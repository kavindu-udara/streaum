import { View, Text } from 'react-native'
import React from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NavigationPropType, RootStackParamList } from '../../../types/navigation'
import PrimaryPressable from '../../components/buttons/PrimaryPressable'
import formStyles from '../../components/styles/formStyles'

type SingleServerRouteProp = RouteProp<RootStackParamList, 'SingleServer'>

const SingleServerScreen = () => {
    const route = useRoute<SingleServerRouteProp>();
    const { serverId } = route.params;

    const navigation = useNavigation<NavigationPropType>();

    const formStyle = formStyles();

    return (
        <View>
            <PrimaryPressable onPress={() => { navigation.navigate("CreateChannel", { serverId }) }} style={formStyle.submitButton}>
                <Text>Create New Channel</Text>
            </PrimaryPressable>
            <Text>Server ID: {serverId}</Text>

            <View>
                <Text className='text-2xl font-bold'>Text Channels</Text>
                <Text className='text-lg'>List of channels will be displayed here.</Text>
            </View>

            <View>
                <Text className='text-2xl font-bold'>Voice Channels</Text>
                <Text className='text-lg'>List of channels will be displayed here.</Text>
            </View>

        </View>
    )
}

export default SingleServerScreen