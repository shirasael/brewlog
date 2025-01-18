import React, { useState, useEffect } from "react";
import BrewList from "./BrewList";
import AddBrewForm from "./AddBrewForm";
import SearchBar from "./SearchBar";
import { api, type Brew, type NewBrew } from "../services/api";
import styles from "./App.module.css";

/**
 * Main application component for BrewLog.
 * Manages the state of coffee brews and provides functionality for CRUD operations.
 */
const App: React.FC = () => {
  const [brews, setBrews] = useState<Brew[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
      setError("Failed to load brews. Please try again later.");
      console.error("Error loading brews:", err);
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
      setError("Failed to add brew. Please try again.");
      console.error("Error adding brew:", err);
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
      setBrews(brews.filter((brew) => brew.id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete brew. Please try again.");
      console.error("Error deleting brew:", err);
    }
  };

  /**
   * Filters brews based on the search query.
   * Matches against bean type, brew type, and details.
   */
  const filteredBrews = brews.filter((brew) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      brew.beanType.toLowerCase().includes(searchLower) ||
      brew.brewType.toLowerCase().includes(searchLower) ||
      (brew.details?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.appTitle}>BrewLog: Your Coffee Journey</h1>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by bean type, brew method, or details..."
      />
      {isLoading ? (
        <div className={styles.loading}>Loading your brews...</div>
      ) : (
        <BrewList brews={filteredBrews} onDeleteBrew={handleDeleteBrew} />
      )}
      <button className={styles.addBrewButton} onClick={handleAddBrewClick}>
        +
      </button>
      {showForm && (
        <AddBrewForm onClose={handleFormClose} onAddBrew={handleAddBrew} />
      )}
    </div>
  );
};

export default App;
