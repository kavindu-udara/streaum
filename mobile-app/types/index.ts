export type Server = { id: string; name: string; image?: string };

export type SelectorItem = { label: string; value: string };

export type Channel = {
  id: number;
  name: string;
  type: "TEXT" | "VOICE";
  serverId: string;
};

export type ChannelRes = {
  id: number;
  name: string;
  type: "TEXT" | "VOICE";
  server: Server;
};

export type MemberType = "CREATOR" | "ADMIN" | "MEMBER" | "REMOVED";
