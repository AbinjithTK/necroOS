# Building NecroOS: A Horror-Themed Windows 95 Simulator with Kiro AI

## The Challenge: Creating Nostalgia with a Twist

When I set out to build NecroOS for the Kiro hackathon, I wanted to create something that blended nostalgia with horror—a browser-based Windows 95 simulator that progressively becomes more unsettling as users interact with it. The scope was ambitious: draggable windows, multiple applications, glitch effects, audio management, and a "haunt level" system that orchestrates the descent into digital madness.

The twist? I'd be building it with Kiro, an AI-powered IDE assistant that promised to accelerate development while maintaining code quality.

## What is NecroOS?

NecroOS is a fully functional Windows 95 desktop environment that runs in your browser. It features:

- **Authentic retro UI** using the react95 component library
- **Multiple applications**: Notepad, Minesweeper, Portfolio Manager, Terminal, and some... darker surprises
- **Progressive horror mechanics** through a haunt level system
- **Visual effects**: CRT monitor simulation, glitch effects, and screen distortions
- **Audio atmosphere**: Ambient sounds and effects that intensify with interaction
- **Corrupted Clippy**: Everyone's favorite assistant, but something's very wrong

The technical stack includes React 19, TypeScript with strict mode, Zustand for state management, and Vite for blazing-fast development.

## The Kiro Experience: From Skeptic to Believer

### Starting with Structure

My first interaction with Kiro set the tone for the entire project. Instead of diving straight into code, I used Kiro's **spec system** to formalize my requirements and design. This turned out to be a game-changer.

I created a spec document outlining:
- Acceptance criteria for each feature
- Correctness properties that needed to be maintained
- Implementation tasks broken down into manageable chunks

Kiro helped me iterate on these specs, catching edge cases I hadn't considered. For example, when designing the window management system, Kiro suggested properties like "windows should never overlap the taskbar" and "minimized windows should restore to their previous position"—details that would have caused bugs later.

### Property-Based Testing: The Secret Weapon

One of Kiro's most impressive capabilities was its understanding of property-based testing with fast-check. Rather than writing dozens of individual test cases, Kiro helped me define properties that should always hold true.

For the window manager:
```typescript
fc.assert(
  fc.property(
    fc.array(windowArbitrary, { minLength: 1, maxLength: 10 }),
    (windows) => {
      // Property: focused window should always have highest z-index
      const focusedWindow = windows.find(w => w.isFocused);
      if (focusedWindow) {
        expect(focusedWindow.zIndex).toBeGreaterThanOrEqual(
          Math.max(...windows.map(w => w.zIndex))
        );
      }
    }
  ),
  { numRuns: 100 }
);
```

Kiro generated these property tests for nearly every component, catching edge cases that traditional unit tests would have missed. The glitch system, audio management, and haunt level orchestration all benefited from this approach.

### Steering Rules: Teaching Kiro My Preferences

Early on, I discovered Kiro's **steering system**—markdown files that provide context and conventions for the entire project. I created three steering documents:

1. **tech.md**: Defined the technology stack, common commands, and TypeScript configuration
2. **structure.md**: Outlined directory organization, naming conventions, and import patterns
3. **product.md**: Described the core concept and key features

Once these were in place, Kiro consistently generated code that matched my project's conventions. No more explaining "use Zustand for state" or "place tests alongside components" in every prompt. Kiro just knew.

### The Flow: Rapid Iteration Without Sacrificing Quality

The development rhythm with Kiro was unlike anything I'd experienced:

1. **Define the feature** in natural language
2. **Kiro generates implementation** with proper TypeScript types, error handling, and tests
3. **Review and refine** using Kiro's diagnostic tools
4. **Move to the next feature**

For the haunting orchestrator—a complex service that manages progressive horror effects—Kiro generated:
- The core service class with proper TypeScript interfaces
- Unit tests covering all methods
- Property-based tests for state transitions
- Error boundary integration
- Performance optimizations

All in a single iteration. What would have taken me hours of careful coding and testing happened in minutes.

### Real-World Example: The Glitch System

The glitch system was one of the most complex features. It needed to:
- Apply visual distortions to windows based on haunt level
- Coordinate with audio effects
- Handle performance constraints
- Provide smooth animations
- Work across different browsers

I described the requirements to Kiro, and it generated:

```typescript
export const GlitchableWindow: React.FC<GlitchableWindowProps> = ({
  children,
  windowId,
  intensity = 0,
}) => {
  const glitchLevel = useStore((state) => state.glitchLevel);
  const effectiveIntensity = Math.min(intensity + glitchLevel * 0.1, 1);
  
  // Kiro added proper memoization for performance
  const glitchStyle = useMemo(() => ({
    filter: `hue-rotate(${effectiveIntensity * 180}deg) 
             contrast(${1 + effectiveIntensity * 0.5})`,
    animation: effectiveIntensity > 0.5 
      ? `glitch ${2 - effectiveIntensity}s infinite` 
      : 'none',
  }), [effectiveIntensity]);

  return (
    <div className="glitchable-window" style={glitchStyle}>
      {children}
    </div>
  );
};
```

Complete with property tests verifying that intensity values always stayed within bounds and that performance remained smooth even with multiple glitching windows.

### Debugging with Context

When I encountered a bug where audio wouldn't play in certain browsers, I used Kiro's context system to share the error. Kiro immediately:

1. Identified it as an autoplay policy issue
2. Generated a robust audio service with user interaction detection
3. Added fallback mechanisms
4. Created comprehensive error handling
5. Wrote tests covering the edge cases

The fix was production-ready, not a quick hack.

## The Results: Quality at Speed

After two weeks of development with Kiro, NecroOS includes:

- **15+ React components**, each with unit and property-based tests
- **95%+ test coverage** across the codebase
- **Zero TypeScript errors** in strict mode
- **Comprehensive error handling** with graceful degradation
- **Performance optimizations** for smooth 60fps animations
- **Cross-browser compatibility** with proper fallbacks

The codebase is maintainable, well-documented, and follows consistent patterns throughout. This isn't just a hackathon project—it's production-quality code.

## What I Learned

### Kiro Excels At:

1. **Structured development**: The spec system keeps complex projects organized
2. **Property-based testing**: Catches edge cases traditional tests miss
3. **Consistency**: Steering rules ensure uniform code across the project
4. **Context awareness**: Kiro understands the entire project, not just individual files
5. **Best practices**: Generated code follows modern patterns and conventions

### The Human Touch Still Matters:

- **Creative direction**: Kiro implements, but you define the vision
- **Architecture decisions**: High-level structure benefits from human insight
- **User experience**: Kiro can't feel the horror atmosphere—that's on you
- **Final polish**: The subtle touches that make it special

## Tips for Using Kiro Effectively

1. **Start with specs**: Invest time in requirements and design documents
2. **Create steering rules early**: Teach Kiro your preferences upfront
3. **Embrace property-based testing**: Let Kiro generate comprehensive test suites
4. **Use context liberally**: Share errors, file structures, and related code
5. **Iterate in conversation**: Kiro learns from your feedback

## The Verdict

Building NecroOS with Kiro transformed my development process. I shipped a complex, well-tested application in a fraction of the time it would have taken solo, without sacrificing code quality. The combination of AI assistance and human creativity is powerful—Kiro handles the tedious implementation details while I focus on the experience and architecture.

If you're skeptical about AI-assisted development, I get it. I was too. But Kiro isn't trying to replace developers—it's amplifying what we can build. And for a solo developer tackling an ambitious project, that amplification is the difference between "maybe someday" and "shipped today."

Try NecroOS if you dare: [Your Demo Link]
Check out the code: [Your GitHub Link]

Built with Kiro. Haunted by design. 👻

---

*This post was written for the Kiro Hackathon bonus blog prize. If you're curious about AI-assisted development, give Kiro a try—just maybe build something less creepy than I did.*

#kiro #hackathon #react #typescript #horror #webdev #ai
