/**
 * Plant model class that corresponds to the backend API data structure
 */
export class Plant {
  /**
   * Unique identifier for the plant
   */
  id: number;

  /**
   * Name of the plant
   */
  name: string;

  /**
   * Amount of water needed by the plant
   */
  waterNeeded: number;

  /**
   * Whether the plant has been watered
   */
  isWatered: boolean;
  /**
   * Image of the plant stored as base64 string
   * In React Native, we'll convert the byte[] from the API to a base64 string
   * Can be null if the plant has no image
   */
  image: string | null;

  /**
   * Days until the plant needs to be watered again
   * Can be null if not applicable
   */
  dayUntilWater: number | null;

  /**
   * ID of the admin who manages this plant
   */
  adminLoginId: number;
  constructor(
    id: number,
    name: string,
    waterNeeded: number,
    isWatered: boolean,
    image: string | null,
    dayUntilWater: number | null,
    adminLoginId: number
  ) {
    this.id = id;
    this.name = name;
    this.waterNeeded = waterNeeded;
    this.isWatered = isWatered;
    this.image = image;
    this.dayUntilWater = dayUntilWater;
    this.adminLoginId = adminLoginId;
  }

  /**
   * Create a Plant instance from API response JSON
   * Handles the conversion of byte[] to base64 string
   */  
  static fromApiResponse(data: any): Plant {
    // For image, we expect the API to send byte[] as base64 encoded string or null
    const imageStr = data.image 
      ? `data:image/jpeg;base64,${data.image}`
      : null;
    
    return new Plant(
      data.id || 0,
      data.name || '',
      data.waterNeeded || 0,
      Boolean(data.isWatered),
      imageStr,
      data.dayUntilWater !== undefined ? data.dayUntilWater : null,
      data.adminLogin?.id || 0
    );
  }

  /**
   * Convert the Plant instance to JSON for API requests
   * Note: This doesn't include the adminLogin object, just the ID
   */
  toApiRequest(): any {
    return {      id: this.id,
      name: this.name,
      waterNeeded: this.waterNeeded,
      isWatered: this.isWatered,
      image: this.image ? this.image.split(',')[1] || null : null, // Remove the data:image/jpeg;base64, prefix or handle null
      dayUntilWater: this.dayUntilWater,
      adminLogin: {
        id: this.adminLoginId
      }
    };
  }
  /**
   * Get the display text for days until watering
   */
  get wateringDueText(): string {
    if (this.dayUntilWater === null) {
      return 'No watering schedule set';
    }
    
    if (this.dayUntilWater <= 0) {
      return 'Watering due today!';
    } else if (this.dayUntilWater === 1) {
      return 'Water tomorrow';
    } else {
      return `Water in ${this.dayUntilWater} days`;
    }
  }

  /**
   * Create a new plant object with default values
   * @param adminLoginId The ID of the admin creating the plant
   * @returns A new Plant instance with default values
   */
  static createNew(adminLoginId: number): Plant {
    return new Plant(
      0, // ID will be assigned by the server
      '', // Empty name to be filled in
      0, // Default water needed
      false, // Not watered by default
      null, // No image by default
      null, // No watering schedule by default
      adminLoginId
    );
  }
}
