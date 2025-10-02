import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ErrorMessage = ({text} : {text : string}) => {
  return (
    <View style={styles.view}>
      <Text style={styles.text}>Error : {text}</Text>
    </View>
  )
}

export default ErrorMessage

const styles = StyleSheet.create({
    view: {
        width : "100%",
        backgroundColor : "#cf52527c",
        alignItems : "center",
        padding: 5,
        borderRadius: 10,
    },
    text : {
        color : "red"
    }
})