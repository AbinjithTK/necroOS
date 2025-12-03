# Cross-Browser Compatibility Testing Guide

This document outlines the cross-browser compatibility testing strategy for NecroOS.

## Supported Browsers

- **Chrome** (latest 2 versions)
- **Firefox** (latest 2 versions)
- **Safari** (latest 2 versions)
- **Edge** (latest 2 versions)

## Key Features to Test

### 1. Error Boundary

**Test:** Verify error boundary catches and displays errors correctly

- [ ] Chrome: Error boundary displays fallback UI
- [ ] Firefox: Error boundary displays fallback UI
- [ ] Safari: Error boundary displays fallback UI
- [ ] Edge: Error boundary displays fallback UI

### 2. Audio System

**Test:** Verify audio permission handling and playback

- [ ] Chrome: Audio permission prompt appears and is handled gracefully
- [ ] Firefox: Audio permission prompt appears and is handled gracefully
- [ ] Safari: Audio permission prompt appears and is handled gracefully (note: Safari has stricter autoplay policies)
- [ ] Edge: Audio permission prompt appears and is handled gracefully

**Test:** Verify audio continues to work after permission denied

- [ ] Chrome: Application continues without audio when permission denied
- [ ] Firefox: Application continues without audio when permission denied
- [ ] Safari: Application continues without audio when permission denied
- [ ] Edge: Application continues without audio when permission denied

### 3. Performance Monitoring

**Test:** Verify performance monitoring adjusts glitch frequency

- [ ] Chrome: Glitch frequency reduces when FPS drops below 30
- [ ] Firefox: Glitch frequency reduces when FPS drops below 30
- [ ] Safari: Glitch frequency reduces when FPS drops below 30
- [ ] Edge: Glitch frequency reduces when FPS drops below 30

### 4. Window Management

**Test:** Verify window limit enforcement (max 10 windows)

- [ ] Chrome: Cannot open more than 10 windows
- [ ] Firefox: Cannot open more than 10 windows
- [ ] Safari: Cannot open more than 10 windows
- [ ] Edge: Cannot open more than 10 windows

### 5. API Error Handling

**Test:** Verify fallback messages when API fails

- [ ] Chrome: Clippy shows fallback message when API times out
- [ ] Firefox: Clippy shows fallback message when API times out
- [ ] Safari: Clippy shows fallback message when API times out
- [ ] Edge: Clippy shows fallback message when API times out

### 6. Visual Effects

**Test:** Verify CRT filter and glitch effects render correctly

- [ ] Chrome: CRT filter visible with scanlines and chromatic aberration
- [ ] Firefox: CRT filter visible with scanlines and chromatic aberration
- [ ] Safari: CRT filter visible with scanlines and chromatic aberration
- [ ] Edge: CRT filter visible with scanlines and chromatic aberration

### 7. Error Recovery

**Test:** Verify application recovers from errors

- [ ] Chrome: Reload button works after error
- [ ] Firefox: Reload button works after error
- [ ] Safari: Reload button works after error
- [ ] Edge: Reload button works after error

## Testing Procedure

### Manual Testing

1. Open the application in each browser
2. Test each feature listed above
3. Document any issues or inconsistencies
4. Verify error messages are user-friendly

### Automated Testing

Run the test suite in each browser using:

```bash
# Chrome
npm test -- --browser=chrome

# Firefox
npm test -- --browser=firefox

# Safari (macOS only)
npm test -- --browser=safari

# Edge
npm test -- --browser=edge
```

## Known Browser-Specific Issues

### Safari

- **Audio Autoplay**: Safari has stricter autoplay policies. Audio will only play after user interaction.
- **Web Audio API**: May require additional user gesture to initialize context.

### Firefox

- **Performance API**: Some performance metrics may differ slightly from Chrome.

### Edge

- **Legacy Edge**: Not supported. Only Chromium-based Edge is supported.

## Error Handling Verification

### Test Scenarios

1. **Network Failure**
   - Disconnect network
   - Verify application shows appropriate error messages
   - Verify application continues to function offline where possible

2. **Audio Permission Denied**
   - Deny audio permission
   - Verify application continues without audio
   - Verify no console errors

3. **Low Performance**
   - Throttle CPU in DevTools
   - Verify glitch frequency reduces automatically
   - Verify application remains responsive

4. **Window Limit**
   - Open 10 windows
   - Attempt to open 11th window
   - Verify warning message appears
   - Verify no crash or freeze

5. **API Timeout**
   - Simulate slow network (DevTools throttling)
   - Trigger Clippy help
   - Verify fallback message appears within 5 seconds

## Reporting Issues

When reporting cross-browser issues, include:

- Browser name and version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or video if applicable
- Console errors (if any)

## Continuous Integration

The CI pipeline should run tests on:

- Chrome (latest)
- Firefox (latest)
- Safari (latest, macOS only)

Edge testing can be done manually as it shares the Chromium engine with Chrome.
