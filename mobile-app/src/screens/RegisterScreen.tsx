import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import H1Text from "../components/text/H1Text";
import ErrorMessage from "../components/messages/ErrorMessage";
import Label from "../components/text/Label";
import PrimaryInput from "../components/inputs/PrimaryInput";
import PrimaryPressable from "../components/buttons/PrimaryPressable";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import PasswordInput from "../components/views/PasswordInput";
import PrimaryLayout from "../components/layouts/PrimaryLayout";
import formStyles from "../components/styles/formStyles";
// const OtterLogo = require("../assets/Otter.jpeg");

type NavigationPropType = NativeStackNavigationProp<RootStackParamList>;

const RegisterScreen = () => {
  const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");

  const navigation = useNavigation<NavigationPropType>();

  const formStyle = formStyles();

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
  };

  const fetchData = async () => {
    setIsLoading(true);

    const data = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const response = await fetch(`${EXPO_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
        setError(
          errorData?.message || "Registration failed. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Request failed: " + error.message);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PrimaryLayout>
        <View style={formStyle.formContainer}>
          <View style={formStyle.header}>
            <H1Text text="Create Account" />
            <Text style={formStyle.subtitle}>Sign up to get started</Text>
          </View>

          {error && <ErrorMessage text={error} setText={setError} />}

          <View style={formStyle.nameRow}>
            <View style={[formStyle.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Label text="First Name" />
              <View style={formStyle.inputContainer}>
                <PrimaryInput
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={formStyle.input}
                />
              </View>
            </View>

            <View style={[formStyle.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Label text="Last Name" />
              <View style={formStyle.inputContainer}>
                <PrimaryInput
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  style={formStyle.input}
                />
              </View>
            </View>
          </View>

          <View style={formStyle.inputGroup}>
            <Label text="Email" />
            <View style={formStyle.inputContainer}>
              <PrimaryInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={formStyle.input}
              />
            </View>
          </View>

          <View style={formStyle.inputGroup}>
            <Label text="Password" />

            <PasswordInput value={password} setPassword={setPassword} />
          </View>

          <View style={formStyle.inputGroup}>
            <Label text="Confirm Password" />
            <PasswordInput value={retypePassword} setPassword={setRetypePassword} placeholder="Confirm your password" />
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
              <Text style={formStyle.submitButtonText}>Create Account</Text>
            )}
          </PrimaryPressable>

          <View style={formStyle.secondaryTextContainer}>
            <Text style={formStyle.secondaryText}>Already have an account? </Text>
            <Text
              style={formStyle.link}
              onPress={() => navigation.navigate("Login")}
            >
              Sign In
            </Text>
          </View>
        </View>
    </PrimaryLayout>
  );
};

export default RegisterScreen;
