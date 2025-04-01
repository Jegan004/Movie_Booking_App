import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import BookingPage from '../components/pages/BookingPage';
import userEvent from '@testing-library/user-event';
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockMovie = {
  Id: '1',
  Title: 'Test Movie',
  ImageUrl: 'testImageBase64',
  Genres: [{ Name: 'Action' }],
  Description: 'Test description',
};

describe('BookingPage', () => {
  const renderComponent = (movie = mockMovie) => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/booking', state: { movie } }]}>
        <Routes>
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/movies" element={<div>Movies Page</div>} />
          <Route path="/orders" element={<div>Orders Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders movie details and booking form', () => {
    renderComponent();

    expect(screen.getByTestId('movie-details')).toBeInTheDocument();
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Genre: Action')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByTestId('booking-form')).toBeInTheDocument();
  });

  it('displays alert and redirects if movie details are missing', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderComponent(null);
    expect(alertMock).toHaveBeenCalledWith('Movie details not found. Redirecting to Movies page.');
    alertMock.mockRestore();
  });

  it('submits the booking form successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({});
    localStorage.setItem('userId', '123');

    renderComponent();

    fireEvent.change(screen.getByTestId('date'), { target: { value: '2025-02-15' } });
    await userEvent.selectOptions(screen.getByTestId('timeslot'), "14:00:00");
    fireEvent.click(screen.getByTestId('confirm'));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('Orders Page')).toBeInTheDocument());
  });

  it('displays error alert if booking fails', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Booking failed'));
    localStorage.setItem('userId', '123');

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    renderComponent();

    fireEvent.change(screen.getByTestId('date'), { target: { value: '2025-02-15' } });
    fireEvent.change(screen.getByTestId('timeslot'), { target: { value: '10:00:00' } });

    fireEvent.click(screen.getByTestId('confirm'));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Booking failed. Please try again.'));

    alertMock.mockRestore();
  });

  it('updates ticket count and total price', () => {
    renderComponent();

    const decreaseButton = screen.getAllByRole('button')[0];
    const increaseButton = screen.getAllByRole('button')[1];

    fireEvent.click(increaseButton);
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(decreaseButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
