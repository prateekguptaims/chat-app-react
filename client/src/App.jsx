
import io from 'socket.io-client'

import './App.css'
import JoinChatPage from './join_room'

const socket=io.connect("https://chatbackend-sage.vercel.app/")


function App() {

  return (
    <>
     
      <JoinChatPage/>
    </>
  )
}

export default App
