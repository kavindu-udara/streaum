import { Appearance, ColorSchemeName, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const H1Text = ({ text }: { text: string }) => {

    const colorScheme: ColorSchemeName = Appearance.getColorScheme();
    const styles = createStyles(colorScheme);

    return (
        <Text style={styles.text}>{text}</Text>
    )
}

export default H1Text
const createStyles = (colorScheme : ColorSchemeName) => {
    return StyleSheet.create({
    text: {
        fontSize: 30,
        color: colorScheme == "dark" ? "#fff" : "#000",
    }
})
}

const styles = StyleSheet.create({
    text: {
        fontSize: 30
    }
})