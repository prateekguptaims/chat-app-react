import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chat from './chat';

// Create socket outside the component to avoid reinitializing on each render

const socket = io("https://chatbackend-sable.vercel.app:8081", {
  transports: ["websocket"], // Force WebSocket transport only
});

function JoinChatPage() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [isJoined, setIsJoined] = useState(false); // To track if the user has joined the chat

  useEffect(() => {
    // Set up event listeners for the socket
    socket.on("receive_message", (data) => {
      console.log("Message received from server: ", data);
    });

    // Clean up the socket event listeners when the component unmounts
    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleJoin = () => {
    if (username !== "" && room !== "") {
      // Emit join_room event to server
      socket.emit("join_room", room);
      setIsJoined(true); // Set user as joined once they emit the event
    } else {
      alert("Please enter both username and room name."); // Validation message
    }
  };

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
