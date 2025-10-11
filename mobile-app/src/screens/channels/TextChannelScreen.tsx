import { View, Text, Pressable, SafeAreaView, KeyboardAvoidingView, FlatList, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../../types/navigation'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RenderMessage from '../../components/rows/RenderMessage'

interface Message {
    id: string;
    text: string;
    sender: "me" | "other";
    name : string
}

type TextChannelRouteProp = RouteProp<RootStackParamList, 'TextChannel'>

const TextChannelScreen = () => {

    const route = useRoute<TextChannelRouteProp>();
    const { channelId, serverId } = route.params;

    const socketURL = `${process.env.EXPO_PUBLIC_WEBSOCKET_URL}/chat/${serverId}/${channelId}/50`;

    const [websocket, setWebSocket] = useState<WebSocket | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const [messages, setMessages] = useState<Message[]>([
        { id: "1", text: "Hey there! 👋", sender: "other", name : "new" },
        { id: "2", text: "Hi! How’s it going?", sender: "me", name : "gg" },
    ]);

    const [newMessage, setNewMessage] = useState("");
    const flatListRef = useRef<FlatList>(null);

    const handleSocketOnOpen = () => {
        console.log('Connected to chat!');
    }
    const getNextMessageId = () => {
        if (messages.length === 0) return "1";
        const maxId = Math.max(...messages.map(m => Number(m.id)));
        return (maxId + 1).toString();
    };

    const handleSocketOnMessage = (event: MessageEvent<any>) => {
        console.log("Message:", event.data)
        // {"message":"{\"text\":\"hehe\"}","name":"fname lname","createdAt":"Sun Oct 12 03:22:16 IST 2025","userId":"1"}
        const data = JSON.parse(event.data);

        const message: Message = { id: Date.now().toString(), text: data.message, sender: data.token != token ? "other" : "me", name : data.name };

        setMessages(prev => [...prev, message]);

    }

    useEffect(() => {

        if (!token) {
            console.log("Token not available");
            return;
        }
        // If websocket already exists and is still open or connecting, don't rejoin
        if (websocket && (websocket.readyState === WebSocket.OPEN || websocket.readyState === WebSocket.CONNECTING)) {
            console.log("Already connected or connecting. Skipping new connection.");
            return;
        }

        const socketURL = `${process.env.EXPO_PUBLIC_WEBSOCKET_URL}/chat/${serverId}/${channelId}/${token}`;
        console.log("Connecting to:", socketURL);

        const socket = new WebSocket(socketURL);
        setWebSocket(socket);

        socket.onopen = () => {
            console.log("Connected to chat!");
            handleSocketOnOpen();
        };

        socket.onmessage = (event) => handleSocketOnMessage(event);

        socket.onerror = (err: any) => {
            console.log("WebSocket error:", err?.message ?? err);
        };

        socket.onclose = (event: any) => {
            console.log(
                "🔌 Disconnected.",
                "code=", event?.code,
                "reason=", event?.reason,
                "wasClean=", event?.wasClean
            );
            setWebSocket(null); // cleanup state
        };

        // cleanup on unmount or when dependencies change
        return () => {
            console.log('Cleaning up WebSocket');
            try {
                socket.onopen = null;
                socket.onmessage = null;
                socket.onerror = null;
                socket.onclose = null;
                socket.close();
            } catch (e) {
                // ignore
            }
            setWebSocket(null);
        };

    }, [socketURL, token]);

    useEffect(() => {
        const fetchToken = async () => {
            const token = (await AsyncStorage.getItem("token"))?.toString();
            if (token) {
                setToken(token);
                // initWebSocker(token);
            }
        };
        fetchToken();
    }, []);


    const handleSend = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: Date.now().toString(),
            text: newMessage.trim(),
            sender: "me",
            name : ""
        };

        // Send message via WebSocketnew
        // websocket?.send(JSON.stringify({ text: message.text }));
        websocket?.send(message.text);

        // Update local message list

        // setMessages((prev) => [...prev, message]);
        setNewMessage("");

    };

    // Auto-scroll to bottom when new message arrives
    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAvoidingView
                className='flex-1'
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={90}
            >
                {/* Message List */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RenderMessage item={item} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 2, paddingVertical: 4 }}
                    showsVerticalScrollIndicator={false}
                />

                {/* Message Input */}
                <View className="flex-row items-center px-3 py-2 border-t border-gray-300 bg-white">
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-base text-gray-900"
                    />

                    <TouchableOpacity
                        onPress={handleSend}
                        className="ml-2 bg-indigo-600 p-3 rounded-full"
                    >
                        <Ionicons name="send" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default TextChannelScreen