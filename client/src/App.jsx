
import io from 'socket.io-client'

import './App.css'
import JoinChatPage from './join_room'

const socket=io.connect("http://localhost:8080")


function App() {

  return (
    <>
     
      <JoinChatPage/>
    </>
  )
}

export default App
