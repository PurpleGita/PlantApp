/* global jest */
// Mock implementation of AsyncStorage for Jest tests
const asyncStorageMock = {
  __INTERNAL_MOCK_STORAGE__: {},

  setItem: jest.fn(async (key, value) => {
    asyncStorageMock.__INTERNAL_MOCK_STORAGE__[key] = value;
    return Promise.resolve();
  }),

  getItem: jest.fn(async (key) => {
    return Promise.resolve(asyncStorageMock.__INTERNAL_MOCK_STORAGE__[key] || null);
  }),

  removeItem: jest.fn(async (key) => {
    delete asyncStorageMock.__INTERNAL_MOCK_STORAGE__[key];
    return Promise.resolve();
  }),

  clear: jest.fn(async () => {
    asyncStorageMock.__INTERNAL_MOCK_STORAGE__ = {};
    return Promise.resolve();
  }),

  getAllKeys: jest.fn(async () => {
    return Promise.resolve(Object.keys(asyncStorageMock.__INTERNAL_MOCK_STORAGE__));
  }),

  multiGet: jest.fn(async (keys) => {
    return Promise.resolve(
      keys.map((key) => [key, asyncStorageMock.__INTERNAL_MOCK_STORAGE__[key] || null])
    );
  }),

  multiSet: jest.fn(async (keyValuePairs) => {
    keyValuePairs.forEach(([key, value]) => {
      asyncStorageMock.__INTERNAL_MOCK_STORAGE__[key] = value;
    });
    return Promise.resolve();
  }),

  multiRemove: jest.fn(async (keys) => {
    keys.forEach((key) => {
      delete asyncStorageMock.__INTERNAL_MOCK_STORAGE__[key];
    });
    return Promise.resolve();
  }),
};

export default asyncStorageMock;
