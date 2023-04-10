import SlideOutOverlay from './components/SlideOutOverlay/SlideOutOverlay'
import ReactDOM from 'react-dom'
import './tailwind.css'

const renderDebuggerUI = () => {
  const rootElement = document.getElementById('debugger-ui')

  ReactDOM.render(<SlideOutOverlay />, rootElement)

  document.addEventListener('keydown', function (event) {
    if (!event.defaultPrevented) {
      if (event.code === 'Space') {
        window.globalState.debugger.paused = !window.globalState.debugger.paused
      } else if (event.code === 'ArrowLeft') {
        window.globalState.debugger.seekPos -= 1
        window.globalState.debugger.paused = true
      } else if (event.code === 'ArrowRight') {
        window.globalState.debugger.seekPos += 1
        window.globalState.debugger.paused = true
      }
    }
  })
}

export default renderDebuggerUI
