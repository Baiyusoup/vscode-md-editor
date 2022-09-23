import { readFileSync } from 'fs';
import * as vscode from 'vscode';
import EventBus from '../eventEmitter/extension';
import { buildPath, executeCommand, updateTextDocument } from '../utils';
export default class CustomMarkdownEditorProvider implements vscode.CustomTextEditorProvider {
	static readonly viewType = "vscode-md-editor.miniEditor";
  extensionPath: string;

  constructor(context: vscode.ExtensionContext) {
    this.extensionPath = context.extensionPath;
  }

  public static register(context: vscode.ExtensionContext) {
    const provider = new CustomMarkdownEditorProvider(context);
    const registration = vscode.window.registerCustomEditorProvider(
      CustomMarkdownEditorProvider.viewType,
      provider
    );
    
    return registration;
  }

  resolveCustomTextEditor(
    document: vscode.TextDocument, 
    webviewPanel: vscode.WebviewPanel, 
    _token: vscode.CancellationToken
  ): void | Thenable<void> {
    const uri = document.uri;
    const webview = webviewPanel.webview;
    const folderPath = vscode.Uri.joinPath(uri, '..');

    webview.options = {
      enableScripts: true,
    };

    const eventBus = EventBus.factory(webviewPanel, uri);
    this.handleMarkdown(document, eventBus, folderPath);
  }

  handleMarkdown(
    document: vscode.TextDocument,
    eventBus: EventBus,
    folderPath: vscode.Uri
  ) {
    const uri = document.uri;
    const webview = eventBus.webviewPanel.webview;

    let documentContent = document.getText();
    const contextPath = `${this.extensionPath}/dist/editor`;
    const rootPath = webview.asWebviewUri(vscode.Uri.file(`${contextPath}`)).toString();

    eventBus
      .on('init', () => {
        eventBus.emit('open', { content: documentContent });
      })
      .on('input', (changes) => {
        documentContent = changes;
        updateTextDocument(document, changes);
      })
      .on('updateWebview', (updateText) => {
        if (documentContent === updateText) {
          return;
        }
        eventBus.emit('update', updateText);
      })
      .on('editInVSCode', () => {
        executeCommand("vscode.openWith", uri, "default", vscode.ViewColumn.Beside);
      })
      .on('command', (command) => {
        executeCommand(command);
      });
    
    const html = readFileSync(`${this.extensionPath}/dist/editor/index.html`, 'utf8')
      .replace('{{rootPath}}', rootPath)
      .replace('{{baseUrl}}', webview.asWebviewUri(folderPath).toString());

    webview.html = buildPath(html, webview, contextPath);
  }
}
