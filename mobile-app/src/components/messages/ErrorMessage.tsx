import { Text, View } from "react-native";
import React from "react";

const ErrorMessage = ({ text }: { text: string }) => {
  return (
    <View className="border border-red-500 rounded-xl p-5 my-5 bg-red-200 ">
      <Text className="font-bold text-red-900">{text}</Text>
    </View>
  );
};

export default ErrorMessage;
