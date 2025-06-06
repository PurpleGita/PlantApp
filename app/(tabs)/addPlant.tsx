import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { usePlants } from '@/context/PlantContext';
import { useAuth } from '@/context/AuthContext';
import { Plant } from '@/models/Plant';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

export default function AddPlantScreen() {
  const [name, setName] = useState('');
  const [waterNeeded, setWaterNeeded] = useState('3'); // Default to 3 days
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { userData } = useAuth();
  const { addPlant } = usePlants();
  const router = useRouter();

  const debounceDelay = 500; // 500ms delay to prevent rapid presses

  // Request permission to use camera and camera roll
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permissions are required to take a photo.');
      return false;
    }
    return true;
  };

  // Handle taking a photo with camera
  const takePhoto = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setIsProcessing(false);
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      } else {
        Alert.alert('No Photo Taken', 'You did not take a photo.');
      }
    } catch {
      Alert.alert('Error', 'An error occurred while taking a photo.');
    } finally {
      setTimeout(() => setIsProcessing(false), debounceDelay);
    }
  };

  // Handle selecting an image from camera roll
  const selectImage = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      } else {
        Alert.alert('No Image Selected', 'You did not select an image.');
      }
    } catch {
      Alert.alert('Error', 'An error occurred while selecting an image.');
    } finally {
      setTimeout(() => setIsProcessing(false), debounceDelay);
    }
  };

  // Clear the selected image
  const clearImage = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      setImage(null);
      Alert.alert('Image Cleared', 'You can now select a new image.');
    } catch {
      Alert.alert('Error', 'An error occurred while clearing the image.');
    } finally {
      setTimeout(() => setIsProcessing(false), debounceDelay);
    }
  };

  // Handle add plant form submission
  const handleAddPlant = async () => {
    if (!name.trim()) {
      setError('Plant name is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newPlant = new Plant(0, name, parseInt(waterNeeded, 10), false, image, null, userData?.id || 0);
      await addPlant(newPlant);
      router.push('/');
    } catch {
      setError('Failed to add plant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D997' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.headerImage}
        />
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.formContainer}>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Plant Name</ThemedText>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter plant name"
                placeholderTextColor="#999"
                accessibilityLabel="Plant name input"
                accessibilityHint="Enter the name of your plant"
              />
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Days Between Watering</ThemedText>
              <TextInput
                style={styles.input}
                value={waterNeeded}
                onChangeText={setWaterNeeded}
                keyboardType="numeric"
                placeholder="Enter number of days"
                placeholderTextColor="#999"
                accessibilityLabel="Days between watering input"
                accessibilityHint="Enter the number of days between watering your plant"
              />
            </ThemedView>

            {/* Image Selection Section */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Plant Image (Optional)</ThemedText>

              {/* Preview selected image if available */}
              <View style={styles.imageContainer}>
                {isSubmitting && !image ? (
                  <ThemedText style={styles.loadingText}>Processing image...</ThemedText>
                ) : image ? (
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (
                  <ThemedText style={styles.placeholderText}>No image selected</ThemedText>
                )}
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                  <Text style={styles.buttonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={selectImage}>
                  <Text style={styles.buttonText}>Select From Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={clearImage}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ThemedView>

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            <TouchableOpacity style={styles.submitButton} onPress={handleAddPlant} disabled={isSubmitting}>
              <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting...' : 'Add Plant'}</Text>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  placeholderText: {
    color: '#999',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  loadingText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
});
