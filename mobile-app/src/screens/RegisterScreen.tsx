import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import H1Text from "../components/text/H1Text";
import ErrorMessage from "../components/messages/ErrorMessage";
import Label from "../components/text/Label";
import PrimaryInput from "../components/inputs/PrimaryInput";
import PrimaryPressable from "../components/buttons/PrimaryPressable";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "../../types/navigation";
import PasswordInput from "../components/views/PasswordInput";
import PrimaryLayout from "../components/layouts/PrimaryLayout";
import formStyles from "../components/styles/formStyles";
import { validateEmail, validatePassword } from "../../lib/validators";
import api from "../../axios";

const RegisterScreen = () => {

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
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password strength validation
    if (!validatePassword(password)) {
      setError("Password is too weak. It should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.");
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

    api.post("/register", {
      firstName,
      lastName,
      email,
      password,
    }).then((res) => {
      console.log(res.data);
      setIsLoading(false);
      if (res.data.success) {
        navigation.navigate("Login");
        return;
      }
      setError(res.data.message || "An error occurred. Please try again.");
    }).catch((err) => {
      setIsLoading(false);
      setError("An error occurred. Please try again.");
      console.error(err);
    });

  };

  return (
    <PrimaryLayout>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 24,
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          {/* Header */}
          <View className="mb-8 items-center">
            <H1Text text="Create Account" />
            <Text className="text-gray-500 text-base mt-1">
              Sign up to get started
            </Text>
          </View>

          {/* Error Message */}
          {error && <ErrorMessage text={error} setText={setError} />}

          {/* Name Row */}
          <View className="flex-row mb-4 gap-3 space-x-2">
            <View className="flex-1">
              <Label text="First Name" />
              <PrimaryInput
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                className="bg-white border border-gray-300 rounded-xl px-4 py-3"
                style={{ width: "100%" }}
              />
            </View>

            <View className="flex-1">
              <Label text="Last Name" />
              <PrimaryInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full"
                style={{ width: "100%" }}
              />
            </View>
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Label text="Email" />
            <PrimaryInput
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3"
              style={{ width: "100%" }}
            />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Label text="Password" />
            <PasswordInput value={password} setPassword={setPassword} />
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Label text="Confirm Password" />
            <PasswordInput
              value={retypePassword}
              setPassword={setRetypePassword}
              placeholder="Confirm your password"
            />
          </View>

          {/* Submit Button */}
          <PrimaryPressable
            onPress={handleSubmit}
            disabled={isLoading}
            className={`py-4 rounded-xl ${isLoading ? "bg-gray-400" : "bg-indigo-600"
              }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Create Account
              </Text>
            )}
          </PrimaryPressable>

          {/* Divider */}
          <View className="flex-row items-center justify-center mt-5 mb-3">
            <View className="h-[1px] bg-gray-300 w-1/4" />
            <Text className="mx-3 text-gray-500">or</Text>
            <View className="h-[1px] bg-gray-300 w-1/4" />
          </View>

          {/* Sign In Redirect */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">Already have an account? </Text>
            <Text
              className="text-indigo-600 font-semibold"
              onPress={() => navigation.navigate("Login")}
            >
              Sign In
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PrimaryLayout>
  );
};

export default RegisterScreen;
