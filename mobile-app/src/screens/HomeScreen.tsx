import { Text, View } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "../../types/navigation";
import ServersRow from "../components/rows/ServersRow";

const HomeScreen = () => {
  const navigation = useNavigation<NavigationPropType>();

  useEffect(() => {
    AsyncStorage.getItem("token")
      .then((res) => {
        console.log({ "Token available": res });
      })
      .catch((err) => {
        navigation.navigate("Login");
        console.log({ "Error while getting token": err });
      });
  }, []);

  return (
    <View>
      <ServersRow/>
      <ServersRow/>
    </View>
  );
};

export default HomeScreen;
