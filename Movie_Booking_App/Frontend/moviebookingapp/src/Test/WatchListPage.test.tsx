import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios, { AxiosResponse } from "axios";
import WatchlistPage from '../components/pages/WatchList';
import { BrowserRouter as Router } from "react-router-dom";
import { MovieModel } from '../components/pages/WatchList';

jest.mock("axios");

describe("WatchlistPage", () => {
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
                <WatchlistPage />
            </Router>
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("should render error state if the API request fails", async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Failed to load watchlist"));

        render(
            <Router>
                <WatchlistPage />
            </Router>
        );

        await waitFor(() => expect(screen.getByText(/failed to load watchlist/i)).toBeInTheDocument());
    });

    it("should render the list of watchlist movies", async () => {
        const mockWatchlist: MovieModel[] = [
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
            data: mockWatchlist,
            status: 200,
            statusText: "OK",
            headers: undefined,
            config: undefined,
        };

        (axios.get as jest.Mock).mockResolvedValue(mockData);

        render(
            <Router>
                <WatchlistPage />
            </Router>
        );

        await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
        expect(screen.getByText(/movie 1/i)).toBeInTheDocument();
        expect(screen.getByText(/movie 2/i)).toBeInTheDocument();
        expect(screen.getByText(/action/i)).toBeInTheDocument();
        expect(screen.getByText(/comedy/i)).toBeInTheDocument();
    });

    it("should handle the 'Remove' button click", async () => {
        const mockWatchlist: MovieModel[] = [
            {
                MovieId: "1",
                MovieTitle: "Movie 1",
                MovieImage: "/image1.jpg",
                Genres: [{ Name: "Action" }],
            },
        ];

        const mockData: AxiosResponse = {
            data: mockWatchlist,
            status: 200,
            statusText: "OK",
            headers: undefined,
            config: undefined,
        };

        (axios.get as jest.Mock).mockResolvedValue(mockData);
        (axios.delete as jest.Mock).mockResolvedValue({ status: 200 });

        render(
            <Router>
                <WatchlistPage />
            </Router>
        );

        await waitFor(() => expect(screen.getByText(/movie 1/i)).toBeInTheDocument());

        fireEvent.click(screen.getByText(/remove/i));

        await waitFor(() => expect(screen.queryByText(/movie 1/i)).not.toBeInTheDocument());
    });

    it("should render empty message if no movies in the watchlist", async () => {
        const mockWatchlist: MovieModel[] = [];

        const mockData: AxiosResponse = {
            data: mockWatchlist,
            status: 200,
            statusText: "OK",
            headers: undefined,
            config: undefined,
        };

        (axios.get as jest.Mock).mockResolvedValue(mockData);

        render(
            <Router>
                <WatchlistPage />
            </Router>
        );

        await waitFor(() => expect(screen.getByText(/no movies in your watchlist/i)).toBeInTheDocument());
    });

    it("should handle missing Genres field in movie object", async () => {
        const mockWatchlist = [
          {
            MovieId: "1",
            MovieTitle: "Movie 1",
            MovieImage: "image1.jpg",
          },
        ];
    
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockWatchlist });
    
        render(
          <Router>
            <WatchlistPage />
          </Router>
        );
    
        await waitFor(() => expect(screen.getByText("Movie 1")).toBeInTheDocument());
        expect(screen.getByText(/Book Now/i)).toBeInTheDocument();
      });

      it("should handle empty or invalid token gracefully", () => {
        localStorage.setItem("token", "invalid-token");
    
        render(
          <Router>
            <WatchlistPage />
          </Router>
        );
    
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
      });

      
});
