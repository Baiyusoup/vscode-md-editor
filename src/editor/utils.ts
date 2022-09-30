const CSS = `
* {
  border-color: var(--vscode-quickInputTitle-background) !important;
}

.vditor-input{
  border:  1px solid var(--vscode-quickInputTitle-background);
}

.vditor-toolbar {
  background-color: var(--vscode-editor-background);
}

.vditor-toolbar__item .vditor-tooltipped {
  color: var(--vscode-editor-foreground)
}


.vditor-content code:not(.hljs) {
  background-color: var(--vscode-tab-activeBackground) !important;
}

.vditor-content,
.vditor-content *:not(.hljs, .hljs *, a) {
  background-color: var(--vscode-editor-background) !important;
  color: var(--vscode-editor-foreground) !important;
}

.vditor-hint button:not(.vditor-menu--disabled):hover{
  background-color: var(--vscode-editorSuggestWidget-background) !important;
}
.vditor-content .vditor-outline li > span >span:hover {
  color: var(--vscode-terminal-ansiBlue) !important;
}
`;
export function autoThme() {
  const styleEle = document.createElement('style');
  styleEle.innerText = CSS;
  document.documentElement.appendChild(styleEle);
}

export function autoResize(editorName: string) {
  window.addEventListener('resize', function handler() {
    document.getElementById(editorName)
      ?.style
        .setProperty('height', `${this.document.documentElement.clientHeight}px`);
  });
}