import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const navigation = useNavigation();

  const pickImage = () => {
    ImagePicker.showImagePicker({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        setImageUri(response.uri);
      }
    });
  };

  const searchAnime = async () => {
    if (!imageUri) {
      Alert.alert('No Image Selected', 'Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'scene.jpg',
    });

    try {
      const response = await axios.post('https://api.trace.moe/search', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigation.navigate('Result', { data: response.data.result[0] });
    } catch (error) {
      console.error('Error searching anime:', error);
      Alert.alert('Error', 'Failed to identify anime. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Search Anime" onPress={searchAnime} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: 200, height: 200, marginTop: 20 },
});

export default HomeScreen;
