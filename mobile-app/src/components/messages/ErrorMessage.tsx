import { Text, View } from "react-native";
import React, { Dispatch, SetStateAction } from "react";

const ErrorMessage = ({
  text,
  setText,
}: {
  text: string | null;
  setText: Dispatch<SetStateAction<string | null>>;
}) => {
  React.useEffect(() => {
    if (text) {
      const timer = setTimeout(() => {
        if (typeof setText === "function") setText(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [text]);

  return (
    <View className="border border-red-500 rounded-xl p-5 my-5 bg-red-200 ">
      <Text className="font-bold text-red-900">{text}</Text>
    </View>
  );
};

export default ErrorMessage;
