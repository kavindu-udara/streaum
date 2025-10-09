import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import PrimaryLayout from '../../components/layouts/PrimaryLayout'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../../types/navigation'
import formStyles from '../../components/styles/formStyles'
import H1Text from '../../components/text/H1Text'
import Label from '../../components/text/Label'
import PrimaryInput from '../../components/inputs/PrimaryInput'
import PrimaryPressable from '../../components/buttons/PrimaryPressable'
import Selector from '../../components/selectors/Selector'
import { SelectorItem } from '../../../types'
import ErrorMessage from '../../components/messages/ErrorMessage'
import api from '../../../axios'

type CreateChannelRouteProp = RouteProp<RootStackParamList, 'CreateChannel'>

const CreateChannelScreen = () => {

    const route = useRoute<CreateChannelRouteProp>();
    const { serverId } = route.params;

    const [name, setName] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [channelTypes, setChannelTypes] = React.useState<SelectorItem[]>([
        { label: "Text", value: "text" },
        { label: "Voice", value: "voice" }
    ]);
    const [channelType, setChannelType] = React.useState<string>("text");
    const [error, setError] = React.useState<string | null>(null);

    const formStyle = formStyles();

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("Please enter a channel name.");
            return;
        }
        setIsLoading(true);
        
        api.post("/channels", {
            name,
            type: channelType,
            serverId
        }).then((res) => {
            console.log(res.data);
            setIsLoading(false);
            if (res.data.success) {
                // navigate back to single server screen
                // navigation.goBack();
                return;
            }
            setError("An error occurred while creating the channel. Please try again.");
        }).catch((err) => {
            setIsLoading(false);
            setError("An error occurred while creating the channel. Please try again.");
            if(err.response){
                setError(err.response.data.message);
            }else{
                setError(err.message || err || "An error occurred while creating the channel. Please try again.");
            }
        });

    }

    return (
        <PrimaryLayout>
            <View className="mb-20" style={formStyle.formContainer}>

                <View style={formStyle.header}>
                    <H1Text text="Create Channel" />
                    <Text style={formStyle.subtitle}>Enter Channel Details</Text>
                </View>

                {error && <ErrorMessage text={error} setText={setError} />}

                {/* input group - name */}
                <View style={formStyle.inputGroup}>
                    <Label text="Name" />
                    <View style={formStyle.inputContainer}>
                        <PrimaryInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter channel name"
                            keyboardType="default"
                            autoCapitalize="none"
                            style={formStyle.input}
                        />
                    </View>
                </View>

                {/* input group - type */}
                <View style={formStyle.inputGroup}>
                    <Label text="Channel Type" />
                    <Selector items={channelTypes} setItems={setChannelTypes} value={channelType} setValue={setChannelType} placeholder='Select Channel Type' />
                </View>

                <PrimaryPressable
                    onPress={handleSubmit}
                    disabled={isLoading}
                    style={formStyle.submitButton}
                >
                    {isLoading ? (
                        <View style={formStyle.loadingContainer}>
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    ) : (
                        <Text style={formStyle.submitButtonText}>Create</Text>
                    )}
                </PrimaryPressable>

            </View>
        </PrimaryLayout>
    )
}

export default CreateChannelScreen