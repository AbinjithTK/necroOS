# AWS Amplify Deployment Checklist

## Pre-Deployment ✅

- [x] Code is committed to GitHub
- [x] `amplify.yml` configuration file created
- [x] Build scripts verified in `package.json`
- [x] TypeScript compiles without errors
- [x] Tests are passing
- [x] README.md is updated with project info

## Deployment Steps

### 1. Access AWS Amplify Console
- [ ] Go to https://console.aws.amazon.com/amplify/
- [ ] Sign in to your AWS account
- [ ] Click "New app" → "Host web app"

### 2. Connect GitHub Repository
- [ ] Select "GitHub" as Git provider
- [ ] Authorize AWS Amplify
- [ ] Select your NecroOS repository
- [ ] Select branch (main/master)

### 3. Configure Build Settings
- [ ] Verify `amplify.yml` is detected
- [ ] Confirm build command: `npm run build`
- [ ] Confirm output directory: `dist`
- [ ] Leave environment variables empty (none needed)

### 4. Deploy
- [ ] Click "Save and deploy"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check build logs for any errors

### 5. Verify Deployment
- [ ] Visit the Amplify URL (e.g., `https://main.d1234567890.amplifyapp.com`)
- [ ] Test boot sequence
- [ ] Test desktop environment
- [ ] Test window management
- [ ] Test glitch effects
- [ ] Test audio (requires user interaction)
- [ ] Test on mobile device
- [ ] Test in different browsers (Chrome, Firefox, Safari)

## Post-Deployment Updates

### Update Documentation with Live URL

**README.md:**
```markdown
**Live Demo:** https://your-app.amplifyapp.com
```

**JUDGES_README.md:**
```markdown
**Live Demo:** https://your-app.amplifyapp.com
**Repository:** https://github.com/yourusername/necroos
```

**KIRO_HACKATHON_BLOG.md:**
```markdown
Try NecroOS yourself: https://your-app.amplifyapp.com
View the code: https://github.com/yourusername/necroos
```

### Create Social Media Assets

- [ ] Take screenshots of key features
- [ ] Record short demo video (30-60 seconds)
- [ ] Create cover image for blog post
- [ ] Prepare tweet/post with demo link

### Hackathon Submission

- [ ] Add live demo URL to submission form
- [ ] Add GitHub repository URL
- [ ] Include JUDGES_README.md link
- [ ] Include KIRO_IMPACT_SHOWCASE.md link
- [ ] Submit blog post to dev.to with #kiro tag

## Troubleshooting

### Build Fails
**Check:**
- Node.js version in Amplify (should be 18+)
- Build logs in Amplify Console
- All dependencies in package.json

**Fix:**
- Update Node.js version in Amplify settings
- Check for missing dependencies
- Verify build command

### App Loads but Features Don't Work
**Check:**
- Browser console for errors
- Network tab for failed requests
- Audio requires user interaction (expected)

**Fix:**
- Check for hardcoded localhost URLs
- Verify all assets are in dist folder
- Test in incognito mode

### Slow Loading
**Check:**
- Bundle size
- Network speed
- CDN distribution

**Fix:**
- Enable Amplify CDN (should be automatic)
- Optimize images if any
- Check Amplify performance settings

## Optional Enhancements

### Custom Domain
- [ ] Purchase domain (optional)
- [ ] Add domain in Amplify Console
- [ ] Configure DNS settings
- [ ] Wait for SSL certificate

### Analytics
- [ ] Enable Amplify Analytics
- [ ] Add tracking code if needed
- [ ] Monitor usage metrics

### Performance
- [ ] Enable compression (automatic)
- [ ] Enable caching (automatic)
- [ ] Check Lighthouse score

## Success Criteria

Your deployment is successful when:
- ✅ Site loads at Amplify URL
- ✅ Boot sequence works
- ✅ Desktop environment renders
- ✅ Windows can be opened/closed
- ✅ Glitch effects appear
- ✅ No console errors (except audio warnings)
- ✅ Works on mobile
- ✅ Works in all major browsers

## Final Steps

- [ ] Share demo link with friends for testing
- [ ] Update all documentation with live URL
- [ ] Create demo video using live site
- [ ] Submit to hackathon with all links
- [ ] Post blog on dev.to with #kiro tag

## Estimated Time

- AWS Amplify setup: 5-10 minutes
- Build and deploy: 2-5 minutes
- Testing: 5-10 minutes
- Documentation updates: 5 minutes
- **Total: ~20-30 minutes**

## Support

If you encounter issues:
- AWS Amplify Docs: https://docs.amplify.aws/
- AWS Support: https://console.aws.amazon.com/support/
- Amplify Discord: https://discord.gg/amplify

---

**Ready to deploy? Let's go! 🚀**
