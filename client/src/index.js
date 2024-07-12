import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './pages/login';
import Signup from './pages/signup';
import Chat from './pages/chat';
import ChatRoom from './pages/chatRoom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path='login' element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat-room" element={<ChatRoom />} />
          <Route path='dashboard' element={<Dashboard />} />



          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
