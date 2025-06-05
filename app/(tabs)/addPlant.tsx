import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { usePlants } from '@/context/PlantContext';
import { useAuth } from '@/context/AuthContext';
import { Plant } from '@/models/Plant';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image } from 'expo-image';

export default function AddPlantScreen() {
  const [name, setName] = useState('');
  const [waterNeeded, setWaterNeeded] = useState('3'); // Default to 3 days
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { userData } = useAuth();
  const { addPlant } = usePlants();
  const router = useRouter();

  const handleAddPlant = async () => {
    // Form validation
    if (!name.trim()) {
      setError('Please enter a plant name');
      return;
    }

    if (!waterNeeded || isNaN(Number(waterNeeded)) || Number(waterNeeded) <= 0) {
      setError('Please enter a valid number of days for watering (greater than 0)');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      if (!userData?.id) {
        setError('You must be logged in to add plants');
        return;
      }
      
      // Create a new plant instance
      const newPlant = new Plant(
        0,  // ID will be assigned by the server
        name.trim(),
        Number(waterNeeded),
        false, // Not watered by default
        null,  // No image by default
        Number(waterNeeded), // Initial days until water equals water needed
        userData.id // Admin ID from the current logged in user
      );
      
      // Add the plant to the database
      await addPlant(newPlant);
      
      // Reset form fields
      setName('');
      setWaterNeeded('3');
      
      // Navigate back to the home screen
      router.replace("/(tabs)/index");
    } catch (err) {
      console.error('Error adding plant:', err);
      setError('Failed to add plant. Please try again later.');
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
            <ThemedText style={styles.title}>Add New Plant</ThemedText>
            
            {error ? (
              <ThemedView style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </ThemedView>
            ) : null}
            
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Plant Name</ThemedText>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter plant name"
                placeholderTextColor="#999"
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
              />
            </ThemedView>
            
            <TouchableOpacity
              style={[
                styles.addButton,
                isSubmitting && styles.addButtonDisabled
              ]}
              onPress={handleAddPlant}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.addButtonText}>
                {isSubmitting ? 'Adding...' : 'Add Plant'}
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.replace("/(tabs)/index")}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
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
    flexGrow: 1,
  },
  formContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#A1CEDC',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
  },
  addButton: {
    backgroundColor: '#A1CEDC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  headerImage: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
