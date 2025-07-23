import React, { useEffect }  from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import FloatingHelpButton from '../components/ui/FloatingHelpButton';

const Layout = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) return;

    // connect and pass the userId in the handshake
    const socket = io('http://localhost:5000', {
      auth: { token: user.token }, 
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected, id=', socket.id);
    });

    // whenever the server emits a "notification", toast it
    socket.on('notification', (note) => {
      switch (note.type) {
        case 'friend_request':
          toast.info(`${note.payload.username} sent you a friend request`);
          break;
        case 'achievement':
          toast.success(note.message || 'Achievement unlocked!');
          break;
        case 'friend_request_accepted':
          toast.success(`${note.payload.username} accepted your friend request`);
          break;
        default:
          toast(note.message || 'You have a new notification');
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Page Content below */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>

      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>
  );
};

export default Layout;
