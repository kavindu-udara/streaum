import { View, Text, FlatList } from 'react-native'
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
        <View>

            {error && <ErrorMessage text={error} setText={setError} />}

            <PrimaryPressable onPress={() => { navigation.navigate("CreateChannel", { serverId }) }} style={formStyle.submitButton}>
                <Text>Create New Channel</Text>
            </PrimaryPressable>
            <Text>Server ID: {serverId}</Text>

            <View>
                <Text className='text-2xl font-bold'>Text Channels</Text>
                {responseData?.textChannels && responseData.textChannels.length > 0 ? (
                    <FlatList data={responseData.textChannels}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <ChannelRow serverId={serverId} channel={item} />
                        )}
                    />
                ) : (
                    <Text className='text-lg'>No text channels available.</Text>
                )}
            </View>

            <View>
                <Text className='text-2xl font-bold'>Voice Channels</Text>
                {responseData?.voiceChannels && responseData.voiceChannels.length > 0 ? (
                    <FlatList data={responseData.voiceChannels}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <ChannelRow serverId={serverId} channel={item} />
                        )}
                    />
                ) : (
                    <Text className='text-lg'>No voice channels available.</Text>
                )}
            </View>

            {isLoading && <Text>Loading...</Text>}

        </View>
    )
}

export default SingleServerScreen