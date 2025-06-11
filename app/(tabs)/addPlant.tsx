import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { usePlants } from '@/context/PlantContext';
import { useAuth } from '@/context/AuthContext';
import { Plant } from '@/models/Plant';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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
    );    try {
      setIsSubmitting(true);
      await addPlant(newPlant);
      Alert.alert('Success', 'Plant added successfully!');
      navigation.goBack() // or navigate to the plant list
    } catch {
      Alert.alert('Error', 'Something went wrong while adding the plant.');
      navigation.goBack()
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Add New Plant</ThemedText>
          <ThemedText style={styles.subtitle}>Fill in the details to add your new plant</ThemedText>
        </ThemedView>

        {/* Image preview and buttons */}
        <ThemedView style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} contentFit="cover" />
          ) : (
            <ThemedView style={styles.placeholderImage}>
              <ThemedText style={styles.placeholderText}>No Image Selected</ThemedText>
            </ThemedView>
          )}
          
          <View style={styles.imageButtons}>
            <TouchableOpacity 
              style={[styles.imageButton, { backgroundColor: '#A1CEDC' }]}
              onPress={pickImage}
            >
              <ThemedText style={styles.buttonText}>Gallery</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.imageButton, { backgroundColor: '#A1CEDC' }]}
              onPress={takeImage}
            >
              <ThemedText style={styles.buttonText}>Camera</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Form fields */}
        <ThemedView style={styles.formSection}>
          <ThemedText style={styles.label}>Plant Name</ThemedText>
          <TextInput
            style={[styles.input, { borderColor: '#A1CEDC' }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter plant name"
            placeholderTextColor="#999"
          />

          <ThemedText style={styles.label}>Days Between Watering </ThemedText>
          <TextInput
            style={[styles.input, { borderColor: '#A1CEDC' }]}
            value={waterNeeded}
            onChangeText={setWaterNeeded}
            keyboardType="numeric"
            placeholder="How many days between watering"
            placeholderTextColor="#999"
          />

          <ThemedText style={styles.label}>Days Until Next Water</ThemedText>
          <TextInput
            style={[styles.input, { borderColor: '#A1CEDC' }]}
            value={dayUntilWater}
            onChangeText={setDayUntilWater}
            keyboardType="numeric"
            placeholder="Days until next watering"
            placeholderTextColor="#999"
          />
        </ThemedView>

        {/* Submit button */}
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { backgroundColor: '#A1CEDC', opacity: isSubmitting ? 0.7 : 1 }
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <ThemedText style={styles.submitButtonText}>
            {isSubmitting ? "Adding Plant..." : "Add Plant"}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
    marginTop: 5,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 5,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    
  },
  placeholderText: {
    opacity: 0.5,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 15,
    color: '#A1CEDC',
  },
  imageButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    color: '#A1CEDC',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  formSection: {
    gap: 10,
    marginBottom: 20,
    backgroundColor: 'transparent',
    
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: -5,
  },
  input: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
    color: '#A1CEDC',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
