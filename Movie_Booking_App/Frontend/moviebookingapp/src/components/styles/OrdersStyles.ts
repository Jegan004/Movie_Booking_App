import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-image: url('https://img.freepik.com/free-photo/videotape-with-3d-glasses-cinema-tickets_23-2148133564.jpg?t=st=1739430676~exp=1739434276~hmac=b854b7767f2fc707d40c1799238bd75b59f7dd8570255b569749c885173b4526&w=1380');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: -1;
  }
`;

export const OrdersContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background: #1e1e1e;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const Title = styled.h2`
  text-align: center;
  color: #e50914;
  font-size: 28px;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

export const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const OrderCard = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background: #282828;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const MovieImage = styled.img`
  width: 80px;
  height: 120px;
  border-radius: 5px;
  margin-right: 15px;
  object-fit: cover;

  @media (max-width: 480px) {
    width: 60px;
    height: 90px;
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

export const OrderDetails = styled.div`
  flex-grow: 1;
`;

export const DetailText = styled.p`
  margin: 5px 0;
  font-size: 14px;
  word-wrap: break-word;

  span {
    font-weight: bold;
    color: #e50914;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const ErrorMessage = styled.p`
  text-align: center;
  color: red;
  font-size: 16px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const LoadingMessage = styled.p`
  text-align: center;
  color: #fff;
  font-size: 16px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;
