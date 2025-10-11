import { Appearance, ColorSchemeName, StyleSheet } from "react-native";

const formStyles = () => {
  const colorScheme = Appearance.getColorScheme();
  const isDark = colorScheme === "dark";

  return StyleSheet.create({
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
    nameRow: {
      flexDirection: "row",
      marginBottom: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: isDark ? "#333" : "#e2e8f0",
      borderRadius: 12,
      backgroundColor: isDark ? "#2a2a2a" : "#fff",
      marginTop: 8,
    },
    inputIcon: {
      marginLeft: 16,
    },
    input: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 10,
      color: isDark ? "#fff" : "#000",
    },
    eyeIcon: {
      padding: 16,
    },
    header: {
      alignItems: "center",
      marginBottom: 24,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? "#a0a0a0" : "#666",
      marginTop: 8,
    },
    submitButton: {
      borderRadius: 12,
      paddingVertical: 16,
      backgroundColor: "#6b46c1",
      marginTop: 10,
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    loadingContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    secondaryTextContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 24,
    },
    secondaryText: {
      color: isDark ? "#a0a0a0" : "#718096",
    },
    link: {
      color: "#6b46c1",
      fontWeight: "bold",
    },
  });
};

export default formStyles;
