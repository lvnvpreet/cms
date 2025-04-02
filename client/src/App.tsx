// Remove default imports and CSS if not needed by EditorInterface
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css' // Keep App.css or remove if EditorInterface handles all styling
import EditorInterface from './components/editor/EditorInterface'; // Import the main editor component

function App() {
  // Render the EditorInterface component
  return (
    <div className="App"> {/* Optional wrapper div */}
      <EditorInterface />
    </div>
  )
}

export default App
