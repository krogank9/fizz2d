import { useEffect, useRef } from 'react'

import { CodeRenderer } from './CodeRenderer'

import './code-editor.css'

import DebugRewindControls from './DebugRewindControls/DebugRewindControls'

const defaultMessage = `/* Add "// debug" to the first
* line of a function to debug it. */`

export function FunctionDebugger() {

  return (
    <div>
      <CodeRenderer highlightRow={null} >{defaultMessage}</CodeRenderer>
      <DebugRewindControls />
    </div>
  )
}
