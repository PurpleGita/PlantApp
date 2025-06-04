import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Checkbox from 'expo-checkbox';
import React from 'react';

export default function HomeScreen() {
  
  const [isChecked, setChecked] = React.useState(false);

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
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">PlantName1         
          <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#4630EB' : undefined}
        /></ThemedText>
        <ThemedText>
          Needs water in <ThemedText type="defaultSemiBold">3 days</ThemedText>
        </ThemedText>
        
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">PlantName2         
          <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#4630EB' : undefined}
        /></ThemedText>
        <ThemedText>
          Needs water <ThemedText type="defaultSemiBold">Today</ThemedText>
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">PlantName3
          <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#4630EB' : undefined}
        />
        </ThemedText>
        <ThemedText>
          Needs water in <ThemedText type="defaultSemiBold">1 day</ThemedText>
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">PlantName4
          <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#4630EB' : undefined}
        />
        </ThemedText>
        <ThemedText>
          Needs water in <ThemedText type="defaultSemiBold">3 days</ThemedText>
        </ThemedText>
      </ThemedView>

        <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">PlantName5
          <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#4630EB' : undefined}
        />
        </ThemedText>
        <ThemedText>
          Needs water in <ThemedText type="defaultSemiBold">2 days</ThemedText>
        </ThemedText>
      </ThemedView>


    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
    checkbox: {
    margin: 8,
  },
});
