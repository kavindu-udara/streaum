import { Appearance, ColorSchemeName, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native';

const PrimaryPressable = ({children, onPress, disabled = false, style, className} : {children : ReactNode, onPress? : () => void , disabled? : boolean, style?: StyleProp<ViewStyle>, className? :string}) => {

    const colorScheme : ColorSchemeName = Appearance.getColorScheme();
    const styles = createStyles(colorScheme);

  return (
    <Pressable style={[styles.pressable , style]} onPress={onPress} disabled={disabled} className={className}>
        {children}
    </Pressable>
  )
}

export default PrimaryPressable

const createStyles = (colorScheme : ColorSchemeName) => {
    return StyleSheet.create({
    pressable : {
        backgroundColor : colorScheme == "dark" ? "#fff" : "#000",
        width: "100%",
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 10,
    }
})
}
