const vscode = typeof acquireVsCodeApi !== "undefined"
  ? acquireVsCodeApi()
  : null;

class EventEmitter {
  events: { [key: string]: Function };
  constructor() {
    this.events = {};
  }
  /**
   * 监听从extension传递过来的message
   * @param type 
   * @param callback 
   * @returns 
   */
  on(type: string, callback: Function) {
    this.events[type] = callback;
    return this;
  }
  /**
   * 执行监听extension的事件
   * @param type 
   * @param payload 
   */
  trigger(type: string, payload?: any) {
    const callbacks = this.events[type];
    callbacks && callbacks(payload);
  }
  /**
   * 将消息传递给extension
   * @param type 事件类型
   * @param payload 数据
   */
  emit(type: string, payload?: any) {
    vscode?.postMessage({ type, payload });
  }
}

window.vscode = new EventEmitter();
// Recevie message from the extension
window.addEventListener("message", function ({ data }) {
  if (!data) {
    return;
  }
  const { type, payload } = data;
  window.vscode.trigger(type, payload);
});
