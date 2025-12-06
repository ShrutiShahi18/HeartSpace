# Deployment Guide for Render

This guide will help you deploy HeartSpace to Render.

## Prerequisites

1. **MongoDB Atlas Account** (Free tier is fine)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string

2. **Gemini API Key**
   - Get your API key from https://makersuite.google.com/app/apikey

3. **GitHub Repository**
   - Push your code to GitHub

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub.

### 2. Create a Render Account

1. Go to https://render.com
2. Sign up for a free account (connect with GitHub)

### 3. Create a New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the `HeartSpace` repository

### 4. Configure the Service

**Basic Settings:**
- **Name**: `heartspace` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (root of repo)
- **Runtime**: `Node`
- **Build Command**: 
  ```
  cd client && npm install --include=dev && npm run build && cd ../server && npm install --production
  ```
- **Start Command**: 
  ```
  cd server && node index.js
  ```

**Environment Variables:**
Add these in the Render dashboard:

1. **NODE_ENV** = `production`

2. **MONGODB_URI** = Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/heartspace?retryWrites=true&w=majority`
   - Replace `username`, `password`, and `cluster` with your actual values

3. **JWT_SECRET** = A random secret string (generate one)
   - You can use: `openssl rand -base64 32` or any random string generator

4. **GEMINI_API_KEY** = Your Gemini API key from Google

5. **PORT** = `10000` (Render sets this automatically, but you can specify)

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your app
3. Wait for the build to complete (usually 5-10 minutes)

### 6. Access Your App

Once deployed, you'll get a URL like: `https://heartspace.onrender.com`

## Alternative: Using render.yaml

If you prefer, you can use the `render.yaml` file included in the project:

1. In Render dashboard, go to **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Render will automatically detect and use `render.yaml`
4. You'll still need to add environment variables in the dashboard

## Troubleshooting

### Build Fails

- Check the build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify build command is correct

### MongoDB Connection Issues

- Verify your MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas (add `0.0.0.0/0` for Render)
- Ensure database user has proper permissions

### API Not Working

- Check that `VITE_API_URL` is not set (it should use relative paths in production)
- Verify CORS settings if needed
- Check server logs in Render dashboard

### Frontend Not Loading

- Verify the build completed successfully
- Check that static files are being served correctly
- Look at browser console for errors

## Environment Variables Summary

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heartspace
JWT_SECRET=your_random_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=10000
```

## Notes

- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for always-on service
- MongoDB Atlas free tier is sufficient for development and small projects

## Post-Deployment

1. Test all features (login, register, create entry, AI insights)
2. Monitor logs for any errors
3. Set up custom domain (optional, paid feature)
4. Enable auto-deploy from main branch (default)

