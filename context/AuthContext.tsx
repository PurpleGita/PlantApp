import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Platform } from 'react-native';

// Define the shape of our auth context
type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);
  
  // Logout function
  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
