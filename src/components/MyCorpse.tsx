import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { necroTheme } from '../theme';
import { useNecroStore } from '../store';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: ${necroTheme.fonts.primary};
  color: ${necroTheme.colors.matrixGreen};
  min-height: 300px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin: 0 0 16px 0;
  color: ${necroTheme.colors.bloodRed};
  text-shadow: 0 0 10px ${necroTheme.colors.bloodRed};
  text-align: center;
  font-weight: bold;
`;

const StatSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px solid ${necroTheme.colors.matrixGreen};
  background-color: rgba(0, 255, 65, 0.05);
  box-shadow: 0 0 5px ${necroTheme.colors.matrixGreen};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid rgba(0, 255, 65, 0.2);

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: ${necroTheme.colors.matrixGreen};
  text-shadow: 0 0 5px ${necroTheme.colors.matrixGreen};
`;

const StatValue = styled.span<{ $critical?: boolean }>`
  font-size: 14px;
  font-weight: bold;
  color: ${({ $critical }) => 
    $critical ? necroTheme.colors.bloodRed : necroTheme.colors.matrixGreen};
  text-shadow: 0 0 5px ${({ $critical }) => 
    $critical ? necroTheme.colors.bloodRed : necroTheme.colors.matrixGreen};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: ${necroTheme.colors.voidBlack};
  border: 1px solid ${necroTheme.colors.matrixGreen};
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number; $critical?: boolean }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  background-color: ${({ $critical }) => 
    $critical ? necroTheme.colors.bloodRed : necroTheme.colors.matrixGreen};
  box-shadow: 0 0 10px ${({ $critical }) => 
    $critical ? necroTheme.colors.bloodRed : necroTheme.colors.matrixGreen};
  transition: width 0.3s ease, background-color 0.3s ease;
`;

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
  color: ${necroTheme.colors.matrixGreen};
  text-shadow: 0 0 5px ${necroTheme.colors.voidBlack};
  z-index: 1;
`;

const Warning = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid ${necroTheme.colors.bloodRed};
  color: ${necroTheme.colors.bloodRed};
  text-align: center;
  font-size: 12px;
  text-shadow: 0 0 5px ${necroTheme.colors.bloodRed};
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;

interface MyCorpseProps {
  windowId: string;
}

/**
 * My Corpse (System Stats) component displaying horror-themed system statistics
 * Features:
 * - Soul Integrity percentage calculation based on haunt level
 * - Haunted RAM display with horror-themed values
 * - Additional spooky system stats (Cursed CPU, Damned Disk, etc.)
 * - Horror theming and glitch effects
 * 
 * Validates Requirements 3.1
 */
export function MyCorpse({ windowId: _windowId }: MyCorpseProps) {
  const hauntLevel = useNecroStore((state) => state.hauntLevel);
  const [cpuUsage, setCpuUsage] = useState(13);
  const [diskUsage, setDiskUsage] = useState(66);

  // Calculate Soul Integrity as inverse of haunt level
  const soulIntegrity = 100 - hauntLevel;
  const isCritical = soulIntegrity < 30;

  // Haunted RAM increases with haunt level
  const hauntedRAM = Math.floor(666 + (hauntLevel * 3.33));

  // Simulate fluctuating CPU and Disk usage
  useEffect(() => {
    const interval = setInterval(() => {
      // CPU usage increases with haunt level and fluctuates
      const baseCpu = 13 + (hauntLevel * 0.5);
      setCpuUsage(Math.floor(baseCpu + Math.random() * 20 - 10));

      // Disk usage slowly increases with haunt level
      const baseDisk = 66 + (hauntLevel * 0.2);
      setDiskUsage(Math.floor(baseDisk + Math.random() * 10 - 5));
    }, 2000);

    return () => clearInterval(interval);
  }, [hauntLevel]);

  // Calculate uptime in a creepy way
  const uptimeMinutes = Math.floor(Date.now() / 60000) % 666;

  return (
    <Container>
      <Title>⚰️ SYSTEM AUTOPSY ⚰️</Title>

      <StatSection>
        <StatLabel>Soul Integrity</StatLabel>
        <ProgressBar>
          <ProgressFill $percentage={soulIntegrity} $critical={isCritical} />
          <ProgressText>{soulIntegrity}%</ProgressText>
        </ProgressBar>
      </StatSection>

      <StatSection>
        <StatRow>
          <StatLabel>Haunted RAM:</StatLabel>
          <StatValue $critical={hauntedRAM > 900}>
            {hauntedRAM} MB
          </StatValue>
        </StatRow>

        <StatRow>
          <StatLabel>Cursed CPU:</StatLabel>
          <StatValue $critical={cpuUsage > 80}>
            {cpuUsage}%
          </StatValue>
        </StatRow>

        <StatRow>
          <StatLabel>Damned Disk:</StatLabel>
          <StatValue $critical={diskUsage > 90}>
            {diskUsage}%
          </StatValue>
        </StatRow>

        <StatRow>
          <StatLabel>Possessed Processes:</StatLabel>
          <StatValue>{Math.floor(13 + hauntLevel / 5)}</StatValue>
        </StatRow>

        <StatRow>
          <StatLabel>Spectral Threads:</StatLabel>
          <StatValue>{Math.floor(666 + hauntLevel * 2)}</StatValue>
        </StatRow>

        <StatRow>
          <StatLabel>Unholy Uptime:</StatLabel>
          <StatValue>{uptimeMinutes} minutes</StatValue>
        </StatRow>

        <StatRow>
          <StatLabel>Corruption Level:</StatLabel>
          <StatValue $critical={hauntLevel > 70}>
            {hauntLevel}/100
          </StatValue>
        </StatRow>
      </StatSection>

      {isCritical && (
        <Warning>
          ⚠️ CRITICAL: SOUL INTEGRITY COMPROMISED ⚠️
          <br />
          System possession imminent...
        </Warning>
      )}

      {hauntLevel > 70 && (
        <Warning>
          🔥 DANGER: MAXIMUM CORRUPTION DETECTED 🔥
          <br />
          The system is no longer yours...
        </Warning>
      )}
    </Container>
  );
}
