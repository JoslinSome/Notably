import React, { useState } from "react";
import {
  Button,
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

export default function ImagePickerComponent({ setImageSet, setPhoto }) {
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

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
    fetch("http://your-node-server.com/api-endpoint", {
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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Button title="Take a photo" onPress={takePhoto} />
          <Button title="Pick an image" onPress={pickImage} />
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: windowWidth * 0.8, height: windowHeight * 0.2 }}
            />
          )}
          <Button title="Submit" onPress={submitImage} />
        </View>
      </Modal>
    </View>
  );
}
