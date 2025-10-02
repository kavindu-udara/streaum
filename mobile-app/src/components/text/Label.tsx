import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Label = ({text} : {text : string}) => {
  return (
      <Text style={styles.text}>{text}</Text>
  )
}

export default Label

const styles = StyleSheet.create({
    text: {
        width : "100%"
    }
})