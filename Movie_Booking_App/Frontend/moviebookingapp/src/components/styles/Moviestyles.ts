import styled from 'styled-components';

export const MoviesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  justify-content: center;
  width: 90%;
  height:100%;
`;

export const MovieCard = styled.div`
  width: 200px;
  margin: 15px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

export const MovieImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: fill;
`;

export const MovieImage1 = styled.img`
  width: 100%;
  height: 300px;
  object-fit: contain;
`;

export const MovieInfo = styled.div`
  padding: 15px;
`;

export const MovieTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  position: relative;

  &:hover {
    white-space: normal;  
    overflow: visible;    
    text-overflow: unset; 
  }
`;

export const MovieGenre = styled.p`
  font-size: 1rem;
  color: #777;
`;

export const Button = styled.button<{ isSelected?: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? 'rgb(188, 11, 11)' : '#4c00b4')};
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
  font-size: 1.1rem;

  &:hover {
    background-color:rgb(188, 11, 11);
  }

  &:active {
    background-color: #37007a;
    transform: translateY(2px);
  }

  &:focus {
    outline: none;
  }
`;

export const GenreButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
  flex-wrap: wrap;
  gap:10px
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MovieDetailsModal = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 60%;
  text-align: center;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;

  h2 {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.1rem;
    margin: 10px 0;
  }
`;

export const ModalContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #e74c3c;
  }
`;

export const MovieDescription = styled.p`
  font-size: 1.1rem;
  margin: 20px 0;
  color: #555;
`;

export const MovieRating = styled.p`
  font-size: 1.2rem;
  color: #f39c12;
  font-weight: bold;
  margin-top: 10px;
`;
