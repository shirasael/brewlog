import React, { useState, useEffect } from 'react';
import BrewList from './BrewList';
import AddBrewForm from './AddBrewForm';
import { api, type Brew, type NewBrew } from '../services/api';
import '../styles/App.css';

/**
 * Main application component for BrewLog.
 * Manages the state of coffee brews and provides functionality for CRUD operations.
 */
const App: React.FC = () => {
    const [brews, setBrews] = useState<Brew[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadBrews();
    }, []);

    /**
     * Fetches all brews from the API and updates the local state.
     * Handles errors by setting an error message in state.
     */
    const loadBrews = async () => {
        try {
            const fetchedBrews = await api.getBrews();
            setBrews(fetchedBrews);
            setError(null);
        } catch (err) {
            setError('Failed to load brews. Please try again later.');
            console.error('Error loading brews:', err);
        } finally {
            setIsLoading(false);
        }
    };

    /** Shows the add brew form modal */
    const handleAddBrewClick = () => {
        setShowForm(true);
    };

    /** Hides the add brew form modal */
    const handleFormClose = () => {
        setShowForm(false);
    };

    /**
     * Creates a new brew entry via the API and updates the local state.
     * @param newBrew - The new brew data to be created
     */
    const handleAddBrew = async (newBrew: NewBrew) => {
        try {
            setIsLoading(true);
            const createdBrew = await api.createBrew(newBrew);
            setBrews([createdBrew, ...brews]);
            setShowForm(false);
            setError(null);
        } catch (err) {
            setError('Failed to add brew. Please try again.');
            console.error('Error adding brew:', err);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Deletes a brew entry by ID and updates the local state.
     * @param id - The ID of the brew to delete
     */
    const handleDeleteBrew = async (id: number) => {
        try {
            await api.deleteBrew(id);
            setBrews(brews.filter(brew => brew.id !== id));
            setError(null);
        } catch (err) {
            setError('Failed to delete brew. Please try again.');
            console.error('Error deleting brew:', err);
        }
    };

    return (
        <div className="container">
            <h1>BrewLog: Your Coffee Journey</h1>
            {error && <div className="error-message">{error}</div>}
            {isLoading ? (
                <div className="loading">Loading your brews...</div>
            ) : (
                <BrewList brews={brews} onDeleteBrew={handleDeleteBrew} />
            )}
            <button className="add-brew-button" onClick={handleAddBrewClick}>+</button>
            {showForm && <AddBrewForm onClose={handleFormClose} onAddBrew={handleAddBrew} />}
        </div>
    );
}

export default App;