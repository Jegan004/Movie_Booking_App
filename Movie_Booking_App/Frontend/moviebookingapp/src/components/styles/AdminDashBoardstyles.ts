import styled from "styled-components";

export const Container = styled.div`
  max-width: 1100px;
  margin: auto;
  padding: 30px;
  text-align: center;
//   background:rgb(190, 214, 237); 
 
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 25px;
  text-transform: uppercase;
  letter-spacing: 3px;
`;

export const Section = styled.div`
  margin-bottom: 35px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);\
  background:transparent;
`;

export const Card = styled.div`
  background: linear-gradient(135deg,rgb(252, 38, 38),rgb(241, 140, 231)); 
  padding: 20px;
  border-radius: 12px;
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
  text-align: center;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out;
   
  &:hover {
    transform: scale(1.05);
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
`;

export const TableHeader = styled.th`
//   background: #1e90ff;
background: linear-gradient(rgb(252, 38, 38),rgb(243, 80, 142)); 
  color: white;
  padding: 12px;
  font-size: 1rem;
  text-transform: uppercase;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f3f3f3;
  }

  &:hover {
    background: #e6f7ff;
    transition: background 0.3s ease-in-out;
  }
`;

export const TableCell = styled.td`
  padding: 12px;
  font-size: 1rem;
  color: #333;
  border-bottom: 1px solid #ddd;
`;

export const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
`;

export const MovieCard = styled.div`
  background: linear-gradient(rgb(252, 38, 38),rgb(236, 114, 189)); 
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out;

  h3 {
    font-size: 1.4rem;
    margin-bottom: 8px;
  }

  p {
    font-size: 1.1rem;
  }

  &:hover {
    transform: scale(1.1);
  }
`;
