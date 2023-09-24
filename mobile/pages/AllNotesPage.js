import React, {useState, useEffect, useRef} from "react";
import { FlatList, TouchableOpacity } from "react-native";
import {
  Card,
  Title,
  Provider as PaperProvider,
  DefaultTheme, FAB,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { api } from "../config/Api";

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
  const navigation = useNavigation();
    const once = useRef(true);
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
        console.log("Erroer: ", error);
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
      onPress={() => navigation.navigate("NotesPage", { note: item })}
    >
      <Card style={{ margin: 10 }}>
        <Card.Content>
          <Title>{item.title}</Title>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <FlatList
        data={notes}
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

export default AllNotesPage;
