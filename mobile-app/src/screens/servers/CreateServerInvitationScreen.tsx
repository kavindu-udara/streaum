import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../../types/navigation'
import PrimaryLayout from '../../components/layouts/PrimaryLayout'
import formStyles from '../../components/styles/formStyles'
import ErrorMessage from '../../components/messages/ErrorMessage'
import { SelectorItem } from '../../../types'
import Label from '../../components/text/Label'
import Selector from '../../components/selectors/Selector'
import api from '../../../axios'

type CreateServerInviteRouteProp = RouteProp<RootStackParamList, 'CreateServerInvitation'>

type ResponseType = {
    invitationId: string
}

const CreateServerInvitationScreen = () => {

    const route = useRoute<CreateServerInviteRouteProp>();
    const { serverId } = route.params;

    const [uploading, setUploading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isResponseSuccess, setIsResponseSuccess] = React.useState<boolean>(false);

    const [responseData, setResponseData] = React.useState<ResponseType | null>(null);

    const [memberTypes, setMemberTypes] = React.useState<SelectorItem[]>([
        { label: "Member", value: "MEMBER" },
        { label: "ADMIN", value: "ADMIN" }
    ]);
    const [memberType, setMemberType] = React.useState<string>("MEMBER");

    const [expireDurations, setExpireDurations] = React.useState<SelectorItem[]>([
        { label: "One Hour", value: "ONEHOUR" },
        { label: "One Day", value: "ONEDAY" },
        { label: "One Week", value: "ONEWEEK" },
    ]);
    const [expireDuration, setExpireDuration] = React.useState<string>("ONEHOUR");

    const formStyle = formStyles();

    const handleSubmit = () => {
        setUploading(true);

        api.post("/server-invitation", {
            serverId,
            type: memberType,
            expireTimePeriod: expireDuration
        }).then((res) => {
            console.log(res.data);
            setUploading(false);
            if (res.data.success) {
                setIsResponseSuccess(true);
                setResponseData(res.data);
                return;
            }
        }).catch((err) => {
            setUploading(false);
            setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
            console.log(err.response?.data || err.message || err || "An error occurred while creating the server");
        })
    }

    const handleCopy = () => {
        if (!responseData) return;

        (async () => {
            try {
                await navigator.clipboard.writeText(responseData.invitationId);
                console.log('Copied!');
            } catch (err) {
                console.error('Failed to copy text:', err);
            }
        })();
    };

    return (
        <PrimaryLayout>
            <View className="mb-20" style={formStyle.formContainer}>

                <View style={formStyle.header}>
                    <Text style={formStyle.subtitle}>Create Server Invite</Text>
                </View>

                {error && <ErrorMessage text={error} setText={setError} />}

                {isResponseSuccess && responseData &&
                    <View className="p-4 bg-green-100 border border-green-400 rounded-lg">
                        <Text className="text-green-800">{responseData.invitationId}
                        </Text>
                    </View>
                }

                {!isResponseSuccess && (
                    <View style={formStyle.inputGroup}>
                        <Label text="Member Type" />
                        <Selector items={memberTypes} setItems={setMemberTypes} value={memberType} setValue={setMemberType} placeholder='Select Member Type' />
                    </View>
                )}

                {!isResponseSuccess && (
                    <View style={formStyle.inputGroup}>
                        <Label text="Expire Duration" />
                        <Selector items={expireDurations} setItems={setExpireDurations} value={expireDuration} setValue={setExpireDuration} placeholder='Select Member Type' />
                    </View>)}


                {isResponseSuccess && responseData ? (
                    <TouchableOpacity
                        onPress={handleCopy}
                        className={`mt-6 py-3 rounded-xl bg-indigo-600`}
                    >
                        <Text className="text-white text-center font-semibold">
                            Copy
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={uploading}
                        className={`mt-6 py-3 rounded-xl ${uploading ? 'bg-gray-400' : 'bg-indigo-600'}`}
                    >
                        <Text className="text-white text-center font-semibold">
                            {uploading ? 'Loading...' : 'Invite Friend'}
                        </Text>
                    </TouchableOpacity>
                )}



            </View>
        </PrimaryLayout>
    )
}

export default CreateServerInvitationScreen