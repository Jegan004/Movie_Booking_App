import styled from "styled-components";

export const FormContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 25px;
  background: #222;
  color: white;
  border-radius: 12px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ff6600;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  display: block;
  margin-bottom: 6px;
  padding-bottom:4px;
  
`;

export const Input = styled.input`
  width: 95%;
  padding: 12px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  background: #333;
  color: white;
  outline: none;
  transition: 0.3s;

  &:focus {
    border: 2px solid #ff6600;
  }
`;

export const TextArea = styled.textarea`
  width: 95%;
  padding: 12px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  background: #333;
  color: white;
  outline: none;
  resize: vertical;
  transition: 0.3s;

  &:focus {
    border: 2px solid #ff6600;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  background: #333;
  color: white;
  outline: none;
  transition: 0.3s;

  &:focus {
    border: 2px solid #ff6600;
  }
`;

export const GenreContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding-bottom: 14px;
`;

export const GenreButton = styled.button<{ selected: boolean }>`
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ selected }) => (selected ? "white" : "#ccc")};
  background: ${({ selected }) => (selected ? "#ff6600" : "#444")};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: ${({ selected }) => (selected ? "#ff4500" : "#666")};
    transform: scale(1.05);
  }
`;

export const ImageUploadContainer = styled.div`
  text-align: center;
`;

export const ImageLabel = styled.label`
  display: block;
  padding: 10px;
  background: #444;
  color: white;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #666;
  }
`;

export const ImageInput = styled.input`
  display: none;
`;

export const PreviewImage = styled.img`
  width: 100%;
  max-height: 250px;
  object-fit: contain;
  border-radius: 10px;
  margin-top: 15px;
  border: 2px solid #ff6600;
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: #ff6600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #ff4500;
    transform: scale(1.05);
  }
`;
