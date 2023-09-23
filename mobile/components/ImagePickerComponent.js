import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import { Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'purple',
    accent: 'black',
  },
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ImagePickerComponent({ setImageSet, setPhoto }) {
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await getCameraPermission();
    if (!hasPermission) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      setPhoto({ uri: result.assets[0].uri });
      setImageSet(true);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await getCameraPermission();
    if (!hasPermission) {
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!result.cancelled) {
      console.log(result);
      setImage(result.assets[0].uri);
      setPhoto({ uri: result.assets[0].uri });
      setImageSet(true);
    } else {
      console.log("cancelled");
    }
  };

  const submitImage = async () => {
    // Make a call to your Node.js server with the selected photo
    fetch("http://localhost3002/", {
      method: "POST",
      body: JSON.stringify({ photo: image }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the server response
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setModalVisible(false);
  };

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'white' }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ position: "absolute", left: 10, top: 10 }}
        >
          <Ionicons name="add-circle" size={32} color="black" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'white' }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ position: "absolute", right: 10, top: 50 }}
            >
              <Ionicons name="close-circle" size={32} color="black" />
            </TouchableOpacity>

            <Button mode="contained" style={styles.button} onPress={takePhoto}>Take a photo</Button>
            <Button mode="contained" style={styles.button} onPress={pickImage}>Pick an image</Button>
            {image && (
              <Image
                source={{ uri: image }}
                style={styles.image}
              />
            )}
            <Button mode="contained" style={styles.button} onPress={submitImage}>Submit</Button>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  button : {
    backgroundColor: 'purple',
    marginTop: 10,
    color: 'white',
    width: 150,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image : {
    width: windowWidth * 0.9,
    height: windowHeight * 0.3,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
  }

});
