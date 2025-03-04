import {React, useState} from 'react'
import AddButton from './components/AddButton'
import Modal from './components/Modal'

function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <>
    <div className='min-h-screen bg-gray-900'>
      <h1>HI</h1>
      <Modal isVisible={isModalVisible} onClose={()=>setModalVisible(false)}/>
    </div>
    <AddButton onClick={()=>setModalVisible(true)}/>
    </>
  )
}

export default App
