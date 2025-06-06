import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePlants } from '@/context/PlantContext';
import { useAuth } from '@/context/AuthContext';
import { Plant } from '@/models/Plant';

export default function AddPlant({ navigation }: any) {
  const { addPlant } = usePlants();
  const { userData } = useAuth();

  const [name, setName] = useState('');
  const [waterNeeded, setWaterNeeded] = useState('');
  const [dayUntilWater, setDayUntilWater] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const takeImage = async () => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission required', 'Camera access is needed to take a photo.');
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    base64: true,
    quality: 0.7,
  });

  if (!result.canceled && result.assets[0].base64) {
    setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
  }
};


  const handleSubmit = async () => {
    if (!userData?.id) {
      Alert.alert('Authentication error', 'You must be logged in to add a plant.');
      return;
    }

    if (!name || !waterNeeded) {
      Alert.alert('Validation Error', 'Name and Water Needed are required.');
      return;
    }

    const newPlant = new Plant(
      0,
      name,
      Number(waterNeeded),
      false,
      image,
      dayUntilWater ? Number(dayUntilWater) : null,
      userData.id
    );

    try {
      setIsSubmitting(true);
      await addPlant(newPlant);
      Alert.alert('Success', 'Plant added successfully!');
      navigation.goBack(); // or navigate to the plant list
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while adding the plant.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Plant Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Plant Name"
      />

      <Text style={styles.label}>Water Needed (ml)</Text>
      <TextInput
        style={styles.input}
        value={waterNeeded}
        onChangeText={setWaterNeeded}
        keyboardType="numeric"
        placeholder="How many days between watering"
      />

      <Text style={styles.label}>Days Until Water</Text>
      <TextInput
        style={styles.input}
        value={dayUntilWater}
        onChangeText={setDayUntilWater}
        keyboardType="numeric"
        placeholder="Days untill next watering"
      />

<View style={styles.imageButtons}>
  <Button title="Pick Image" onPress={pickImage} />
  <View style={{ width: 10 }} />
  <Button title="Take Image" onPress={takeImage} />
</View>

      

      <View style={styles.submitButton}>
        <Button title={isSubmitting ? "Submitting..." : "Add Plant"} onPress={handleSubmit} disabled={isSubmitting} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
  },
  image: {
    marginTop: 10,
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 20,
  },
  imageButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},

});
