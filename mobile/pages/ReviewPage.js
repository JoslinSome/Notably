import React, {useEffect, useState} from "react";
import {View, StyleSheet, Text, FlatList, Modal, TextInput, TouchableOpacity, Image} from "react-native";
import {Button, FAB, Provider as PaperProvider} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import {api} from "../config/Api";
import notebookImage from "../assets/notebook.png";
function ReviewPage({props,route}) {
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


    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("Quiz", {user, notebook: item})}>
            <Image style={{width: 150, height: 140, opacity: 0.8, margin: 15, borderRadius:10}} source={ notebookImage}/>
            <Text>{item.title}</Text>
        </TouchableOpacity>
    );
  return (
    <View style={styles.container}>
      <Text style={styles.Title}>Select Course to review</Text>
      <PaperProvider >
        <FlatList
            data={noteBooks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
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
              <Button onPress={() => setModalVisible(false)}>Close</Button>
            </View>
          </View>
        </Modal>
      </PaperProvider>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(212,195,232)",
  },
    Title: {
        fontSize: 20,
      fontWeight: "bold",
      color: "rgb(87,9,180)",
      marginTop: 35,
      marginLeft: 10
    }
});
export default ReviewPage;
