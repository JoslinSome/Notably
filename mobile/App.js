import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import NotesPage from "./pages/NotesPage";

export default function App() {
  return <NotesPage />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
