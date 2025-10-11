import { View, Text, Image, Pressable } from 'react-native'
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
    }

  return (
   <Pressable
      onPress={handlePress}
      className="w-full bg-white flex flex-row items-center p-4 mb-3 rounded-xl border border-slate-200 shadow-sm active:opacity-80"
      android_ripple={{ color: "#e5e7eb" }}
      style={{
        elevation: 2, // subtle shadow for Android
      }}
    >
      {/* Server Icon */}
      <View className="mr-4">
        <Image
          source={imageSource}
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
          }}
        />
      </View>

      {/* Server Info */}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900">
          {server.name}
        </Text>
        <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
          Tap to open server
        </Text>
      </View>

      {/* Right Arrow Indicator */}
      <View className="ml-3">
        <Text className="text-gray-400 text-xl">›</Text>
      </View>
    </Pressable>
  )
}

export default ServersRow