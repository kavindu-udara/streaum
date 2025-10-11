import { View, Text } from 'react-native'
import React from 'react'
import { Message } from '../../../types'

const RenderMessage = ({ item }: { item: Message }) => {
    return (
        <View
            className={`flex-row my-1 px-3 ${item.sender === "me" ? "justify-end" : "justify-start"
                }`}
        >
            <View
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${item.sender === "me"
                    ? "bg-indigo-600 rounded-br-none"
                    : "bg-gray-200 rounded-bl-none"
                    }`}
            >
                <Text className='text-black text-sm'>{item.name}</Text>
                <Text
                    className={`text-base ${item.sender === "me" ? "text-white" : "text-gray-800"
                        }`}
                >
                    {item.text}
                </Text>
            </View>
        </View>
    )
}

export default RenderMessage