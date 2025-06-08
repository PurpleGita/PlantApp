/* global jest */
// Mock for global fetch
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
