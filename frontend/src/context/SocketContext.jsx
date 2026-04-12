import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    const { user } = useSelector((state) => state.auth);
    
    // Use a ref to track the current socket so cleanup always has the right reference
    const socketRef = useRef(null);

    // Only depend on user._id (a primitive string), NOT the entire user object.
    const userId = user?._id;

    useEffect(() => {
        if (userId) {
            // Determine the socket server URL:
            // - In development: use the backend URL directly (VITE_API_URL)
            // - Fallback: connect to localhost:5001
            const socketURL = import.meta.env.VITE_API_URL || "http://localhost:5001";
            
            console.log("🔌 Connecting socket to:", socketURL, "for user:", userId);

            const newSocket = io(socketURL, {
                query: {
                    userId: userId,
                },
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                transports: ["websocket", "polling"], // Try WebSocket first, fall back to polling
            });

            socketRef.current = newSocket;
            setSocket(newSocket);

            // 2. Listen for Online Users (Green Dots)
            newSocket.on("getOnlineUsers", (users) => {
                console.log("👥 Online users updated:", users);
                setOnlineUsers(users);
            });

            // 3. Connection Event Logging
            newSocket.on("connect", () => {
                console.log("✅ Socket connected:", newSocket.id);
            });

            newSocket.on("connect_error", (err) => {
                console.error("❌ Socket connection error:", err.message);
            });

            newSocket.on("disconnect", (reason) => {
                console.log("❌ Socket disconnected:", reason);
            });

            newSocket.on("reconnect", (attemptNumber) => {
                console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
            });

            // Cleanup on unmount or when userId changes (logout)
            return () => {
                console.log("🔌 Closing socket connection");
                newSocket.close();
                socketRef.current = null;
                setSocket(null);
                setOnlineUsers([]);
            };
        } else {
            // If user logs out, close socket
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
                setSocket(null);
                setOnlineUsers([]);
            }
        }
    }, [userId]); // ✅ Only re-run when userId changes (login/logout), NOT on every render

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};