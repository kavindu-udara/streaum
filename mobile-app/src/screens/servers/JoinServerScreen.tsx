import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
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
        if(!id){
            setError("Id is required");
        }
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
      <View className="flex-1 px-6 justify-center">
        {/* Header */}
        <View className="mb-10 items-center">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Join a Server
          </Text>
          <Text className="text-gray-500 text-base text-center">
            Enter your invitation ID below to join a server.
          </Text>
        </View>

        {/* Error Message */}
        {error && <ErrorMessage text={error} setText={setError} />}

        {/* Input Field */}
        <View className="mt-6 w-full flex flex-col items-center">
          <Label text="Invitation ID" />
          <PrimaryInput
            style={[
              formStyle.input,
              {
                borderColor: "#d1d5db", // soft gray
                borderWidth: 1,
                backgroundColor: "#fff",
                borderRadius: 10,
                paddingHorizontal: 14,
                width: "100%"
              },
            ]}
            value={id}
            onChangeText={setId}
            placeholder="Enter invite ID"
            autoCapitalize="none"
          />
        </View>

        {/* Join Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={uploading}
          className={`mt-8 py-4 rounded-xl ${
            uploading ? "bg-gray-400" : "bg-indigo-600"
          }`}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Join Server
            </Text>
          )}
        </TouchableOpacity>

        {/* Hint Text */}
        <Text className="text-center text-gray-400 text-sm mt-6">
          Need an invite? Ask a friend or create your own server.
        </Text>
      </View>
    </PrimaryLayout>
    )
}

export default JoinServerScreen