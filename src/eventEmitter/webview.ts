const vscode = typeof acquireVsCodeApi !== "undefined"
  ? acquireVsCodeApi()
  : null;

const events: { [key: string]: Function } = {};

window.addEventListener("message", function ({ data }) {
  if (!data) {
    return;
  }
  const callbacks = events[data.type];
  callbacks && callbacks(data.content);
});

const eventBusFactory = () => {
  return {
    /**
     * 事件注册
     * @param type 
     * @param callback 
     */
    on: (type: string, callback: Function) => {
      events[type] = callback;
    },
    /**
     * 将消息传递给extension
     * @param type 事件类型
     * @param payload 数据
     */
    emit: (type: string, content: any) => {
      vscode?.postMessage({ type, content });
    }
  };
};

window.vscodeEvent = eventBusFactory();
window.eventBus = eventBusFactory();