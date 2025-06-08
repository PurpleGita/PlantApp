/**
 * @jest-environment jsdom
 */
import React from 'react';
import { act } from 'react-test-renderer';
import * as renderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '@/app/(tabs)/index';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    navigate: jest.fn(),
  }),
  useSegments: jest.fn().mockReturnValue(['', '']),
}));
jest.mock('native-notify', () => jest.fn());
jest.mock('@/components/ParallaxScrollView', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});
jest.mock('expo-image', () => ({
  Image: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('expo-checkbox', () => ({
  Checkbox: () => 'Checkbox',
}));
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    userData: { id: 1, username: 'testuser' },
    logout: jest.fn(),
  }),
}));
jest.mock('@/context/PlantContext', () => ({
  usePlants: () => ({
    plants: [],
    loadingPlants: false,
    errorMessage: null,
    refreshPlants: jest.fn(),
    waterPlant: jest.fn(),
  }),
}));

// Simple component for testing without using React Native components
const SimpleComponent = () => 'Simple Component';

describe('Basic Test Suite', () => {
  // Basic test that doesn't rely on any React Native components
  test('1+1 equals 2', () => {
    expect(1 + 1).toBe(2);
  });
  
  test('Component renders without crashing', () => {
    // Wrap in act to handle React state updates
    let component!: renderer.ReactTestRenderer;
    
    act(() => {
      component = renderer.create(<SimpleComponent />);
    });
    
    expect(component).toBeTruthy();
    expect(component.toJSON()).toBe('Simple Component');
  });

  test('AsyncStorage mock works', async () => {
    await AsyncStorage.setItem('test', 'value');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('test', 'value');
  });
});

describe('HomeScreen Tests', () => {
  test('HomeScreen renders without crashing', () => {
    let component!: renderer.ReactTestRenderer;
    
    act(() => {
      component = renderer.create(<HomeScreen />);
    });
    
    expect(component).toBeTruthy();
  });
  
  test('HomeScreen contains logout button', () => {
    let component!: renderer.ReactTestRenderer;
    
    act(() => {
      component = renderer.create(<HomeScreen />);
    });
    
    const json = component.toJSON();
    const hasLogoutButton = JSON.stringify(json).includes('Logout');
    expect(hasLogoutButton).toBe(true);
  });
});
