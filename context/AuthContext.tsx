import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants for storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Define the user data type
interface UserData {
  id: number;
  username: string;
}

// Define the shape of our auth context
type AuthContextType = {
  isAuthenticated: boolean;
  userData: UserData | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userData: null,
  login: async () => false,
  logout: async () => {},
});

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing auth token when the app starts
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        // Get the stored token and user data
        const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const storedUserDataString = await AsyncStorage.getItem(USER_DATA_KEY);
        
        if (storedToken && storedUserDataString) {
          const storedUserData = JSON.parse(storedUserDataString);
          setIsAuthenticated(true);
          setUserData(storedUserData);
          console.log('User authenticated from stored token');
        }
      } catch (error) {
        console.error('Error loading authentication data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStoredAuth();
  }, []);
  
  // Login function that validates credentials with the backend API
  const login = useCallback(async (username: string, password: string) => {
    try {
      // Use different IP addresses based on platform
      // - Use 10.0.2.2 for Android emulator (maps to host machine's localhost)
      // - Use localhost for web
      // - Use host machine's actual IP address for physical devices
      let apiUrl;
      if (Platform.OS === 'android') {
        apiUrl = 'http://192.168.1.139:8080/adminlogins';
      } else if (Platform.OS === 'ios') {
        apiUrl = 'http://192.168.1.139:8080/adminlogins';
      } else {
        apiUrl = 'http://192.168.1.139:8080/adminlogins';
      }
      console.log('Attempting to connect to:', apiUrl);
      
      // Make a real API call to fetch users from the endpoint with explicit configuration
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });
      
      if (!response.ok) {
        console.error('API response error:', response.status, response.statusText);
        return false;
      }
      
      const users = await response.json();
      console.log('Received users data:', JSON.stringify(users).substring(0, 100) + '...');
      
      // Check if the provided credentials match any user in the API response
      const matchedUser = users.find(
        (user: any) => user.username === username && user.password === password
      );
      
      // If a matching user is found, set authentication state to true
      if (matchedUser) {
        // Create a user data object (exclude password for security)
        const userData: UserData = {
          id: matchedUser.id,
          username: matchedUser.username
        };
        
        // Generate a simple token (in a real app, this would come from the server)
        const token = `token_${userData.id}_${Date.now()}`;
        
        // Store the token and user data
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        
        // Update state
        setIsAuthenticated(true);
        setUserData(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);
  
  // Logout function
  const logout = useCallback(async () => {
    try {
      // Clear stored authentication data
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      
      // Update state
      setIsAuthenticated(false);
      setUserData(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  // Don't render children until we've checked for stored auth
  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
