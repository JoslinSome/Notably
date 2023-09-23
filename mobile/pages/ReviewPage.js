import React from "react";
import { View, StyleSheet, Text } from "react-native";
function ReviewPage(props) {
  return (
    <View style={styles.container}>
      <Text>Hi</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(114,13,227)",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ReviewPage;
