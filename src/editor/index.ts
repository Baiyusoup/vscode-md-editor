import "../eventEmitter/webview";
import "./style.css";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { autoResize, autoThme } from "./utils";

window.vscode
  .on('open', (payload: any) => {
    const editorName = "editor";
    if (window.vditor) {
      window.vditor.destroy();
      window.vditor = null;
    }
    const instance = new Vditor(editorName, {
      mode: "wysiwyg",
      value: payload.content,
      height: document.documentElement.clientHeight,
      cache: { enable: false },
      toolbar: [
        'outline',
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "emoji",
        "|",
        "list",
        "ordered-list",
        "check",
        "table",
        "outdent",
        "indent",
        "|",
        "quote",
        "line",
        "code",
        "inline-code",
        "|",
        "undo",
        "redo",
      ],
      input(value) {
        window.vscode.emit("input", value);
      },
      after() {
        window.vscode.on("update", (context: string) => {
          instance.setValue(context);
        });
      }
    });
    window.vditor = instance;

    autoThme();
    autoResize(editorName);
  })
.emit("init");
