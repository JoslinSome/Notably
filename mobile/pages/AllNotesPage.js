import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'purple',
    accent: 'black',
  },
};

function AllNotesPage() {
  const [notes, setNotes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Get all the notes from the server
    axios.post("http://"+api+`/notes/read-note`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      console.log("Response: ", response);
    })
    .catch(error => {
      console.log("Error: ", error);
    });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('NotesPage', { note: item })}>
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
        data={notes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
      />
    </PaperProvider>
  );
}

export default AllNotesPage;