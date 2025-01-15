import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import App from '../components/App';

// Mock TimePicker component
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

// Mock BrewItem component
jest.mock('../components/BrewItem', () => {
    return function MockBrewItem({ id, beanType, brewType, waterTemp, weightIn, weightOut, brewTime, bloomTime, details }: any) {
        return (
            <div data-testid="brew-item" key={id}>
                <div>{beanType}</div>
                <div>{brewType}</div>
                <div>{waterTemp}°C</div>
                <div>{weightIn}g</div>
                <div>{weightOut}g</div>
                <div>{brewTime}</div>
                {bloomTime > 0 && <div>{bloomTime}s</div>}
                {details && <div>{details}</div>}
            </div>
        );
    };
});

describe('App', () => {
  const mockSuccessResponse = {
    ok: true,
    json: () => Promise.resolve([])
  };

  beforeEach(() => {
    // Mock fetch globally before each test with a default success response
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockSuccessResponse));
  });

  afterEach(() => {
    // Clean up after each test
    jest.restoreAllMocks();
  });

  it('renders the app title', async () => {
    await act(async () => {
      render(<App />);
      // Wait for initial data fetch
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(screen.getByText(/brewlog: your coffee journey/i)).toBeInTheDocument();
  });

  it('shows add brew form when + button is clicked', async () => {
    await act(async () => {
      render(<App />);
      // Wait for initial data fetch
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Initially, form should not be visible
    expect(screen.queryByText(/add new brew/i)).not.toBeInTheDocument();
    
    // Click the + button
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    
    // Form should now be visible
    expect(screen.getByText(/add new brew/i)).toBeInTheDocument();
  });

  it('adds a new brew and updates the list', async () => {
    // Mock the API calls
    const mockBrew = {
      id: 1,
      bean_type: 'Test Bean',
      brew_type: 'V60',
      water_temp: 95,
      weight_in: 20,
      weight_out: 40,
      brew_time: '02:00',
      bloom_time: 30,
      details: 'Test details',
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: null
    };

    let brews: any[] = [];

    (global.fetch as jest.Mock).mockImplementation(async (url, options) => {
      if (url.toString().endsWith('/brews/')) {
        if (options?.method === 'POST') {
          brews.push(mockBrew);
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockBrew)
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(brews)
        });
      }
      throw new Error('Unhandled request');
    });

    // Render app and wait for initial load
    await act(async () => {
      render(<App />);
      // Wait for initial data fetch
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Wait for empty state to be shown
    expect(screen.getByText(/no brews yet/i)).toBeInTheDocument();
    
    // Open the form
    const addButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addButton);
    
    // Wait for form to be visible
    await screen.findByText(/add new brew/i);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/beans/i), {
      target: { value: 'Test Bean' }
    });
    fireEvent.change(screen.getByLabelText(/brew type/i), {
      target: { value: 'V60' }
    });
    fireEvent.change(screen.getByLabelText(/water temp/i), {
      target: { value: '95' }
    });
    fireEvent.change(screen.getByLabelText(/weight in/i), {
      target: { value: '20' }
    });
    fireEvent.change(screen.getByLabelText(/weight out/i), {
      target: { value: '40' }
    });
    
    // Set brew time using digital clock
    fireEvent.click(screen.getByLabelText(/brew time/i));
    const clockInput = screen.getByTestId('digital-clock-input');
    fireEvent.change(clockInput, { target: { value: '2:00' } });
    fireEvent.click(screen.getByText('Done'));
    
    fireEvent.change(screen.getByLabelText(/bloom time/i), {
      target: { value: '30' }
    });
    fireEvent.change(screen.getByLabelText(/details/i), {
      target: { value: 'Test details' }
    });
    
    // Submit the form and wait for updates
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add brew/i }));
      // Wait for POST request and state updates
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Wait for the brew to appear and verify its details
    const brewItem = await screen.findByTestId('brew-item');
    expect(brewItem).toHaveTextContent('Test Bean');
    expect(brewItem).toHaveTextContent('V60');
    expect(brewItem).toHaveTextContent('95°C');
    expect(brewItem).toHaveTextContent('20g');
    expect(brewItem).toHaveTextContent('40g');
    expect(brewItem).toHaveTextContent('02:00');
    expect(brewItem).toHaveTextContent('30s');
    expect(brewItem).toHaveTextContent('Test details');
    
    // Form should be closed
    expect(screen.queryByText(/add new brew/i)).not.toBeInTheDocument();
  });

  it('closes form when cancel is clicked', async () => {
    await act(async () => {
      render(<App />);
      // Wait for initial data fetch
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Open the form
    const addButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addButton);
    
    // Wait for form to be visible
    await screen.findByText(/add new brew/i);
    
    // Click cancel
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    // Form should be closed
    expect(screen.queryByText(/add new brew/i)).not.toBeInTheDocument();
  });
}); 