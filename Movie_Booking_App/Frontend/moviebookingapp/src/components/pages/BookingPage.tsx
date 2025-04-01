import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookingContainer,
  BookingForm,
  Input,
  Select,
  Button,
  CounterContainer,
  CounterButton,
} from "../styles/BookingStyles";
import { MovieDetailsModal, MovieImage1 } from "../styles/Moviestyles";

interface MovieModel {
  Id: string;
  Title: string;
  ImageUrl: string;
  Genres?: { Name: string }[];
  Description: string;
}

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMovie = location.state?.movie || null;

  // const [selectedMovie, setSelectedMovie] = useState<MovieModel | null>(movieFromState);
  const [showDate, setShowDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [ticketCount, setTicketCount] = useState<number>(1);
  const ticketPrice = 190;
  const totalPrice = ticketCount * ticketPrice;
const today = new Date().toISOString().split("T")[0];
const maxDate = new Date();
maxDate.setDate(new Date().getDate() + 7);
  useEffect(() => {
    if (!selectedMovie || !selectedMovie.Title || !selectedMovie.ImageUrl) {
      alert("Movie details not found. Redirecting to Movies page.");
      navigate("/movies"); 
    }
  }, [selectedMovie, navigate]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMovie || !showDate || !timeSlot) {
      alert("Please fill in all fields.");
      return;
    }

    const formattedShowtime = new Date(`${showDate}T${timeSlot}`).toISOString();

    const bookingData = {
      userId: localStorage.getItem("userId"),
      movieId: selectedMovie.Id,
      showtime: formattedShowtime,
      ticketPrice,
      ticketCount,
      totalPrice,
    };

    try {
      await axios.post(
        `http://localhost:5233/api/bookings/${bookingData.userId}`,
        bookingData
      );
      alert("Booking successful!");
      navigate("/orders");
    } catch (error) {
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <BookingContainer data-testid="booking-page">
      {selectedMovie && (
        <>
          <MovieDetailsModal data-testid="movie-details">
            <MovieImage1 src={`data:image/jpeg;base64,${selectedMovie.ImageUrl}`} alt={selectedMovie.Title} data-testid="movie-image"/>
            <h2 data-testid="title">{selectedMovie.Title}</h2>
            <p data-testid={`genre-${selectedMovie.Genres?.map((g) => g.Name.toLowerCase()).join(", ")}`}>Genre: {selectedMovie.Genres?.map((g) => g.Name).join(", ")}</p>
            <p>{selectedMovie.Description}</p>
          </MovieDetailsModal>
            
          <h2 data-testid="bookticket">Book Your Ticket</h2>
          <BookingForm data-testid="booking-form" onSubmit={handleBooking} >
            <label data-testid="showdate" >Show Date:</label>
            <Input type="date" value={showDate} min={today} max={maxDate.toISOString().split("T")[0]} onChange={(e) => setShowDate(e.target.value)} required  data-testid="date"/>

            <label >Time Slot:</label>
            <Select data-testid="timeslot" value={timeSlot} onChange={(e) =>{ setTimeSlot(e.target.value)}} required>
              <option value="">Select a Time</option>
              <option value="10:00:00" data-testid="10:00">10:00 AM</option>
              <option value="14:00:00" data-testid="2:00">2:00 PM</option>
              <option value="18:00:00" data-testid="6:00">6:00 PM</option>
              <option value="21:00:00" data-testid="9:00">9:00 PM</option>
            </Select>

            <label data-testid="ticket">Tickets:</label>
            <CounterContainer data-testid="counter">
              <CounterButton type="button" onClick={() => setTicketCount((prev) => Math.max(1, prev - 1))}>-</CounterButton>
              <span>{ticketCount}</span>
              <CounterButton type="button" onClick={() => setTicketCount((prev) => prev + 1)}>+</CounterButton>
            </CounterContainer>

            <label data-testid="total">Total Price: ₹{totalPrice}</label>
            <Button type="submit" data-testid="confirm">Confirm Booking</Button>
          </BookingForm>
        </>
      )}
    </BookingContainer>
  );
};

export default BookingPage;
