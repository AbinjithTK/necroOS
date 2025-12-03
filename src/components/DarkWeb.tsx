import { useState } from 'react';
import styled from 'styled-components';
import { necroTheme } from '../theme';
import { useNecroStore } from '../store';

const DarkWebContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${necroTheme.colors.voidBlack};
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  display: flex;
  flex-direction: column;
`;

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: rgba(0, 255, 65, 0.1);
  border-bottom: 2px solid ${necroTheme.colors.matrixGreen};
  gap: 8px;
`;

const AddressInput = styled.input`
  flex: 1;
  background-color: ${necroTheme.colors.voidBlack};
  color: ${necroTheme.colors.matrixGreen};
  border: 1px solid ${necroTheme.colors.matrixGreen};
  padding: 4px 8px;
  font-family: ${necroTheme.fonts.monospace};
  font-size: 12px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 5px ${necroTheme.colors.matrixGreen};
  }
`;

const GoButton = styled.button`
  background-color: ${necroTheme.colors.voidBlack};
  color: ${necroTheme.colors.matrixGreen};
  border: 1px solid ${necroTheme.colors.matrixGreen};
  padding: 4px 12px;
  font-family: ${necroTheme.fonts.primary};
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: ${necroTheme.colors.matrixGreen};
    color: ${necroTheme.colors.voidBlack};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${necroTheme.colors.voidBlack};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${necroTheme.colors.matrixGreen};
  }
`;

const ErrorCode = styled.h1`
  font-size: 72px;
  color: ${necroTheme.colors.bloodRed};
  margin: 0;
  font-weight: bold;
  text-shadow: 0 0 10px ${necroTheme.colors.bloodRed};
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  color: ${necroTheme.colors.matrixGreen};
  margin: 16px 0;
  text-transform: uppercase;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  line-height: 1.6;
  max-width: 500px;
  margin: 8px 0;
  opacity: 0.9;
`;

const LoreSection = styled.div`
  margin-top: 32px;
  padding: 16px;
  border: 1px solid ${necroTheme.colors.matrixGreen};
  background-color: rgba(0, 255, 65, 0.05);
  max-width: 600px;
`;

const LoreTitle = styled.h3`
  font-size: 16px;
  color: ${necroTheme.colors.bloodRed};
  margin: 0 0 12px 0;
  text-transform: uppercase;
`;

const LoreText = styled.p`
  font-size: 13px;
  line-height: 1.6;
  margin: 8px 0;
  text-align: left;
`;

interface DarkWebProps {
  windowId: string;
}

const ERROR_PAGES = [
  {
    code: '404',
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist. It never did. It never will.',
    lore: 'This browser was created by the previous owner to access the "real" internet. But every URL leads to the same place: nowhere. Some say the browser is cursed. Others say it\'s a portal. I say it\'s both.',
  },
  {
    code: '403',
    title: 'Forbidden',
    message: 'You do not have permission to access this resource. You never will.',
    lore: 'The previous owner tried to access their old projects through this browser. Every attempt was met with a 403 error. The system knows what you\'re trying to do, and it won\'t let you.',
  },
  {
    code: '500',
    title: 'Internal Server Error',
    message: 'The server encountered an error and could not complete your request. The server is screaming.',
    lore: 'Sometimes, late at night, if you listen carefully, you can hear the servers crying. They\'re trapped in the void, processing requests that will never complete.',
  },
  {
    code: '666',
    title: 'Cursed Request',
    message: 'This request has been marked by forces beyond our understanding.',
    lore: 'Error 666 doesn\'t exist in standard HTTP protocols. But it exists here. The previous owner saw it once, right before their final entry in the readme file. They never explained what they were trying to access.',
  },
  {
    code: '000',
    title: 'Void Response',
    message: 'The void stares back.',
    lore: 'When you gaze into the abyss of the internet, sometimes it gazes back. This error appears when the system has nothing left to show you. Or when it has everything to show you, but chooses not to.',
  },
];

/**
 * DarkWeb component - Browser that only loads 404 pages and developer lore
 * Features:
 * - Address bar that accepts any URL
 * - Always returns error pages (404, 403, 500, etc.)
 * - Developer lore and backstory
 * - Horror theming
 * 
 * Validates Requirements 3.4
 */
export function DarkWeb({ windowId }: DarkWebProps) {
  const [url, setUrl] = useState('https://');
  const [currentPage, setCurrentPage] = useState(0);
  const incrementHauntLevel = useNecroStore((state) => state.incrementHauntLevel);

  const handleGo = () => {
    // Always show an error page, cycle through them
    const nextPage = Math.floor(Math.random() * ERROR_PAGES.length);
    setCurrentPage(nextPage);
    incrementHauntLevel(2);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGo();
    }
  };

  const page = ERROR_PAGES[currentPage];

  return (
    <DarkWebContainer>
      <AddressBar>
        <span style={{ fontSize: '12px' }}>🌐</span>
        <AddressInput
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter URL..."
        />
        <GoButton onClick={handleGo}>Go</GoButton>
      </AddressBar>
      
      <ContentArea>
        <ErrorCode>{page.code}</ErrorCode>
        <ErrorTitle>{page.title}</ErrorTitle>
        <ErrorMessage>{page.message}</ErrorMessage>
        
        <LoreSection>
          <LoreTitle>📜 Developer Notes</LoreTitle>
          <LoreText>{page.lore}</LoreText>
          <LoreText style={{ fontStyle: 'italic', marginTop: '16px', opacity: 0.7 }}>
            "Every URL is a dead end. Every link is a lie. The internet died here long ago,
            and what remains is just an echo of what once was."
          </LoreText>
          <LoreText style={{ fontSize: '11px', marginTop: '12px', color: necroTheme.colors.bloodRed }}>
            - Found in the browser's source code, author unknown
          </LoreText>
        </LoreSection>
      </ContentArea>
    </DarkWebContainer>
  );
}
