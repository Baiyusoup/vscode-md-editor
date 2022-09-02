/* eslint-disable no-template-curly-in-string */
import { spawn } from 'child_process';
import { copyFileSync, existsSync, lstatSync, mkdirSync } from 'fs';
import path, { isAbsolute, parse, resolve } from 'path';
import * as vscode from 'vscode';
import Holder from './Holder';

export default class MarkdownService {
  constructor(private context: vscode.ExtensionContext) {
  }

  public async loadClipboardImage() {
    const document = vscode.window.activeTextEditor?.document || Holder.activeDocument;

    if (await vscode.env.clipboard.readText() === '') {
      if (!document || document.isUntitled || document.isClosed)
        return;

      const uri: vscode.Uri = document.uri;
      let rePath = vscode.workspace.getConfiguration('vscode-office').get<string>('pasterImgPath');
      rePath = rePath.replace('${fileName}', parse(uri.fsPath).name).replace('${now}', `${new Date().getTime()}`);
      const imagePath = isAbsolute(rePath) ? rePath : `${resolve(uri.fsPath, '..')}/${rePath}`.replace(/\\/g, '/');
      const dir = path.dirname(imagePath);
      if (!existsSync(dir))
        mkdirSync(dir, { recursive: true });

      this.saveClipboardImageToFileAndGetPath(imagePath, (savedImagePath) => {
        if (!savedImagePath)
          return;
        if (savedImagePath === 'no image') {
          vscode.window.showErrorMessage('There is not an image in the clipboard.');
          return;
        }
        if (savedImagePath.startsWith('copyed:')) {
          const copyedFile = savedImagePath.replace('copyed:', '');
          if (!existsSync(copyedFile)) {
            vscode.window.showErrorMessage(`Coped file ${copyedFile} not found!`);
            return;
          }
          if (lstatSync(copyedFile).isDirectory())
            vscode.window.showErrorMessage('Not support paster directory.');
          else
            copyFileSync(copyedFile, imagePath);
        }
        const editor = vscode.window.activeTextEditor;
        const imgName = parse(rePath).name;
        if (editor) {
          editor?.edit((edit) => {
            const current = editor.selection;
            if (current.isEmpty)
              edit.insert(current.start, `![${imgName}](${rePath})`);
            else
              edit.replace(current, `![${imgName}](${rePath})`);
          });
        } else {
          vscode.env.clipboard.writeText(`![${imgName}](${rePath})`);
          vscode.commands.executeCommand('editor.action.clipboardPasteAction');
        }
      });
    } else {
      vscode.commands.executeCommand('editor.action.clipboardPasteAction');
    }
  }

  private saveClipboardImageToFileAndGetPath(imagePath: string, cb: (value: string) => void) {
    if (!imagePath)
      return;
    const platform = process.platform;
    if (platform === 'win32') {
      // Windows
      const scriptPath = path.join(this.context.extensionPath, '/lib/pc.ps1');
      const powershell = spawn('powershell', [
        '-noprofile',
        '-noninteractive',
        '-nologo',
        '-sta',
        '-executionpolicy', 'unrestricted',
        '-windowstyle', 'hidden',
        '-file', scriptPath,
        imagePath,
      ]);
      powershell.on('exit', (_code, _signal) => {
      });
      powershell.stdout.on('data', (data) => {
        cb(data.toString().trim());
      });
    } else if (platform === 'darwin') {
      // Mac
      const scriptPath = path.join(this.context.extensionPath, './lib/mac.applescript');
      const ascript = spawn('osascript', [scriptPath, imagePath]);
      ascript.on('exit', (_code, _signal) => {
      });
      ascript.stdout.on('data', (data) => {
        cb(data.toString().trim());
      });
    } else {
      // Linux
      const scriptPath = path.join(this.context.extensionPath, './lib/linux.sh');

      const ascript = spawn('sh', [scriptPath, imagePath]);
      ascript.on('exit', (_code, _signal) => {
      });
      ascript.stdout.on('data', (data) => {
        const result = data.toString().trim();
        if (result === 'no xclip') {
          vscode.window.showInformationMessage('You need to install xclip command first.');
          return;
        }
        cb(result);
      });
    }
  }
}
