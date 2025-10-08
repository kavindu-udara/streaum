import { FlatList, Text, View } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "../../types/navigation";
import ServersRow from "../components/rows/ServersRow";
import api from "../../axios";
import { Server } from "../../types";

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

  return (
    <View>

      {status === "Loading" ? (
        <Text>Loading</Text>
      ) : status === "Error" ? (
        <Text>Error while fetching servers</Text>
      ) : status === "Not-Found" ? (
        <Text>No servers found. Join or create a server.</Text>
      ) : (
        <Text>Servers</Text>
      )}

      {/* create a flatlist */}
      {servers && servers.length > 0 && (
        <FlatList data={servers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ServersRow server={item} />
          )}
        />
      )}

    </View>
  );
};


export default HomeScreen;
