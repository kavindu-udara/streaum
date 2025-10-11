import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { RootStackParamList } from "../types/navigation";
import { NavigationContainer } from "@react-navigation/native";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import CreateServerScreen from "./screens/servers/CreateServerScreen";
import SingleServerScreen from "./screens/servers/SingleServerScreen";
import CreateChannelScreen from "./screens/channels/CreateChannelScreen";
import TextChannelScreen from "./screens/channels/TextChannelScreen";
import VoiceChannelScreen from "./screens/channels/VoiceChannelScreen";

const Layout = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
        <Stack.Screen
          name="SingleServer"
          component={SingleServerScreen}
          options={{
            headerShown: true,
            headerTitle : "Server Dashboard"
          }}
        />
        <Stack.Screen
          name="CreateChannel"
          component={CreateChannelScreen}
          options={{
            headerShown: true,
            headerTitle : "Create Channel"
          }}
        />
        {/* channels */}
        <Stack.Screen
          name="TextChannel"
          component={TextChannelScreen}
          options={{
            headerShown: true,
            headerTitle : "Channel Name"
          }}
        />
        {/* channels */}
        <Stack.Screen
          name="VoiceChannel"
          component={VoiceChannelScreen}
          options={{
            headerShown: true,
            headerTitle : "Channel Name"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Layout;
