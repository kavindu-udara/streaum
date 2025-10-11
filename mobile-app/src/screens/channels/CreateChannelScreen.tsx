import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import PrimaryLayout from '../../components/layouts/PrimaryLayout'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NavigationPropType, RootStackParamList } from '../../../types/navigation'
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

    const navigation = useNavigation<NavigationPropType>();

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
                navigation.navigate("SingleServer", { serverId });
                return;
            }
            setError("An error occurred while creating the channel. Please try again.");
        }).catch((err) => {
            setIsLoading(false);
            setError("An error occurred while creating the channel. Please try again.");
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError(err.message || err || "An error occurred while creating the channel. Please try again.");
            }
        });

    }

    return (
        <PrimaryLayout>
            <View className="flex-1 px-6 justify-center">
                {/* Header */}
                <View className="mb-10 items-center">
                    <H1Text text="Create Channel" />
                    <Text className="text-gray-500 text-base text-center mt-1">
                        Fill in the details below to add a new channel.
                    </Text>
                </View>

                {/* Error */}
                {error && (
                    <View className="mb-3">
                        <ErrorMessage text={error} setText={setError} />
                    </View>
                )}

                {/* Channel Name */}
                <View className="mb-6">
                    <Label text="Channel Name" />
                    <View className="mt-2">
                        <PrimaryInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter channel name"
                            keyboardType="default"
                            autoCapitalize="none"
                            style={[
                                formStyle.input,
                                {
                                    borderColor: "#d1d5db",
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    paddingHorizontal: 14,
                                    backgroundColor: "#fff",
                                    width : "100%"
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* Channel Type */}
                <View className="mb-8">
                    <Label text="Channel Type" />
                    <View className="mt-2">
                        <Selector
                            items={channelTypes}
                            setItems={setChannelTypes}
                            value={channelType}
                            setValue={setChannelType}
                            placeholder="Select Channel Type"
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <PrimaryPressable
                    onPress={handleSubmit}
                    disabled={isLoading}
                    className={`py-4 rounded-xl ${isLoading ? "bg-gray-400" : "bg-indigo-600"
                        }`}
                    style={{
                        backgroundColor: "#4f46e5",
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 10,
                    }}
                >
                    {isLoading ? (
                        <View className="flex flex-row justify-center items-center">
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    ) : (
                        <Text className="text-white text-center font-semibold">
                            Create Channel
                        </Text>
                    )}
                </PrimaryPressable>

                {/* Cancel Button */}
                <PrimaryPressable
                    onPress={() => navigation.navigate("SingleServer", { serverId })}
                    className="py-4 rounded-xl bg-gray-500 mt-3"
                    disabled={isLoading}
                    style={{
                        backgroundColor: "#4e4e4e",
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 10,
                    }}
                >
                    <Text className="text-white text-center font-semibold">
                        Cancel
                    </Text>
                </PrimaryPressable>
            </View>
        </PrimaryLayout>
    )
}

export default CreateChannelScreen