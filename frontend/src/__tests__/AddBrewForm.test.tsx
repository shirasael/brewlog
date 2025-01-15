import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { act } from 'react';
import AddBrewForm from '../components/AddBrewForm';
import dayjs from 'dayjs';

// Mock MultiSectionDigitalClock component
jest.mock('@mui/x-date-pickers/MultiSectionDigitalClock', () => ({
    MultiSectionDigitalClock: ({ value, onChange }: any) => {
        const mockDayjs = require('dayjs');
        return (
            <div data-testid="digital-clock">
                <input
                    type="text"
                    value={value ? `${value.minute().toString().padStart(2, '0')}:${value.second().toString().padStart(2, '0')}` : '00:00'}
                    onChange={(e) => {
                        const [min, sec] = e.target.value.split(':').map(Number);
                        const newValue = mockDayjs().hour(0).minute(min).second(sec);
                        onChange(newValue);
                    }}
                    data-testid="digital-clock-input"
                />
            </div>
        );
    }
}));

// Mock LocalizationProvider
jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
    LocalizationProvider: ({ children }: any) => <>{children}</>
}));

describe('AddBrewForm', () => {
  const mockOnAddBrew = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('handles brew time input correctly', () => {
    render(<AddBrewForm onClose={mockOnClose} onAddBrew={mockOnAddBrew} />);
    
    // Initially time picker should be hidden
    const timePickerContainer = screen.getByTestId('digital-clock').parentElement;
    expect(timePickerContainer).toHaveClass('timePickerContainer');
    expect(timePickerContainer).not.toHaveClass('show');
    
    // Click time input to show picker
    fireEvent.click(screen.getByLabelText(/brew time/i));
    expect(timePickerContainer).toHaveClass('show');
    
    // Set time using digital clock
    const clockInput = screen.getByTestId('digital-clock-input');
    fireEvent.change(clockInput, { target: { value: '2:30' } });
    
    // Click done to close picker
    fireEvent.click(screen.getByText('Done'));
    expect(timePickerContainer).not.toHaveClass('show');
    
    // Check if time is displayed correctly
    const timeInput = screen.getByLabelText(/brew time/i);
    expect(timeInput).toHaveValue('02:30');
  });

  it('closes time picker when clicking outside', () => {
    render(<AddBrewForm onClose={mockOnClose} onAddBrew={mockOnAddBrew} />);
    
    // Open time picker
    fireEvent.click(screen.getByLabelText(/brew time/i));
    const timePickerContainer = screen.getByTestId('digital-clock').parentElement;
    expect(timePickerContainer).toHaveClass('show');
    
    // Click outside
    fireEvent.mouseDown(document.body);
    expect(timePickerContainer).not.toHaveClass('show');
  });

  it('submits form with correct brew time format', () => {
    render(<AddBrewForm onClose={mockOnClose} onAddBrew={mockOnAddBrew} />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/beans/i), { target: { value: 'Test Bean' } });
    fireEvent.change(screen.getByLabelText(/brew type/i), { target: { value: 'V60' } });
    fireEvent.change(screen.getByLabelText(/water temp/i), { target: { value: '95' } });
    fireEvent.change(screen.getByLabelText(/weight in/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/weight out/i), { target: { value: '40' } });
    
    // Set brew time
    fireEvent.click(screen.getByLabelText(/brew time/i));
    const clockInput = screen.getByTestId('digital-clock-input');
    fireEvent.change(clockInput, { target: { value: '2:30' } });
    fireEvent.click(screen.getByText('Done'));
    
    // Submit form
    fireEvent.click(screen.getByText(/add brew/i));
    
    expect(mockOnAddBrew).toHaveBeenCalledWith({
      beanType: 'Test Bean',
      brewType: 'V60',
      waterTemp: 95,
      weightIn: 20,
      weightOut: 40,
      brewTime: '02:30',
      bloomTime: 0,
      details: undefined,
      imageUrl: null
    });
  });

  it('renders the form with all inputs', () => {
    act(() => {
      render(<AddBrewForm onAddBrew={mockOnAddBrew} onClose={mockOnClose} />);
    });

    expect(screen.getByLabelText(/beans/i)).toBeInTheDocument();
    expect(screen.getByText(/upload an image or take a photo/i)).toBeInTheDocument();
    
    // Check brew type select and its options
    const brewTypeSelect = screen.getByLabelText(/brew type/i) as HTMLSelectElement;
    expect(brewTypeSelect).toBeInTheDocument();
    expect(brewTypeSelect.options[0].text).toBe('Select a brew method');
    expect(brewTypeSelect.options[1].text).toBe('V60');
    expect(brewTypeSelect.options[2].text).toBe('Espresso');
    expect(brewTypeSelect.options[brewTypeSelect.options.length - 1].text).toBe('Other');
    
    expect(screen.getByLabelText(/water temp/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight out/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/brew time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bloom time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/details/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add brew/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<AddBrewForm onAddBrew={mockOnAddBrew} onClose={mockOnClose} />);
    
    // Find the cancel button by its class and text content
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 