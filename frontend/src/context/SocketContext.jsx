import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);
  const socketRef = useRef(null);

  const addToast = (type, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message, timestamp: new Date() }]);

    // Auto remove toast after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('[Socket.io] Connected with id:', newSocket.id);
        newSocket.emit('join_user_room', user.id);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('[Socket.io] Disconnected');
      });

      newSocket.on('task_created', (data) => {
        setLastEvent({ type: 'task_created', data, timestamp: Date.now() });
        addToast('created', data.message || `Task "${data.task?.title}" created.`);
      });

      newSocket.on('task_updated', (data) => {
        setLastEvent({ type: 'task_updated', data, timestamp: Date.now() });
        addToast(
          data.isStatusChanged ? 'status' : 'updated',
          data.message || `Task "${data.task?.title}" was updated.`
        );
      });

      newSocket.on('task_deleted', (data) => {
        setLastEvent({ type: 'task_deleted', data, timestamp: Date.now() });
        addToast('deleted', data.message || 'A task was deleted.');
      });

      return () => {
        if (newSocket) {
          newSocket.emit('leave_user_room', user.id);
          newSocket.disconnect();
        }
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthenticated, user?.id]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        lastEvent,
        toasts,
        removeToast,
        addToast,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
