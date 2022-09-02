import fs, {
  existsSync,
  mkdirSync,
  readFileSync,
} from 'fs';
import {
  basename,
  dirname,
  isAbsolute,
  parse,
  resolve,
} from 'path';
import * as vscode from 'vscode';
import Hanlder from './Handler';
import Holder from './Holder';
import { Util } from './util';

export default class MarkdownEditorProvider implements vscode.CustomTextEditorProvider {
  private extensionPath: string;
  private countStatus: vscode.StatusBarItem;
  private cursorStatus: vscode.StatusBarItem;

  constructor(private context: vscode.ExtensionContext) {
    this.extensionPath = context.extensionPath;
    this.countStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.cursorStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 120);
  }

  private getFolders(): vscode.Uri[] {
    const data = [];
    for (let i = 65; i <= 90; i++)
      data.push(vscode.Uri.file(`${String.fromCharCode(i)}:/`));

    return data;
  }

  resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken,
  ): void | Thenable<void> {
    const uri = document.uri;
    const webview = webviewPanel.webview;
    const folderPath = vscode.Uri.joinPath(uri, '..');
    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file('/'), ...this.getFolders()],
    };
    const handler = Hanlder.bind(webviewPanel, uri);
    this.handleMarkdown(document, handler, folderPath);
  }

  private handleMarkdown(document: vscode.TextDocument, handler: Hanlder, folderPath: vscode.Uri) {
    const uri = document.uri;
    const webview = handler.panel.webview;

    let content = document.getText();
    const contextPath = `${this.extensionPath}/resource/vditor`;
    const rootPath = webview.asWebviewUri(vscode.Uri.file(`${contextPath}`)).toString();

    Holder.activeDocument = document;
    handler.panel.onDidChangeViewState((e) => {
      Holder.activeDocument = e.webviewPanel.visible ? document : Holder.activeDocument;
      if (e.webviewPanel.visible) {
        this.countStatus.show();
        this.cursorStatus.show();
      } else {
        this.countStatus.hide();
        this.cursorStatus.hide();
      }
    });

    const config = vscode.workspace.getConfiguration('vscode-office');
    handler.on('init', () => {
      handler.emit('open', {
        title: basename(uri.fsPath),
        content,
        rootPath,
        config,
      });
      this.countStatus.text = `Line ${content.split(/\r\n|\r|\n/).length}    Count ${content.length}`;
      this.countStatus.show();
    }).on('externalUpdate', (e) => {
      const updatedText = e.document.getText()?.replace(/\r/g, '');
      if (content === updatedText)
        return;
      handler.emit('update', updatedText);
    }).on('command', (command) => {
      vscode.commands.executeCommand(command);
    }).on('openLink', (uri: string) => {
      const resReg = /https:\/\/file.*\.net/i;
      if (uri.match(resReg)) {
        const localPath = uri.replace(resReg, '');
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(localPath));
      } else {
        vscode.env.openExternal(vscode.Uri.parse(uri));
      }
    }).on('img', (img) => {
      let rePath = vscode.workspace.getConfiguration('vscode-office').get<string>('pasterImgPath');
      // eslint-disable-next-line no-template-curly-in-string
      rePath = rePath.replace('${fileName}', parse(uri.fsPath).name).replace('${now}', `${new Date().getTime()}`);
      const imagePath = isAbsolute(rePath) ? rePath : `${resolve(uri.fsPath, '..')}/${rePath}`.replace(/\\/g, '/');
      const dir = dirname(imagePath);
      if (!existsSync(dir))
        mkdirSync(dir, { recursive: true });

      const fileName = parse(rePath).name;
      fs.writeFileSync(imagePath, Buffer.from(img, 'binary'));
      vscode.env.clipboard.writeText(`![${fileName}](${rePath})`);
      vscode.commands.executeCommand('editor.action.clipboardPasteAction');
    }).on('editInVSCode', () => {
      vscode.commands.executeCommand('vscode.openWith', uri, 'default', vscode.ViewColumn.Beside);
    }).on('save', (newContent) => {
      content = newContent;
      this.updateTextDocument(document, newContent);
    }).on('doSave', async (content) => {
      vscode.commands.executeCommand('workbench.action.files.save');
      this.countStatus.text = `Line ${content.split(/\r\n|\r|\n/).length}    Count ${content.length}`;
    }).on('saveOutline', (enable) => {
      config.update('openOutline', enable, true);
    });

    webview.html = Util.buildPath(
      readFileSync(`${this.extensionPath}/resource/vditor/index.html`, 'utf8')
        .replace('{{rootPath}}', rootPath)
        .replace('{{baseUrl}}', webview.asWebviewUri(folderPath).toString()),
      webview, contextPath);
  }

  private updateTextDocument(document: vscode.TextDocument, content: any) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), content);
    return vscode.workspace.applyEdit(edit);
  }
}
