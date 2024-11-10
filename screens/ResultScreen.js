import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ResultScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { data } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anime: {data.anime}</Text>
      <Text>Episode: {data.episode}</Text>
      <Text>Timestamp: {Math.floor(data.from / 60)}:{Math.floor(data.from % 60)}</Text>
      <Image source={{ uri: data.image }} style={styles.image} />
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  image: { width: 300, height: 200, marginTop: 10 },
});

export default ResultScreen;
