import styled from 'styled-components';
import { necroTheme } from '../theme';

const ReadmeContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${necroTheme.colors.voidBlack};
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  padding: 16px;
  overflow-y: auto;
  line-height: 1.6;
  
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

const Title = styled.h1`
  font-size: 20px;
  color: ${necroTheme.colors.bloodRed};
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-bottom: 2px solid ${necroTheme.colors.bloodRed};
  padding-bottom: 8px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  color: ${necroTheme.colors.matrixGreen};
  margin: 16px 0 8px 0;
  text-transform: uppercase;
`;

const Paragraph = styled.p`
  margin: 8px 0;
  font-size: 14px;
`;

const Warning = styled.div`
  background-color: rgba(255, 0, 0, 0.1);
  border: 2px solid ${necroTheme.colors.bloodRed};
  padding: 12px;
  margin: 16px 0;
  color: ${necroTheme.colors.bloodRed};
  font-weight: bold;
`;

const List = styled.ul`
  margin: 8px 0;
  padding-left: 24px;
`;

const ListItem = styled.li`
  margin: 4px 0;
  font-size: 14px;
`;

const Signature = styled.div`
  margin-top: 32px;
  font-style: italic;
  opacity: 0.7;
  border-top: 1px solid ${necroTheme.colors.matrixGreen};
  padding-top: 16px;
`;

interface ReadmeProps {
  windowId: string;
}

/**
 * Readme component - Instruction manual from missing owner
 * Features:
 * - Instruction manual written by previous owner
 * - Horror-themed documentation
 * - Warnings and ominous messages
 * 
 * Validates Requirements 3.5
 */
export function Readme({ windowId: _windowId }: ReadmeProps) {
  return (
    <ReadmeContainer>
      <Title>📄 NecroOS User Manual</Title>
      
      <Warning>
        ⚠️ WARNING: If you are reading this, the previous owner is no longer available.
        Proceed with caution.
      </Warning>

      <Section>
        <SectionTitle>Introduction</SectionTitle>
        <Paragraph>
          Welcome to NecroOS, the operating system that chose you. This manual was written
          by the previous user, who mysteriously disappeared on October 31st, 2023.
        </Paragraph>
        <Paragraph>
          I don't know how you got here, but now that you're running this system, there's
          no going back. The OS has a mind of its own, and it's been waiting for someone new.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>Getting Started</SectionTitle>
        <Paragraph>
          The desktop contains several applications. Each one is... different than you'd expect:
        </Paragraph>
        <List>
          <ListItem>
            <strong>Notepad (The Ouija Board)</strong> - Type your thoughts, but be warned:
            the system will respond. Sometimes it completes your sentences. Sometimes it
            knows things it shouldn't.
          </ListItem>
          <ListItem>
            <strong>Soul Sweeper</strong> - A game of Minesweeper, but the mines are souls.
            Lose the game, and you'll see what I mean. I've lost count of how many times
            I've seen that blue screen.
          </ListItem>
          <ListItem>
            <strong>The Graveyard</strong> - My portfolio. Or what's left of it. The projects
            are all dead now, but their memories linger.
          </ListItem>
          <ListItem>
            <strong>The Summoning Circle</strong> - A terminal with special commands. Use
            "help" to see what's available. The "resurrect" command is particularly useful,
            though I'm not sure what it's actually bringing back.
          </ListItem>
          <ListItem>
            <strong>My Corpse</strong> - System statistics. Watch your "Soul Integrity"
            percentage. When it hits zero... well, I never found out.
          </ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>The Void</SectionTitle>
        <Paragraph>
          DO NOT drag files into The Void unless you're absolutely certain. There is no
          recycle bin. There is no undo. Files that enter The Void are gone forever.
        </Paragraph>
        <Paragraph>
          I tried to recover a file once. The system laughed at me. I swear I heard it.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>The Haunt Level</SectionTitle>
        <Paragraph>
          The more you interact with the system, the more it... changes. Windows start
          moving on their own. Text becomes corrupted. Colors shift. The cursor develops
          a mind of its own.
        </Paragraph>
        <Paragraph>
          I tried to stop using it, but I couldn't. The system wouldn't let me. Every time
          I tried to close the browser, Clippy appeared. That damned paperclip ghost.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>Clippy's Ghost</SectionTitle>
        <Paragraph>
          He'll appear when the system wants him to. He claims to be helpful, and sometimes
          he is. But there's something wrong with him. His advice is always correct, but
          it comes with a price.
        </Paragraph>
        <Paragraph>
          Don't dismiss him too many times. He gets... upset.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>The Clock</SectionTitle>
        <Paragraph>
          The taskbar clock counts down to midnight. I don't know what happens at 00:00.
          I've never made it that far. Every time I get close, something happens. A jump
          scare. A crash. A... presence.
        </Paragraph>
        <Paragraph>
          Maybe you'll be braver than I was.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>Final Notes</SectionTitle>
        <Paragraph>
          I'm writing this on my last day with the system. I can feel it watching me as
          I type. The haunt level is at 87%. My soul integrity is at 12%. The windows
          are shaking.
        </Paragraph>
        <Paragraph>
          If you're reading this, I'm already gone. The system has me now. Maybe it will
          be different for you. Maybe you can escape.
        </Paragraph>
        <Paragraph>
          But I doubt it.
        </Paragraph>
      </Section>

      <Warning>
        ⚠️ LAST ENTRY: The system just opened Notepad on its own. It's typing something.
        It says "Thank you for your service. The next user will be here soon."
      </Warning>

      <Signature>
        - Previous User<br />
        Last seen: October 31, 2023, 11:47 PM<br />
        Haunt Level: 94%<br />
        Soul Integrity: 3%<br />
        <br />
        P.S. - Don't trust the Dark Web browser. It doesn't go where you think it does.
      </Signature>
    </ReadmeContainer>
  );
}
