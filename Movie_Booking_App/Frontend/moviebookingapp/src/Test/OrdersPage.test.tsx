import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import OrdersPage from '../components/pages/OrdersPage';

jest.mock('axios');

describe('OrdersPage', () => {


  beforeEach(() => {
    localStorage.setItem('userId', 'testUserId');
    jest.clearAllMocks();
  });

  it('should render loading message initially', () => {
    render(<OrdersPage />);
    expect(screen.getByText('Loading your orders...')).toBeInTheDocument();
  });

  it('should render error message if user is not logged in', async () => {
    localStorage.removeItem('userId');
    render(<OrdersPage />);
    await waitFor(() => expect(screen.getByText('User not logged in.')).toBeInTheDocument());
  });

  it('should render error message if API call fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(<OrdersPage />);
    await waitFor(() => expect(screen.getByText('Book Movies to view your Bookings .')).toBeInTheDocument());
  });

  it('should render no bookings message if no orders are found', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: [] });
    render(<OrdersPage />);
    await waitFor(() => expect(screen.getByText('No bookings found.')).toBeInTheDocument());
  });

  
});