# NecroOS Deployment Guide

## AWS Amplify Deployment

### Prerequisites
- AWS Account
- GitHub repository with NecroOS code
- AWS Amplify CLI (optional)

### Option 1: Deploy via AWS Amplify Console (Recommended)

1. **Go to AWS Amplify Console**
   - Visit: https://console.aws.amazon.com/amplify/
   - Click "New app" → "Host web app"

2. **Connect Repository**
   - Select "GitHub" as your Git provider
   - Authorize AWS Amplify to access your GitHub
   - Select your NecroOS repository
   - Select the main/master branch

3. **Configure Build Settings**
   - Amplify will auto-detect the build settings
   - Verify the `amplify.yml` configuration:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```

4. **Review and Deploy**
   - Review the settings
   - Click "Save and deploy"
   - Wait for deployment (usually 2-5 minutes)

5. **Get Your URL**
   - Once deployed, you'll get a URL like: `https://main.d1234567890.amplifyapp.com`
   - You can also add a custom domain

### Option 2: Deploy via Amplify CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify in your project
amplify init

# Add hosting
amplify add hosting

# Select "Hosting with Amplify Console"
# Choose "Manual deployment"

# Publish
amplify publish
```

### Post-Deployment Steps

1. **Update Documentation**
   - Add your Amplify URL to `README.md`
   - Update `JUDGES_README.md` with live demo link

2. **Test the Deployment**
   - Visit your Amplify URL
   - Test all features:
     - Boot sequence
     - Desktop environment
     - Window management
     - Glitch effects
     - Audio (may need user interaction)

3. **Configure Custom Domain (Optional)**
   - In Amplify Console, go to "Domain management"
   - Add your custom domain
   - Follow DNS configuration steps

### Troubleshooting

**Build Fails:**
- Check Node.js version (should be 18+)
- Verify `package.json` scripts
- Check build logs in Amplify Console

**App Doesn't Load:**
- Check browser console for errors
- Verify `dist` folder is being deployed
- Check routing configuration

**Audio Doesn't Work:**
- This is expected - browsers require user interaction for audio
- Audio will work after user clicks/types

### Environment Variables (if needed)

If you add any environment variables later:

1. Go to Amplify Console
2. Select your app
3. Go to "Environment variables"
4. Add variables with `VITE_` prefix

Example:
```
VITE_API_URL=https://api.example.com
```

### Continuous Deployment

AWS Amplify automatically deploys when you push to your connected branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Amplify will automatically:
1. Detect the push
2. Run the build
3. Deploy the new version
4. Update the live site

### Monitoring

- **Build History**: View all deployments in Amplify Console
- **Logs**: Check build and deploy logs for issues
- **Analytics**: Enable Amplify Analytics for usage metrics

### Cost

AWS Amplify Free Tier includes:
- 1,000 build minutes per month
- 15 GB served per month
- 5 GB stored per month

NecroOS should easily fit within free tier limits.

## Alternative Deployment Options

### Vercel (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Netlify (Alternative)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

### GitHub Pages (Alternative)

1. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/necroos",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Deploy:
```bash
npm run deploy
```

## Recommended: AWS Amplify

For this hackathon, AWS Amplify is recommended because:
- ✅ Free tier is generous
- ✅ Automatic CI/CD from GitHub
- ✅ Easy custom domains
- ✅ Built-in SSL
- ✅ Global CDN
- ✅ Easy rollbacks

## After Deployment

Update these files with your live URL:

1. **README.md**
   ```markdown
   **Live Demo:** https://your-app.amplifyapp.com
   ```

2. **JUDGES_README.md**
   ```markdown
   **Live Demo:** https://your-app.amplifyapp.com
   ```

3. **KIRO_HACKATHON_BLOG.md**
   ```markdown
   Try NecroOS: https://your-app.amplifyapp.com
   ```

## Success!

Once deployed, your NecroOS will be live and accessible worldwide. Share the link in your hackathon submission!

---

**Need Help?**
- AWS Amplify Docs: https://docs.amplify.aws/
- Amplify Discord: https://discord.gg/amplify
