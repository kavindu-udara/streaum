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

export type MemberType = "CREATOR" | "ADMIN" | "MEMBER";

// {"message": "Servers found successfully.", "server": [{"id": "e903fbdc-591a-4235-9c30-95f2634bb187", "name": "yooyoy"}, {"id": "77466c54-4e3f-4806-b2de-c4ad1866a0bb", "name": "test"}, {"id": "aed45eb3-2eb1-4e64-a68a-bf4c687363a1", "name": "test2"}, {"id": "fb3f3d1f-bf5f-44e4-b671-5d98e591eb84", "name": "hellow"}, {"id": "f2b867ef-b3db-406c-a1c2-31993124b196", "name": "fixing"}, {"id": "df634e63-2195-49b8-ab10-8759c2f49095", "image": "9e773da9cd4e41fb966a6b7af0acb7e0.jpg", "name": "lets see"}, {"id": "c86e8420-c66a-4cf9-b627-95b826bbb17e", "name": "without image"}], "success": true}

// {"channels": [
// {"id": 1, "name": "test", "server": [Object], "type": "TEXT"},
// {"id": 2, "name": "test", "server": [Object], "type": "VOICE"}],
// "memberType": "CREATOR", "message": "Server found successfully.", "server": {"id": "df634e63-2195-49b8-ab10-8759c2f49095", "image": "9e773da9cd4e41fb966a6b7af0acb7e0.jpg", "name": "lets see"}, "success": true}
