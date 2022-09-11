import tinymce from "tinymce";
import "tinymce/models/dom";
import "tinymce/icons/default";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/link";
import "tinymce/skins/ui/oxide-dark/skin.css";
import "tinymce/skins/ui/oxide-dark/content.css";
import "../eventEmitter/webview";

window.eventBus
  .on('open', () => {
    tinymce.init({
      selector: "#editor",
      plugins: ["link"],
      toolbar: false,
      statusbar: false,
      height: document.documentElement.clientHeight,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      init_instance_callback(editor) {
        editor.on("keyup", function (event) {
          console.log("keyup", event);
        });
      },
    });
  });

window.eventBus
  .emit("init");
