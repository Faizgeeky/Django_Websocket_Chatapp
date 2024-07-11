import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthGuard from '../services/AuthGuard';

const Chat = ({ recipientId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [chatSocket, setChatSocket] = useState(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws/chat/`);

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            setChatSocket(socket);
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };

        socket.onclose = () => {
            console.log('Chat socket closed unexpectedly');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error observed:', error);
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        // Retrieve data from localStorage
        const storedData = localStorage.getItem('user');

        // Parse the JSON string into an object
        const userData = JSON.parse(storedData);

        // Access the 'access' property
        const accessToken = userData.access;
        console.log(accessToken)

        if (chatSocket && message) {
            chatSocket.send(JSON.stringify({
                'message': message,
                'receiver': 2,
                'sender' : accessToken
            }));
            setMessage('');
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default AuthGuard(Chat);
