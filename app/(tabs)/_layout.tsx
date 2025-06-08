import { Tabs, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  
  // Track if component is mounted
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state after first render
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Redirect to login page if not authenticated and not already on login page
  useEffect(() => {
    // Only proceed if component is mounted
    if (!isMounted) return;
    
    // Only redirect if not authenticated and not already on the login page
    const isLoginPage = segments[1] === 'loginPage';
    
    if (!isAuthenticated && !isLoginPage) {
      // Add a small delay for smoother transition
      const redirectTimer = setTimeout(() => {
        router.replace("/(tabs)/loginPage");
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, router, segments, isMounted]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="addPlant" 
        options={{
          title: 'Add Plant',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="flower.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="loginPage"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          // Hide this tab from the tab bar since we're using auto-redirect
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
