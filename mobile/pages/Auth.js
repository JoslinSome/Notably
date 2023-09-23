import { StatusBar } from "expo-status-bar";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as React from "react";
import logo from "../assets/logo.png";
import LongBtn from "../components/LongBtn";
// Endpoint

export default function Auth({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Image source={logo} style={styles.logo} />
      <View style={styles.btns}>
        <LongBtn text={"Sign In"} navigation={navigation} to={"SignIn"} />
        <LongBtn
          text={"Create an account"}
          navigation={navigation}
          to={"SignUp"}
        />
      </View>
    </View>
  );
}
// <Button
//     disabled={!request}
//     title="Login"
//     onPress={() => {
//         promptAsync().then(r => console.log(r));
//     }}
// />
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(114,13,227)",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {},
  title: {
    fontSize: 30,
    color: "#c6bce0",
    fontWeight: "bold",
    marginBottom: -30,
  },
  btns: {
    marginTop: -20,
  },
});
