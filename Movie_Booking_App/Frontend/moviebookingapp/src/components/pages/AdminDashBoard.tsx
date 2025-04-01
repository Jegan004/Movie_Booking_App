import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Title,
  Card,
  Section,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  MovieGrid,
  MovieCard,
} from "../styles/AdminDashBoardstyles";

interface User {
  UserId: string;
  Name: string;
  Email: string;
  BookingCount: number;
}

interface Movie {
  MovieId: string;
  Title: string;
  BookingCount: number;
}

const MetricsPage = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [mostBookedMovies, setMostBookedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const usersRes = await axios.get("http://localhost:5233/api/users/total-users");
        setTotalUsers(usersRes.data?.TotalUsers ?? 0);

        const topUsersRes = await axios.get("http://localhost:5233/api/users/top-users");
        const topUsersData = Array.isArray(topUsersRes.data) ? topUsersRes.data : [];
        setTopUsers(topUsersData);

        const moviesRes = await axios.get("http://localhost:5233/api/users/bookedmovies");
        const moviesData = Array.isArray(moviesRes.data) ? moviesRes.data : [];
        setMostBookedMovies(moviesData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setTopUsers([]); 
        setMostBookedMovies([]);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <Container>
      <Title>Platform Metrics</Title>
      <Section>
        <Card>Total Registered Users: {totalUsers}</Card>
      </Section>

      <Section>
        <h2>Top Users by Bookings</h2>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Bookings</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {topUsers.length > 0 ? (
              topUsers.map((user) => (
                <TableRow key={user.UserId}>
                  <TableCell>{user.Name}</TableCell>
                  <TableCell>{user.Email}</TableCell>
                  <TableCell>{user.BookingCount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No users found</TableCell>
              </TableRow>
            )}
          </tbody>
        </Table>
      </Section>

      <Section>
        <h2>Most Booked Movies</h2>
        <MovieGrid>
          {mostBookedMovies.length > 0 ? (
            mostBookedMovies.map((movie) => (
              <MovieCard key={movie.MovieId}>
                <h3>{movie.Title}</h3>
                <p>Bookings: {movie.BookingCount}</p>
              </MovieCard>
            ))
          ) : (
            <p>No movies found</p>
          )}
        </MovieGrid>
      </Section>
    </Container>
  );
};

export default MetricsPage;
