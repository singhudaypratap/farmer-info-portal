import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FarmerInfoPortal from './FarmerInfoPortal'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FarmerInfoPortal />
    </>
  )
}

export default App
