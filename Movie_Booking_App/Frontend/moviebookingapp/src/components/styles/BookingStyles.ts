import styled from "styled-components";

export const BookingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px ;
  opacity:0.8;
  
`;

export const BookingForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 15px;
  background:#fff;
  padding:20px;
  opacity: 1;
  brightness: 100%;

`;

export const Input = styled.input`
  padding: 10px;
  font-size: 16px;
`;

export const Select = styled.select`
  padding: 10px;
  font-size: 16px;
`;

export const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #ff5733;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #e64a19;
  }
`;

export const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CounterButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;
