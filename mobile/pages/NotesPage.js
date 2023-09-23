import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Dialog, Portal, PaperProvider } from "react-native-paper";
import React, { useRef, useState, useEffect } from "react";
import DialogComponent from "../components/DialogComponent";
import SpecialInputComponent from "../components/SpecialInputComponent";
import ImagePickerComponent from "../components/ImagePickerComponent";

function NotesPage({route}) {
  const { note } = route.params;
  const [text, setText] = useState("");
  const [stringsToRender, setStringsToRender] = useState([]);

  const [imageSet, setImageSet] = useState(false);
  const [photo, setPhoto] = useState(null);

  // useEffect(() => {
  //   if (imageSet && photo) {
  //     // Make a call to your Node.js server with the selected photo
  //     fetch("http://localhost:3001/parse_image_to_note", {
  //       method: "POST",
  //       body: JSON.stringify({ photo }),
  //       headers: { "Content-Type": "application/json" },
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // Handle the server response
  //         console.log(data);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   }
  // }, [imageSet, photo]);

  function parseNote() {
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
  return (
    <View style={styles.container}>
      <View style={styles.note}>
        {/* <DialogComponent text={text} setText={setText} parse={parseNote} /> */}
        <ImagePickerComponent setImageSet={setImageSet} setPhoto={setPhoto} />
        {/*// <TextInput style={styles.mainNote} multiline={true} numberOfLines={4} fontSize={16}>*/}
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
    marginTop: "10%",
    marginLeft: "5%",
    width: "87.5%",
    height: "100%",
  },
  white: {
    color: "#ffffff",
  },
  mainNote: {
    marginTop: 30,
  },
  title: {
    underline: { textDecorationLine: "underline" },
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default NotesPage;
