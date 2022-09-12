import "../eventEmitter/webview";
import "./style.css";
const editor = document.getElementById("editor") as HTMLTextAreaElement;

window.vscode
  .on('open', (payload: any) => {
    editor.value = payload.content;
    editor.addEventListener("input", function (event) {
      window.vscode.emit("input", editor.value);
    });
  })
  .on("update", (content: string) => {
    editor.value = content;
  })
  .emit("init");
