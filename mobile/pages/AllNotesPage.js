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
    // Fetch notes from your Node.js server
    fetch('http://localhost:3002/notes/get-all')
      .then(response => response.json())
      .then(data => setNotes(data))
      .catch(error => console.error('Error:', error));
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