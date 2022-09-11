declare var acquireVsCodeApi: () => { postMessage: (payload: any) => void};

declare interface Window {
  vscodeEvent: {
    on: (type: string, callback: Function) => void;
    emit: (type: string, content?: any) => void;
  },
  eventBus: {
    on: (type: string, callback: Function) => void;
    emit: (type: string, content?: any) => void;
  }
}