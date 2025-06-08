/* global jest */
// Mocking PlantService
jest.mock('../models/PlantService', () => {
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
