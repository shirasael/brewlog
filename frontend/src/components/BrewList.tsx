import React from "react";
import BrewItem from "./BrewItem";
import styles from "./BrewList.module.css";
import { type Brew } from "../services/api";

/**
 * Props interface for the BrewList component.
 * @interface BrewListProps
 * @property {Brew[]} brews - Array of brew entries to display
 * @property {Function} onDeleteBrew - Callback function to handle brew deletion
 */
interface BrewListProps {
  brews: Brew[];
  onDeleteBrew: (id: number) => void;
}

/**
 * Displays a list of brew entries or an empty state message.
 * Renders individual BrewItem components for each brew in the list.
 * @component
 */
const BrewList: React.FC<BrewListProps> = ({ brews, onDeleteBrew }) => {
  if (brews.length === 0) {
    return (
      <div className={styles.brewList} data-testid="brew-list">
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>☕</div>
          <p className={styles.emptyStateText}>
            No brews yet. Time to make some coffee!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.brewList} data-testid="brew-list">
      {brews.map((brew) => (
        <BrewItem key={brew.id} {...brew} onDelete={onDeleteBrew} />
      ))}
    </div>
  );
};

export default BrewList;
