import styled from "styled-components";

export const WatchlistContainer = styled.div`
  min-height: 100vh;
  background-image: url('https://img.freepik.com/free-photo/videotape-with-3d-glasses-cinema-tickets_23-2148133564.jpg?t=st=1739434276~exp=1739434276~hmac=b854b7767f2fc707d40c1799238bd75b59f7dd8570255b569749c885173b4526&w=1380');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 15px;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }
`;

export const Title = styled.h1`
  font-size: 3rem;
  color: #ffffff;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-weight: 800;
  letter-spacing: 2px;

  @media (max-width: 768px) {
    font-size: 2.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 25px;
  width: 100%;
  max-width: 1300px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

export const MovieCard = styled.div`
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.4);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 24px rgba(0, 0, 0, 0.6);
  }
`;

export const MovieImage = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: transform 0.3s ease, filter 0.3s ease;
  background-color: #1c1c1c;

  ${MovieCard}:hover & {
    transform: scale(1.05);
    filter: brightness(0.85);
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

export const MovieOverlay = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 12px;
  transition: transform 0.3s ease;
  transform: translateY(100%);

  ${MovieCard}:hover & {
    transform: translateY(0);
  }
`;

export const MovieTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 5px;
`;

export const MovieGenre = styled.p`
  font-size: 14px;
  color: #f39c12;
  font-weight: bold;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
`;

export const ActionButton = styled.button`
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #ff3b3f;
    transform: translateY(-2px);
  }

  &:nth-child(2) {
    background-color: #2ecc71;

    &:hover {
      background-color: #27ae60;
    }
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 12px;
  }
`;

export const EmptyMessage = styled.div`
  font-size: 22px;
  color: white;
  margin-top: 40px;
  text-align: center;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;
