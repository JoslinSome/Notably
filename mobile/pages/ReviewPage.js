import React, {useEffect, useState} from "react";
import {View, StyleSheet, Text, FlatList, Modal, TextInput, TouchableOpacity, Image} from "react-native";
import {Button, FAB, Provider as PaperProvider} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import {api} from "../config/Api";
import flashcardImage from "../assets/flashcard.png";
import {width, height} from "../config/DeviceDemensions";


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
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Quiz", {user, notebook: item})}
        >
          <Image style={styles.cardImage} source={flashcardImage} />
          <Text style={styles.cardTitle}>{item.title}</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Course to review</Text>
      <PaperProvider>
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
  },
    Title: {
        fontSize: 20,
      fontWeight: "bold",
      color: "white",
      marginTop: 35,
      marginLeft: 10
    },
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: "purple",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: "white",
      marginBottom: 20,
      textAlign: 'center',
    },
    cardContainer: {
      flex: 1,
      flexDirection: 'column',
      margin: 1,
    },
    card: {
      justifyContent: 'center',
      alignItems: 'center',
      height: height/3.5,
      width: width/6,
      backgroundColor: '#fff',
      borderRadius: 10,
      margin: 10,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
    },
    cardImage: {
      width: '100%',
      height: '70%',
      resizeMode: 'contain',
    },
    cardTitle: {
      marginTop: 10,
      fontSize: 16,
    },
});
export default ReviewPage;
