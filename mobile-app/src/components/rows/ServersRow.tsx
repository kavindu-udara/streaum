import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { Server } from '../../../types';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../types/navigation';
const ServerImage = require('../../assets/images/server-logo.jpeg');

const ServersRow = ({ server }: { server: Server }) => {

  const navigation = useNavigation<NavigationPropType>();

  const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (server.image) {
      console.log(`${EXPO_PUBLIC_API_URL}/files/${server.image}`)
    }
  }, [server]);

  const imageSource = server.image
    ? { uri: `${EXPO_PUBLIC_API_URL}/files/${server.image}` }
    : ServerImage;

    const handlePress = () => {
      console.log("Pressed server: ", server.id);
      navigation.navigate('SingleServer', { serverId: server.id });
      // Navigate to SingleServer screen with serverId
      // navigation.navigate('SingleServer', { serverId: server.id });
    }

  return (
    <View onTouchEnd={handlePress} className='py-5 px-5 w-full bg-white flex flex-row items-center gap-5 border-b border-slate-300 hover:bg-gray-100'>
      <View>
        <Image
          source={imageSource}
          style={{ width: 50, height: 50 }}
          className='rounded-lg'
        />
      </View>
      <Text className='font-bold text-2xl'>{server.name}</Text>
    </View>
  )
}

export default ServersRow