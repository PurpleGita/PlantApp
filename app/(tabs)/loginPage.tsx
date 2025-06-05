// filepath: c:\Users\rasmu\Documents\PlatformIO\Projects\PlantProject\PlantApp\app\(tabs)\loginPage.tsx
import { Image } from 'expo-image';
import { useState, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const colorScheme = useColorScheme() ?? 'light';
  const { login } = useAuth();
  const router = useRouter();
  
  // Create refs for the text inputs
  const usernameInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const handleLogin = async () => {
    // Don't proceed if form is invalid
    if (!username || !password) {
      setLoginError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      const success = await login(username, password);
      if (success) {
        // Navigate to home screen on successful login
        // Use a small delay to ensure navigation happens after state updates
        setTimeout(() => {
          // Just navigate to index, which is the default route
          router.navigate("/");
        }, 100);
      } else {
        setLoginError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setLoginError("An error occurred. Please try again later.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle username submission - move to password field
  const handleUsernameSubmit = () => {
    passwordInputRef.current?.focus();
  };
  
  // Handle password submission - attempt login
  const handlePasswordSubmit = () => {
    handleLogin();
  };
  
  // Dismiss keyboard when tapping outside inputs
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <ThemedView style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>

            <ThemedText type="title" style={styles.title}>
              Moon Plants
            </ThemedText>
            
            <ThemedText style={styles.subtitle}>
              Log in to track and care for your plants
            </ThemedText>

            <View style={styles.form}>
              <TextInput
                ref={usernameInputRef}
                style={[
                  styles.input,
                  { color: colorScheme === 'dark' ? '#ECEDEE' : '#11181C' }
                ]}                placeholder="Username"
                placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={handleUsernameSubmit}
                blurOnSubmit={false}
                accessibilityLabel="Username input field"
              />

              <TextInput
                ref={passwordInputRef}
                style={[
                  styles.input,
                  { color: colorScheme === 'dark' ? '#ECEDEE' : '#11181C' }
                ]}
                placeholder="Password"
                placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="go"
                onSubmitEditing={handlePasswordSubmit}
                accessibilityLabel="Password input field"
              />
              
              {loginError ? (
                <ThemedText style={styles.errorText}>
                  {loginError}
                </ThemedText>
              ) : null}
              
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { opacity: isLoading ? 0.7 : 1 }
                ]}
                onPress={handleLogin}
                disabled={isLoading || !username || !password}
                accessibilityLabel="Login button"
                accessibilityHint="Double tap to log in"
              >
                <ThemedText style={styles.buttonText}>
                  {isLoading ? 'Logging in...' : 'Log In'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity accessibilityLabel="Forgot password">
                <ThemedText type="link" style={styles.footerText}>
                  Forgot Password?
                </ThemedText>
              </TouchableOpacity>
              
              <View style={styles.signupContainer}>
                <ThemedText style={styles.footerText}>
                  Don&apos;t have an account? 
                </ThemedText>
                <TouchableOpacity accessibilityLabel="Sign up">
                  <ThemedText type="link" style={styles.signupText}> Sign Up</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ThemedView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 16,
  },
  form: {
    width: '100%',
    gap: 16,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#A1CEDC',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#A1CEDC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    gap: 16,
  },
  footerText: {
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
});
