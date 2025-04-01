import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios, { AxiosResponse } from "axios";
import FavoritesPage from '../components/pages/FavoritesPage';
import { BrowserRouter as Router } from "react-router-dom";
import { MovieModel } from '../components/pages/FavoritesPage'; // Adjust the import path as necessary
jest.mock("axios");

describe("FavoritesPage", () => {

    beforeEach(() => {

        localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidXNlckBnbWFpbC5jb20iLCJ1c2VySWQiOiI2N2FhZjkzNzQ3Mzk0YmIxNmQwOTJlODMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzM5MjYxNzcyLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MTk5LyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcxOTkvIn0.ghkYpVEhI5FK60hnR-b64NNUnRJ1kX1P1IVyR9A5shI");
    });

    afterEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it("should render loading state initially", () => {
        render(
            <Router>
                <FavoritesPage />
            </Router>
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("should render error state if the API request fails", async () => {
        // mockAxios.onGet("http://localhost:5233/api/favorites/user/1").reply(500);

        render(
            <Router>
                <FavoritesPage />
            </Router>
        );

        await waitFor(() => expect(screen.getByText(/failed to load favorites/i)).toBeInTheDocument());
    });

    it("should render the list of favorite movies", async () => {
        const mockFavorites: MovieModel[] = [
            {
                MovieId: "1",
                MovieTitle: "Movie 1",
                MovieImage: "/image1.jpg",
                Genres: [{ Name: "Action" }],
            },
            {
                MovieId: "2",
                MovieTitle: "Movie 2",
                MovieImage: "/image2.jpg",
                Genres: [{ Name: "Comedy" }],
            },
        ];

        const mockData: AxiosResponse = {
            data: mockFavorites,
            status: 200,
            statusText: "OK",
            headers: undefined,
            config: undefined
        };

        (axios.get as jest.Mock).mockResolvedValue(mockData);

        render(
            <Router>
                <FavoritesPage />
            </Router>
        );

        expect(axios.get).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
        expect(screen.getByText(/movie 1/i)).toBeInTheDocument();
        expect(screen.getByText(/movie 2/i)).toBeInTheDocument();
        expect(screen.getByText(/action/i)).toBeInTheDocument();
        expect(screen.getByText(/comedy/i)).toBeInTheDocument();
    });

    it("should remove a movie from favorites", async () => {
        const mockFavorites:MovieModel[] = [
            {
                MovieId: "1",
                MovieTitle: "Movie 1",
                MovieImage: "/image1.jpg",
                Genres: [{ Name: "Action" }],
            },
        ];

        const mockedAxios = axios as jest.Mocked<typeof axios>;

        const mockData: AxiosResponse = {
            data: mockFavorites,
            status: 200,
            statusText: "OK",
            headers: undefined,
            config: undefined
        };

        mockedAxios.get.mockResolvedValue(mockData);
        mockedAxios.delete.mockResolvedValue({ status: 200 });

        render(
            <Router>
                <FavoritesPage />
            </Router>
        );

        await waitFor(() => expect(screen.getByText(/movie 1/i)).toBeInTheDocument());

        fireEvent.click(screen.getByText(/remove from favorites/i));

        await waitFor(() => expect(screen.queryByText(/movie 1/i)).not.toBeInTheDocument());
    });

    it("should render empty message if no favorite movies", async () => {
        const mockFavorites:MovieModel[] = [
            
        ];

        const mockedAxios = axios as jest.Mocked<typeof axios>;

        const mockData: AxiosResponse = {
            data: mockFavorites,
            status: 200,
            statusText: "OK",
            headers: undefined,
            config: undefined
        };

        mockedAxios.get.mockResolvedValue(mockData);
        render(
            <Router>
                <FavoritesPage />
            </Router>
        );

        await waitFor(() => expect(screen.getByText(/No movies in your favorites/i)).toBeInTheDocument());
    });

    it("should handle invalid token in localStorage gracefully", () => {
        localStorage.setItem("token", "invalid.token");
        render(
            <Router>
                <FavoritesPage />
            </Router>
        );

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("should show an error when removing a movie from favorites fails", async () => {
        const mockFavorites = [
            {
                MovieId: "1",
                MovieTitle: "Movie 1",
                MovieImage: "/image1.jpg",
                Genres: [{ Name: "Action" }],
            },
        ];

        (axios.get as jest.Mock).mockResolvedValue({ data: mockFavorites });
        (axios.delete as jest.Mock).mockRejectedValue(new Error("Remove failed"));

        render(
            <Router>
                <FavoritesPage />
            </Router>
        );

        await waitFor(() => expect(screen.getByText(/movie 1/i)).toBeInTheDocument());

        fireEvent.click(screen.getByText(/remove from favorites/i));

        await waitFor(() => expect(screen.getByText(/movie 1/i)).toBeInTheDocument());
    });

    it("should render movie images and remove buttons for each movie", async () => {
        const mockFavorites = [
            {
                MovieId: "1",
                MovieTitle: "Movie 1",
                MovieImage: "base64encodedImage1",
                Genres: [{ Name: "Action" }],
            },
        ];

        (axios.get as jest.Mock).mockResolvedValue({ data: mockFavorites });

        render(
            <Router>
                <FavoritesPage />
            </Router>
        );

        await waitFor(() => expect(screen.getByText(/movie 1/i)).toBeInTheDocument());

        const movieImage = screen.getByAltText("Movie 1") as HTMLImageElement;
        expect(movieImage).toBeInTheDocument();
        expect(movieImage.src).toContain("data:image/jpeg;base64,base64encodedImage1");

        const removeButton = screen.getByText(/remove from favorites/i);
        expect(removeButton).toBeInTheDocument();
    });
  
});
