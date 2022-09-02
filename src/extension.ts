import * as vscode from 'vscode';
import MarkdownEditorProvider from './MarkdownEditorProvider';
import MarkdownService from './MarkdownService';

export function activate(context: vscode.ExtensionContext) {
  const viewOption = { webviewOptions: { retainContextWhenHidden: true, enableFindWidget: true } };
  const markdownService = new MarkdownService(context);
  context.subscriptions.push(
    vscode.commands.registerCommand('office.markdown.paste', () => {
      markdownService.loadClipboardImage();
    }),
    vscode.window.registerCustomEditorProvider('cweijan.markdownViewer', new MarkdownEditorProvider(context), viewOption),
  );
}

export function deactivate() { }
