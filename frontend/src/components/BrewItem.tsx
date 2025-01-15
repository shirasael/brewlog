import React, { useState, useRef, useEffect } from 'react';
import styles from './BrewItem.module.css';
import DeleteConfirmation from './DeleteConfirmation';

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

// Sample coffee bag images for different origins
const defaultImages: { [key: string]: string } = {
    'Ethiopian': 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    'Colombian': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    'Brazilian': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    'default': 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
};

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
    onDelete
}) => {
    const [startX, setStartX] = useState<number | null>(null);
    const [currentX, setCurrentX] = useState<number>(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!startX) return;
        const diff = startX - e.touches[0].clientX;
        const newX = Math.min(Math.max(-diff, -100), 0); // Limit swipe to -100px
        setCurrentX(newX);
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        onDelete(id);
        setShowDeleteConfirm(false);
        setCurrentX(0);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setCurrentX(0);
    };

    const handleTouchEnd = () => {
        if (currentX < -50) { // If swiped more than 50px, show delete confirmation
            setShowDeleteConfirm(true);
        } else {
            setCurrentX(0); // Reset position
        }
        setStartX(null);
        setIsSwiping(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isSwiping && itemRef.current && !itemRef.current.contains(e.target as Node)) {
                setCurrentX(0);
                setIsSwiping(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSwiping]);

    const formatTime = (time: string | number) => {
        const timeStr = time.toString();
        if (timeStr.includes(':') || timeStr.includes('s') || timeStr === 'N/A') {
            return timeStr;
        }
        return `${timeStr}s`;
    };

    // Choose image based on bean type or use provided URL
    const getImage = () => {
        if (imageUrl && !imageUrl.includes('placeholder')) {
            return imageUrl;
        }
        // Check if the bean type contains any of our known origins
        const origin = Object.keys(defaultImages).find(key => 
            beanType.toLowerCase().includes(key.toLowerCase())
        );
        return defaultImages[origin || 'default'];
    };

    const transform = {
        transform: `translateX(${currentX}px)`,
        transition: isSwiping ? 'none' : 'transform 0.3s ease'
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
                                    ×
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
                <div className={styles.deleteIndicator}>
                    Delete
                </div>
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