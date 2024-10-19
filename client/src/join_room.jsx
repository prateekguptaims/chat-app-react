import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chat from './chat';



const socket=io.connect("https://chatbackend-sable.vercel.app")

// const socket = io('http://localhost:8081'); // Replace with your server URL

function JoinChatPage() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [isJoined, setIsJoined] = useState(false); // To track if the user has joined the chat
//   const [showChat, setShowChat] = useState(false)

  const handleJoin = () => {
    if (username !== "" && room !== "") {
        socket.emit("join_room", room);
        // setShowChat(true)
      setIsJoined(true); // Set user as joined once they emit the event
    }
  };

  // Optionally, clean up socket on component unmount
  

  return (
    <div style={styles.container}>
      {!isJoined ? (
        <div>
          <h1 style={styles.heading}>Join Chat Room</h1>
          
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Enter room name"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              style={styles.input}
            />
          </div>

          <button onClick={handleJoin} style={styles.button}>
            Join
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '300px',
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default JoinChatPage;
