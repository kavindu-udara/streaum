import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { RootStackParamList } from "../types/navigation";
import { NavigationContainer } from "@react-navigation/native";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import CreateServerScreen from "./screens/servers/CreateServerScreen";

const Layout = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: true,
            headerLeft: () => null,
            headerTitle : "Servers"
          }}
        />

        {/* servers */}
        <Stack.Screen
          name="CreateServer"
          component={CreateServerScreen}
          options={{
            headerShown: true,
            headerTitle : "Create Server"
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Layout;
