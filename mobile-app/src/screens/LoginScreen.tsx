import {
  View,
  Text,
  StyleSheet,
  ColorSchemeName,
  Appearance,
  ActivityIndicator,
} from "react-native";
import React, { isValidElement, useState } from "react";
import H1Text from "../components/text/H1Text";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import Label from "../components/text/Label";
import PrimaryInput from "../components/inputs/PrimaryInput";
import formStyles from "../components/styles/formStyles";
import PrimaryLayout from "../components/layouts/PrimaryLayout";
import PasswordInput from "../components/views/PasswordInput";
import PrimaryPressable from "../components/buttons/PrimaryPressable";
import ErrorMessage from "../components/messages/ErrorMessage";
import { validateEmail, validatePassword } from "../../lib/validators";
import api from "../../axios";

type NavigationPropType = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationPropType>();

  const formStyle = formStyles();

  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = () => {
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
        console.log(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <PrimaryLayout>
      <View className="mb-20" style={formStyle.formContainer}>
        <View style={formStyle.header}>
          <H1Text text="Login" />
          <Text style={formStyle.subtitle}>Enter Login Details</Text>
        </View>

        {error && <ErrorMessage text={error} setText={setError} />}

        {/* input group - email */}
        <View style={formStyle.inputGroup}>
          <Label text="Email" />
          <View style={formStyle.inputContainer}>
            <PrimaryInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              style={formStyle.input}
            />
          </View>
        </View>

        {/* input group - password */}
        <View style={formStyle.inputGroup}>
          <Label text="Password" />
          <PasswordInput value={password} setPassword={setPassword} />
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
            <Text style={formStyle.submitButtonText}>Login</Text>
          )}
        </PrimaryPressable>
        <View style={formStyle.secondaryTextContainer}>
          <Text style={formStyle.secondaryText}>Don't have an account? </Text>
          <Text
            style={formStyle.link}
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
          </Text>
        </View>
      </View>
    </PrimaryLayout>
  );
};

export default LoginScreen;
