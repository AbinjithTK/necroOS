import { useState } from 'react';
import type { FormEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import { necroTheme } from '../theme';

interface LoginPromptProps {
  onLoginSuccess: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LoginContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${necroTheme.colors.voidBlack};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: ${fadeIn} 0.5s ease-in;
`;

const LoginBox = styled.div`
  background-color: ${necroTheme.colors.darkGray};
  border: 2px solid ${necroTheme.colors.matrixGreen};
  padding: 40px;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
`;

const Title = styled.h1`
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  font-size: 24px;
  margin: 0 0 30px 0;
  text-align: center;
  text-shadow: 0 0 10px ${necroTheme.colors.matrixGreen};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  font-size: 14px;
`;

const Input = styled.input`
  background-color: ${necroTheme.colors.voidBlack};
  border: 2px solid ${necroTheme.colors.matrixGreen};
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.monospace};
  font-size: 14px;
  padding: 8px 12px;
  outline: none;

  &:focus {
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
  }

  &::placeholder {
    color: ${necroTheme.colors.darkGray};
  }
`;

const Button = styled.button`
  background-color: ${necroTheme.colors.matrixGreen};
  border: none;
  color: ${necroTheme.colors.voidBlack};
  font-family: ${necroTheme.fonts.primary};
  font-size: 14px;
  font-weight: bold;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${necroTheme.colors.bloodRed};
    color: ${necroTheme.colors.matrixGreen};
    box-shadow: 0 0 15px ${necroTheme.colors.bloodRed};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Warning = styled.div`
  color: ${necroTheme.colors.bloodRed};
  font-family: ${necroTheme.fonts.monospace};
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
  opacity: 0.8;
`;

/**
 * LoginPrompt component that accepts any password for username "Guest"
 * Validates Requirements 12.4: Login accepts any password for "Guest"
 */
export function LoginPrompt({ onLoginSuccess }: LoginPromptProps) {
  const [username, setUsername] = useState('Guest');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Accept any password for username "Guest"
    // This satisfies Requirement 12.4
    if (username.toLowerCase() === 'guest') {
      onLoginSuccess();
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Welcome to NecroOS</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username:</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Guest"
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password:</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter any password..."
            />
          </FormGroup>

          <Button type="submit">
            Enter
          </Button>
        </Form>

        <Warning>
          ⚠ WARNING: System may contain disturbing content ⚠
        </Warning>
      </LoginBox>
    </LoginContainer>
  );
}
