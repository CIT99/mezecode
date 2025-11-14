# Netlify Deployment Guide

This guide will walk you through deploying your Mezcode application to Netlify.

## Prerequisites

- A GitHub account (or GitLab/Bitbucket)
- Your code pushed to a Git repository
- Node.js and npm installed locally (for testing builds)

## Step 1: Create Netlify Account

1. Go to [netlify.com](https://www.netlify.com)
2. Click "Sign up" in the top right
3. Choose to sign up with GitHub (recommended) or email
4. Complete the signup process

## Step 2: Connect Your Repository

### Option A: Via Netlify Dashboard (Recommended)

1. Log in to your Netlify dashboard
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your `mezecode` repository
6. Netlify will detect the `netlify.toml` configuration automatically

### Option B: Via Netlify CLI

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Step 3: Verify Build Settings

Netlify should automatically detect your build settings from `netlify.toml`:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: Netlify will use the latest LTS version

If you need to verify or change these:
1. Go to Site settings → Build & deploy
2. Review the build settings
3. Ensure they match your `netlify.toml` configuration

## Step 4: Test Your Build Locally

Before deploying, test your build locally:

```bash
# Install dependencies
npm install

# Run the build
npm run build

# Preview the build
npm run preview
```

Visit `http://localhost:4173` (or the port shown) to verify everything works.

## Step 5: Deploy

### Automatic Deployments

Once connected, Netlify will automatically:
- Deploy when you push to your main branch
- Create preview deployments for pull requests
- Rebuild when you update your repository

### Manual Deploy

1. Push your code to your repository:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Netlify will automatically start building
3. Watch the build logs in the Netlify dashboard
4. Once complete, your site will be live!

## Step 6: Verify Security Headers

After deployment, verify security headers are working:

1. Visit your deployed site
2. Open browser DevTools → Network tab
3. Reload the page
4. Click on the main document request
5. Check the Response Headers section
6. Verify you see:
   - `Content-Security-Policy`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-Content-Type-Options: nosniff`
   - `X-XSS-Protection: 1; mode=block`

You can also use online tools like:
- [SecurityHeaders.com](https://securityheaders.com)
- [Observatory by Mozilla](https://observatory.mozilla.org)

## Step 7: Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain name
4. Follow Netlify's DNS configuration instructions
5. Netlify will automatically provision SSL certificates

## Troubleshooting

### Build Fails

1. Check build logs in Netlify dashboard
2. Verify Node.js version compatibility
3. Ensure all dependencies are in `package.json`
4. Check for environment variables if needed

### Security Headers Not Showing

1. Verify `netlify.toml` is in the root directory
2. Check that headers section is properly formatted
3. Clear browser cache and check again
4. Verify you're checking the correct URL (not a redirect)

### Code Execution Issues

1. Verify iframe sandbox attributes are working
2. Check browser console for CSP violations
3. Test code execution in the preview iframe
4. Review security headers for any conflicts

## Security Notes

- Code execution happens in sandboxed iframes with `sandbox="allow-scripts"`
- User code is validated and sanitized before execution
- Error messages are sanitized to prevent XSS
- Security headers are configured in `netlify.toml`
- Content Security Policy allows necessary inline scripts for code editor

## Next Steps

- Set up environment variables if needed (Site settings → Environment variables)
- Configure form handling if you add forms
- Set up analytics (optional)
- Configure branch previews for testing

## Support

- [Netlify Documentation](https://docs.netlify.com)
- [Netlify Community](https://answers.netlify.com)
- [Netlify Status](https://www.netlifystatus.com)

