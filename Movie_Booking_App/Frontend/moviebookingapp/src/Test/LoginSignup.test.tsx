import { render, screen, fireEvent, waitFor,act } from '@testing-library/react';
import LoginSignup from '../components/pages/LoginSignup';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('axios');

const mockSetIsLoggedIn = jest.fn();
const mockSetUserRole = jest.fn();

const renderComponent = () => {
  render(
    <BrowserRouter>
      <LoginSignup setIsLoggedIn={mockSetIsLoggedIn} setUserRole={mockSetUserRole} />
    </BrowserRouter>
  );
};

describe('LoginSignup Component', () => {
  beforeEach(() => {
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidXNlckBnbWFpbC5jb20iLCJ1c2VySWQiOiI2N2FhZjkzNzQ3Mzk0YmIxNmQwOTJlODMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzM5MjYxNzcyLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MTk5LyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcxOTkvIn0.ghkYpVEhI5FK60hnR-b64NNUnRJ1kX1P1IVyR9A5shI");
});
  afterEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
    });
  

  it('renders login form initially', () => {
    renderComponent();
    const login= screen.getByTestId("action");
    expect(login).toBeInTheDocument();
    expect(login).toHaveTextContent("Login");
  });

  test("renders form fields", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("Email Id")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });
 
  it('switches to signup form', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Sign Up'));
    const signup= screen.getByTestId("action");
    expect(signup).toBeInTheDocument();
    expect(signup).toHaveTextContent("Sign Up");    
  });

  test("renders signup fields", () => {
    renderComponent();
    fireEvent.click(screen.getByText('Sign Up'));
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Id")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });
  it('validates email input', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Email Id'), { target: { value: 'invalidemail' } });
    fireEvent.click(screen.getByTestId('submit'));
    expect(screen.getByText('Please enter a valid email address!')).toBeInTheDocument();
  });

  it('validates password input', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Email Id'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByTestId('submit'));
    expect(screen.getByText('Password must be at least 6 characters long!')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockToken = 'mock.jwt.token';
    const mockResponse = { data: { Token: mockToken } };
    mockedAxios.post.mockResolvedValue(mockResponse);
    console.error = jest.fn();
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Email Id'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('submit'));
    
  });

  it('handles failed login', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Login failed'));

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Email Id'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('submit'));
    await waitFor(() => expect(screen.getByText('Invalid credentials, please try again!')).toBeInTheDocument());
  });

  it('clears input fields when switching forms', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Email Id'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('gray'));
    expect(screen.getByPlaceholderText('Email Id')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('');
  });

  it('shows an alert and clears input fields after successful signup', async () => {
    window.alert = jest.fn(); 
    mockedAxios.post.mockResolvedValue({ data: {} }); 
    renderComponent();
    fireEvent.click(screen.getByText('Sign Up'));
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email Id'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    const submitButton = screen.getByTestId('gray');
    fireEvent.click(submitButton);
    expect(screen.getByPlaceholderText('Email Id')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('');
    expect(screen.getByTestId('submit')).toBeInTheDocument();
  });

  it('displays error when name is empty during signup', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Sign Up'));
    fireEvent.change(screen.getByPlaceholderText('Email Id'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit'));

    expect(screen.getByText('Name is required!')).toBeInTheDocument();
  });

  it('clears error message when switching between forms', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Email Id'), { target: { value: 'invalidemail' } });
    fireEvent.click(screen.getByTestId('submit'));
    expect(screen.getByText('Please enter a valid email address!')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('gray'));
    expect(screen.queryByText('Please enter a valid email address!')).not.toBeInTheDocument();
  });

  it('persists role in localStorage after successful login', async () => {
    const mockResponse = { data: { Token: 'mock.jwt.token.with.role' } };
    mockedAxios.post.mockResolvedValue(mockResponse);
    jest.spyOn(window, 'atob').mockImplementation(() => JSON.stringify({
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'User'
    }));

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Email Id'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(localStorage.getItem('userRole')).toBe('User');
    });
  });

  it('handles network error during signup', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Network error'));

    renderComponent();
    fireEvent.click(screen.getByText('Sign Up'));
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email Id'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(screen.getByText('Error signing up, please try again!')).toBeInTheDocument();
    });
  });

  it('renders input images correctly', () => {
    renderComponent();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
  });
  it('renders input images of signuup correctly', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Sign Up'));
    expect(screen.getByTestId('userimg')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
  });
});
