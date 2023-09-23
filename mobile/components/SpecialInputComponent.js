import React from 'react';
import {View, StyleSheet, TextInput} from "react-native";

function SpecialInputComponent({text}) {
    return (
            <TextInput style={styles.special} multiline={true} defaultValue={text}/>
    );
}

const styles = StyleSheet.create({
    container: {
    },
    special: {
        backgroundColor: '#010a1a',
        color: 'rgba(229,191,73,0.8)',
        height: '10%',
        borderRadius: 10,
        paddingLeft: 8,
        paddingRight: 8,
        marginTop: 10,
    },
})
export default SpecialInputComponent;
