import React, { useState, useEffect } from 'react';
import BrewList from './BrewList';
import AddBrewForm from './AddBrewForm';
import { api, type Brew, type NewBrew } from '../services/api';
import '../styles/App.css';

const App: React.FC = () => {
    const [brews, setBrews] = useState<Brew[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadBrews();
    }, []);

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

    const handleAddBrewClick = () => {
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
    };

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