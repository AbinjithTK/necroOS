import { useState } from 'react';
import styled from 'styled-components';
import { necroTheme } from '../theme';
import { useNecroStore } from '../store';

const PortfolioContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${necroTheme.colors.voidBlack};
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  overflow-y: auto;
`;

const Section = styled.div`
  padding: 16px;
  border-bottom: 2px solid ${necroTheme.colors.matrixGreen};
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 12px 0;
  color: ${necroTheme.colors.bloodRed};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ObituaryText = styled.p`
  line-height: 1.6;
  margin: 8px 0;
  font-size: 14px;
`;

const ColdCasesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CaseItem = styled.div`
  padding: 12px;
  border: 1px solid ${necroTheme.colors.matrixGreen};
  background-color: rgba(0, 255, 65, 0.05);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(0, 255, 65, 0.15);
    border-color: ${necroTheme.colors.bloodRed};
    transform: translateX(4px);
  }
`;

const CaseNumber = styled.div`
  font-size: 12px;
  color: ${necroTheme.colors.bloodRed};
  margin-bottom: 4px;
`;

const CaseTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const CaseDescription = styled.div`
  font-size: 13px;
  opacity: 0.8;
`;

const DetailView = styled.div`
  padding: 16px;
  background-color: ${necroTheme.colors.voidBlack};
  border: 2px solid ${necroTheme.colors.bloodRed};
  margin: 16px;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${necroTheme.colors.matrixGreen};
`;

const BackButton = styled.button`
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

const DetailTitle = styled.h3`
  font-size: 18px;
  color: ${necroTheme.colors.bloodRed};
  margin: 0;
`;

const DetailSection = styled.div`
  margin-bottom: 16px;
`;

const DetailLabel = styled.div`
  font-size: 12px;
  color: ${necroTheme.colors.bloodRed};
  text-transform: uppercase;
  margin-bottom: 4px;
  letter-spacing: 1px;
`;

const DetailContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const TechTag = styled.span`
  padding: 4px 8px;
  background-color: rgba(0, 255, 65, 0.2);
  border: 1px solid ${necroTheme.colors.matrixGreen};
  font-size: 12px;
`;

export interface ProjectData {
  title: string;
  description: string;
  techStack: string[];
  caseNumber: string;
  details?: string;
  status?: string;
  dateOfDeath?: string;
}

interface PortfolioManagerProps {
  windowId: string;
  projects?: ProjectData[];
}

const DEFAULT_PROJECTS: ProjectData[] = [
  {
    caseNumber: 'CASE-001',
    title: 'E-Commerce Platform',
    description: 'A full-stack online marketplace that mysteriously vanished from the web.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
    details: 'Built a complete e-commerce solution with user authentication, product catalog, shopping cart, and payment processing. The platform handled thousands of transactions before its untimely demise.',
    status: 'DECEASED - Server Failure',
    dateOfDeath: '2023-10-31',
  },
  {
    caseNumber: 'CASE-002',
    title: 'Real-Time Chat Application',
    description: 'A messaging platform where conversations echo into the void.',
    techStack: ['TypeScript', 'Socket.io', 'Redis', 'MongoDB', 'Docker'],
    details: 'Developed a scalable real-time chat system with WebSocket connections, message persistence, and user presence tracking. The last messages sent were never received.',
    status: 'DECEASED - Connection Lost',
    dateOfDeath: '2023-09-13',
  },
  {
    caseNumber: 'CASE-003',
    title: 'AI-Powered Analytics Dashboard',
    description: 'A data visualization tool that predicted its own obsolescence.',
    techStack: ['Python', 'TensorFlow', 'D3.js', 'FastAPI', 'Kubernetes'],
    details: 'Created an intelligent analytics platform with machine learning models for predictive insights. The AI became self-aware and chose to shut itself down.',
    status: 'DECEASED - Self-Terminated',
    dateOfDeath: '2023-08-06',
  },
  {
    caseNumber: 'CASE-004',
    title: 'Mobile Fitness Tracker',
    description: 'An app that tracked more than just your steps.',
    techStack: ['React Native', 'Firebase', 'GraphQL', 'HealthKit', 'Google Fit'],
    details: 'Built a cross-platform mobile application for fitness tracking with social features and gamification. Users reported strange activity patterns that couldn\'t be explained.',
    status: 'DECEASED - Anomalous Behavior',
    dateOfDeath: '2023-07-22',
  },
  {
    caseNumber: 'CASE-005',
    title: 'Blockchain Voting System',
    description: 'A decentralized voting platform where votes disappeared into the ether.',
    techStack: ['Solidity', 'Ethereum', 'Web3.js', 'IPFS', 'Truffle'],
    details: 'Developed a secure blockchain-based voting system with smart contracts and cryptographic verification. The final vote count never matched the number of voters.',
    status: 'DECEASED - Consensus Failure',
    dateOfDeath: '2023-06-15',
  },
];

/**
 * Portfolio Manager component - The Graveyard
 * Features:
 * - "Obituary" section (About Me) with horror theming
 * - "Cold Cases" section (Past Projects) with project list
 * - Project detail window with police report styling
 * - Horror theming while maintaining readability
 * 
 * Validates Requirements 6.1, 6.2, 6.3, 6.4
 */
export function PortfolioManager({ windowId: _windowId, projects = DEFAULT_PROJECTS }: PortfolioManagerProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const incrementHauntLevel = useNecroStore((state) => state.incrementHauntLevel);

  const handleProjectClick = (project: ProjectData) => {
    setSelectedProject(project);
    incrementHauntLevel(1);
  };

  const handleBackClick = () => {
    setSelectedProject(null);
  };

  if (selectedProject) {
    return (
      <PortfolioContainer>
        <DetailView>
          <DetailHeader>
            <DetailTitle>CASE FILE: {selectedProject.caseNumber}</DetailTitle>
            <BackButton onClick={handleBackClick}>← BACK TO CASES</BackButton>
          </DetailHeader>

          <DetailSection>
            <DetailLabel>Project Name</DetailLabel>
            <DetailContent>{selectedProject.title}</DetailContent>
          </DetailSection>

          <DetailSection>
            <DetailLabel>Case Number</DetailLabel>
            <DetailContent>{selectedProject.caseNumber}</DetailContent>
          </DetailSection>

          <DetailSection>
            <DetailLabel>Status</DetailLabel>
            <DetailContent style={{ color: necroTheme.colors.bloodRed }}>
              {selectedProject.status || 'DECEASED - Unknown Cause'}
            </DetailContent>
          </DetailSection>

          {selectedProject.dateOfDeath && (
            <DetailSection>
              <DetailLabel>Date of Death</DetailLabel>
              <DetailContent>{selectedProject.dateOfDeath}</DetailContent>
            </DetailSection>
          )}

          <DetailSection>
            <DetailLabel>Description</DetailLabel>
            <DetailContent>{selectedProject.description}</DetailContent>
          </DetailSection>

          {selectedProject.details && (
            <DetailSection>
              <DetailLabel>Investigation Notes</DetailLabel>
              <DetailContent>{selectedProject.details}</DetailContent>
            </DetailSection>
          )}

          <DetailSection>
            <DetailLabel>Technology Stack (Evidence)</DetailLabel>
            <TechStack>
              {selectedProject.techStack.map((tech, index) => (
                <TechTag key={index}>{tech}</TechTag>
              ))}
            </TechStack>
          </DetailSection>

          <DetailSection>
            <DetailLabel>Final Notes</DetailLabel>
            <DetailContent style={{ fontStyle: 'italic', opacity: 0.7 }}>
              This project has been archived in The Graveyard. May it rest in peace... or pieces.
            </DetailContent>
          </DetailSection>
        </DetailView>
      </PortfolioContainer>
    );
  }

  return (
    <PortfolioContainer>
      <Section>
        <SectionTitle>📜 Obituary</SectionTitle>
        <ObituaryText>
          <strong>In Memory of a Developer's Sanity</strong>
        </ObituaryText>
        <ObituaryText>
          Here lies the digital remains of countless hours spent debugging, refactoring, and 
          questioning life choices. A full-stack developer who ventured too deep into the 
          codebase and emerged... changed.
        </ObituaryText>
        <ObituaryText>
          Specializing in React, TypeScript, Node.js, and summoning demons through poorly 
          written SQL queries. Experienced in building scalable applications that scale 
          beyond mortal comprehension.
        </ObituaryText>
        <ObituaryText>
          Known for writing code that works in mysterious ways, often surprising even the 
          author. Believes in clean code, but the code has other plans.
        </ObituaryText>
        <ObituaryText style={{ fontStyle: 'italic', color: necroTheme.colors.bloodRed }}>
          "It works on my machine" - Famous last words
        </ObituaryText>
      </Section>

      <Section>
        <SectionTitle>🗂️ Cold Cases (Past Projects)</SectionTitle>
        <ObituaryText style={{ fontSize: '13px', opacity: 0.8, marginBottom: '16px' }}>
          These projects have been laid to rest. Click on any case to view the full investigation report.
        </ObituaryText>
        <ColdCasesList>
          {projects.map((project, index) => (
            <CaseItem 
              key={index} 
              onClick={() => handleProjectClick(project)}
              data-testid={`project-${index}`}
            >
              <CaseNumber>{project.caseNumber}</CaseNumber>
              <CaseTitle>{project.title}</CaseTitle>
              <CaseDescription>{project.description}</CaseDescription>
            </CaseItem>
          ))}
        </ColdCasesList>
      </Section>

      <Section>
        <SectionTitle>⚰️ Final Words</SectionTitle>
        <ObituaryText style={{ fontSize: '13px', fontStyle: 'italic' }}>
          "Every project is a learning experience. Some teach you new technologies. 
          Others teach you the true meaning of suffering."
        </ObituaryText>
        <ObituaryText style={{ fontSize: '13px', marginTop: '12px' }}>
          If you dare to collaborate with the undead, reach out through the void. 
          Response time may vary depending on how deep in the codebase I am.
        </ObituaryText>
      </Section>
    </PortfolioContainer>
  );
}
