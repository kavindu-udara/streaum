import {
  Appearance,
  ColorSchemeName,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import PrimaryInput from "../inputs/PrimaryInput";
import { Ionicons } from "@expo/vector-icons";
import formStyles from "../styles/formStyles";

const PasswordInput = ({value, setPassword, placeholder = "Create a password"} : {value : string, setPassword : Dispatch<SetStateAction<string>>, placeholder?: string}) => {
  const formStyle = formStyles();
  const styles = createStyles();

  const colorScheme = Appearance.getColorScheme();

  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={formStyle.inputContainer}>
      <PrimaryInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        value={value}
        onChangeText={setPassword}
        style={formStyle.input}
      />
      <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
        <Ionicons
          name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
          size={20}
          color={colorScheme === "dark" ? "#a0a0a0" : "#666"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;

const createStyles = () => {
  return StyleSheet.create({
    eyeIcon: {
      padding: 16,
    },
  });
};
