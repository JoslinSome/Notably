import React, { useState, useEffect } from 'react';
import {FlatList, TouchableOpacity, Modal, View, TextInput, Text, Image, StyleSheet} from 'react-native';
import { Card, Title, FAB, Provider as PaperProvider, DefaultTheme, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {api} from "../config/Api";
import notebookImage from "../assets/notebook.png"
import { width, height } from '../config/DeviceDemensions';
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
    <View style={styles.notebook_container}>
      <TouchableOpacity
        style={styles.notebook_card}
        onPress={() => navigation.navigate("AllNotes", {user, notebook: item})}
      >
        <Image style={styles.notebook_image} source={notebookImage} />
      </TouchableOpacity>
      <Text style={styles.notebook_card_title}>{item.title}</Text>
    </View>
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
    notebook_container: {
        alignItems: 'center',
        marginTop: 20,
      },
    notebook_card: {
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        // Make the card look elevated and have a shadow
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        width: width/5.5,
        height: width/5.5,
        justifyContent: "center",
        // Make background color white
        backgroundColor: "#ffffff",
        
    },
    notebook_image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
      },
    notebook_card_title: {
        color: "black",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
      },
    notebook_card_content: {
        justifyContent: "center",
        margin: 5,
    },
});

export default AllNoteBooksPage;
