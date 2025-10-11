import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../../types/navigation'

type TextChannelRouteProp = RouteProp<RootStackParamList, 'TextChannel'>

const TextChannelScreen = () => {

    const route = useRoute<TextChannelRouteProp>();
    const { channelId, serverId } = route.params;

    const socketURL = `${process.env.EXPO_PUBLIC_API_URL}/chat/${serverId}/${channelId}/50`;

    const [websocket, setWebSocket] = useState<WebSocket | null>(null);

    const handleSocketOnOpen = () => {

    }

    const handleSocketOnMessage = (event: MessageEvent<any>) => {
        console.log("Message:", event.data)
    }

    useEffect(() => {
        const socket = new WebSocket(socketURL);
        setWebSocket(socket);

        socket.onopen = () => console.log("Connected to chat!");
        socket.onmessage = (event) => handleSocketOnMessage(event);
        socket.onclose = () => console.log("Disconnected.");

        return () => {
            socket.close();
        }
    }, [socketURL]);

    return (
        <View>
            <Text>TextChannelScreen</Text>
            <Text>Channel ID: {channelId}</Text>
            <Text>Server ID: {serverId}</Text>
            <Pressable onPress={() => websocket?.close()} >Disconnect</Pressable>
        </View>
    )
}

export default TextChannelScreen