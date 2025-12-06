# Deploy Frontend to Render - Step by Step Guide

This guide will help you deploy the HeartSpace frontend as a separate static site on Render.

## Prerequisites

1. ✅ Backend already deployed on Render (or have the backend URL ready)
2. ✅ GitHub repository with your code
3. ✅ Render account (sign up at https://render.com)

## Step-by-Step Instructions

### Step 1: Go to Render Dashboard

1. Visit https://render.com
2. Sign in (or sign up if you don't have an account)
3. Click **"New +"** button in the top right

### Step 2: Create Static Site

1. Click **"Static Site"** from the dropdown menu
2. You'll see the "Create a new static site" page

### Step 3: Connect Your Repository

1. **Connect account**: If not already connected, click "Connect account" and authorize Render to access your GitHub
2. **Repository**: Select `ShrutiShahi18/HeartSpace` (or your repository name)
3. Click **"Connect"**

### Step 4: Configure the Static Site

Fill in the following settings:

**Basic Settings:**
- **Name**: `heartspace-frontend` (or any name you prefer)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `client` ⚠️ **IMPORTANT**: This tells Render to look in the `client` folder

**Build Settings:**
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Publish Directory**: `dist` ⚠️ **IMPORTANT**: This is where Vite outputs the built files

### Step 5: Add Environment Variable

**Before clicking "Create Static Site"**, click **"Advanced"** to expand advanced settings:

1. Click **"Add Environment Variable"**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL with `/api` at the end
     - Example: `https://heartspace.onrender.com/api`
     - ⚠️ **IMPORTANT**: Include `/api` at the end!
     - If your backend is `https://heartspace-abc123.onrender.com`, use `https://heartspace-abc123.onrender.com/api`

### Step 6: Deploy

1. Click **"Create Static Site"** at the bottom
2. Render will start building your frontend
3. Wait for the build to complete (usually 3-5 minutes)

### Step 7: Get Your Frontend URL

Once deployment is complete:
- Your frontend will be available at: `https://heartspace-frontend.onrender.com` (or your chosen name)
- You can find the URL in the Render dashboard

## Configuration Summary

Here's a quick reference of what you need:

| Setting | Value |
|---------|-------|
| **Name** | `heartspace-frontend` |
| **Branch** | `main` |
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Environment Variable** | `VITE_API_URL` = `https://your-backend.onrender.com/api` |

## Update Backend CORS (If Needed)

If you get CORS errors, update your backend CORS settings:

1. Go to your backend service on Render
2. Go to **Environment** tab
3. Add environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://heartspace-frontend.onrender.com`
4. Redeploy the backend

Or manually update `server/index.js` to include your frontend URL in the allowed origins.

## Testing After Deployment

1. **Visit your frontend URL**: `https://heartspace-frontend.onrender.com`
2. **Try to register/login**: Check browser console for errors
3. **Test API connection**: 
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try logging in
   - Check if API calls are going to the correct backend URL

## Troubleshooting

### Build Fails

**Error**: "Cannot find module"
- **Fix**: Make sure `Root Directory` is set to `client`
- Check that all dependencies are in `client/package.json`

**Error**: "Build command failed"
- **Fix**: Check build logs in Render dashboard
- Try building locally: `cd client && npm run build`

### API Not Working

**Error**: "Network Error" or CORS errors
- **Fix**: 
  1. Check `VITE_API_URL` includes `/api` at the end
  2. Verify backend is running
  3. Update backend CORS to allow your frontend domain

**Error**: "404 Not Found" for API calls
- **Fix**: Check that `VITE_API_URL` is set correctly
- Should be: `https://your-backend.onrender.com/api`

### Environment Variables Not Working

**Symptom**: Still using localhost API
- **Fix**: 
  1. Make sure variable name is exactly `VITE_API_URL` (case-sensitive)
  2. Redeploy after adding environment variables
  3. Clear browser cache

### Page Shows "Cannot GET /"

**Fix**: This shouldn't happen with static sites, but if it does:
- Check that `Publish Directory` is set to `dist`
- Verify the build completed successfully

## Quick Checklist

Before deploying, make sure:

- [ ] Backend is deployed and working
- [ ] You have the backend URL (e.g., `https://heartspace.onrender.com`)
- [ ] Root Directory is set to `client`
- [ ] Publish Directory is set to `dist`
- [ ] Build Command is `npm install && npm run build`
- [ ] `VITE_API_URL` environment variable is set with `/api` at the end

## After Deployment

Once deployed:

1. ✅ Test the frontend URL
2. ✅ Try registering a new account
3. ✅ Test creating a journal entry
4. ✅ Test AI insights generation
5. ✅ Check browser console for any errors

## Custom Domain (Optional - Paid Feature)

If you want a custom domain:

1. Go to your static site in Render dashboard
2. Click **"Settings"** tab
3. Scroll to **"Custom Domains"**
4. Add your domain
5. Follow DNS configuration instructions

## Cost

- **Free tier**: Available for static sites
- **Limitations**: 
  - Service may spin down after inactivity
  - First request after spin-down may be slow
- **Upgrade**: Paid plans available for always-on service

## Next Steps

After successful deployment:

1. Share your frontend URL with users
2. Monitor deployment logs for any issues
3. Set up auto-deploy from main branch (enabled by default)
4. Consider setting up a custom domain

---

**Need Help?** Check the build logs in Render dashboard for detailed error messages.

