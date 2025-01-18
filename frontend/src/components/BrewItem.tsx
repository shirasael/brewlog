import React, { useState, useRef, useEffect } from "react";
import styles from "./BrewItem.module.css";
import DeleteConfirmation from "./DeleteConfirmation";

/**
 * Props interface for the BrewItem component.
 * @interface BrewItemProps
 * @property {number} id - Unique identifier for the brew
 * @property {string} beanType - Type/origin of coffee beans used
 * @property {string | null} imageUrl - Optional URL for brew image
 * @property {string} brewType - Method of brewing (e.g., 'Pour Over', 'Espresso')
 * @property {number} waterTemp - Water temperature in Celsius
 * @property {number} weightIn - Input coffee weight in grams
 * @property {number} weightOut - Output coffee weight in grams
 * @property {string} brewTime - Total brewing time
 * @property {number} bloomTime - Coffee bloom time in seconds
 * @property {string} [details] - Optional additional brewing notes
 * @property {Function} onDelete - Callback function for brew deletion
 */
interface BrewItemProps {
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
  onDelete: (id: number) => void;
}

/**
 * Default coffee bean images mapped by origin
 */
const defaultImages: { [key: string]: string } = {
  Ethiopian:
    "https://images.unsplash.com/photo-1610632380989-680fe40816c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  Colombian:
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  Brazilian:
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  default:
    "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
};

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

/**
 * Component for displaying individual brew records with swipe-to-delete functionality.
 * Includes brew details, image, and interactive delete confirmation.
 * @component
 */
const BrewItem: React.FC<BrewItemProps> = ({
  id,
  beanType,
  imageUrl,
  brewType,
  waterTemp,
  weightIn,
  weightOut,
  brewTime,
  bloomTime,
  details,
  onDelete,
}) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Handles the start of a touch event for swipe functionality
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  /**
   * Handles touch movement for swipe animation
   * Limits swipe distance to -100px
   */
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX) return;
    const diff = startX - e.touches[0].clientX;
    const newX = Math.min(Math.max(-diff, -100), 0);
    setCurrentX(newX);
  };

  /** Initiates the delete confirmation dialog */
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  /** Confirms and executes brew deletion */
  const handleConfirmDelete = () => {
    onDelete(id);
    setShowDeleteConfirm(false);
    setCurrentX(0);
  };

  /** Cancels the delete operation */
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setCurrentX(0);
  };

  /**
   * Handles the end of a touch event
   * Shows delete confirmation if swiped more than 50px
   */
  const handleTouchEnd = () => {
    if (currentX < -50) {
      setShowDeleteConfirm(true);
    } else {
      setCurrentX(0);
    }
    setStartX(null);
    setIsSwiping(false);
  };

  useEffect(() => {
    /**
     * Handles clicks outside the brew item to reset swipe state
     */
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isSwiping &&
        itemRef.current &&
        !itemRef.current.contains(e.target as Node)
      ) {
        setCurrentX(0);
        setIsSwiping(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSwiping]);

  /**
   * Formats time values to include 's' suffix if needed
   * @param time - Time value to format
   * @returns Formatted time string
   */
  const formatTime = (time: string | number) => {
    const timeStr = time.toString();
    if (timeStr.includes(":") || timeStr.includes("s") || timeStr === "N/A") {
      return timeStr;
    }
    return `${timeStr}s`;
  };

  /**
   * Selects appropriate image based on bean type or provided URL
   * Falls back to default image if no matches found
   * @returns URL of the selected image
   */
  const getImage = () => {
    if (imageUrl && !imageUrl.includes("placeholder")) {
      return imageUrl;
    }
    const origin = Object.keys(defaultImages).find((key) =>
      beanType.toLowerCase().includes(key.toLowerCase()),
    );
    return defaultImages[origin || "default"];
  };

  const transform = {
    transform: `translateX(${currentX}px)`,
    transition: isSwiping ? "none" : "transform 0.3s ease",
  };

  return (
    <>
      <div className={styles.brewItemContainer} ref={itemRef}>
        <div
          className={styles.brewItem}
          data-testid="brew-item"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={transform}
        >
          <div className={styles.imageContainer}>
            <img
              src={getImage()}
              alt={`${beanType} coffee beans`}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <h2 className={styles.title}>{beanType}</h2>
              <div className={styles.headerActions}>
                <span className={styles.brewType}>{brewType}</span>
                <button
                  className={styles.deleteButton}
                  onClick={handleDelete}
                  aria-label="Delete brew"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Weight In</span>
                <span className={styles.statValue}>{weightIn}g</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Water Temp</span>
                <span className={styles.statValue}>{waterTemp}°C</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Weight Out</span>
                <span className={styles.statValue}>{weightOut}g</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Brew Time</span>
                <span className={styles.statValue}>{formatTime(brewTime)}</span>
              </div>
            </div>

            {(bloomTime > 0 || details) && (
              <div className={styles.infoSection}>
                {bloomTime > 0 && (
                  <div className={styles.bloomTime}>
                    Bloom Time: {formatTime(bloomTime)}
                  </div>
                )}
                {details && <p className={styles.details}>{details}</p>}
              </div>
            )}
          </div>
        </div>
        <div className={styles.deleteIndicator}>Delete</div>
      </div>
      {showDeleteConfirm && (
        <DeleteConfirmation
          beanType={beanType}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default BrewItem;
