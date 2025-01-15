import React from 'react';
import BrewItem from './BrewItem';
import styles from './BrewList.module.css';
import { type Brew } from '../services/api';

interface BrewListProps {
    brews: Brew[];
    onDeleteBrew: (id: number) => void;
}

const BrewList: React.FC<BrewListProps> = ({ brews, onDeleteBrew }) => {
    if (brews.length === 0) {
        return (
            <div className={styles.brewList} data-testid="brew-list">
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>☕</div>
                    <p className={styles.emptyStateText}>No brews yet. Time to make some coffee!</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.brewList} data-testid="brew-list">
            {brews.map((brew) => (
                <BrewItem 
                    key={brew.id} 
                    {...brew} 
                    onDelete={onDeleteBrew}
                />
            ))}
        </div>
    );
};

export default BrewList;