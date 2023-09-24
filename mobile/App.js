import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import ReviewPage from "./pages/ReviewPage";
import { useCookies } from "react-cookie";
import { Ionicons } from "@expo/vector-icons";
import { backgroundColor, headerColor, titleColor } from "./config/colors";
import { useEffect, useRef, useState } from "react";
import { api } from "./config/Api";
import Auth from "./pages/Auth";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AllNotesPage from "./pages/AllNotesPage";
import Profile from "./pages/Profile";
import NotesPage from "./pages/NotesPage";
import AllNoteBooksPage from "./pages/AllNotebooksPage";
import QuizPage from "./pages/QuizPage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Home({ route, navigation }) {
  const { user } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="All Notebooks"
        component={NotesStackScreen}
        initialParams={{ user }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Review"
        component={ReviewStackScreen}
        initialParams={{ user }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Profile}
        initialParams={{ user }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const ReviewStack = createStackNavigator();
function ReviewStackScreen({ route, navigation }) {
  const { user } = route.params;
  return (
      <ReviewStack.Navigator>
          <ReviewStack.Screen
              name="ChooseReview"
              component={ReviewPage}
              initialParams={{ user }}
              options={{
                headerShown: false
              }}
          />
          <ReviewStack.Screen
              name="Quiz"
              component={QuizPage}
              initialParams={{ user }}
              options={{
                 headerShown: false,
              }}
          />

      </ReviewStack.Navigator>
  );
}

// Stack for the notes, and notebooks
const NotesStack = createStackNavigator();
function NotesStackScreen({ route, navigation }) {
  const { user } = route.params;
  return (
    <NotesStack.Navigator>
      <NotesStack.Screen
        name="AllNoteBooks"
        component={AllNoteBooksPage}
        initialParams={{ user }}
        options={{
          headerTitle: "All Notebooks",
          headerStyle: {
            backgroundColor: headerColor,
          },
          headerTintColor: titleColor,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />
      <NotesStack.Screen
        name="AllNotes"
        component={AllNotesPage}
        initialParams={{ user }}
        options={{
          headerTitle: "All Notes",
          headerStyle: {
            backgroundColor: headerColor,
          },
          headerTintColor: titleColor,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <NotesStack.Screen
        name="NotesPage"
        component={NotesPage}
        initialParams={{ user }}
        options={{
          headerTitle: "Notes",
          headerStyle: {
            backgroundColor: headerColor,
          },
          headerTintColor: titleColor,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </NotesStack.Navigator>
  );
}

export default function App() {
  const [cookies, setCookies] = useCookies(["access-token", "username"]);
  const [refresh, setRefresh] = useState(true);
  const [clientId, setClientId] = useState();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          headertitle="New group"
          options={{
            headerLeft: () => {
              return null;
            },
            headerRight: () => {
              return (
                <View style={styles.row}>
                  <TouchableOpacity>
                    <Ionicons
                      name="notifications-outline"
                      size={30}
                      color={"#c6bce0"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.icon}>
                    <Ionicons
                      name="settings-outline"
                      size={30}
                      color={"#c6bce0"}
                    />
                  </TouchableOpacity>
                </View>
              );
            },
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#575252",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    left: -10,
  },
  icon: {
    marginLeft: 20,
  },
});
