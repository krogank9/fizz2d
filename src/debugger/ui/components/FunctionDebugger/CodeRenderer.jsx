import SyntaxHighlighter from 'react-syntax-highlighter'
import { createElement } from 'react-syntax-highlighter'
import vsdark from './vs-dark.js'
//import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';


// https://github.com/winitop/Theme-VSCode-Dark/blob/master/vscode-dark.css

import './code-editor.css'

function scrollToHighlightedLine() {
    const preContainer = document.querySelector('.cm-editor');
    const lineElement = document.querySelector(`.codeViewerHighlightRow`);
    if (preContainer && lineElement) {
      const lineTop = lineElement.offsetTop;
      preContainer.scrollTop = lineTop - preContainer.offsetTop;
    }
  }
  

let lastRowHighlighted = null;
export default function myRenderer(rowNumberToHighlight) {
  return ({ rows, stylesheet, useInlineStyles }) => (
    <>
      {rows.map((row, index) => {
        row.properties.className = row.properties.className.filter(c => c != "codeViewerHighlightRow")
        if(rowNumberToHighlight === index + 1) {
            row.properties.className.push("codeViewerHighlightRow")
            let highlightedRow = index + 1;
            if(highlightedRow !== lastRowHighlighted) {
                setTimeout(scrollToHighlightedLine, 0);
                lastRowHighlighted = highlightedRow;
            }
        }
        return createElement({
          node: row,
          stylesheet,
          useInlineStyles,
          key: index,
          id: "rowToHighlight"
        })
      })}
    </>
  )
}

export function CodeRenderer({ children, highlightRow }) {
  return (
    <SyntaxHighlighter
      language="javascript"
      showLineNumbers={true}
      style={vsdark}
      className={'cm-editor'}
      customStyle={{ padding: '4px 0', maxHeight: "300px", fontSize: "12px" }}
      showInlineLineNumbers={true}
      renderer={myRenderer(highlightRow)}
    >
      {children}
    </SyntaxHighlighter>
  )
}
