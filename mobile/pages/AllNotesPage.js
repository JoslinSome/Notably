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
    <View style={styles.note_container}>
      <TouchableOpacity
        style={styles.note_card}
        onPress={() => navigation.navigate("NotesPage", { note: item })}
      >
        <Image style={styles.note_image} source={noteImage} />
      </TouchableOpacity>
      <Text style={styles.note_card_title}>{item.title}</Text>
    </View>
  );
  function filter(text){
      setText(text)
      setNotesToDisplay(notes.filter(element => element.content.includes(text)));
      console.log(notesToDisplay)
  }
  return (
    <PaperProvider>
        <TextInput
  placeholder="Enter search text"
  onChangeText={(text) => filter(text)}
  style={styles.input}
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
  note_container: {
    alignItems: 'center',
    margin: 10,
  },
  note_card: {
    width: width / 7.5,
    height: width / 7.6,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
  },
  note_image: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
    marginLeft: '10%',
    marginTop: '7.5%',
  },
  note_card_title: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderColor: 'gray',
  },
});


export default AllNotesPage;
