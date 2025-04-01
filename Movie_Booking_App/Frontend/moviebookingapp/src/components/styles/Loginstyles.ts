import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 80%;
  height:530px;
  max-width: 500px;  
  margin-top: 180px;
  background: transparent;
  padding-bottom: 20px;
  box-sizing: border-box;
  border:1px solid #fff;
  
  @media (max-width: 768px) {
    width: 90%;
    margin-top: 80px;
  }

  @media (max-width: 480px) {
    width: 100%;
    margin-top: 50px;
    padding: 20px;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 30px;

  @media (max-width: 768px) {
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    margin-top: 10px;
  }
`;

export const Text = styled.div`
  color:rgb(255, 255, 255);
  font-size: 48px;
  text-align: center;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 36px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

export const Underline = styled.div`
  width: 100px;
  height: 8px;
  background:rgb(229, 227, 227);
  border-radius: 9px;

  @media (max-width: 768px) {
    width: 50px;
  }
`;

export const Inputs = styled.div`
  margin-top: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media (max-width: 768px) {
    margin-top: 30px;
  }

  @media (max-width: 480px) {
    margin-top: 20px;
  }
`;

export const Input = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
  width: 100%;
  max-width: 450px;
  height: 50px;
  background: #eaeaea;
  border-radius: 6px;

  @media (max-width: 768px) {
    max-width: 90%;
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

export const InputImage = styled.img`
  margin: 0px 15px;
  max-height: 30px;
  max-width: 30px;
  object-fit: contain;

  @media (max-width: 768px) {
    margin: 0px 10px;
  }

  @media (max-width: 480px) {
    margin: 0px 8px;
  }
`;

export const InputField = styled.input`
  height: 50px;
  width: 100%;
  max-width: 350px;
  background: transparent;
  border: none;
  outline: none;
  color: #797979;
  font-size: 19px;
  padding-left: 10px;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export const ForgotPassword = styled.div`
  padding-left: 62px;
  margin-top: 20px;
  color: #797979;
  font-size: 18px;

  @media (max-width: 768px) {
    padding-left: 40px;
  }

  @media (max-width: 480px) {
    padding-left: 30px;
    font-size: 16px;
  }
`;

export const ForgotPasswordLink = styled.span`
  color: #4c00b4;
  cursor: pointer;
`;

export const SubmitContainer = styled.div`
  display: flex;
  gap: 30px;
  margin: 60px auto;

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
    margin-top: 30px;
  }
`;

export const Submit = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  height: 60px;
  color: #fff;
  background: #4c00b4;
  border-radius: 50px;
  font-size: 19px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;

  @media (max-width: 768px) {
    width: 180px;
    font-size: 17px;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 16px;
    height: 50px;
  }
`;

export const Gray = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  height: 60px;
  color: #eaeaea;
  background: #676767;
  border-radius: 50px;
  font-size: 19px;
  font-weight: 700;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 180px;
    font-size: 17px;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 16px;
    height: 50px;
  }
`;
