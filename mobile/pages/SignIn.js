import {View, StyleSheet, Text, Image, ScrollView, TouchableOpacity} from "react-native";
import logo from "../assets/logo.png"
import {width,height} from "../config/DeviceDemensions";
import TextField from "../components/TextField";
import LongBtn from "../components/LongBtn";
import {useState} from "react";
import{useCookies} from "react-cookie"
import axios from "axios";
export default function SignIn({navigation}){
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")
    const [cookies,setCookie] = useCookies(["access-token","username"])
    console.log(cookies)
    async function signIn(){
         await axios.post("http://"+api+`/auth/login`, {
            username: userName,
            password
        })
            .then(r=>{
                if(r.data.hasOwnProperty("message")){
                    setErr(r.data.message)
                }
                else{
                    setCookie("access-token",r.data.token)
                    setCookie("username",r.data.username)
                    console.log(r.data,"jkhjkh")
                    //window.localStorage.setItem("userId",r.data.userId)
                    navigation.popToTop();
                    navigation.replace('SpotifyAuth',{user: r.data.user})
                }

            })
            .catch(err=>{console.log("Error",err)})
    }
    return(
        <View style={styles.container}>
            <ScrollView>
                <Image source={logo} style={styles.logo}/>
                <Text style={styles.title}>
                    Sign In
                </Text>
                <Text style={styles.err}>{err}</Text>
                <TextField title={"User Name"} onChange={setUserName}/>
                <TextField title={"Password"} password={true} onChange={setPassword}/>
                <View style={styles.btn}>
                    <LongBtn text="Sign In" click={signIn}/>
                </View>
                <TouchableOpacity style={styles.signup} onPress={()=>navigation.navigate("SignUp")}>
                    <Text style={styles.signupText}>Don't have an account? Sign up!</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(114,13,227)',
        alignItems: 'center',
    },
    err: {
        color: "rgba(245,237,237,0.81)",
        fontSize: 20,
        marginTop: -10,
        alignSelf: "center"
    },
    signupText: {
        color: "#ffff",
        fontStyle: "italic"
    },
    title: {
        fontSize: 30,
        color: "#c6bce0",
        fontWeight: "bold",
        marginTop: height*.05,
        marginBottom: height*.05,
        alignSelf: "center"
    },
    signup: {
        alignSelf: "center",
    },
    btn: {
        alignSelf: "center",
        marginTop: height*.1
    },
    logo: {
        height: height*.45,
        width: width*.35,
        marginTop: height*.30,
        alignSelf: "center"
    },

})
