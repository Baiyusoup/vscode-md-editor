/* eslint-disable no-undef */
const latexSymbols = [
  // 运算符
  { name: 'log', value: '\\log' },
  // 关系运算符
  { name: 'pm', value: '\\pm' },
  { name: 'times', value: '\\times' },
  { name: 'leq', value: '\\leq' },
  { name: 'eq', value: '\\eq' },
  { name: 'geq', value: '\\geq' },
  { name: 'neq', value: '\\neq' },
  { name: 'approx', value: '\\approx' },
  { name: 'prod', value: '\\prod' },
  { name: 'bigodot', value: '\\bigodot' },
  // 逻辑符号
  { name: 'exists', value: '\\exists' },
  { name: 'forall', value: '\\forall' },
  { name: 'rightarrow', value: '\\rightarrow' },
  { name: 'leftarrow', value: '\\leftarrow' },
  // 三角函数符号
  { name: 'sin', value: '\\sin' },
  { name: 'cos', value: '\\cos' },
  { name: 'tan', value: '\\tan' },
  // 函数
  { name: 'fraction', value: '\\frac{}{}' },
  { name: 'sqrt', value: '\\sqrt{}' },
  { name: 'sum', value: '\\sum_{i=0}^n' },
  // 希腊数字
  { name: 'alpha', value: '\\alpha' },
  { name: 'beta', value: '\\beta' },
  { name: 'Delta', value: '\\Delta' },
  { name: 'delta', value: '\\delta' },
  { name: 'epsilon', value: '\\epsilon' },
  { name: 'theta', value: '\\theta' },
  { name: 'lambda', value: '\\lambda' },
  { name: 'Lambda', value: '\\Lambda' },
  { name: 'phi', value: '\\phi' },
  { name: 'Phi', value: '\\Phi' },
  { name: 'omega', value: '\\omega' },
  { name: 'Omega', value: '\\Omega' },
];

export const hotKeys = [
  {
    key: '\\',
    hint: (key) => {
      if (document.getSelection()?.anchorNode?.parentElement?.getAttribute('data-type') !== 'math-inline')
        return [];

      const results = !key ? latexSymbols : latexSymbols.filter(symbol => symbol.name.toLowerCase().startsWith(key.toLowerCase()));
      return results.map(com => ({
        html: com.name, value: com.value,
      }));
    },
  },
];

export const toolbar = [
  'outline',
  'headings',
  'bold',
  'italic',
  'strike',
  'link',
  'emoji',
  '|',
  {
    tipPosition: 's',
    tip: 'Edit In VSCode',
    className: 'right',
    icon: '<?xml version="1.0" encoding="iso-8859-1"?><svg height="401pt" viewBox="0 -1 401.52289 401" width="401pt" xmlns="http://www.w3.org/2000/svg"><path d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0"/></svg>',
    click() {
      handler.emit('editInVSCode');
    },
  },
  { name: 'upload', tipPosition: 'e' },
  '|',
  // "edit-mode",  // 屏蔽掉, 现版本都是针对一种模式优化
  'code-theme',
  // "|",
  'list',
  'ordered-list',
  'check',
  'table',
  'outdent',
  'indent',
  '|',
  'quote',
  'line',
  'code',
  'inline-code',
  '|',
  'undo',
  'redo',
  '|',
  'preview',
  'info',
  'help',
];

/**
 * 针对wysiwyg和ir两种模式对超链接做不同的处理
 */
export const openLink = () => {
  const clickCallback = (e) => {
    const ele = e.target;
    e.stopPropagation();
    if (!e.ctrlKey && event.type !== 'dblclick')
      return;

    if (ele.tagName === 'A') {
      handler.emit('openLink', ele.href);
    } else if (ele.tagName === 'IMG') {
      const parent = ele.parentElement;
      if (parent?.tagName === 'A' && parent.href) {
        handler.emit('openLink', parent.href);
        return;
      }
      const src = ele.src;
      if (src?.match(/http/))
        handler.emit('openLink', src);
    }
  };
  const content = document.querySelector('.vditor-wysiwyg');
  content.addEventListener('dblclick', clickCallback);
  content.addEventListener('click', clickCallback);
  document.querySelector('.vditor-ir').addEventListener('click', (e) => {
    let ele = e.target;
    if (ele.classList.contains('vditor-ir__link'))
      ele = e.target.nextElementSibling?.nextElementSibling?.nextElementSibling;

    if (ele.classList.contains('vditor-ir__marker--link'))
      handler.emit('openLink', ele.textContent);
  });
};

// 监听选项改变事件
export function onToolbarClick(editor) {
  document.querySelector('.vditor-toolbar').addEventListener('click', (e) => {
    let type;
    for (let i = 0; i < 3; i++) {
      type = e.path[i].dataset.type;
      if (type)
        break;
    }

    if (type === 'outline')
      handler.emit('saveOutline', editor.vditor.options.outline.enable);
  });
}

export const createContextMenu = (editor) => {
  $('body').on('contextmenu', (e) => {
    e.stopPropagation();
    const top = e.pageY - 10;
    const left = e.pageX - 90;
    $('#context-menu').css({
      display: 'block',
      top,
      left,
    }).addClass('show');
  }).on('click', (e) => {
    $('#context-menu').removeClass('show').hide();
    const id = e.target.id;
    if (!e.target.id)
      return;

    switch (id) {
      case 'copy':
        document.execCommand('copy');
        break;
      case 'paste':
        // document.execCommand("paste")
        vscodeEvent.emit('command', 'office.markdown.paste');
        break;
      case 'exportPdf':
        vscodeEvent.emit('save', editor.getValue());
        vscodeEvent.emit('export');
        break;
      case 'exportHtml':
        vscodeEvent.emit('save', editor.getValue());
        vscodeEvent.emit('exportPdfToHtml');
        break;
    }
  });

  $('#context-menu a').on('click', function () {
    $(this).parent().removeClass('show').hide();
  });
};

export const imageParser = (viewAbsoluteLocal) => {
  if (!viewAbsoluteLocal)
    return;
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelector)
          continue;
        const imgs = node.querySelectorAll('img');
        for (const img of imgs) {
          const url = img.src;
          if (url.startsWith('http') || url.startsWith('vscode-webview-resource'))
            continue;

          // windows absolute path
          if (url.startsWith('file://')) {
            img.src = `${location.origin.replace('vscode-webview', 'vscode-webview-resource')}/${url.replace('file:', 'file').replace(':', '%3a')}`;
            continue;
          }
        }
      }
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
};

/**
 * 自动补全符号
 */
const keys = ['\'', '"', '{', '(', '$'];
export const autoSymbal = (editor) => {
  const _exec = document.execCommand.bind(document);
  document.execCommand = (cmd, ...args) => {
    if (cmd === 'delete') {
      setTimeout(() => {
        return _exec(cmd, ...args);
      });
    } else {
      return _exec(cmd, ...args);
    }
  };
  window.onkeypress = (e) => {
    if (e.ctrlKey && e.code === 'KeyV' && !e.shiftKey) {
      vscodeEvent.emit('command', 'office.markdown.paste');
      e.stopPropagation();
      return;
    }
    // 旧版本是让vscode触发, 但现在触发不了了
    if (e.ctrlKey && e.code === 'KeyS' && !e.shiftKey) {
      vscodeEvent.emit('doSave', editor.getValue());
      e.stopPropagation();
      return;
    }
    if (!keys.includes(e.key))
      return;

    const selectText = document.getSelection().toString();
    if (selectText !== '')
      return;

    if (e.key === '(')
      document.execCommand('insertText', false, ')');
    else if (e.key === '{')
      document.execCommand('insertText', false, '}');
    else
      document.execCommand('insertText', false, e.key);

    document.getSelection().modify('move', 'left', 'character');
  };

  window.onresize = () => {
    document.getElementById('vditor').style.height = `${document.documentElement.clientHeight}px`;
  };
  window.onfocus = () => {
    setTimeout(() => {
      document.querySelector('.vditor-reset').focus();
    }, 10);
  };
};
