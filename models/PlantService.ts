import { Plant } from './Plant';
import { Platform } from 'react-native';

export class PlantService {
  // Get the base API URL based on the platform
  private getApiBaseUrl(): string {
    if (Platform.OS === 'android') {
      return 'http://192.168.1.139:8080';
    } else if (Platform.OS === 'ios') {
      return 'http://192.168.1.139:8080';
    } else {
      // Web or other platforms
      return 'http://localhost:8080';
    }
  }

  /**
   * Get all plants for a specific admin
   */
  async getPlantsByAdminId(adminId: number): Promise<Plant[]> {
    try {
      // Change endpoint to match your API
      const response = await fetch(`${this.getApiBaseUrl()}/items/admin/${adminId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('API response error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Plants data received:', JSON.stringify(data).substring(0, 100) + '...');
      
      // Convert API response to Plant objects
      return data.map((item: any) => Plant.fromApiResponse(item));
    } catch (error) {
      console.error('Error fetching plants:', error);
      throw error;
    }
  }

  /**
   * Create a new plant
   */
  async createPlant(plant: Plant): Promise<Plant> {
    try {
      const response = await fetch(`${this.getApiBaseUrl()}/items`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plant.toApiRequest()),
      });

      if (!response.ok) {
        console.error('API response error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return Plant.fromApiResponse(data);
    } catch (error) {
      console.error('Error creating plant:', error);
      throw error;
    }
  }

  /**
   * Update an existing plant
   */
  async updatePlant(plant: Plant): Promise<Plant> {
    try {
      const response = await fetch(`${this.getApiBaseUrl()}/items/${plant.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plant.toApiRequest()),
      });

      if (!response.ok) {
        console.error('API response error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return Plant.fromApiResponse(data);
    } catch (error) {
      console.error('Error updating plant:', error);
      throw error;
    }
  }

  /**
   * Update plant's watering status
   */
  async updatePlantWateringStatus(plantId: number, isWatered: boolean): Promise<Plant> {
    try {
      const response = await fetch(`${this.getApiBaseUrl()}/items/${plantId}/water`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isWatered }),
      });

      if (!response.ok) {
        console.error('API response error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return Plant.fromApiResponse(data);
    } catch (error) {
      console.error('Error updating plant watering status:', error);
      throw error;
    }
  }

  /**
   * Delete a plant
   */
  async deletePlant(plantId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.getApiBaseUrl()}/items/${plantId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('API response error:', response.status, response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting plant:', error);
      throw error;
    }
  }
}