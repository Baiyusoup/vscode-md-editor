import * as vscode from 'vscode';

export function  buildPath(data: string, webview: vscode.Webview, contextPath: string) {
  return data.replace(/((src|href)=("|')?)(\/\/)/gi, '$1http://')
    .replace(
      /((src|href)=("|'))((?!(http))[^"']+?\.(css|js|properties|json|png|jpg))\b/gi,
      `$1${webview.asWebviewUri(vscode.Uri.file(`${contextPath}`))}/$4`
    );
}

export function executeCommand(command: string, ...args: any[]) {
  return vscode.commands.executeCommand(command, ...args);
}

export function getFolders() {
  const folders: vscode.Uri[] = [];
  for(let i = 65; i <= 90; i++) {
    folders.push(vscode.Uri.file(`${String.fromCharCode(i)}:/`));
  }

  return folders;
}

export function updateTextDocument(document: vscode.TextDocument, content: any) {
  const edit = new vscode.WorkspaceEdit();
  // 更新整个文件
  // TODO: 最少量更新
  edit.replace(
    document.uri,
    new vscode.Range(0, 0, document.lineCount, 0),
    content
  );
  return vscode.workspace.applyEdit(edit);
}