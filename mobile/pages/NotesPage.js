import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Dialog, Portal, PaperProvider } from "react-native-paper";
import React, { useRef, useState, useEffect } from "react";
import DialogComponent from "../components/DialogComponent";
import SpecialInputComponent from "../components/SpecialInputComponent";
import ImagePickerComponent from "../components/ImagePickerComponent";
import axios from "axios";
import {api} from "../config/Api";

function NotesPage({route}) {
  const { note } = route.params;
  const [stringsToRender, setStringsToRender] = useState([]);
  const [title, setTitle] = useState("");
  const [imageSet, setImageSet] = useState(false);
  const [photo, setPhoto] = useState(null);
  const once = useRef(true);

  // Save all notes in string to render to database

  function parseNote(text) {
    console.log("HERE PARSING")
    let strings = text.split("\n");
    let currentString = "";
    let newStrings = [];
    strings.forEach((string) => {
      if (string[0] === "[") {
        if (currentString !== "") {
          newStrings.push(currentString);
        }
        if (
            string[string.length - 1] === "]" ||
            string[string.length - 1] === "*"
        ) {
          newStrings.push(string);
        }
        currentString = "";
      } else {
        currentString += " " + string;
        if (
            string[string.length - 1] === "]" ||
            string[string.length - 1] === "*"
        ) {
          newStrings.push(string);
        }
      }
    });
    if (
        currentString !== "" &&
        currentString !== newStrings[newStrings.length - 1]
    ) {
      newStrings.push(currentString);
    }
    // let stringsToRender = []
    // newStrings.forEach(string => {
    //     if(string[0] === "["){
    //         stringsToRender.push(string)
    //     }
    //     else{
    //         let words = string.split(" ")
    //         let currentLine = ""
    //         words.forEach(word => {
    //             if(currentLine.length + word.length < 30){
    //                 currentLine += word + " "
    //             }
    //             else{
    //                 stringsToRender.push(currentLine)
    //                 currentLine = word + " "
    //             }
    //         })
    //         stringsToRender.push(currentLine)
    //     }
    // })
    setStringsToRender(newStrings);
  }
  if(once.current){
    console.log("In Here")
    axios
        .get(`http://${api}/notes/get-by-id`,{params: {id: note._id}})
        .then(r => {
          console.log("Successfully joined")
          setTitle(r.data.title)
          parseNote(
              r.data.content
          )
          once.current=false
        }).catch(e=>console.log("error",e))
  }





  async function save(){
    if (stringsToRender.length > 0) {
      await axios.put("http://" + api + `/notes/update`, {
        params: {
          content: stringsToRender,
          id: note._id,
          title
        }
      }).then(r => {
        console.log("Successfully joined")
      }).catch(e => console.log(e))
    }
  }

  return (
    <View style={styles.container}>
        <ImagePickerComponent save={save} parse={parseNote} setImageSet={setImageSet} setPhoto={setPhoto} />

      <View style={styles.note}>
        {/* <DialogComponent text={text} setText={setText} parse={parseNote} /> */}{/*// <TextInput style={styles.mainNote} multiline={true} numberOfLines={4} fontSize={16}>*/}
        {
          //   console.log(stringsToRender)

            stringsToRender.map((string, index) => {
              if (string[0] === "[") {
                return <SpecialInputComponent key={index} text={string} />;
              } else {
                return (
                  <TextInput
                    key={index}
                    defaultValue={string}
                    multiline={true}
                    numberOfLines={string.length <= 25 ? 2 : string.length / 25}
                    fontSize={16}
                  />
                );
                // return <Text>{string}</Text>
              }
            })
        }
        {/*</TextInput>*/}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  note: {
    marginTop: "7%",
    marginLeft: "2.5%",
    width: "95%",
    height: "100%",
  },
  white: {
    color: "#ffffff",
  },
  mainNote: {
    marginTop: 10,
  },
  title: {
    underline: { textDecorationLine: "underline" },
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  save:{
    marginTop: 100
  }
});

export default NotesPage;
