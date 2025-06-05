import { Image } from 'expo-image';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Checkbox } from 'expo-checkbox';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

export default function HomeScreen() {
  
  // Create individual state for each plant
  const [plant1Checked, setPlant1Checked] = React.useState(false);
  const [plant2Checked, setPlant2Checked] = React.useState(false);
  const [plant3Checked, setPlant3Checked] = React.useState(false);
  const [plant4Checked, setPlant4Checked] = React.useState(false);
  const [plant5Checked, setPlant5Checked] = React.useState(false);
  
  // Get auth context and router
  const { logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    // Redirect will happen automatically through the TabLayout effect
    // We don't need to manually navigate here
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D997' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Plants Overview:</ThemedText>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <View style={styles.plantRow}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.plantImage}
            contentFit="cover"
          />
          <View style={styles.plantInfo}>
            <ThemedText type="subtitle">PlantName1</ThemedText>
            <ThemedText>
              Needs water in <ThemedText type="defaultSemiBold">3 days</ThemedText>
            </ThemedText>
          </View>
        <View style={styles.checkboxContainer}>
            <Checkbox
              style={styles.checkbox}
              value={plant1Checked}
              onValueChange={setPlant1Checked}
              color={plant1Checked ? '#4630EB' : undefined}
            />
          </View>
        </View>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <View style={styles.plantRow}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.plantImage}
            contentFit="cover"
          />
          <View style={styles.plantInfo}>
            <ThemedText type="subtitle">PlantName2</ThemedText>
            <ThemedText>
              Needs water <ThemedText type="defaultSemiBold">Today!</ThemedText>
            </ThemedText>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              style={styles.checkbox}
              value={plant2Checked}
              onValueChange={setPlant2Checked}
              color={plant2Checked ? '#4630EB' : undefined}
            />
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <View style={styles.plantRow}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.plantImage}
            contentFit="cover"
          />
          <View style={styles.plantInfo}>
            <ThemedText type="subtitle">PlantName3</ThemedText>
            <ThemedText>
              Needs water in <ThemedText type="defaultSemiBold">1 day</ThemedText>
            </ThemedText>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              style={styles.checkbox}
              value={plant3Checked}
              onValueChange={setPlant3Checked}
              color={plant3Checked ? '#4630EB' : undefined}
            />
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <View style={styles.plantRow}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.plantImage}
            contentFit="cover"
          />
          <View style={styles.plantInfo}>
            <ThemedText type="subtitle">PlantName4</ThemedText>
            <ThemedText>
              Needs water in <ThemedText type="defaultSemiBold">3 days</ThemedText>
            </ThemedText>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              style={styles.checkbox}
              value={plant4Checked}
              onValueChange={setPlant4Checked}
              color={plant4Checked ? '#4630EB' : undefined}
            />
          </View>
        </View>
      </ThemedView>

        <ThemedView style={styles.stepContainer}>
        <View style={styles.plantRow}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.plantImage}
            contentFit="cover"
          />
          <View style={styles.plantInfo}>
            <ThemedText type="subtitle">PlantName5</ThemedText>
            <ThemedText>
              Needs water in <ThemedText type="defaultSemiBold">2 days</ThemedText>
            </ThemedText>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              style={styles.checkbox}
              value={plant5Checked}
              onValueChange={setPlant5Checked}
              color={plant5Checked ? '#4630EB' : undefined}
            />
          </View>
        </View>
      </ThemedView>


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
  stepContainer: {
    gap: 8,
    marginBottom: 16,
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
});
