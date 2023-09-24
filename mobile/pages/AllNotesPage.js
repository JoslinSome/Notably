import React, {useState, useEffect, useRef} from "react";
import {FlatList, Image, TextInput, Text, TouchableOpacity, View, StyleSheet} from "react-native";

import {
  Card,
  Title,
  Provider as PaperProvider,
  DefaultTheme, FAB,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { api } from "../config/Api";
import SpecialInputComponent from "../components/SpecialInputComponent";

import noteImage from "../assets/note.png";
import {width, height} from "../config/DeviceDemensions";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "purple",
    accent: "black",
  },
};

function AllNotesPage({route}) {
  const { user, notebook } = route.params;
  const [notes, setNotes] = useState([]);
    const [notesToDisplay, setNotesToDisplay] = useState([])
  const navigation = useNavigation();
    const once = useRef(true);
    const [text, setText] = useState()
    useEffect(() => {
    // Get all the notes from the server
    axios
      .get("http://" + api + `/notes/get-by-notebook/${notebook._id}`,{}, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setNotes(response.data);
          if(once.current){
              console.log("ONCE")
              let string =""
              for(let i=0; i<response.data.length; i++){
                  string+=response.data[i].content
              }
              console.log("HERE",string,notes.length)
              axios
                  .get("http://" + api + `/notes/get-flash-cards`,{params: {text: string}}, {
                      headers: {
                          "Content-Type": "multipart/form-data",
                      },
                  }).then(r=>console.log(r.data)).catch(e=>console.log("Error getting flashcards"))
              once.current= false
          }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, []);

  async function createNewNote() {
    const response = await axios
        .post("http://" + api + `/notes/create`,{notebookId: notebook._id} )
        .then((r) => {
            navigation.navigate("NotesPage", {note: r.data});
        }).catch(e=>console.log("Error creating note"))
  }
  const renderItem = ({ item }) => (

      <TouchableOpacity
          style={styles.notes_card}
          onPress={() => navigation.navigate("NotesPage", { note: item })}
      >
          <Image style={{width: 150, height: 140, opacity: 0.8, margin: 15, borderRadius:10}} source={ noteImage}/>
          <View style={styles.notes_card_content}>
              <Text style={styles.notes_card_title}>{item.title}</Text>
          </View>
      </TouchableOpacity>

                                                                 );
  function filter(text){
      setText(text)
      setNotesToDisplay(notes.filter(element => element.content.includes(text)));
      console.log(notesToDisplay)
  }
  return (
    <PaperProvider>
        <TextInput
            placeholder={"Enter search text"}
            onChangeText={
                 (text) => filter(text)
            }
        />
      <FlatList
        data={notesToDisplay.length>0? notesToDisplay: notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
      />
      <FAB
          style={{
            position: "absolute",
            margin: 16,
            right: 0,
            bottom: 0,
          }}
          small
          icon="plus"
          onPress={() => createNewNote()}
      />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
    notes_title: {
        fontSize: 60,
        fontWeight: "bold",
        color: "#ffffff",
        marginLeft: 100,
    },
    notes_description: {
        fontSize: 15,
        textAlign: "center",
        color: "#ffffff",
    },
    notes_card: {
        margin: 20,
        borderRadius: 10,
        // Make the card look elevated and have a shadow
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        width: 170,
        height: 170,
        // Make background color white
        backgroundColor: "#ffffff",

    },
    notes_card_title: {
        color: "black",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    notes_card_description: {
        color: "#ffffff",
        fontSize: 15,
    },
    notes_card_date: {
        color: "#ffffff",
        fontSize: 10,
    },
    notes_card_icon: {
        color: "#ffffff",
    },
    notes_card_content: {
        justifyContent: "center",
        margin: 5,
    },
});


export default AllNotesPage;
