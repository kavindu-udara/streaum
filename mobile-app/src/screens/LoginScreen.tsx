import {
  View,
  Text,
  StyleSheet,
  ColorSchemeName,
  Appearance,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import H1Text from "../components/text/H1Text";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import Label from "../components/text/Label";
import PrimaryInput from "../components/inputs/PrimaryInput";
import formStyles from "../components/styles/formStyles";
import PrimaryLayout from "../components/layouts/PrimaryLayout";
import PasswordInput from "../components/views/passwordInput";
import PrimaryPressable from "../components/buttons/PrimaryPressable";
import ErrorMessage from "../components/messages/ErrorMessage";

type NavigationPropType = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationPropType>();
  const colorScheme = Appearance.getColorScheme();
  const styles = createStyles(colorScheme);

  const formStyle = formStyles();

  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsLoading(true);
  };

  return (
    <PrimaryLayout>
      <View className="mb-20" style={formStyle.formContainer}>
        <View style={formStyle.header}>
          <H1Text text="Login" />
          <Text style={formStyle.subtitle}>Enter Login Details</Text>
        </View>

        {error && <ErrorMessage text={error} />}

        {/* input group - email */}
        <View style={formStyle.inputGroup}>
          <Label text="Email" />
          <View style={formStyle.inputContainer}>
            <PrimaryInput
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
  });
};
