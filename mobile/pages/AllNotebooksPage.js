import React, { useState, useEffect } from 'react';
import {FlatList, TouchableOpacity, Modal, View, TextInput, Text, Image, StyleSheet} from 'react-native';
import { Card, Title, FAB, Provider as PaperProvider, DefaultTheme, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {api} from "../config/Api";
import notebookImage from "../assets/notebook.png"
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "purple",
    accent: "black",
  },
};

function AllNoteBooksPage({ route }) {
  console.log("AllNoteBooksPage");
  console.log(route);
  const { user } = route.params;
  console.log("User: ", user);
  const [noteBooks, setNoteBooks] = useState([]);
  const navigation = useNavigation();
  const userId = user._id; // Replace with your actual user id

  useEffect(() => {
    // Get all the notes for the user from the server
    axios
      .get(`http://${api}/notebook/get-by-user/${userId}`)
      .then((response) => {
        setNoteBooks(response.data);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createNewNotebook = () => {
    // Create a new notebook
    axios
      .post(`http://${api}/notebook/create`, {
        title: title || "New Notebook",
        description: description || "A new notebook",
        user: user,
      })
      .then((response) => {
        console.log("Response of creating a notebook: ", response.data);
        setNoteBooks([...noteBooks, response.data]);
        setTitle("");
        setDescription("");
        setModalVisible(false);
      navigation.navigate("AllNotes", { user, notebook: response.data });
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
        style={styles.notes_card}
      onPress={() => navigation.navigate("AllNotes", {user, notebook: item})}>
        <Image style={{width: 150, height: 140, opacity: 0.8, margin: 15, borderRadius:10}} source={ notebookImage}/>
        <View style={styles.notes_card_content}>
            <Text style={styles.notes_card_title}>{item.title}</Text>
        </View>
    </TouchableOpacity>
  );

  return (
    <PaperProvider theme={theme}>
      <FlatList
        data={noteBooks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
        onPress={() => setModalVisible(true)}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{ backgroundColor: "#ffffff", padding: 20, borderRadius: 10 }}
          >
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <Button onPress={createNewNotebook}>Submit</Button>
            <Button onPress={() => setModalVisible(false)}>Close</Button>
          </View>
        </View>
      </Modal>
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

export default AllNoteBooksPage;
