declare var acquireVsCodeApi: () => { postMessage: (payload: any) => void};
declare interface Window {
  vscode: {
    on: (type: string, callback: Function) => Window["vscode"];
    trigger: (type: string, payload?: any) => void;
    emit: (type: string, payload?: any) => void;
  }
}