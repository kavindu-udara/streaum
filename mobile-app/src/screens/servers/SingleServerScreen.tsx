import { View, Text, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NavigationPropType, RootStackParamList } from '../../../types/navigation'
import PrimaryPressable from '../../components/buttons/PrimaryPressable'
import formStyles from '../../components/styles/formStyles'
import api from '../../../axios'
import { ChannelRes, MemberType, Server } from '../../../types'
import ErrorMessage from '../../components/messages/ErrorMessage'
import ChannelRow from '../../components/rows/ChannelRow'

type SingleServerRouteProp = RouteProp<RootStackParamList, 'SingleServer'>

type APIResponse = {
    success: boolean;
    server: Server,
    textChannels?: ChannelRes[],
    voiceChannels?: ChannelRes[],
    memberType: MemberType,
    message: string;
}

const SingleServerScreen = () => {
    const route = useRoute<SingleServerRouteProp>();
    const { serverId } = route.params;

    const navigation = useNavigation<NavigationPropType>();

    const formStyle = formStyles();

    const [responseData, setResponseData] = useState<APIResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        api.get(`/my-servers/${serverId}`).then((res) => {
            setIsLoading(false);
            console.log(res.data);
            setResponseData(res.data);
        }).catch((err) => {
            setIsLoading(false);
            console.log(err.response.data || err.message || err || "An error occurred while fetching the server");
        });
    }, [serverId]);

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="px-5 py-6 space-y-6">

                {/* Header Section */}
                <View className="flex flex-row items-center justify-between">
                    <PrimaryPressable
                        onPress={() =>
                            navigation.navigate("CreateChannel", { serverId })
                        }
                        style={{
                            backgroundColor: "#4f46e5",
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            borderRadius: 10,
                        }}
                    >
                        <Text className="text-white font-semibold text-base">
                            + New Channel
                        </Text>
                    </PrimaryPressable>
                </View>

                <View className="flex flex-row items-center justify-between mt-5">
                    <PrimaryPressable
                        onPress={() =>
                            navigation.navigate("CreateServerInvitation", { serverId })
                        }
                        style={{
                            backgroundColor: "#4f46e5",
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            borderRadius: 10,
                        }}
                    >
                        <Text className="text-white font-semibold text-base">
                            Create Server Invitation
                        </Text>
                    </PrimaryPressable>
                </View>

                {/* Error Message */}
                {error && <ErrorMessage text={error} setText={setError} />}

                {/* Text Channels */}
                <View className="bg-white rounded-2xl p-5 border border-gray-200 mt-5">
                    <Text className="text-xl font-bold text-gray-900 mb-3">
                        💬 Text Channels
                    </Text>

                    {responseData?.textChannels &&
                        responseData.textChannels.length > 0 ? (
                        <FlatList
                            data={responseData.textChannels}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <ChannelRow serverId={serverId} channel={item} />
                            )}
                        />
                    ) : (
                        <Text className="text-gray-500 text-base">
                            No text channels available.
                        </Text>
                    )}
                </View>

                {/* Voice Channels */}
                <View className="bg-white rounded-2xl p-5 border border-gray-200 mt-5">
                    <Text className="text-xl font-bold text-gray-900 mb-3">
                        🔊 Voice Channels
                    </Text>

                    {responseData?.voiceChannels &&
                        responseData.voiceChannels.length > 0 ? (
                        <FlatList
                            data={responseData.voiceChannels}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <ChannelRow serverId={serverId} channel={item} />
                            )}
                        />
                    ) : (
                        <Text className="text-gray-500 text-base">
                            No voice channels available.
                        </Text>
                    )}
                </View>

                {/* Loading State */}
                {isLoading && (
                    <View className="flex items-center py-4">
                        <Text className="text-gray-500 text-base">Loading...</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

export default SingleServerScreen