import { View, Text, Image } from 'react-native'
import React from 'react'
const ServerImage = require('../../assets/images/server-logo.jpeg');

const ServersRow = () => {
  return (
    <View className='py-5 px-5 w-full bg-white flex flex-row items-center gap-5 border-b border-slate-300 hover:bg-gray-100'>
      <View>
        <Image
            source={ServerImage}
            style={{ width: 50, height: 50}}
            className='rounded-lg'
        />
      </View>
      <Text className='font-bold text-2xl'>Server Name</Text>
    </View>
  )
}

export default ServersRow