import { render, screen, waitFor } from '@testing-library/react';
import MetricsPage from '../components/pages/AdminDashBoard';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

jest.mock('axios');

describe('MetricsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders total registered users', async () => {
    (axios.get as jest.Mock).mockImplementation((url) => {
      switch (url) {
        case 'http://localhost:5233/api/users/total-users':
          return Promise.resolve({ data: { TotalUsers: 10 } });
        case 'http://localhost:5233/api/users/top-users':
          return Promise.resolve({ data: [] });
        case 'http://localhost:5233/api/users/bookedmovies':
          return Promise.resolve({ data: [] });
        default:
          return Promise.reject(new Error('Unexpected URL'));
      }
    });

    await act(async () => {
      render(<MetricsPage />);
    });

    expect(screen.getByText(/Total Registered Users: 10/i)).toBeInTheDocument();
  });

  test('renders top users by bookings', async () => {
    const mockUsers = [
      { UserId: '1', Name: 'John Doe', Email: 'john@example.com', BookingCount: 5 },
    ];

    (axios.get as jest.Mock).mockImplementation((url) => {
      switch (url) {
        case 'http://localhost:5233/api/users/total-users':
          return Promise.resolve({ data: { TotalUsers: 10 } });
        case 'http://localhost:5233/api/users/top-users':
          return Promise.resolve({ data: mockUsers });
        case 'http://localhost:5233/api/users/bookedmovies':
          return Promise.resolve({ data: [] });
        default:
          return Promise.reject(new Error('Unexpected URL'));
      }
    });

    await act(async () => {
      render(<MetricsPage />);
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('renders most booked movies', async () => {
    const mockMovies = [
      { MovieId: '1', Title: 'Movie A', BookingCount: 15 },
    ];

    (axios.get as jest.Mock).mockImplementation((url) => {
      switch (url) {
        case 'http://localhost:5233/api/users/total-users':
          return Promise.resolve({ data: { TotalUsers: 10 } });
        case 'http://localhost:5233/api/users/top-users':
          return Promise.resolve({ data: [] });
        case 'http://localhost:5233/api/users/bookedmovies':
          return Promise.resolve({ data: mockMovies });
        default:
          return Promise.reject(new Error('Unexpected URL'));
      }
    });

    await act(async () => {
      render(<MetricsPage />);
    });

    expect(screen.getByText('Movie A')).toBeInTheDocument();
    expect(screen.getByText('Bookings: 15')).toBeInTheDocument();
  });

  test('renders error fallback when API fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));

    await act(async () => {
      render(<MetricsPage />);
    });

    expect(screen.getByText('No users found')).toBeInTheDocument();
    expect(screen.getByText('No movies found')).toBeInTheDocument();
  });
});
