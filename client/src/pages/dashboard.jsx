import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import './Dashboard.css';
import AuthGuard from '../services/AuthGuard';
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const storedData = localStorage.getItem('user');
    const userData = JSON.parse(storedData);
    const accessToken = userData.access;
    const userEmail = userData.email;
    const [users, setUsers] = useState([]);
    const [interest, setInterest] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
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

        const fetchInterest = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/recieved-interest/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setInterest(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchInterest();
    }, [accessToken])

    function sendRequest(userId) {
        const sendReq = async () => {
            console.log("Sending request to", userId)
            try {
                const postData = {
                    "receiver": userId

                };
                const response = axios.post('http://127.0.0.1:8000/api/send-interest/', postData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                });
                // setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        sendReq()
    }

    function rejectUser(id){
        const fetchUsers = async () => {
            try {
                const postData = {
                    "user_id": id
                 
                };
                const response = await axios.post('http://127.0.0.1:8000/api/reject-interest/', postData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json' 
                    },
                });
                // setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }

    function acceptUser(id) {
        const fetchUsers = async () => {
            try {
                const postData = {
                    "user_id": id

                };
                const response = await axios.post('http://127.0.0.1:8000/api/accept-interest/', postData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                });
                // setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }

   
    return (
        <div className="container">
            <div className="row">
                {/* First Box */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <button style={{ padding: '15px 25px', fontSize: '18px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate("/chat")}>Inbox</button>
                            <h5 className="header-title pb-3 mt-0">Your Interest Requests {userEmail}</h5>
                            <div
                                className="table-responsive boxscroll"
                                style={{ overflow: 'hidden', outline: 'none' }}
                                tabIndex="5000"
                            >
                                <table className="table mb-0">
                                    <tbody>
                                        {interest.map((item) => {
                                            // Determine if the current user is the sender or the receiver
                                            const isSender = item.sender.email === userEmail;
                                            const user = isSender ? item.receiver : item.sender;

                                            return (
                                                <tr key={item.id}>
                                                    <td className="border-top-0">
                                                        <div className="media">
                                                            <img
                                                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                                alt=""
                                                                className="thumb-md rounded-circle"
                                                            />
                                                            <div className="media-body ml-2">
                                                                <p className="mb-0">{user.username}<span className="badge badge-soft-danger">{item.id}</span></p>
                                                                <span className="font-12 text-muted">{user.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="border-top-0 text-right">
                                                        {item.status === 'pending' && isSender && (
                                                            <a href="#" className="btn btn-light btn-sm">
                                                                <i className="far fa-times-circle mr-2 text-danger"></i>Pending
                                                            </a>
                                                        )}
                                                        {item.status === 'pending' && !isSender && (
                                                            <>
                                                                <a onClick={() => { acceptUser(user.id)}} className="btn btn-light btn-sm">
                                                                    <i className="far fa-user mr-2 text-success"></i>Accept
                                                                </a>
                                                                <a onClick={() => {rejectUser(user.id)}} className="btn btn-light btn-sm">
                                                                    <i className="far fa-times-circle mr-2 text-danger"></i>Reject
                                                                </a>
                                                            </>
                                                        )}
                                                        {item.status === 'accepted' && (
                                                            <span className="btn btn-light btn-sm">
                                                                <i className="far fa-check-circle mr-2 text-success"></i>Accepted
                                                            </span>
                                                        )}
                                                        {item.status === 'rejected' && (
                                                            <span className="btn btn-light btn-sm">
                                                                <i className="far fa-times-circle mr-2 text-danger"></i>Rejected
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Box */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            {/* Content for the second box */}
                            <h5 className="header-title pb-3 mt-0">All Users</h5>
                            {/* Add content here */}
                            <table className="table mb-0">
                                <tbody>
                                    {users
                                        .filter(user => user.email !== userEmail) // Filter out users with matching email
                                        .map(user => (
                                            <tr key={user.id}>
                                                <td className="border-top-0">
                                                    <div className="media">
                                                        <img
                                                            src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                            alt=""
                                                            className="thumb-md rounded-circle"
                                                        />
                                                        <div className="media-body ml-2">
                                                            <p className="mb-0">
                                                                {user.username}
                                                                <span className="badge badge-soft-danger">{user.id}</span>
                                                            </p>
                                                            <span className="font-12 text-muted">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="border-top-0 text-right">
                                                    <button onClick={() => sendRequest(user.id)} className="btn btn-light btn-sm">
                                                        <i className="far fa-user mr-2 text-success"></i>Send Request
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>

                            </table>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AuthGuard(Dashboard);
