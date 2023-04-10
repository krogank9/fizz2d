import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBug } from '@fortawesome/free-solid-svg-icons'

import RewindControls from '../RewindControls/RewindControls'

// import the react-json-view component
import ReactJson from 'react-json-view'

import { useGlobalStateProxy } from '../../utils/utils.js'
import { FunctionDebugger } from '../FunctionDebugger/FunctionDebugger'

function SlideOutOverlay() {
  const [isVisible, setIsVisible] = useState(true)
  const [paused, setPaused] = useGlobalStateProxy(
    'globalState.debugger.paused',
  )
  const [seekPos, setSeekPos] = useGlobalStateProxy(
    'globalState.debugger.seekPos',
  )
  const [minSeekPos, setMinSeekPos] = useGlobalStateProxy(
    'globalState.debugger.minSeekPos',
  )

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div className="pointer-events-auto">
      {isVisible ? (
        <div className="fixed top-0 right-0 h-full w-80 bg-gray-700 border-l border-gray-600 overflow-y-auto z-10 flex flex-col p-4">
          <div className="mb-4">
            <h2 className="text-xl mb-2 text-gray-100">Function Debugger</h2>
            <div className="bg-gray-600 h-px mb-4"></div>
            <FunctionDebugger />
          </div>
          <div className="mb-4">
            <h2 className="text-xl mb-2 text-gray-100">State Viewer</h2>
            <div className="bg-gray-600 h-px mb-4"></div>
            <ReactJson
              theme="flat"
              enableClipboard={false}
              collapsed={true}
              name={window.globalState.appState?.constructor?.name || 'state'}
              style={{ backgroundColor: 'transparent', userSelect: 'none' }}
              src={window.globalState.app.state}
            />
          </div>
          <div className="absolute bottom-4 right-4 flex space-x-4 items-center">
            <RewindControls
              play={paused}
              toggledPaused={() => setPaused(!paused)}
              increment={() => window.globalState.debugger.seekPos++}
              decrement={() => window.globalState.debugger.seekPos--}
              seekPos={seekPos}
              minSeekPos={minSeekPos}
              setSeekPos={setSeekPos}
            />
            <button
              className="p-2 bg-gray-800 text-white rounded-full"
              onClick={toggleVisibility}
            >
              <FontAwesomeIcon icon={faBug} />
            </button>
          </div>
        </div>
      ) : (
        <span
          className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-full cursor-pointer"
          onClick={toggleVisibility}
        >
          <FontAwesomeIcon icon={faBug} />
        </span>
      )}
    </div>
  )
}

export default SlideOutOverlay
