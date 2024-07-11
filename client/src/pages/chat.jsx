// import React, { useEffect, useState, useRef } from 'react';
// import AuthGuard from '../services/AuthGuard';
// import axios from 'axios';

// function Chat({ roomName }) {
//     const [users, setUsers] = useState([]);
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState('');
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [chatSocket, setChatSocket] = useState(null);
//     // const accessToken = localStorage.user.access;
//     const socket = useRef(null);

//     const storedData = localStorage.getItem('user');

//     // Parse the JSON string into an object
//     const userData = JSON.parse(storedData);

//     // Access the 'access' property
//     const accessToken = userData.access;

//     useEffect(() => {
//         // Fetch users
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:8000/api/users/', {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                     },
//                 });
//                 setUsers(response.data);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             }
//         };

//         fetchUsers();

//         // Initialize WebSocket
//         const initWebSocket = () => {
//             const ws = new WebSocket(`ws://localhost:8000/ws/chat/`);

//             ws.onopen = () => {
//                 console.log('WebSocket connection opened');
//                 setChatSocket(ws);
//             };

//             ws.onmessage = (e) => {
//                 const data = JSON.parse(e.data);
//                 console.log("Messages happend", data)
//                 setMessages((prevMessages) => [...prevMessages, data.message]);
//             };

//             ws.onclose = () => {
//                 console.log('Chat socket closed unexpectedly');
//             };

//             ws.onerror = (error) => {
//                 console.error('WebSocket error observed:', error);
//             };

//             socket.current = ws;
//         };

//         initWebSocket();

//         return () => {
//             if (socket.current) {
//                 socket.current.close();
//             }
//         };
//     }, [accessToken]);

//     const handleUserClick = (user) => {
//         setSelectedUser(user);
//         // Optionally, you can load previous messages between selectedUser and current user
//         // For now, just setting the selected user is demonstrated
//     };

//     const sendMessage = (e) => {
//         e.preventDefault();
//         console.log("sending message to ", selectedUser.id, message, accessToken)
//         if (chatSocket && message.trim() !== '') {
//             chatSocket.send(
//                 JSON.stringify({
//                     message: message,
//                     receiver: selectedUser.id, // Assuming selectedUser has an `id` property
//                     sender: accessToken,
//                 })
//             );
//             setMessage('');
//         }
//     };

//     return (
//         <div className="container py-5">
//             <div className="row">
//                 {/* Members List */}
//                 <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
//                     <h5 className="font-weight-bold mb-3 text-center text-lg-start">Members</h5>
//                     {users.map((user) => (
//                         <div className="card mb-2" key={user.id} onClick={() => handleUserClick(user)}>
//                             <div className="card-body">
//                                 <ul className="list-unstyled mb-0">
//                                     <li className="p-2 border-bottom bg-body-tertiary">
//                                         <a href="#!" className="d-flex justify-content-between">
//                                             <div className="d-flex flex-row">
//                                                 <div className="pt-1">
//                                                     <p className="fw-bold mb-0">{user.username}</p>
//                                                     <p className="small text-muted">{user.email}</p>
//                                                 </div>
//                                             </div>
//                                         </a>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Chat Box */}
//                 <div className="col-md-6 col-lg-7 col-xl-8 bg-warning rounded">
//                     <ul className="list-unstyled">
//                         {/* Display Messages */}
//                         {messages.map((msg, index) => (
//                             <li className="d-flex justify-content-between mb-4" key={index}>
//                                 <div className="card w-100">
//                                     <div className="card-header d-flex justify-content-between p-3">
//                                         <p className="fw-bold mb-0">{msg.sender}</p>
//                                         <p className="text-muted small mb-0">
//                                             <i className="far fa-clock"></i> {msg.timestamp}
//                                         </p>
//                                     </div>
//                                     <div className="card-body">
//                                         <p className="mb-0">{msg.message}</p>
//                                     </div>
//                                 </div>
//                             </li>
//                         ))}

//                         {/* Message Input */}
//                         <li className="bg-white mb-3">
//                             <div className="form-outline">
//                                 <textarea
//                                     className="form-control bg-body-tertiary"
//                                     id="textAreaExample2"
//                                     rows="4"
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                 ></textarea>
//                                 <label className="form-label" htmlFor="textAreaExample2">
//                                     Message
//                                 </label>
//                             </div>
//                         </li>

//                         {/* Send Button */}
//                         <button
//                             type="button"
//                             className="btn btn-info btn-rounded float-end"
//                             onClick={sendMessage}
//                         >
//                             Send
//                         </button>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AuthGuard(Chat);

import React, { useEffect, useState, useRef } from 'react';
import AuthGuard from '../services/AuthGuard';
import axios from 'axios';

function Chat({ roomName }) {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [chatSocket, setChatSocket] = useState(null);
    const socket = useRef(null);

    const storedData = localStorage.getItem('user');
    const userData = JSON.parse(storedData);
    const accessToken = userData.access;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/users/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();

        const initWebSocket = () => {
            const ws = new WebSocket(`ws://localhost:8000/ws/chat/`);

            ws.onopen = () => {
                console.log('WebSocket connection opened');
                setChatSocket(ws);
            };

            ws.onmessage = (e) => {
                const data = JSON.parse(e.data);
                console.log("Messages happened", data);
                setMessages((prevMessages) => [...prevMessages, data.message]);
            };

            ws.onclose = () => {
                console.log('Chat socket closed unexpectedly');
            };

            ws.onerror = (error) => {
                console.error('WebSocket error observed:', error);
            };

            socket.current = ws;
        };

        initWebSocket();

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [accessToken]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        // Fetch message history between selectedUser.id and current user
        fetchMessageHistory(user.id);
    };

    const fetchMessageHistory = async (receiverId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/messages/${receiverId}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("data dfor messages", response.data)
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching message history:', error);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (chatSocket && message.trim() !== '') {
            chatSocket.send(
                JSON.stringify({
                    message: message,
                    receiver: selectedUser.id, // Assuming selectedUser has an `id` property
                    sender: accessToken,
                })
            );
            setMessage('');
        }
    };

    return (
        <div className="container py-5">
            <div className="row">
                {/* Members List */}
                <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
                    <h5 className="font-weight-bold mb-3 text-center text-lg-start">Members</h5>
                    {users.map((user) => (
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
                    ))}
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
    );
}

export default AuthGuard(Chat);
