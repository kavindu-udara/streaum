import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../types/navigation';
import PrimaryLayout from '../../components/layouts/PrimaryLayout';
import formStyles from '../../components/styles/formStyles';
import ErrorMessage from '../../components/messages/ErrorMessage';
import Label from '../../components/text/Label';
import PrimaryInput from '../../components/inputs/PrimaryInput';

const JoinServerScreen = () => {
    const navigation = useNavigation<NavigationPropType>();

    const [error, setError] = useState<string | null>(null);
    const [id, setId] = useState<string>('');

    const formStyle = formStyles();

    return (
        <PrimaryLayout>
            <View style={formStyle.header}>
                <Text style={formStyle.subtitle}>Enter Server Details</Text>
            </View>

            {error && <ErrorMessage text={error} setText={setError} />}

            <View className='mt-4'>
                <Label text="Name" />
                <PrimaryInput
                    style={[formStyle.input, { borderColor: "black", borderWidth: 1, width: "auto" }]}
                    value={id}
                    onChangeText={setId}
                    placeholder="Enter server id"
                />
            </View>

        </PrimaryLayout>
    )
}

export default JoinServerScreen