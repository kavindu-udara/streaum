import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { ChannelRes } from '../../../types'
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../types/navigation';

const ChannelRow = ({ channel, serverId }: { channel: ChannelRes, serverId: string }) => {

    const navigation = useNavigation<NavigationPropType>();

    const handleOnPress = () => {
        if (channel.type === "TEXT") {
            navigation.navigate("TextChannel", { channelId: channel.id, serverId, channelName: channel.name });
        } else if (channel.type === "VOICE") {
            navigation.navigate("VoiceChannel", { channelId: channel.id, serverId, channelName: channel.name });
        }
    }

    return (
        <Pressable onPress={handleOnPress}>
            <View className='mb-3 p-5 flex flex-row gap-5 items-center border border-slate-300 '>
                {/* icon */}
                {
                    channel.type === "TEXT" ? (
                        <Fontisto name="hashtag" size={24} color="black" />
                    ) : (
                        <AntDesign name="sound" size={24} color="black" />
                    )
                }
                <Text className='font-semibold text-lg'>{channel.name}</Text>
            </View>
        </Pressable>
    )
}

export default ChannelRow