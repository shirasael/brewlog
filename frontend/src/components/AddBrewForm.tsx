import React, { useState, useEffect, useRef } from 'react';
import { type NewBrew } from '../services/api';
import styles from './AddBrewForm.module.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import dayjs from 'dayjs';

interface AddBrewFormProps {
    onClose: () => void;
    onAddBrew: (brew: NewBrew) => void;
}

export function AddBrewForm({ onClose, onAddBrew }: AddBrewFormProps) {
    const [beanType, setBeanType] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [brewType, setBrewType] = useState('');
    const [waterTemp, setWaterTemp] = useState('');
    const [weightIn, setWeightIn] = useState('');
    const [weightOut, setWeightOut] = useState('');
    const [brewTime, setBrewTime] = useState<dayjs.Dayjs | null>(dayjs().hour(0).minute(0).second(0));
    const [bloomTime, setBloomTime] = useState<string>('0');
    const [details, setDetails] = useState('');
    const [customBrewType, setCustomBrewType] = useState('');
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const timePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
                setIsTimePickerOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedBrewTime = brewTime ? 
            `${brewTime.minute().toString().padStart(2, '0')}:${brewTime.second().toString().padStart(2, '0')}` : 
            '00:00';
        
        const newBrew: NewBrew = {
            beanType,
            imageUrl,
            brewType: brewType === 'custom' ? customBrewType : brewType,
            waterTemp: parseFloat(waterTemp),
            weightIn: parseFloat(weightIn),
            weightOut: parseFloat(weightOut),
            brewTime: formattedBrewTime,
            bloomTime: parseInt(bloomTime) || 0,
            details: details || undefined
        };
        onAddBrew(newBrew);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.addBrewForm} onClick={(e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        }}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Add New Brew</h2>
                
                <label className={styles.label}>
                    Beans:
                    <input
                        type="text"
                        className={styles.input}
                        value={beanType}
                        onChange={(e) => setBeanType(e.target.value)}
                        placeholder="e.g., Ethiopian Yirgacheffe"
                        required
                    />
                </label>

                <label className={styles.label}>
                    Image:
                    <input
                        type="file"
                        accept="image/*"
                        className={styles.input}
                        onChange={handleImageUpload}
                    />
                    <span className={styles.helperText}>
                        upload an image or take a photo
                    </span>
                </label>

                <label className={styles.label}>
                    Brew Type:
                    <select 
                        className={styles.input}
                        value={brewType === 'custom' ? 'custom' : brewType} 
                        onChange={(e) => setBrewType(e.target.value)} 
                        required 
                    >
                        <option value="">Select a brew method</option>
                        <option value="V60">V60</option>
                        <option value="Espresso">Espresso</option>
                        <option value="Aeropress">Aeropress</option>
                        <option value="French Press">French Press</option>
                        <option value="Chemex">Chemex</option>
                        <option value="Kalita Wave">Kalita Wave</option>
                        <option value="Moka Pot">Moka Pot</option>
                        <option value="Cold Brew">Cold Brew</option>
                        <option value="custom">Other</option>
                    </select>
                    {brewType === 'custom' && (
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Enter custom brew method"
                            value={customBrewType}
                            onChange={(e) => setCustomBrewType(e.target.value)}
                            required
                        />
                    )}
                </label>

                <label className={styles.label}>
                    Water Temperature (°C):
                    <input
                        type="number"
                        className={styles.input}
                        value={waterTemp}
                        onChange={(e) => setWaterTemp(e.target.value)}
                        placeholder="e.g., 93"
                        required
                        step="0.1"
                    />
                </label>

                <label className={styles.label}>
                    Weight In (g):
                    <input
                        type="number"
                        className={styles.input}
                        value={weightIn}
                        onChange={(e) => setWeightIn(e.target.value)}
                        placeholder="e.g., 18"
                        required
                        step="0.1"
                    />
                </label>

                <label className={styles.label}>
                    Weight Out (g):
                    <input
                        type="number"
                        className={styles.input}
                        value={weightOut}
                        onChange={(e) => setWeightOut(e.target.value)}
                        placeholder="e.g., 36"
                        required
                        step="0.1"
                    />
                </label>

                <label className={styles.label}>
                    Brew Time:
                    <div className={styles.timeInput} ref={timePickerRef}>
                        <input
                            type="text"
                            className={styles.input}
                            value={brewTime ? 
                                `${brewTime.minute().toString().padStart(2, '0')}:${brewTime.second().toString().padStart(2, '0')}` : 
                                '00:00'
                            }
                            readOnly
                            required
                            onClick={() => setIsTimePickerOpen(true)}
                        />
                        <div className={`${styles.timePickerContainer} ${isTimePickerOpen ? styles.show : ''}`}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MultiSectionDigitalClock
                                    value={brewTime}
                                    onChange={(newValue) => setBrewTime(newValue)}
                                    timeSteps={{ minutes: 1, seconds: 1 }}
                                    views={['minutes', 'seconds']}
                                    autoFocus
                                />
                            </LocalizationProvider>
                            <button
                                type="button"
                                className={styles.doneButton}
                                onClick={() => setIsTimePickerOpen(false)}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </label>

                <label className={styles.label}>
                    Bloom Time (seconds):
                    <input
                        type="number"
                        className={styles.input}
                        value={bloomTime}
                        onChange={(e) => setBloomTime(e.target.value)}
                        placeholder="e.g., 30"
                        min="0"
                    />
                </label>

                <label className={styles.label}>
                    Details:
                    <textarea
                        className={styles.textarea}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Add any additional notes about your brew"
                        rows={3}
                    />
                </label>

                <div className={styles.buttonGroup}>
                    <button type="button" onClick={onClose} className={styles.cancelButton}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.submitButton}>
                        Add Brew
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddBrewForm;