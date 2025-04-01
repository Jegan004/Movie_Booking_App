import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  OrdersContainer,
  Container,
  Title,
  OrderList,
  OrderCard,
  MovieImage,
  OrderDetails,
  DetailText,
  ErrorMessage,
  LoadingMessage,
} from "../styles/OrdersStyles";

interface OrderModel {
  Id: string;
  MovieTitle: string;
  MovieImage: string;
  Showtime: string;
  TicketCount: number;
  TotalPrice: number;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5233/api/bookings/user/${userId}`
        );
        //console.log("[DEBUG] API Response:", response.data);

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response format from bookings API.");
        }

        const formattedOrders = response.data.map((order: any) => {
         // console.log("[DEBUG] Showtime:", order.Showtime); 
          const showDateTime = new Date(order.Showtime);
          const showDate = showDateTime.toLocaleDateString("en-GB"); 
          const showTime = showDateTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        
          return {
            Id: order.Id,
            MovieTitle: order.MovieTitle,
            MovieImage: `data:image/jpeg;base64,${order.MovieImage}`,
            Showtime: `${showDate} at ${showTime}`,
            TicketCount: order.TicketCount,
            TotalPrice: order.TotalPrice,
          };
        });
        

        setOrders(formattedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Book Movies to view your Bookings .");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container>
    <OrdersContainer>
      <Title>🎫 Your Bookings</Title>
      {loading && <LoadingMessage>Loading your orders...</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && orders.length === 0 && (
        <ErrorMessage>No bookings found.</ErrorMessage>
      )}
      <OrderList>
        {orders.map((order) => (
          <OrderCard key={order.Id}>
            <MovieImage src={order.MovieImage} alt={order.MovieTitle} />
            <OrderDetails>
              <DetailText>
                🎬 <span>Movie:</span> {order.MovieTitle}
              </DetailText>
              <DetailText>
                📅 <span>Showtime:</span> {order.Showtime}
              </DetailText>
              <DetailText>
                🎫 <span>Tickets:</span> {order.TicketCount}
              </DetailText>
              <DetailText>
                💰 <span>Total Price:</span> ₹{order.TotalPrice}
              </DetailText>
            </OrderDetails>
          </OrderCard>
        ))}
      </OrderList>
    </OrdersContainer>
    </Container>
  );
};

export default OrdersPage;
