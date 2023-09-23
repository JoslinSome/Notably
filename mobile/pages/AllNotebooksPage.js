import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Modal, View, TextInput, Text } from 'react-native';
import { Card, Title, FAB, Provider as PaperProvider, DefaultTheme, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {api} from "../config/Api";

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
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    navigation.navigate("AllNotesPage", { user, notebook: notebook });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("AllNotes", { note: item })}
    >
      <Card style={{ margin: 10 }}>
        <Card.Content>
          <Title>{item.title}</Title>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <PaperProvider theme={theme}>
      <FlatList
        data={noteBooks}
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
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
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

export default AllNoteBooksPage;
