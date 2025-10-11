import { View, Text, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import H1Text from "../components/text/H1Text";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "../../types/navigation";
import Label from "../components/text/Label";
import PrimaryInput from "../components/inputs/PrimaryInput";
import formStyles from "../components/styles/formStyles";
import PrimaryLayout from "../components/layouts/PrimaryLayout";
import PasswordInput from "../components/views/PasswordInput";
import PrimaryPressable from "../components/buttons/PrimaryPressable";
import ErrorMessage from "../components/messages/ErrorMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateEmail, validatePassword } from "../../lib/validators";
import api from "../../axios";

const LoginScreen = () => {
  const navigation = useNavigation<NavigationPropType>();

  const formStyle = formStyles();

  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    // validating

    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password shoul be at least 8 characters, one uppercase, one lowercase, one number, one special character"
      );
      return;
    }

    setIsLoading(true);
    api
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        setIsLoading(false);
        if (res.data.success) {
          // store the token in async storage and navigate to home screen
          AsyncStorage.setItem("token", res.data.token).then(() => {
            navigation.navigate("Home");
          });
          return;
        }
        setError(res.data.message);
      })
      .catch((err) => {
        console.log(err.response.data);
        setIsLoading(false);
        setError(err.response.data.message || "An error occurred during login");
      });
  };

  return (
    <PrimaryLayout>
      <View className="flex-1 justify-center px-6 py-10">
        {/* Header */}
        <View className="mb-8 items-center">
          <H1Text text="Welcome Back 👋" />
          <Text className="text-gray-500 text-base mt-1">
            Log in to continue chatting
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="mb-3">
            <ErrorMessage text={error} setText={setError} />
          </View>
        )}

        {/* Email Input */}
        <View className="mb-6">
          <Label text="Email" />
          <PrimaryInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              formStyle.input,
              {
                borderColor: "#d1d5db",
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: "#fff",
                paddingHorizontal: 14,
                width : "100%"
              },
            ]}
          />
        </View>

        {/* Password Input */}
        <View className="mb-10">
          <Label text="Password" />
          <PasswordInput value={password} setPassword={setPassword} />
        </View>

        {/* Login Button */}
        <PrimaryPressable
          onPress={handleSubmit}
          disabled={isLoading}
          className={`py-4 rounded-xl shadow-md ${isLoading ? "bg-gray-400" : "bg-indigo-600"
            }`}
        >
          {isLoading ? (
            <View className="flex flex-row justify-center items-center">
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Login
            </Text>
          )}
        </PrimaryPressable>

        {/* Divider */}
        <View className="flex-row items-center justify-center mt-5 mb-3">
          <View className="h-[1px] bg-gray-300 w-1/4" />
          <Text className="mx-3 text-gray-500">or</Text>
          <View className="h-[1px] bg-gray-300 w-1/4" />
        </View>

        {/* Sign Up Redirect */}
        <View className="flex-row justify-center mt-2">
          <Text className="text-gray-500">Don’t have an account? </Text>
          <Text
            onPress={() => navigation.navigate("Register")}
            className="text-indigo-600 font-semibold"
          >
            Sign Up
          </Text>
        </View>
      </View>
    </PrimaryLayout>
  );
};

export default LoginScreen;
