import { View, Text } from 'react-native'
import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../../types/navigation'

type VoiceChannelRouteProp = RouteProp<RootStackParamList, 'VoiceChannel'>

const VoiceChannelScreen = () => {
    const route = useRoute<VoiceChannelRouteProp>();
    const { channelId } = route.params;
    return (
        <View>
            <Text>VoiceChannelScreen</Text>
            <Text>Channel ID: {channelId}</Text>
        </View>
    )
}

export default VoiceChannelScreen