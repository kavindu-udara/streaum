import { View, Text, Image, TouchableOpacity, Alert, Pressable, Button } from 'react-native';
import React, { useState } from 'react';
import Label from '../../components/text/Label';
import PrimaryInput from '../../components/inputs/PrimaryInput';
import formStyles from '../../components/styles/formStyles';
import * as ImagePicker from "expo-image-picker";
import PrimaryLayout from '../../components/layouts/PrimaryLayout';
import ErrorMessage from '../../components/messages/ErrorMessage';
import api from '../../../axios';
import { AxiosResponse } from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NavigationPropType } from '../../../types/navigation';
const defaultServerImg = require("../../assets/images/default-server-image.jpeg");

const CreateServerScreen = () => {

    const navigation = useNavigation<NavigationPropType>();

    const formStyle = formStyles();
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pickImageExpo = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setIsImageUploaded(false);
            setUploadedImageUrl(null);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Please enter a server name.');
            return;
        }

        if (selectedImage && !isImageUploaded) {
            await uploadImage().then(async (res) => {

                if (res.data.fileName) {
                    const uploadedFileName = res.data.fileName;
                    setUploadedImageUrl(uploadedFileName);
                    await createServer(uploadedFileName);
                } else {
                    setUploading(false);
                    console.log(res.data)
                    setError('Image upload failed. Please try again.');
                }
            }).catch((err) => {
                setUploading(false);
                setError('Image upload failed. Please try again.');
                console.log(err);
            })
        } else {
            await createServer(null);
        }

    }

    const uploadImage = async (): Promise<AxiosResponse<any, any, {}>> => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', {
            uri: selectedImage,
            type: 'image/jpeg',
            name: 'server.jpg',
        } as any);
        try {
            const res = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload success: ', res.data);
            return res;
        } catch (err : any) {
            setUploading(false);
            console.log('Upload error: ', err.response.data || err.message || err);
            throw err;
        }
    }

    const createServer = async (uploadedFileName: string | null) => {
        const payload = uploadedFileName ? { name, imageUrl: uploadedFileName } : { name };

        api.post('/create-server', payload).then((res) => {
            console.log(res.data);
            setUploading(false);
            if (res.data.success) {
                Alert.alert('Success', 'Server created successfully!');
                setName('');
                setSelectedImage(null);
                setIsImageUploaded(false);
                setUploadedImageUrl(null);
                navigation.navigate('Home');
                return;
            }
            setError(res.data.message || 'An error occurred. Please try again.');
        }).catch((err) => {
            setUploading(false);
            setError('An error occurred. Please try again.');
            console.error(err.response.data || err.message || err);
        });
    };

    return (
        <PrimaryLayout>
            <View className="mb-20" style={formStyle.formContainer}>


                <View style={formStyle.header}>
                    <Text style={formStyle.subtitle}>Enter Server Details</Text>
                </View>

                {error && <ErrorMessage text={error} setText={setError} />}

                <View className='items-center justify-center'>
                    <Pressable onPress={pickImageExpo}>
                        <Image
                            source={
                                typeof selectedImage === 'string'
                                    ? { uri: selectedImage }
                                    : defaultServerImg
                            }
                            style={{ width: 100, height: 100 }}
                            className='rounded-full border'
                        />
                    </Pressable>
                    <Text className='text-gray-500 mt-2'>Tap image to change</Text>
                </View>

                <View className='mt-4'>
                    <Label text="Name" />
                    <PrimaryInput
                        style={[formStyle.input, { borderColor: "black", borderWidth: 1, width: "auto" }]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter server name"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={uploading}
                    className={`mt-6 py-3 rounded-xl ${uploading ? 'bg-gray-400' : 'bg-blue-600'}`}
                >
                    <Text className="text-white text-center font-semibold">
                        {uploading ? 'Uploading...' : 'Create Server'}
                    </Text>
                </TouchableOpacity>
            </View>
        </PrimaryLayout>
    );
};

export default CreateServerScreen;
