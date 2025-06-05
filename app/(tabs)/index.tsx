import { Image } from 'expo-image';
import { StyleSheet, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Checkbox } from 'expo-checkbox';
import { useAuth } from '@/context/AuthContext';
import { usePlants } from '@/context/PlantContext';
import React, { useState, useCallback } from 'react';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  
  // Get auth context and router
  const { logout, userData } = useAuth();
  const router = useRouter();
  
  // Get plants data from context
  const { plants, loadingPlants, errorMessage, refreshPlants, waterPlant } = usePlants();
  
  const handleLogout = async () => {
    await logout();
    // Redirect will happen automatically through the TabLayout effect
  };
  
  // Handle checkbox toggle for a plant
  const handleWateringToggle = async (plantId: number, currentStatus: boolean) => {
    if (!currentStatus) {
      // Only water the plant if it's not already watered
      await waterPlant(plantId);
    }
  };
  
  // Pull to refresh functionality
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPlants();
    setRefreshing(false);
  }, [refreshPlants]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D997' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedView>
          <ThemedText type="title">Plants Overview</ThemedText>
          {userData && (
            <ThemedText style={styles.welcomeText}>Welcome, {userData.username}</ThemedText>
          )}
        </ThemedView>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      {/* Loading state */}
      {loadingPlants && !refreshing && (
        <ThemedView style={styles.messageContainer}>
          <ThemedText>Loading plants...</ThemedText>
        </ThemedView>
      )}
      
      {/* Error message */}
      {errorMessage && (
        <ThemedView style={styles.messageContainer}>
          <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={refreshPlants}
          >
            <ThemedText style={styles.retryText}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
      
      {/* Empty state */}
      {!loadingPlants && plants.length === 0 && !errorMessage && (
        <ThemedView style={styles.messageContainer}>
          <ThemedText>You do not have any plants yet.</ThemedText>
          <ThemedText style={styles.addPlantText}>Add some plants to get started!</ThemedText>
        </ThemedView>
      )}
      
      {/* Plant list */}
      {plants.map(plant => (
        <ThemedView key={plant.id} style={styles.stepContainer}>
          <View style={styles.plantRow}>
            {plant.image ? (
              <Image
                source={{ uri: plant.image }}
                style={styles.plantImage}
                contentFit="cover"
              />
            ) : (
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.plantImage}
                contentFit="cover"
              />
            )}
            <View style={styles.plantInfo}>
              <ThemedText type="subtitle">{plant.name}</ThemedText>
              <ThemedText>
                {plant.wateringDueText}
              </ThemedText>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                style={styles.checkbox}
                value={plant.isWatered}
                onValueChange={() => handleWateringToggle(plant.id, plant.isWatered)}
                color={plant.isWatered ? '#4630EB' : undefined}
                disabled={plant.isWatered} // Prevent unchecking if already watered
              />
            </View>
          </View>
        </ThemedView>
      ))}

      {/* Add plant button */}
      <TouchableOpacity 
        style={styles.addPlantButton}
        onPress={() => {/* Navigate to add plant screen */}}
      >
        <ThemedText style={styles.addPlantButtonText}>Add New Plant</ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#A1CEDC',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  plantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  plantInfo: {
    flex: 1,
  },
  checkboxContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  messageContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#A1CEDC',
    borderRadius: 8,
    marginTop: 10,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addPlantText: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  addPlantButton: {
    backgroundColor: '#A1CEDC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  addPlantButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});