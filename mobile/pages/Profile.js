import {View, Text, StyleSheet, TouchableOpacity} from "react-native"
import ImageIcon from "../components/ImageIcon";
import * as React from "react";
import {height} from "../config/DeviceDemensions";
import {useCookies} from "react-cookie";
import axios from "axios";
import {api} from "../config/Api";
import {useRef, useState} from "react";

export default function Profile({route,navigation}) {

    return(
        <View style={styles.container}>
            <Text>Hi</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121b22',
        alignItems: 'center',
    },
    logout: {
        backgroundColor: "#3366d3",
        marginTop: 110,
        marginLeft: 80,
        alignItems: "center",
        justifyContent: "center",
        width: 90,
        height: 40,
        borderRadius: 10
    },
    container2: {
        width: 130,
        height: 130,
        borderRadius: 100,
        backgroundColor: "#3668d7",
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        left: 10
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
        marginLeft: 30,
        marginTop: 50
    },
    text4: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
    text3: {
        color: "white",
        fontWeight: "bold",
        fontSize: 38,
    },
    text2: {
        color: "white",
        fontStyle: "italic",
        fontSize: 16,
        marginLeft: 30,
        marginTop: 15
    },
    row: {
        width: '100%',
        flexDirection: "row",
        top: height/2-60,

    }
});
