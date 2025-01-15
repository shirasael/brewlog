const API_BASE_URL = 'http://localhost:8000/api/v1';

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

interface BrewResponse extends Brew {
    id: number;
    created_at: string;
    updated_at: string | null;
}

type NewBrew = Omit<Brew, 'id'>;

// Convert snake_case response to camelCase for frontend
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

// Convert camelCase to snake_case for API requests
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

export const api = {
    async getBrews(): Promise<Brew[]> {
        const response = await fetch(`${API_BASE_URL}/brews/`);
        if (!response.ok) {
            throw new Error('Failed to fetch brews');
        }
        const data = await response.json();
        return data.map(transformBrewResponse);
    },

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