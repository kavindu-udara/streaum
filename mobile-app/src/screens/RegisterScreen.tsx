import {
  View,
  Text,
  ActivityIndicator,
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
