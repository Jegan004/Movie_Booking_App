import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NavbarContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  background-color: #333;
  background:linear-gradient(#2A00B7,#42006C);
  color: white;
  box-shadow: 0 4px 6px rgba(152, 51, 51, 0.1);
  position: relative;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }
`;

export const LogoContainer = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: white;

  h1 {
    margin: 0;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

export const NavbarLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin: 0 1rem;
  font-size: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6347;  /* Tomato red color on hover */
  }

  @media (max-width: 768px) {
    margin: 1rem 0;
    font-size: 1.1rem;
  }
`;

export const NavbarMenu = styled.nav<{ $isMenuOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    display: ${({ $isMenuOpen }) => ($isMenuOpen ? 'flex' : 'none')};
    padding-top: 10px;
    gap: 1rem;
  }
`;

export const MenuToggle = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 30px;
  height: 22px;
  cursor: pointer;

  div {
    width: 100%;
    height: 4px;
    background-color: white;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

