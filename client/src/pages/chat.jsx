import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AuthGuard from '../services/AuthGuard';
function Chat() {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [roomName, setRoomName] = useState('');

    const [selectedUser, setSelectedUser] = useState(null);
    const [socket, setSocket] = useState(null);

    const storedData = localStorage.getItem('user');
    const userData = JSON.parse(storedData);
    const accessToken = userData.access;
    const userEmail = userData.email;

    useEffect(() => {
        const fetchInterest = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/accept-interest/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchInterest();

        if (selectedUser) {
            console.log("Selected user id is", selectedUser.id);
            const ws = new WebSocket(`ws://localhost:8000/ws/chat/?token=${accessToken}&recipient=${selectedUser.id}`);

            ws.onopen = () => {
                setSocket(ws);
            };

            ws.onmessage = (e) => {
                const data = JSON.parse(e.data);
                if (data.type === 'websocket_connected') {
                    setRoomName(data.room);
                    console.log('WebSocket connected to room:', data.room);
                } else {
                    setMessages((prevMessages) => [...prevMessages, data]);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            return () => {
                ws.close();
            };
        }
    }, [accessToken, selectedUser]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchMessageHistory(user.id);
    };

    const fetchMessageHistory = async (receiverId) => {
        try {
            console.log("hello")
            // const response = await axios.get(`http://127.0.0.1:8000/api/messages/${receiverId}/`, {
            //     headers: { Authorization: `Bearer ${accessToken}` },
            // });
            // setMessages(response.data);
        } catch (error) {
            console.error('Error fetching message history:', error);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (socket && message.trim() !== '' && roomName) {
            socket.send(JSON.stringify({
                receiver: selectedUser.id,
                message: message,
                sender: accessToken,
                roomname : roomName,
            }));
            setMessage('');
        }
    };

    return (
        <div className='container'>
        <div className="chat-container">
            <div className="row">
                {/* Members List */}
                <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
                    <h5 className="font-weight-bold mb-3 text-center text-lg-start">Members</h5>
                    {users.map((item) => {
                    const isSender = item.sender.email === userEmail;
                    const user = isSender ? item.receiver : item.sender;
                    return(
                        <div className="card mb-2" key={user.id} onClick={() => handleUserClick(user)}>
                            <div className="card-body">
                                <ul className="list-unstyled mb-0">
                                    <li className="p-2 border-bottom bg-body-tertiary">
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">{user.username}</p>
                                                    <p className="small text-muted">{user.email}</p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    );
                    })}
                </div>

                {/* Chat Box */}
                <div className="col-md-6 col-lg-7 col-xl-8 bg-warning rounded">
                    <ul className="list-unstyled">
                        {/* Display Messages */}
                        {messages.map((msg, index) => (
                            <li className="d-flex justify-content-between mb-4" key={index}>
                                <div className="card w-100">
                                    <div className="card-header d-flex justify-content-between p-3">
                                        <p className="fw-bold mb-0">{msg.sender}</p>
                                        <p className="text-muted small mb-0">
                                            <i className="far fa-clock"></i> {msg.timestamp}
                                        </p>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-0">{msg.message}</p>
                                    </div>
                                </div>
                            </li>
                        ))}

                        {/* Message Input */}
                        <li className="bg-white mb-3">
                            <div className="form-outline">
                                <textarea
                                    className="form-control bg-body-tertiary"
                                    id="textAreaExample2"
                                    rows="4"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                <label className="form-label" htmlFor="textAreaExample2">
                                    Message
                                </label>
                            </div>
                        </li>

                        {/* Send Button */}
                        <button
                            type="button"
                            className="btn btn-info btn-rounded float-end"
                            onClick={sendMessage}
                        >
                            Send
                        </button>

                    </ul>
                </div>
            </div>
        </div>
     </div>
    );
}

export default AuthGuard(Chat);
