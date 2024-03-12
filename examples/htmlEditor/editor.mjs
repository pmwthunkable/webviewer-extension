import { EditorView, basicSetup } from "codemirror";
import { html } from "@codemirror/lang-html";

let editor;

window.ThunkableWebviewerExtension.receiveMessage((message) => {
  try {
    const messageObj = JSON.parse(message);
    if (messageObj.type === "initEditor") {
      document.body.innerHTML = "";
      editor = new EditorView({
        doc: messageObj.initialValue,
        extensions: [
          basicSetup,
          html(),
        ],
        parent: document.body,
      });
    }
  } catch (e) {
    console.error("An error occurred");
  }
});

window.ThunkableWebviewerExtension.receiveMessageWithReturnValue((message, callback) => {
  try {
    const messageObj = JSON.parse(message);
    if (messageObj.type === "getValue") {
      callback(editor.state.doc.toString());
    } else if (messageObj.type === "getDataUrl") {
      callback('data:text/html,' + encodeURIComponent(editor.state.doc.toString()));
    }
  } catch (e) {
    console.error("An error occurred");
  }

});

window.ThunkableWebviewerExtension.postMessage(
  JSON.stringify({ type: "pageLoaded" })
);
