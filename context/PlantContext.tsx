import { createContext, useContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { Plant } from '../models/Plant';
import { PlantService } from '../models/PlantService';
import { useAuth } from './AuthContext';

interface PlantContextType {
  plants: Plant[];
  loadingPlants: boolean;
  errorMessage: string | null;
  refreshPlants: () => Promise<void>;
  waterPlant: (plantId: number) => Promise<void>;
  addPlant: (plant: Plant) => Promise<void>;
  updatePlant: (plant: Plant) => Promise<void>;
  deletePlant: (plantId: number) => Promise<void>;
}

const PlantContext = createContext<PlantContextType>({
  plants: [],
  loadingPlants: false,
  errorMessage: null,
  refreshPlants: async () => {},
  waterPlant: async () => {},
  addPlant: async () => {},
  updatePlant: async () => {},
  deletePlant: async () => {},
});

export function PlantProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loadingPlants, setLoadingPlants] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { userData } = useAuth();
  
  // Create a memoized instance of PlantService that won't change between renders
  const plantService = useMemo(() => new PlantService(), []);

  const refreshPlants = useCallback(async () => {
    if (!userData?.id) return;
    
    setLoadingPlants(true);
    setErrorMessage(null);
    
    try {
      const plantsData = await plantService.getPlantsByAdminId(userData.id);
      setPlants(plantsData);
    } catch (error) {
      console.error('Error fetching plants:', error);
      setErrorMessage('Failed to load plants. Please try again later.');
    } finally {
      setLoadingPlants(false);
    }
  }, [userData?.id, plantService]);

  const waterPlant = useCallback(async (plantId: number) => {
    try {
      const updatedPlant = await plantService.updatePlantWateringStatus(plantId);
      
      // Update the local state with the proper Plant instance returned from the API
      setPlants(prevPlants => 
        prevPlants.map(plant => 
          plant.id === plantId ? updatedPlant : plant
        )
      );
    } catch (error) {
      console.error('Error watering plant:', error);
      setErrorMessage('Failed to water plant. Please try again.');
    }
  }, [plantService]);

  const addPlant = useCallback(async (plant: Plant) => {
    try {
      const newPlant = await plantService.createPlant(plant);
      setPlants(prevPlants => [...prevPlants, newPlant]);
    } catch (error) {
      console.error('Error adding plant:', error);
      setErrorMessage('Failed to add plant. Please try again.');
    }
  }, [plantService]);

  const updatePlant = useCallback(async (plant: Plant) => {
    try {
      const updatedPlant = await plantService.updatePlant(plant);
      setPlants(prevPlants => 
        prevPlants.map(p => 
          p.id === plant.id ? updatedPlant : p
        )
      );
    } catch (error) {
      console.error('Error updating plant:', error);
      setErrorMessage('Failed to update plant. Please try again.');
    }
  }, [plantService]);

  const deletePlant = useCallback(async (plantId: number) => {
    try {
      const success = await plantService.deletePlant(plantId);
      if (success) {
        setPlants(prevPlants => prevPlants.filter(p => p.id !== plantId));
      } else {
        throw new Error('Failed to delete plant');
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
      setErrorMessage('Failed to delete plant. Please try again.');
    }
  }, [plantService]);

  // Load plants when user is authenticated
  useEffect(() => {
    if (userData?.id) {
      refreshPlants();
    } else {
      setPlants([]);
      setLoadingPlants(false);
    }
  }, [userData?.id, refreshPlants]);

  return (
    <PlantContext.Provider 
      value={{ 
        plants, 
        loadingPlants, 
        errorMessage, 
        refreshPlants, 
        waterPlant,
        addPlant,
        updatePlant,
        deletePlant
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}

export function usePlants() {
  return useContext(PlantContext);
}
