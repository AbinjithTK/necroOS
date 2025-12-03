# NecroOS Audio Files

This directory should contain the following audio files for the NecroOS application:

## Required Audio Files

1. **ambient-hum.mp3**
   - Low, continuous ambient hum
   - Loops continuously when desktop is active
   - Volume: Low (0.3)
   - Duration: 10-30 seconds (will loop)

2. **void-growl.mp3**
   - Deep, ominous growl
   - Plays when files are dragged to "The Void"
   - Volume: Medium (0.5)
   - Duration: 2-3 seconds

3. **jump-scare.mp3**
   - Loud, screeching sound
   - Plays during jump scare events
   - Volume: Medium-High (0.7)
   - Duration: 1-2 seconds
   - **Important**: Should not be ear-damaging

4. **ui-click.mp3** (Optional)
   - Subtle click sound
   - Plays on UI interactions
   - Volume: Low (0.2)
   - Duration: <0.5 seconds

5. **ui-error.mp3** (Optional)
   - Error beep sound
   - Plays on error states
   - Volume: Low-Medium (0.4)
   - Duration: <1 second

## Audio Format Guidelines

- Format: MP3 (for broad browser compatibility)
- Sample Rate: 44.1kHz or 48kHz
- Bit Rate: 128-192 kbps (balance quality and file size)
- Channels: Mono or Stereo

## Browser Compatibility

The audio system uses the Web Audio API, which is supported in:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Autoplay Policy

Due to browser autoplay policies, audio will only start after user interaction.
The audio system initializes when the user enables audio via the toggle button.

## Development Note

If audio files are missing, the application will continue to work but without sound.
Console warnings will indicate which audio files failed to load.
