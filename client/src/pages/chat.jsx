import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthGuard from '../services/AuthGuard';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

function Chat() {

    const [users , setUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.user.access;
            console.log(accessToken);
            try {
                const response = await axios.get(
                    'http://127.0.0.1:8000/api/users/',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setUsers(response.data)
                console.log("response is here?",response.data); // Handle the response data here
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error
            }
        };

        fetchData();
    }, []); 

  return (
    <div>
              <div class="container py-5">

                  <div class="row">

                      <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">

                          <h5 class="font-weight-bold mb-3 text-center text-lg-start">Member</h5>
                      
                        {users.map((user) => (
                            <div className="card" key={user.id}>
                                <div className="card-body">
                                    <ul className="list-unstyled mb-0">
                                        <li className="p-2 border-bottom bg-body-tertiary">
                                            <a href="#!" className="d-flex justify-content-between">
                                                <div className="d-flex flex-row">
                                                    {/* <img
                                                        src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp"
                                                        alt="avatar"
                                                        className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                                        width="60"
                                                    /> */}
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

                      <div class="col-md-6 col-lg-7 col-xl-8">

                          <ul class="list-unstyled">
                              <li class="d-flex justify-content-between mb-4">
                                  <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp" alt="avatar"
                                      class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60"/>
                                      <div class="card">
                                          <div class="card-header d-flex justify-content-between p-3">
                                              <p class="fw-bold mb-0">Brad Pitt</p>
                                              <p class="text-muted small mb-0"><i class="far fa-clock"></i> 12 mins ago</p>
                                          </div>
                                          <div class="card-body">
                                              <p class="mb-0">
                                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                                  labore et dolore magna aliqua.
                                              </p>
                                          </div>
                                      </div>
                              </li>
                              <li class="d-flex justify-content-between mb-4">
                                  <div class="card w-100">
                                      <div class="card-header d-flex justify-content-between p-3">
                                          <p class="fw-bold mb-0">Lara Croft</p>
                                          <p class="text-muted small mb-0"><i class="far fa-clock"></i> 13 mins ago</p>
                                      </div>
                                      <div class="card-body">
                                          <p class="mb-0">
                                              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                                              laudantium.
                                          </p>
                                      </div>
                                  </div>
                                  <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp" alt="avatar"
                                      class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="60"/>
                              </li>
                              <li class="d-flex justify-content-between mb-4">
                                  <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp" alt="avatar"
                                      class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60"/>
                                      <div class="card">
                                          <div class="card-header d-flex justify-content-between p-3">
                                              <p class="fw-bold mb-0">Brad Pitt</p>
                                              <p class="text-muted small mb-0"><i class="far fa-clock"></i> 10 mins ago</p>
                                          </div>
                                          <div class="card-body">
                                              <p class="mb-0">
                                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                                  labore et dolore magna aliqua.
                                              </p>
                                          </div>
                                      </div>
                              </li>
                              <li class="bg-white mb-3">
                                  <div data-mdb-input-init class="form-outline">
                                      <textarea class="form-control bg-body-tertiary" id="textAreaExample2" rows="4"></textarea>
                                      <label class="form-label" for="textAreaExample2">Message</label>
                                  </div>
                              </li>
                              <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-info btn-rounded float-end">Send</button>
                          </ul>

                      </div>

                  </div>

              </div>
    </div>
  )
}

export default AuthGuard(Chat)
