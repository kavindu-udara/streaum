import { ActivityIndicator, FlatList, Text, View } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "../../types/navigation";
import ServersRow from "../components/rows/ServersRow";
import api from "../../axios";
import { Server } from "../../types";
import PrimaryPressable from "../components/buttons/PrimaryPressable";

type Status = "Loading" | "Success" | "Error" | "Not-Found";

const HomeScreen = () => {
  const navigation = useNavigation<NavigationPropType>();

  const [status, setstatus] = React.useState<Status>("Loading");
  const [servers, setServers] = React.useState<Server[]>([]);

  const fetchData = async (token: string) => {
    setstatus("Loading");
    api
      .post("/my-servers", {
        token,
      })
      .then((res) => {
        setstatus("Success");
        console.log("server res : ", res.data);
        setServers(res.data.servers);
      })
      .catch((err) => {
        console.log(
          err.response.data ||
          err.message || err ||
          "An error occurred while fetching servers"
        );

        if (err.response && err.response.status === 401) {
          navigation.navigate("Login");
        } else if (err.response && err.response.status === 404) {
          setstatus("Not-Found");
        } else {
          setstatus("Error");
        }
      });
  };

  useEffect(() => {
    AsyncStorage.getItem("token")
      .then((res) => {
        console.log({ "Token available": res });
        if (res) {
          fetchData(res.toString());
        }
        setstatus("Error");
      })
      .catch((err) => {
        setstatus("Error");
        navigation.navigate("Login");
        console.log({ "Error while getting token": err });
      });
  }, []);

  const renderContent = () => {
    if (status === "Loading") {
      return (
        <View className="flex items-center mt-6">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="mt-2 text-gray-600">Loading servers...</Text>
        </View>
      );
    }

    if (status === "Error") {
      return (
        <Text className="text-center text-red-500 mt-6">
          Error while fetching servers.
        </Text>
      );
    }

    if (status === "Not-Found" || !servers?.length) {
      return (
        <Text className="text-center text-gray-500 mt-6">
          No servers found. Join or create a server.
        </Text>
      );
    }
    return (
      <FlatList
        data={servers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ServersRow server={item} />}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="mt-4"
      />
    );
  };

  return (
    <View className="flex-1 bg-white px-5 pt-8">
      
      {/* Buttons */}
      <View className="flex flex-col w-full gap-5">
        <PrimaryPressable
          onPress={() => navigation.navigate("CreateServer")}
          style={{
            backgroundColor: "#4f46e5",
            borderRadius: 10,
            marginRight: 8,
          }}
        >
          <Text className="text-white font-semibold text-base text-center">
            Create Server
          </Text>
        </PrimaryPressable>

        <PrimaryPressable
          onPress={() => navigation.navigate("JoinServer")}
          style={{
            backgroundColor: "#10b981",
            borderRadius: 10,
          }}
        >
          <Text className="text-white font-semibold text-base text-center">
            Join Server
          </Text>
        </PrimaryPressable>
      </View>

      {renderContent()}
    </View>
  );
};


export default HomeScreen;
