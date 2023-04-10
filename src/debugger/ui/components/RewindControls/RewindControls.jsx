import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faPause,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'

import './rewind-controls.css'

export default function RewindControls({
  play,
  toggledPaused,
  increment,
  decrement,
  seekPos,
  minSeekPos,
  setSeekPos,
}) {
  return (
    <div className="flex items-center space-x-2 select-none rewind-controls-container">
      <span
        onClick={toggledPaused}
        className="p-2 bg-gray-800 text-white rounded-full cursor-pointer"
      >
        <FontAwesomeIcon icon={play ? faPlay : faPause} />
      </span>
      <span
        onClick={decrement}
        className="p-2 bg-gray-800 text-white rounded-full cursor-pointer"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </span>
      <span
        onClick={increment}
        className="p-2 bg-gray-800 text-white rounded-full cursor-pointer"
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </span>
      <span className='rewind-slider-container'>
        <input
          type="range"
          min={minSeekPos}
          max={0}
          value={seekPos}
          step={1}
          onChange={(evt) => setSeekPos(evt.target.value)}
          onInput={(evt) => setSeekPos(evt.target.value)}
          className="w-32 outline-none"
          style={{
            background: `linear-gradient(to right, #2874AE ${100 - 100 * seekPos / minSeekPos}%, #242A2D ${100 - 100 * seekPos / minSeekPos}%)`
          }}
        />
      </span>
    </div>
  )
}
