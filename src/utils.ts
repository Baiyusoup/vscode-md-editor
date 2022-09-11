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