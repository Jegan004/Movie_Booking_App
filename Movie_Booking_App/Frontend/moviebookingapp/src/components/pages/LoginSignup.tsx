import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userimg from '../../assets/user.png';
import email from '../../assets/email.svg';
import password from '../../assets/password.png';

import {
  Container, Header, Text, Underline, Inputs, Input, InputImage, InputField,
  SubmitContainer, Submit, Gray
} from '../styles/Loginstyles';

interface LoginSignupProps {
  setIsLoggedIn: (loggedIn: boolean) => void;
  setUserRole: (role: string) => void;
}

const LoginSignup: React.FC<LoginSignupProps> = ({ setIsLoggedIn, setUserRole }) => {
  const [action, setAction] = useState('Login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => password.length >= 6;

  const handleAuth = async (url: string, payload: object, isSignup = false) => {
    try {
      const response = await axios.post(url, payload);
      const token = response.data.Token;

      if (token) {
        localStorage.setItem('token', token);
        const arrayToken = token.split(".");
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        const role = tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        setIsLoggedIn(true);
        setUserRole(role);
        localStorage.setItem('userRole', role);

        if (role === "Admin") {
          navigate("/admindash");
        } else {
          navigate('/movies');
        }
      } else if (isSignup) {
        alert('Registration successful! Please log in.');
        setAction('Login');
        setEmailInput('');
        setPasswordInput('');
        setNameInput('');
      }
      
    } catch (error: any) {
      console.error(`${action} failed`, error);
      setErrorMessage(action === 'Login' ? 'Invalid credentials, please try again!' : 'Error signing up, please try again!');
    }
  };

  const handleLogin = () => {
    if (!validateEmail(emailInput)) {
      setErrorMessage('Please enter a valid email address!');
      return;
    }

    if (!validatePassword(passwordInput)) {
      setErrorMessage('Password must be at least 6 characters long!');
      return;
    }

    handleAuth('http://localhost:5233/api/users/login', {
      email: emailInput,
      password: passwordInput,
    });
  };

  const handleSignup = () => {
    if (nameInput.trim() === '') {
      setErrorMessage('Name is required!');
      return;
    }

    if (!validateEmail(emailInput)) {
      setErrorMessage('Please enter a valid email address!');
      return;
    }

    if (!validatePassword(passwordInput)) {
      setErrorMessage('Password must be at least 6 characters long!');
      return;
    }

    handleAuth('http://localhost:5233/api/users/register', {
      fullName: nameInput,
      email: emailInput,
      password: passwordInput,
    }, true);
  };

  return (
    <Container data-testid="login-signup">
      <Header data-testid="header">
        <Text data-testid="action">{action}</Text>
        <Underline />
      </Header>
      <Inputs data-testid="inputs">
        {action === 'Sign Up' && (
          <Input data-testid="name-input">
            <InputImage src={userimg} alt="name icon" data-testid="userimg" />
            <InputField
              type="text"
              placeholder="Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              data-testid="name"
            />
          </Input>
        )}
        <Input data-testid="email-input">
          <InputImage src={email} alt="email icon" data-testid="email" />
          <InputField
            type="email"
            placeholder="Email Id"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            data-testid="emailinput"
          />
        </Input>
        <Input data-testid="password-input">
          <InputImage src={password} alt="password icon" data-testid="password" />
          <InputField
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            data-testid="passwordinput"
          />
        </Input>
      </Inputs>

      {errorMessage && <div style={{ color: 'white', textAlign: 'center', marginTop: '10px' }}>{errorMessage}</div>}

      <SubmitContainer data-testid="submit-container">
        <Submit onClick={action === 'Login' ? handleLogin : handleSignup} data-testid="submit">
          {action}
        </Submit>
        <Gray
        onClick={() => {
          setAction(action === 'Login' ? 'Sign Up' : 'Login');
          setEmailInput('');
          setPasswordInput('');
          setNameInput('');
          setErrorMessage('');
        }}
        data-testid="gray">
          {action === 'Login' ? 'Sign Up' : 'Login'}
        </Gray>
      </SubmitContainer>
    </Container>
  );
};

export default LoginSignup;
