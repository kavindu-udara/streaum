import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";

type TextContentType =
  | "none"
  | "URL"
  | "addressCity"
  | "addressCityAndState"
  | "addressState"
  | "countryName"
  | "creditCardNumber"
  | "creditCardExpiration"
  | "creditCardExpirationMonth"
  | "creditCardExpirationYear"
  | "creditCardSecurityCode"
  | "creditCardType"
  | "creditCardName"
  | "creditCardGivenName"
  | "creditCardMiddleName"
  | "creditCardFamilyName"
  | "emailAddress"
  | "familyName"
  | "fullStreetAddress"
  | "givenName"
  | "jobTitle"
  | "location"
  | "middleName"
  | "name"
  | "namePrefix"
  | "nameSuffix"
  | "nickname"
  | "organizationName"
  | "postalCode"
  | "streetAddressLine1"
  | "streetAddressLine2"
  | "sublocality"
  | "telephoneNumber"
  | "username"
  | "password"
  | "newPassword"
  | "oneTimeCode"
  | "birthdate"
  | "birthdateDay"
  | "birthdateMonth"
  | "birthdateYear"
  | "cellularEID"
  | "cellularIMEI"
  | "dateTime"
  | "flightNumber"
  | "shipmentTrackingNumber"
  | undefined;

const PrimaryInput = ({
  value,
  onChangeText,
  placeholder,
  textContentType = "none",
  secureTextEntry = false,
  style,
  keyboardType,
  autoCapitalize,
  className
}: {
  value?: string;
  onChangeText?: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  textContentType?: TextContentType;
  secureTextEntry?: boolean;
  style?: StyleProp<TextStyle>;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  className? : string
}) => {
  return (
    <TextInput
      textContentType={textContentType}
      secureTextEntry={secureTextEntry}
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType ? keyboardType : "default"}
      autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
      className={className}
    />
  );
};

export default PrimaryInput;

const styles = StyleSheet.create({
  input: {
    width: "70%",
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
});
