import {
  Appearance,
  ColorSchemeName,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { ReactNode } from "react";

const PrimaryLayout = ({ children }: { children: ReactNode }) => {
  const colorScheme = Appearance.getColorScheme();
  const styles = createStyles(colorScheme);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PrimaryLayout;

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
    header: {
      alignItems: "center",
      marginBottom: 24,
    },
  });
};
