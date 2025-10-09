import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  CreateServer : undefined;
  SingleServer : { serverId: string };
  CreateChannel : { serverId: string };
};

export type NavigationPropType = NativeStackNavigationProp<RootStackParamList>;