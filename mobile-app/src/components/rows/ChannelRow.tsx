import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { ChannelRes } from '../../../types'
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../types/navigation';

const ChannelRow = ({ channel, serverId }: { channel: ChannelRes, serverId: string }) => {

    const navigation = useNavigation<NavigationPropType>();
  const isTextChannel = channel.type === "TEXT";

    const handleOnPress = () => {
        if (channel.type === "TEXT") {
            navigation.navigate("TextChannel", { channelId: channel.id, serverId, channelName: channel.name });
        } else if (channel.type === "VOICE") {
            navigation.navigate("VoiceChannel", { channelId: channel.id, serverId, channelName: channel.name });
        }
    }

    return (
        <Pressable
      onPress={handleOnPress}
      className="mb-3"
      android_ripple={{ color: "#e5e7eb" }} // subtle ripple effect on Android
    >
      <View className="flex-row items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 ">
        {/* Channel Icon */}
        {isTextChannel ? (
          <Fontisto name="hashtag" size={24} color="#4f46e5" />
        ) : (
          <AntDesign name="sound" size={24} color="#4f46e5" />
        )}

        {/* Channel Name */}
        <Text className="text-lg font-semibold text-gray-800">{channel.name}</Text>
      </View>
    </Pressable>
    )
}

export default ChannelRow