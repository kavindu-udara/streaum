import { View, Text } from 'react-native'
import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../../types/navigation'

type TextChannelRouteProp = RouteProp<RootStackParamList, 'TextChannel'>

const TextChannelScreen = () => {

    const route = useRoute<TextChannelRouteProp>();
    const { channelId } = route.params;

  return (
    <View>
      <Text>TextChannelScreen</Text>
        <Text>Channel ID: {channelId}</Text>
    </View>
  )
}

export default TextChannelScreen