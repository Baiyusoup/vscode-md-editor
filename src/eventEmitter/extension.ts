import type { WebviewPanel, Uri } from 'vscode';
import { EventEmitter } from 'events';
import * as vscode from 'vscode';

export default class EventBus {
  constructor(public webviewPanel: WebviewPanel, private eventEmitter: EventEmitter) { }

  public static factory(webviewPanel: WebviewPanel, uri: Uri) {
    const eventEmitter = new EventEmitter();

    // 当用户Enter或者保存时时，vscode会触发onDidChangeTextDocument
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === uri.toString() && e.contentChanges.length > 0) {
        eventEmitter.emit('externalUpdate', e);
      }
    });

    // Make sure we get rid of the listener when our editor is closed.
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Recevie message from the webview
    webviewPanel.webview.onDidReceiveMessage(({ type, payload }) => {
      console.log(type, payload);
      eventEmitter.emit(type, payload);
    });

    return new EventBus(webviewPanel, eventEmitter);
  }

  /**
   * 监听webview传递过来的message
   * @param type 
   * @param callback 
   * @returns 
   */
  on(type: string, callback: (payload?: any) => void) {
    this.eventEmitter.on(type, callback);
    return this;
  }

  /**
   * 发送message给webview
   * @param type 
   * @param payload 
   */
  emit(type: string, payload?: any) {
    this.webviewPanel.webview.postMessage({ type, payload });
  }
}