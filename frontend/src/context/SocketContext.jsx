import { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    // ✅ FIX: Changed from userData to user to match authSlice structure
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user?._id) {
            // 1. Initialize Connection
            const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
                query: {
                    userId: user._id,
                },
            });

            setSocket(newSocket);

            // 2. Listen for Online Users (Green Dots)
            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // 3. Connection Event Logging (Optional - for debugging)
            newSocket.on("connect", () => {
                console.log("✅ Socket connected:", newSocket.id);
            });

            newSocket.on("disconnect", () => {
                console.log("❌ Socket disconnected");
            });

            // Cleanup on unmount or logout
            return () => {
                console.log("🔌 Closing socket connection");
                newSocket.close();
                setSocket(null);
            };
        } else {
            // If user logs out, close socket
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};