import React from "react";
import styles from "./SearchBar.module.css";

/**
 * Props interface for the SearchBar component.
 * @interface SearchBarProps
 * @property {string} value - Current search query value
 * @property {Function} onChange - Callback function when search query changes
 * @property {string} [placeholder] - Optional placeholder text for the search input
 */
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Search bar component for filtering brews.
 * Provides a styled input field with search icon and clear button.
 * 
 * @component
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="Search your brews..."
 * />
 * ```
 */
const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search brews by bean type, method..." 
}) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchIcon}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        type="text"
        className={styles.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search brews"
      />
      {value && (
        <button
          className={styles.clearButton}
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar; 