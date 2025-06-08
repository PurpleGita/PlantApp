/* global jest, describe, test, expect, beforeEach */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock all the required dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve(null)),
  clear: jest.fn(() => Promise.resolve(null)),
}));

describe('Simple test', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('1+1 should equal 2', () => {
    // Just verify that the test environment works
    expect(1 + 1).toBe(2);
  });

  test('AsyncStorage mock should work', async () => {
    await AsyncStorage.setItem('testKey', 'testValue');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('testKey', 'testValue');
  });
});
