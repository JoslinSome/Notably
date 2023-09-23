import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import logo from "../assets/logo.png";
import { width, height } from "../config/DeviceDemensions";
import TextField from "../components/TextField";
import LongBtn from "../components/LongBtn";
import axios from "axios";
import { useState } from "react";

import { api } from "../config/Api";
export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");

  async function signUp() {
    if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      userName.length === 0 ||
      password.length === 0
    ) {
      setError("Please fill out all fields");
      return;
    }
    if (userName.length < 5 || password.length < 6) {
      setError("Username or Password too short");
      return;
    }
    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    const response = await axios
      .post("http://" + api + `/user/register`, {
        firstname: firstName,
        lastname: lastName,
        username: userName,
        password,
      })
      .then((r) => {
        console.log("Response: ", r);
        navigation.navigate("Auth");
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Sign up</Text>
        </View>
        <Text style={styles.err}>{error}</Text>
        <View style={styles.row2}>
          <TextField title={"First name"} half={true} onChange={setFirstName} />
          <TextField title={"Last name"} half={true} onChange={setLastName} />
        </View>
        <TextField title={"User name"} onChange={setUserName} />
        <TextField title={"Password"} password={true} onChange={setPassword} />
        <TextField
          title={"Re-Enter Password"}
          password={true}
          onChange={setRePassword}
        />

        <View style={styles.btn}>
          <LongBtn text="Sign Up" click={signUp} />
        </View>
        <TouchableOpacity
          style={styles.signup}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.signupText}>
            Already have an account? Sign In!
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(114,13,227)",
    alignItems: "center",
  },
  signupText: {
    color: "#ffff",
    fontStyle: "italic",
  },
  signup: {
    alignSelf: "center",
    marginTop: -height * 0.04,
  },
  row: {
    flexDirection: "row",
    marginBottom: height * 0.15,
  },
  row2: {
    flexDirection: "row",
  },
  title: {
    fontSize: 35,
    color: "#c6bce0",
    fontWeight: "bold",
    marginTop: height * 0.2,
    alignSelf: "center",
    marginLeft: -width * 0.02,
  },
  btn: {
    alignSelf: "center",
    marginTop: height * 0.05,
  },
  logo: {
    height: height * 0.35,
    width: width * 0.25,
    marginTop: height * 0.2,
    alignSelf: "center",
  },
  err: {
    color: "rgba(245,237,237,0.81)",
    fontSize: 20,
    marginTop: -30,
    alignSelf: "center",
  },
});
