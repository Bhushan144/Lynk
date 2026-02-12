import { useEffect, useState, useRef } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { 
    Search, MoreVertical, Send, Paperclip, Phone, Video, ArrowLeft, 
    UserPlus, MessageCircle, Smile, Loader2, CheckCheck, Info, X
} from "lucide-react";
import toast from "react-hot-toast";

const Chat = () => {
    const { socket, onlineUsers } = useSocketContext();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);

    // --- STATE ---
    const [activeTab, setActiveTab] = useState("chats");
    const [conversations, setConversations] = useState([]); 
    const [requests, setRequests] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showChatInfo, setShowChatInfo] = useState(false);
    
    // Loading States
    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    
    // UI Toggles
    const [showSidebar, setShowSidebar] = useState(true);

    // ----------------------------------------------------------------------
    // AUTO-SCROLL TO BOTTOM
    // ----------------------------------------------------------------------
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ----------------------------------------------------------------------
    // 1. INITIAL DATA FETCHING
    // ----------------------------------------------------------------------
    const fetchChats = async () => {
        try {
            setLoadingChats(true);
            const { data } = await api.get("/chat/my-chats");
            setConversations(data.data.chats);
        } catch (error) {
            console.error("Failed to load chats", error);
            toast.error("Failed to load chats");
        } finally {
            setLoadingChats(false);
        }
    };

    const fetchRequests = async () => {
        try {
            setLoadingRequests(true);
            const { data } = await api.get("/chat/requests");
            setRequests(data.data.requests);
        } catch (error) {
            console.error("Failed to load requests", error);
        } finally {
            setLoadingRequests(false);
        }
    };

    useEffect(() => {
        fetchChats();
        fetchRequests();
    }, []);

    // ----------------------------------------------------------------------
    // 2. REAL-TIME LISTENERS (Socket.io) - 🔥 DEEP FIX
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!socket) {
            console.log("⚠️ Socket not connected yet");
            return;
        }

        console.log("✅ Socket connected, setting up listeners");

        // 🔥 Handle New Message - Updates sidebar for BOTH sender and receiver
        const handleNewMessage = (message) => {
            console.log("📩 [SOCKET EVENT] newMessage received:", {
                messageId: message._id,
                sender: message.sender,
                currentUser: user._id,
                isMine: message.sender === user._id,
                conversationId: message.conversation,
                content: message.content?.substring(0, 30)
            });
            
            // 1. If viewing this chat, append message to chat window
            if (selectedChat?._id === message.conversation) {
                setMessages((prev) => {
                    // Avoid duplicates (optimistic update already added it)
                    const exists = prev.some(m => m._id === message._id);
                    if (exists) {
                        console.log("⚠️ Message already exists, skipping duplicate");
                        return prev;
                    }
                    console.log("✅ Adding message to chat window");
                    return [...prev, message];
                });
            }

            // 2. 🔥 CRITICAL: Update sidebar for EVERYONE (sender + receiver)
            setConversations((prev) => {
                console.log("🔄 Updating conversations sidebar...");
                const existingIndex = prev.findIndex(c => c._id === message.conversation);
                
                if (existingIndex !== -1) {
                    // Update existing conversation
                    const updated = [...prev];
                    const currentChat = updated[existingIndex];
                    
                    updated[existingIndex] = {
                        ...currentChat,
                        lastMessage: message,
                        updatedAt: new Date().toISOString(),
                        // Only increment unread if:
                        // 1. This is NOT the sender (sender shouldn't see unread badge)
                        // 2. User is NOT currently viewing this chat
                        unreadCount: message.sender === user._id 
                            ? 0  // Sender's own message = 0 unread
                            : (selectedChat?._id === message.conversation ? 0 : (currentChat.unreadCount || 0) + 1)
                    };
                    
                    // 🔥 SORT BY TIMESTAMP - MOST RECENT FIRST
                    const sorted = updated.sort((a, b) => {
                        const dateA = new Date(a.updatedAt).getTime();
                        const dateB = new Date(b.updatedAt).getTime();
                        return dateB - dateA;
                    });
                    
                    console.log("✅ Sidebar updated and sorted. Top 3:", sorted.slice(0, 3).map(c => ({ 
                        name: c.partner?.fullName, 
                        lastMsg: c.lastMessage?.content?.substring(0, 20),
                        time: new Date(c.updatedAt).toLocaleTimeString()
                    })));
                    
                    return sorted;
                } else {
                    // New conversation - refetch to get full data
                    console.log("🆕 New conversation detected, refetching...");
                    fetchChats();
                    return prev;
                }
            });
        };

        // B. Handle New Connection Request
        const handleNewRequest = (data) => {
            console.log("📨 [SOCKET EVENT] newRequest received:", data);
            toast.custom((t) => (
                <div className="bg-black text-white px-4 py-3 rounded-xl shadow-lg text-sm flex items-center gap-3">
                    <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                        <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold">New Connection Request</p>
                        <p className="text-xs text-gray-300">{data.senderName} wants to connect</p>
                    </div>
                </div>
            ), { duration: 4000 });
            fetchRequests();
        };

        // C. Handle Request Accepted
        const handleRequestAccepted = (data) => {
            console.log("🎉 [SOCKET EVENT] requestAccepted received:", data);
            toast.success(`🎉 ${data.accepterName} accepted your request!`, {
                duration: 4000,
                style: {
                    background: '#000',
                    color: '#fff',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '16px',
                }
            });
            fetchChats(); // Refresh to show new accepted connection
        };

        // 🔥 REGISTER EVENT LISTENERS
        socket.on("newMessage", handleNewMessage);
        socket.on("newRequest", handleNewRequest);
        socket.on("requestAccepted", handleRequestAccepted);

        console.log("✅ Socket listeners registered");

        // 🔥 CLEANUP
        return () => {
            console.log("🧹 Cleaning up socket listeners");
            socket.off("newMessage", handleNewMessage);
            socket.off("newRequest", handleNewRequest);
            socket.off("requestAccepted", handleRequestAccepted);
        };
    }, [socket, selectedChat, user._id]); // All dependencies included

    // ----------------------------------------------------------------------
    // 3. LOAD MESSAGES WHEN CHAT IS SELECTED
    // ----------------------------------------------------------------------
    const fetchMessages = async (conversationId) => {
        try {
            setLoadingMessages(true);
            const { data } = await api.get(`/chat/${conversationId}`);
            setMessages(data.data);
            
            // Reset unread count in local state immediately
            setConversations(prev => 
                prev.map(c => 
                    c._id === conversationId 
                        ? { ...c, unreadCount: 0 } 
                        : c
                )
            );
        } catch (error) {
            console.error("Failed to load messages", error);
            toast.error("Failed to load messages");
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        setShowSidebar(false);
        fetchMessages(chat._id);
    };

    // ----------------------------------------------------------------------
    // 4. SEND MESSAGE - 🔥 OPTIMISTIC UPDATE
    // ----------------------------------------------------------------------
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const messageContent = newMessage.trim();
        setNewMessage("");

        // 🔥 Optimistic UI Update - Add temp message immediately
        const tempMessage = {
            _id: `temp-${Date.now()}`,
            content: messageContent,
            sender: user._id,
            conversation: selectedChat._id,
            createdAt: new Date().toISOString(),
            isTemp: true
        };
        
        setMessages(prev => [...prev, tempMessage]);

        // 🔥 Update sidebar optimistically (sender's view)
        setConversations(prev => {
            const updated = prev.map(c => {
                if (c._id === selectedChat._id) {
                    return {
                        ...c,
                        lastMessage: tempMessage,
                        updatedAt: new Date().toISOString(),
                        unreadCount: 0 // Sender always has 0 unread
                    };
                }
                return c;
            });
            
            // Sort immediately
            return updated.sort((a, b) => {
                const dateA = new Date(a.updatedAt).getTime();
                const dateB = new Date(b.updatedAt).getTime();
                return dateB - dateA;
            });
        });

        try {
            setSendingMessage(true);
            const { data } = await api.post("/chat/send", {
                conversationId: selectedChat._id,
                content: messageContent
            });

            console.log("✅ Message sent successfully:", data.data);

            // 🔥 Replace temp message with real message
            setMessages(prev => 
                prev.map(msg => 
                    msg._id === tempMessage._id 
                        ? { ...data.data, isTemp: false } 
                        : msg
                )
            );
            
            // Update sidebar with real message data
            setConversations(prev => 
                prev.map(c => 
                    c._id === selectedChat._id 
                        ? { ...c, lastMessage: data.data } 
                        : c
                )
            );

        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message");
            
            // Remove temp message on failure
            setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
            
            // Revert sidebar update
            setConversations(prev => {
                const updated = prev.map(c => {
                    if (c._id === selectedChat._id) {
                        const prevMessages = messages.filter(m => m._id !== tempMessage._id);
                        const prevLastMessage = prevMessages[prevMessages.length - 1];
                        return {
                            ...c,
                            lastMessage: prevLastMessage || null
                        };
                    }
                    return c;
                });
                
                return updated.sort((a, b) => {
                    const dateA = new Date(a.updatedAt || 0).getTime();
                    const dateB = new Date(b.updatedAt || 0).getTime();
                    return dateB - dateA;
                });
            });
        } finally {
            setSendingMessage(false);
        }
    };

    // ----------------------------------------------------------------------
    // 5. CONNECTION REQUEST HANDLERS
    // ----------------------------------------------------------------------
    const handleAcceptRequest = async (conversationId) => {
        try {
            await api.post("/chat/manage-request", {
                conversationId,
                action: "ACCEPTED"
            });
            toast.success("Request accepted!");
            fetchRequests();
            fetchChats();
        } catch (error) {
            console.error(error);
            toast.error("Failed to accept request");
        }
    };

    const handleRejectRequest = async (conversationId) => {
        try {
            await api.post("/chat/manage-request", {
                conversationId,
                action: "REJECTED"
            });
            toast.success("Request rejected");
            fetchRequests();
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject request");
        }
    };

    // ----------------------------------------------------------------------
    // 6. PROFILE VIEW
    // ----------------------------------------------------------------------
    const handleViewProfile = () => {
        if (selectedChat?.partner?._id) {
            navigate(`/profile/${selectedChat.partner._id}`);
        }
    };

    // ----------------------------------------------------------------------
    // 7. SEARCH FILTER
    // ----------------------------------------------------------------------
    const filteredConversations = conversations.filter(chat =>
        chat.partner?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredRequests = requests.filter(req =>
        req.initiator?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ----------------------------------------------------------------------
    // RENDER - 🔥 PERFECT HEIGHT: Navbar is 80px (h-20), so Chat = calc(100vh - 80px)
    // ----------------------------------------------------------------------
    return (
        <div className="flex h-[calc(100vh-80px)] bg-gray-50">
            {/* Left Sidebar */}
            <div className={`${showSidebar ? 'block' : 'hidden md:block'} w-full md:w-96 bg-white border-r border-gray-200 flex flex-col h-full`}>
                
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
                    
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/10 outline-none transition-all"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => setActiveTab("chats")}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                activeTab === "chats" 
                                    ? "bg-black text-white" 
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Chats
                        </button>
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors relative ${
                                activeTab === "requests" 
                                    ? "bg-black text-white" 
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Requests
                            {requests.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {requests.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Chats List */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === "chats" ? (
                        loadingChats ? (
                            <div className="flex items-center justify-center h-32">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm">
                                <MessageCircle className="h-12 w-12 mb-2 text-gray-300" />
                                <p>No conversations yet</p>
                                <p className="text-xs text-gray-400 mt-1">Accept a request to start chatting</p>
                            </div>
                        ) : (
                            filteredConversations.map((chat) => {
                                const isOnline = onlineUsers.includes(chat.partner?._id);
                                const isSelected = selectedChat?._id === chat._id;
                                
                                return (
                                    <div
                                        key={chat._id}
                                        onClick={() => handleChatSelect(chat)}
                                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                            isSelected ? 'bg-gray-100 border-l-4 border-l-black' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={chat.partner?.avatar || `https://ui-avatars.com/api/?name=${chat.partner?.fullName}&background=000&color=fff`}
                                                    className="h-12 w-12 rounded-full object-cover"
                                                    alt={chat.partner?.fullName}
                                                />
                                                {isOnline && (
                                                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline">
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {chat.partner?.fullName}
                                                    </h3>
                                                    {chat.lastMessage && (
                                                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                                            {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {chat.lastMessage?.content || "No messages yet"}
                                                    </p>
                                                    {chat.unreadCount > 0 && (
                                                        <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                                                            {chat.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )
                    ) : (
                        // Requests Tab
                        loadingRequests ? (
                            <div className="flex items-center justify-center h-32">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm">
                                <UserPlus className="h-12 w-12 mb-2 text-gray-300" />
                                <p>No pending requests</p>
                            </div>
                        ) : (
                            filteredRequests.map((request) => (
                                <div key={request._id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={request.initiator?.avatar || `https://ui-avatars.com/api/?name=${request.initiator?.fullName}&background=000&color=fff`}
                                            className="h-12 w-12 rounded-full object-cover"
                                            alt={request.initiator?.fullName}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900">
                                                {request.initiator?.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {request.requestMessage || "Wants to connect with you"}
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => handleAcceptRequest(request._id)}
                                                    className="flex-1 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRequest(request._id)}
                                                    className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>

            {/* Right Side - Chat Area */}
            <div className={`${!showSidebar ? 'flex' : 'hidden md:flex'} flex-1 flex-col relative h-full`}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setShowSidebar(true)}
                                    className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <img
                                    src={selectedChat.partner?.avatar || `https://ui-avatars.com/api/?name=${selectedChat.partner?.fullName}&background=000&color=fff`}
                                    className="h-10 w-10 rounded-full object-cover"
                                    alt={selectedChat.partner?.fullName}
                                />
                                <div>
                                    <h2 className="font-semibold text-gray-900">{selectedChat.partner?.fullName}</h2>
                                    <p className="text-xs text-gray-500">
                                        {onlineUsers.includes(selectedChat.partner?._id) ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hidden md:block">
                                    <Phone className="h-5 w-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hidden md:block">
                                    <Video className="h-5 w-5" />
                                </button>
                                <button 
                                    onClick={() => setShowChatInfo(!showChatInfo)}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                                >
                                    <Info className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area - 🔥 NO MORE UGLY SCROLLBAR */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {loadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                </div>
                            ) : (
                                <div className="space-y-4 max-w-4xl mx-auto">
                                    {messages.map((msg, index) => {
                                        const isMe = msg.sender === user._id;
                                        const showAvatar = index === 0 || messages[index - 1].sender !== msg.sender;
                                        const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.sender !== msg.sender;
                                        
                                        return (
                                            <div key={msg._id || index} className={`flex ${isMe ? "justify-end" : "justify-start"} ${!showAvatar ? 'mt-1' : ''}`}>
                                                {!isMe && showAvatar && (
                                                    <img 
                                                        src={selectedChat.partner?.avatar || `https://ui-avatars.com/api/?name=${selectedChat.partner?.fullName}&background=000&color=fff`}
                                                        className="h-8 w-8 rounded-full object-cover mr-2 mt-auto mb-1 flex-shrink-0" 
                                                        alt=""
                                                    />
                                                )}
                                                {!isMe && !showAvatar && <div className="w-8 mr-2" />}
                                                
                                                <div className={`max-w-[75%] md:max-w-[60%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                                        isMe 
                                                        ? `bg-black text-white ${isLastInGroup ? 'rounded-br-md' : ''}` 
                                                        : `bg-white text-gray-900 border border-gray-100 ${isLastInGroup ? 'rounded-bl-md' : ''}`
                                                    }`}>
                                                        <p className="break-words">{msg.content}</p>
                                                        <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-gray-300' : 'text-gray-400'}`}>
                                                            <span className="text-[10px]">
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {isMe && msg.isRead && (
                                                                <CheckCheck className="h-3 w-3 text-blue-400" />
                                                            )}
                                                            {isMe && msg.isTemp && (
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
                            <div className="flex items-center gap-2 max-w-4xl mx-auto">
                                <button 
                                    type="button" 
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors hidden md:block"
                                >
                                    <Smile className="h-5 w-5" />
                                </button>
                                <button 
                                    type="button" 
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors hidden md:block"
                                >
                                    <Paperclip className="h-5 w-5" />
                                </button>
                                <div className="flex-1 relative">
                                    <input
                                        ref={messageInputRef}
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        disabled={sendingMessage}
                                        className="w-full bg-gray-100 border-none rounded-full px-5 py-3 focus:ring-2 focus:ring-black/10 outline-none transition-all disabled:opacity-50"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={!newMessage.trim() || sendingMessage} 
                                    className="p-3 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                                >
                                    {sendingMessage ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    // Empty State
                    <div className="hidden md:flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-gray-50 to-white">
                        <div className="w-24 h-24 bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center mb-6 shadow-xl">
                            <MessageCircle className="h-12 w-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h2>
                        <p className="text-gray-500 max-w-sm">
                            Select a chat from the sidebar to start messaging, or accept a connection request
                        </p>
                    </div>
                )}

                {/* Chat Info Sidebar */}
                {showChatInfo && selectedChat && (
                    <>
                        <div 
                            className="fixed inset-0 bg-black/20 z-40 md:hidden"
                            onClick={() => setShowChatInfo(false)}
                        />
                        
                        <div className={`absolute md:relative right-0 top-0 h-full w-80 bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 ${
                            showChatInfo ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
                        }`}>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg">Chat Info</h3>
                                <button 
                                    onClick={() => setShowChatInfo(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-6 text-center">
                                <img 
                                    src={selectedChat.partner?.avatar || `https://ui-avatars.com/api/?name=${selectedChat.partner?.fullName}&background=000&color=fff`}
                                    className="h-24 w-24 rounded-full object-cover mx-auto mb-4 border-4 border-gray-100" 
                                    alt={selectedChat.partner?.fullName}
                                />
                                <h4 className="font-bold text-xl text-gray-900">{selectedChat.partner?.fullName}</h4>
                                <p className="text-sm text-gray-500 mt-1">@{selectedChat.partner?.username}</p>
                                
                                <div className="mt-6 space-y-3">
                                    <button 
                                        onClick={handleViewProfile}
                                        className="block w-full py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Chat;