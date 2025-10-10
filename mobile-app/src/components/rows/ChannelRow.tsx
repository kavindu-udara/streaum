import { View, Text } from 'react-native'
import React from 'react'
import { ChannelRes } from '../../../types'

const ChannelRow = ({channel} : {channel : ChannelRes}) => {
  return (
    <View>
      <Text>{channel.name}</Text>
    </View>
  )
}

export default ChannelRow