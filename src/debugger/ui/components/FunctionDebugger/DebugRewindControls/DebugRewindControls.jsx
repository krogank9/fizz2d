import './debug-rewind-controls.css'

import {
  CgArrowLeft,
  CgArrowRight,
  CgPushChevronLeft,
  CgPushChevronRight,
} from 'react-icons/cg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowLeft,
    faArrowRight,
  } from '@fortawesome/free-solid-svg-icons'

export default function DebugRewindControls({
  increment,
  decrement,
  incrementToNextFunction,
  decrementToPrevFunction,
  seekPos,
  minSeekPos,
  setSeekPos,
}) {
  return (
    <div className="flex items-center space-x-2 select-none rewind-controls-container pt-3">
      <span
        onClick={decrement}
        className="p-2 bg-gray-800 text-white rounded-full cursor-pointer"
        title='Step backward'
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </span>
      <span
        onClick={increment}
        className="p-2 bg-gray-800 text-white rounded-full cursor-pointer"
        title='Step forward'
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </span>
      <span
        onClick={decrement}
        className="p-1 bg-gray-800 text-white rounded-full cursor-pointer"
        title='To previous function'
        style={{paddingTop: 9, paddingBottom: 9}}
      >
        <CgPushChevronLeft size={22} />
      </span>
      <span
        onClick={increment}
        className="p-1 bg-gray-800 text-white rounded-full cursor-pointer"
        title='To next function'
        style={{paddingTop: 9, paddingBottom: 9}}
      >
        <CgPushChevronRight size={22} />
      </span>
      <span className="debug-rewind-slider-container">
        <input
          type="range"
          min={minSeekPos}
          max={0}
          value={seekPos}
          step={1}
          onInput={(evt) => setSeekPos(evt.target.value)}
          className="w-32 outline-none"
          style={{
            background: `linear-gradient(to right, #5f42bd ${
              100 - (100 * seekPos) / minSeekPos
            }%, #242A2D ${100 - (100 * seekPos) / minSeekPos}%)`,
          }}
        />
      </span>
    </div>
  )
}
