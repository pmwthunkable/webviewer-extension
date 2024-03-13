import { EditorView, basicSetup } from "codemirror";
import { html } from "@codemirror/lang-html";

let editor;

const setupEditor = (initialValue) => {
  document.body.innerHTML = "";
  editor = new EditorView({
    doc: initialValue,
    extensions: [
      basicSetup,
      html(),
    ],
    parent: document.body,
  });
}

window.ThunkableWebviewerExtension.receiveMessage((message) => {
  try {
    const messageObj = JSON.parse(message);
    if (messageObj.type === "initEditor") {
      if (messageObj.value.startsWith('data:text/html,')) {
        const docContent = messageObj.value.substring('data:text/html,'.length);
        setupEditor(decodeURIComponent(docContent));
      } else if (messageObj.value.startsWith('http')) {
        fetch(messageObj.value).then(fetchResponse => fetchResponse.text().then(text=> setupEditor(text)));
      } else {
        setupEditor(messageObj.value);
      }
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
