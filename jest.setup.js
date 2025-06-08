
// jest.setup.js
/* global jest */

// Mock AsyncStorage directly
jest.mock('@react-native-async-storage/async-storage', () => {
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

  return asyncStorageMock;
});

// Mock PlantService
jest.mock('@/models/PlantService', () => {
  return {
    PlantService: jest.fn().mockImplementation(() => ({
      getPlantsByAdminId: jest.fn().mockResolvedValue([]),
      waterPlant: jest.fn().mockResolvedValue({}),
      addPlant: jest.fn().mockResolvedValue({}),
      updatePlant: jest.fn().mockResolvedValue({}),
      deletePlant: jest.fn().mockResolvedValue({})
    }))
  };
});

// Mock fetch API
global.fetch = jest.fn().mockImplementation(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      {
        id: 1,
        username: "test",
        password: "test"
      }
    ])
  })
);

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  }),
  useSegments: jest.fn().mockReturnValue(['', '']),
}));

// Mock native-notify
jest.mock('native-notify', () => ({
  __esModule: true,
  default: jest.fn()
}));
