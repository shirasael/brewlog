/** Base URL for the API endpoints */
const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Interface representing a coffee brew record.
 * @interface Brew
 * @property {number} id - Unique identifier for the brew
 * @property {string} beanType - Type/origin of coffee beans used
 * @property {string | null} imageUrl - Optional URL for brew image
 * @property {string} brewType - Method of brewing (e.g., V60, Espresso)
 * @property {number} waterTemp - Water temperature in Celsius
 * @property {number} weightIn - Input coffee weight in grams
 * @property {number} weightOut - Output coffee weight in grams
 * @property {string} brewTime - Total brewing time in "mm:ss" format
 * @property {number} bloomTime - Coffee bloom time in seconds
 * @property {string} [details] - Optional additional brewing notes
 */
interface Brew {
    id: number;
    beanType: string;
    imageUrl: string | null;
    brewType: string;
    waterTemp: number;
    weightIn: number;
    weightOut: number;
    brewTime: string;
    bloomTime: number;
    details?: string;
}

/**
 * Extended brew interface including timestamp fields from the API response.
 * @interface BrewResponse
 * @extends {Brew}
 * @property {string} created_at - ISO timestamp of record creation
 * @property {string | null} updated_at - ISO timestamp of last update
 */
interface BrewResponse extends Brew {
    id: number;
    created_at: string;
    updated_at: string | null;
}

/** Type for creating new brews, excluding the ID field */
type NewBrew = Omit<Brew, 'id'>;

/**
 * Transforms API response from snake_case to camelCase.
 * @param {any} brew - Raw brew data from API
 * @returns {Brew} Transformed brew object
 */
function transformBrewResponse(brew: any): Brew {
    return {
        id: brew.id,
        beanType: brew.bean_type,
        imageUrl: brew.image_url,
        brewType: brew.brew_type,
        waterTemp: brew.water_temp,
        weightIn: brew.weight_in,
        weightOut: brew.weight_out,
        brewTime: brew.brew_time,
        bloomTime: brew.bloom_time,
        details: brew.details
    };
}

/**
 * Transforms frontend camelCase to API snake_case.
 * @param {NewBrew} brew - Frontend brew data
 * @returns {any} Transformed data for API request
 */
function transformBrewRequest(brew: NewBrew): any {
    return {
        bean_type: brew.beanType,
        image_url: brew.imageUrl,
        brew_type: brew.brewType,
        water_temp: brew.waterTemp,
        weight_in: brew.weightIn,
        weight_out: brew.weightOut,
        brew_time: brew.brewTime,
        bloom_time: brew.bloomTime,
        details: brew.details
    };
}

/**
 * API client for interacting with the brewing records backend.
 * Provides CRUD operations for brew records with automatic case transformation.
 */
export const api = {
    /**
     * Fetches all brew records.
     * @returns {Promise<Brew[]>} List of brew records
     * @throws {Error} If the API request fails
     */
    async getBrews(): Promise<Brew[]> {
        const response = await fetch(`${API_BASE_URL}/brews/`);
        if (!response.ok) {
            throw new Error('Failed to fetch brews');
        }
        const data = await response.json();
        return data.map(transformBrewResponse);
    },

    /**
     * Creates a new brew record.
     * @param {NewBrew} brew - New brew data
     * @returns {Promise<Brew>} Created brew record
     * @throws {Error} If the API request fails
     */
    async createBrew(brew: NewBrew): Promise<Brew> {
        const response = await fetch(`${API_BASE_URL}/brews/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transformBrewRequest(brew)),
        });
        if (!response.ok) {
            throw new Error('Failed to create brew');
        }
        const data = await response.json();
        return transformBrewResponse(data);
    },

    /**
     * Updates an existing brew record.
     * @param {number} id - ID of the brew to update
     * @param {Brew} brew - Updated brew data
     * @returns {Promise<Brew>} Updated brew record
     * @throws {Error} If the API request fails
     */
    async updateBrew(id: number, brew: Brew): Promise<Brew> {
        const response = await fetch(`${API_BASE_URL}/brews/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transformBrewRequest(brew)),
        });
        if (!response.ok) {
            throw new Error('Failed to update brew');
        }
        const data = await response.json();
        return transformBrewResponse(data);
    },

    /**
     * Deletes a brew record.
     * @param {number} id - ID of the brew to delete
     * @throws {Error} If the API request fails
     */
    async deleteBrew(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/brews/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete brew');
        }
    }
};

export type { Brew, BrewResponse, NewBrew }; 