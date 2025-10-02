import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Appearance, StyleSheet, Dimensions, Image, ColorSchemeName } from 'react-native';
import React, { useState } from 'react';
import H1Text from '../components/text/H1Text';
import ErrorMessage from '../components/messages/ErrorMessage';
import Label from '../components/text/Label';
import { Ionicons } from '@expo/vector-icons';
import PrimaryInput from '../components/inputs/PrimaryInput';
import PrimaryPressable from '../components/buttons/PrimaryPressable';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
const OtterLogo = require("../assets/Otter.jpeg");

type NavigationPropType = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window')

const RegisterScreen = () => {
    const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [retypePassword, setRetypePassword] = useState<string>("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [retypeSecureTextEntry, setRetypeSecureTextEntry] = useState(true);

    const navigation = useNavigation<NavigationPropType>();
    const colorScheme = Appearance.getColorScheme();
    const styles  = createStyles(colorScheme);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const toggleRetypeSecureEntry = () => {
        setRetypeSecureTextEntry(!retypeSecureTextEntry);
    };

    const handleSubmit = async () => {
        setError(null);
        if (!firstName || !lastName || !email || !password || !retypePassword) {
            setError("All fields are required");
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }
        
        // Password strength validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
        
        if (password !== retypePassword) {
            setError("Passwords don't match");
            return;
        }

        await fetchData();
    }

    const fetchData = async () => {
        setIsLoading(true);

        const data = {
            firstName,
            lastName,
            email,
            password
        };

        try {
            const response = await fetch(`${EXPO_PUBLIC_API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            console.log("Status:", response.status, response.statusText);
            
            if (response.ok) {
                const responseData = await response.json();
                console.log("Success:", responseData);

                if (!responseData.success) {
                    setError(responseData.message);
                } else {
                    setError(null);
                    navigation.navigate("Login");
                }
            } else {
                const errorData = await response.json().catch(() => null);
                setError(errorData?.message || "Registration failed. Please try again.");
            }
        } catch (error: any) {
            console.error("Request failed: " + error.message);
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <Image 
                        source={colorScheme === 'dark' 
                            ? OtterLogo 
                            : OtterLogo} 
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.header}>
                        <H1Text text='Create Account' />
                        <Text style={styles.subtitle}>Sign up to get started</Text>
                    </View>

                    {error && (
                        <ErrorMessage text={error} />
                    )}
                    
                    <View style={styles.nameRow}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Label text='First Name' />
                            <View style={styles.inputContainer}>
                                <PrimaryInput 
                                    placeholder="First Name" 
                                    value={firstName} 
                                    onChangeText={setFirstName}
                                    style={styles.input}
                                />
                            </View>
                        </View>
                        
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Label text='Last Name' />
                            <View style={styles.inputContainer}>
                                <PrimaryInput 
                                    placeholder="Last Name" 
                                    value={lastName} 
                                    onChangeText={setLastName}
                                    style={styles.input}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Label text='Email' />
                        <View style={styles.inputContainer}>
                            <PrimaryInput 
                                placeholder="Email address" 
                                value={email} 
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Label text='Password' />
                        <View style={styles.inputContainer}>
                            <PrimaryInput 
                                secureTextEntry={secureTextEntry}
                                placeholder="Create a password" 
                                value={password} 
                                onChangeText={setPassword}
                                style={styles.input}
                            />
                            <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
                                <Ionicons 
                                    name={secureTextEntry ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color={colorScheme === 'dark' ? '#a0a0a0' : '#666'} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Label text='Confirm Password' />
                        <View style={styles.inputContainer}>
                            <PrimaryInput 
                                secureTextEntry={retypeSecureTextEntry}
                                placeholder="Confirm your password" 
                                value={retypePassword} 
                                onChangeText={setRetypePassword}
                                style={styles.input}
                            />
                            <TouchableOpacity onPress={toggleRetypeSecureEntry} style={styles.eyeIcon}>
                                <Ionicons 
                                    name={retypeSecureTextEntry ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color={colorScheme === 'dark' ? '#a0a0a0' : '#666'} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <PrimaryPressable 
                        onPress={handleSubmit} 
                        disabled={isLoading}
                        style={styles.registerButton}
                    >
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text style={styles.registerButtonText}>Creating account...</Text>
                            </View>
                        ) : (
                            <Text style={styles.registerButtonText}>Create Account</Text>
                        )}
                    </PrimaryPressable>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <Text 
                            style={styles.loginLink}
                            onPress={() => navigation.navigate("Login")}
                        >
                            Sign In
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
  );
};

export default RegisterScreen;


const createStyles = (theme: ColorSchemeName) => {
    const isDark = theme === "dark";
    
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? "#121212" : "#f8f9fa",
        },
        scrollContainer: {
            flexGrow: 1,
            justifyContent: "center",
            padding: 20,
        },
        logoContainer: {
            alignItems: 'center',
            marginBottom: 30,
        },
        logo: {
            width: width * 0.4,
            height: width * 0.4,
        },
        formContainer: {
            backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
            borderRadius: 16,
            padding: 24,
            shadowColor: isDark ? "#000" : "#6b46c1",
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: isDark ? 0.1 : 0.1,
            shadowRadius: 12,
            elevation: 4,
        },
        header: {
            alignItems: 'center',
            marginBottom: 24,
        },
        subtitle: {
            fontSize: 16,
            color: isDark ? "#a0a0a0" : "#666",
            marginTop: 8,
        },
        nameRow: {
            flexDirection: 'row',
            marginBottom: 20,
        },
        inputGroup: {
            marginBottom: 20,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isDark ? "#333" : "#e2e8f0",
            borderRadius: 12,
            backgroundColor: isDark ? "#2a2a2a" : "#f8fafc",
            marginTop: 8,
        },
        inputIcon: {
            marginLeft: 16,
        },
        input: {
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: isDark ? "#fff" : "#000",
        },
        eyeIcon: {
            padding: 16,
        },
        registerButton: {
            borderRadius: 12,
            paddingVertical: 16,
            backgroundColor: "#6b46c1",
            marginTop: 10,
        },
        registerButtonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
        },
        loadingContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        loginContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 24,
        },
        loginText: {
            color: isDark ? "#a0a0a0" : "#718096",
        },
        loginLink: {
            color: "#6b46c1",
            fontWeight: "bold",
        },
    });
}