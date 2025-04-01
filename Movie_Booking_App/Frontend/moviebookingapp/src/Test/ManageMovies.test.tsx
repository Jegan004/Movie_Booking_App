import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManageMovies from '../components/pages/ManageMovies';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(() => {
  global.URL.createObjectURL = jest.fn();
});

describe('ManageMovies Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form inputs and button', () => {
    render(<ManageMovies />);

    expect(screen.getByTestId('text')).toBeInTheDocument();
    expect(screen.getByTestId('movie-description')).toBeInTheDocument();
    expect(screen.getByTestId('date')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });

  test('allows input values to be updated', () => {
    render(<ManageMovies />);

    fireEvent.change(screen.getByTestId('text'), { target: { value: 'New Movie' } });
    expect(screen.getByTestId('text')).toHaveValue('New Movie');

    fireEvent.change(screen.getByTestId('movie-description'), { target: { value: 'Great movie description' } });
    expect(screen.getByTestId('movie-description')).toHaveValue('Great movie description');

    fireEvent.change(screen.getByTestId('date'), { target: { value: '2025-02-20' } });
    expect(screen.getByTestId('date')).toHaveValue('2025-02-20');
  });

  test('allows genre selection', () => {
    render(<ManageMovies />);
    const actionButton = screen.getByTestId('genre-action');
    fireEvent.click(actionButton);
    console.log(window.getComputedStyle(actionButton).backgroundColor);
    expect(window.getComputedStyle(actionButton).backgroundColor).toBe('rgb(255, 69, 0)');
  });
  

  test('submits the form successfully', async () => {
    mockedAxios.post.mockResolvedValue({ status: 201 });

    render(<ManageMovies />);
    fireEvent.change(screen.getByTestId('text'), { target: { value: 'Sample Movie' } });
    fireEvent.change(screen.getByTestId('movie-description'), { target: { value: 'This is a sample description' } });
    fireEvent.change(screen.getByTestId('date'), { target: { value: '2025-02-20' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Upcoming' } });
    const actionGenreButton = screen.getByTestId('genre-action');
    fireEvent.click(actionGenreButton);
    const file = new File(['image-content'], 'movie-poster.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/choose image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByTestId('button'));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    const formData = mockedAxios.post.mock.calls[0][1] as FormData;
    expect(formData.get('Title')).toBe('Sample Movie');
    expect(formData.get('Description')).toBe('This is a sample description');
    expect(formData.get('ReleaseDate')).toBe('2025-02-20');
    expect(formData.get('Status')).toBe('Upcoming');
    expect(formData.get('Genres')).toBe('Action');
    expect(formData.get('ImageFile')).toBe(file);

  });

  test('shows an error alert when API call fails', async () => {
    mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Failed to add movie.' } } });
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<ManageMovies />);

    fireEvent.change(screen.getByTestId('text'), { target: { value: 'Sample Movie' } });
    fireEvent.change(screen.getByTestId('movie-description'), { target: { value: 'Description' } });
    fireEvent.change(screen.getByTestId('date'), { target: { value: '2025-02-20' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Now Showing' } });

    const actionGenreButton = screen.getByTestId('genre-action');
    fireEvent.click(actionGenreButton);

    const file = new File(['file'], 'poster.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/choose image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByTestId('button'));

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Failed to add movie.'));
    alertMock.mockRestore();
  });

  test('shows validation alert if required fields are missing', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<ManageMovies />);

    fireEvent.click(screen.getByTestId('button'));

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Please fill in all fields and upload an image.'));
    alertMock.mockRestore();
  });
  test('uploads an image and displays preview', () => {
    render(<ManageMovies />);

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/choose image/i);
   fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
  });
});
