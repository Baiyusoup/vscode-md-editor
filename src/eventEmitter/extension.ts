import type { WebviewPanel, Uri } from 'vscode';
import { EventEmitter } from 'events';
import * as vscode from 'vscode';

export default class EventBus {
  constructor(public webviewPanel: WebviewPanel, private eventEmitter: EventEmitter) { }

  public static factory(webviewPanel: WebviewPanel, uri: Uri) {
    const eventEmitter = new EventEmitter();

    const fileWatcher = vscode.workspace.createFileSystemWatcher(uri.fsPath);
    fileWatcher.onDidChange((e) => {
      eventEmitter.emit('fileChange', e);
    });

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === uri.toString() && e.contentChanges.length > 0) {
        eventEmitter.emit('externalUpdate', e);
      }
    });

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
      eventEmitter.emit('dispose');
    });

    // bind from webview
    webviewPanel.webview.onDidReceiveMessage((message) => {
      eventEmitter.emit(message.type, message.content);
    });

    return new EventBus(webviewPanel, eventEmitter);
  }

  on(event: string, callback: (content: any) => void) {
    this.eventEmitter.on(event, callback);
    return this;
  }

  emit(event: string, content?: any) {
    this.webviewPanel.webview.postMessage({ type: event, content });
  }
}