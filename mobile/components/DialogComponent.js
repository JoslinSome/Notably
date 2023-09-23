import React, { useState } from 'react';
import { Button, Overlay } from 'react-native-elements';
import {Text} from "react-native-paper";
import {TouchableOpacity, View, StyleSheet, TextInput} from "react-native";
import {Ionicons} from "@expo/vector-icons";
const DialogComponent = ({text,setText,parse}) => {
    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
        setVisible(!visible);
    };
    const parseNote = () => {
        toggleOverlay()
        parse(text)
    }
    return (
        <View>
            <TouchableOpacity onPress={toggleOverlay}>
                <Ionicons name="add-outline" size={30} color='rgba(229,191,73,0.8)' />
            </TouchableOpacity>
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                <View style={styles.container}>
                    <Text style={styles.white}>Enter Text to convert</Text>
                    <TextInput style={styles.special} multiline={true}
                               onChangeText={text => setText(text)}/>
                    <Button title="Submit" onPress={parseNote} />
                </View>
            </Overlay>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '70%',
        width: 300,
        borderRadius: 30,
    },
    white: {
        color: '#8f46e3',
        fontSize: 16,
        fontWeight: 'bold',
    }
})
export default DialogComponent;
