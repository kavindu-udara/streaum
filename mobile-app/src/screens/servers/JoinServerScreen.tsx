import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NavigationPropType, RootStackParamList } from '../../../types/navigation';
import PrimaryLayout from '../../components/layouts/PrimaryLayout';
import formStyles from '../../components/styles/formStyles';
import ErrorMessage from '../../components/messages/ErrorMessage';
import Label from '../../components/text/Label';
import PrimaryInput from '../../components/inputs/PrimaryInput';
import api from '../../../axios';

const JoinServerScreen = () => {
    const navigation = useNavigation<NavigationPropType>();

    const [error, setError] = useState<string | null>(null);
    const [id, setId] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);

    const formStyle = formStyles();

    const handleSubmit = () => {
        setUploading(true);
        api.get("/server-invitation", {
            params: {
                id
            }
        }).then((res) => {
            setUploading(false);
            console.log(res.data);
            if(res.data.success){
                navigation.navigate("SingleServer", {serverId : res.data.serverId});
            }
        }).catch(err => {
            setUploading(false);
            console.log(err);
            setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
            console.log(err.response?.data || err.message || err || "An error occurred while creating the server");
        })
    }

    return (
        <PrimaryLayout>

            <View style={formStyle.header}>
                <Text style={formStyle.subtitle}>Enter Server Details</Text>
            </View>

            {error && <ErrorMessage text={error} setText={setError} />}

            <View className='mt-4'>
                <Label text="Invitation Id" />
                <PrimaryInput
                    style={[formStyle.input, { borderColor: "black", borderWidth: 1, width: "auto" }]}
                    value={id}
                    onChangeText={setId}
                    placeholder="Enter invite id"
                />
            </View>

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={uploading}
                className={`mt-6 py-3 rounded-xl ${uploading ? 'bg-gray-400' : 'bg-blue-600'}`}
            >
                <Text className="text-white text-center font-semibold">
                    {uploading ? 'Loading...' : 'Join'}
                </Text>
            </TouchableOpacity>

        </PrimaryLayout>
    )
}

export default JoinServerScreen