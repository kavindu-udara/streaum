import { View, Text, Pressable, SafeAreaView, KeyboardAvoidingView, FlatList, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../../types/navigation'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Message {
    id: string;
    text: string;
    sender: "me" | "other";
}

type TextChannelRouteProp = RouteProp<RootStackParamList, 'TextChannel'>

const TextChannelScreen = () => {

    const route = useRoute<TextChannelRouteProp>();
    const { channelId, serverId } = route.params;

    const socketURL = `${process.env.EXPO_PUBLIC_WEBSOCKET_URL}/chat/${serverId}/${channelId}/50`;

    const [websocket, setWebSocket] = useState<WebSocket | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const handleSocketOnOpen = () => {
        console.log('Connected to chat!');
    }

    const handleSocketOnMessage = (event: MessageEvent<any>) => {
        console.log("Message:", event.data)
    }

    const initWebSocker = (token : string) => {
        if (!token) {
            console.log("Token not available");
            return;
        }

        const socketURL = `${process.env.EXPO_PUBLIC_WEBSOCKET_URL}/chat/${serverId}/${channelId}/${token}`;
        const socket = new WebSocket(socketURL);
        setWebSocket(socket);

        socket.onopen = () => handleSocketOnOpen();
        socket.onmessage = (event) => handleSocketOnMessage(event);
        socket.onerror = (err: any) => {
            // In React Native the event nishape can vary; print as much as possible
            console.log('WebSocket error:', err?.message ?? err);
        };
        socket.onclose = (event: any) => {
            console.log('Disconnected. code=', event?.code, 'reason=', event?.reason, 'wasClean=', event?.wasClean);
        };

    }

    // useEffect(() => {

    //     if (!token) {
    //         console.log("Token not available");
    //         return;
    //     }

    //     console.log('Opening WebSocket to:', socketURL);

    //     const socket = new WebSocket(socketURL);
    //     setWebSocket(socket);

    //     socket.onopen = () => handleSocketOnOpen();
    //     socket.onmessage = (event) => handleSocketOnMessage(event);
    //     socket.onerror = (err: any) => {
    //         // In React Native the event shape can vary; print as much as possible
    //         console.log('WebSocket error:', err?.message ?? err);
    //     };
    //     socket.onclose = (event: any) => {
    //         console.log('Disconnected. code=', event?.code, 'reason=', event?.reason, 'wasClean=', event?.wasClean);
    //     };

    //     // cleanup on unmount or when dependencies change
    //     return () => {
    //         console.log('Cleaning up WebSocket');
    //         try {
    //             socket.onopen = null;
    //             socket.onmessage = null;
    //             socket.onerror = null;
    //             socket.onclose = null;
    //             socket.close();
    //         } catch (e) {
    //             // ignore
    //         }
    //         setWebSocket(null);
    //     };

    // }, [socketURL, token]);

    useEffect(() => {
        const fetchToken = async () => {
            const token = (await AsyncStorage.getItem("token"))?.toString();
            if (token) {
                setToken(token);
                initWebSocker(token);
            }
        };
        fetchToken();
    }, []);

    const [messages, setMessages] = useState<Message[]>([
        { id: "1", text: "Hey there! 👋", sender: "other" },
        { id: "2", text: "Hi! How’s it going?", sender: "me" },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const flatListRef = useRef<FlatList>(null);

    const handleSend = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: Date.now().toString(),
            text: newMessage.trim(),
            sender: "me",
        };

        // Send message via WebSocket
        websocket?.send(JSON.stringify({ text: message.text }));

        // Update local message list

        setMessages((prev) => [...prev, message]);
        setNewMessage("");

    };

    // Auto-scroll to bottom when new message arrives
    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const renderMessage = ({ item }: { item: Message }) => (
        <View
            className={`flex-row my-1 px-3 ${item.sender === "me" ? "justify-end" : "justify-start"
                }`}
        >
            <View
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${item.sender === "me"
                    ? "bg-indigo-600 rounded-br-none"
                    : "bg-gray-200 rounded-bl-none"
                    }`}
            >
                <Text
                    className={`text-base ${item.sender === "me" ? "text-white" : "text-gray-800"
                        }`}
                >
                    {item.text}
                </Text>
            </View>
        </View>
    );

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
                    renderItem={renderMessage}
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