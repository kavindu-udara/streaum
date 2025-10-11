import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  CreateServer: undefined;
  JoinServer : undefined;
  CreateServerInvitation : { serverId: string };
  SingleServer: { serverId: string };
  CreateChannel: { serverId: string };
  TextChannel: { channelId: number; serverId: string; channelName: string };
  VoiceChannel: { channelId: number; serverId: string; channelName: string };
};

export type NavigationPropType = NativeStackNavigationProp<RootStackParamList>;
