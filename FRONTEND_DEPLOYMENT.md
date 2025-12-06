# Frontend Deployment Guide

This guide covers deploying the HeartSpace frontend separately from the backend.

## Option 1: Deploy to Vercel (Recommended for Frontend)

Vercel is optimized for React/Vite applications and offers excellent performance.

### Prerequisites
- GitHub repository with your code
- Backend API URL (your Render backend URL)

### Steps

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Import your `HeartSpace` repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**
   Add these in Vercel dashboard:
   - `VITE_API_URL` = Your backend API URL (e.g., `https://heartspace.onrender.com/api`)
     - **Important**: Include `/api` at the end
     - Example: `https://your-backend.onrender.com/api`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain

---

## Option 2: Deploy to Netlify

Netlify is another great option for frontend deployment.

### Steps

1. **Go to Netlify**
   - Visit https://www.netlify.com
   - Sign up/Login with GitHub

2. **Import Your Repository**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select `HeartSpace` repository

3. **Configure Build Settings**
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

4. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend.onrender.com/api`

5. **Deploy**
   - Click "Deploy site"
   - Your app will be live at `https://random-name.netlify.app`

### Custom Domain
- Go to Domain settings → Add custom domain

---

## Option 3: Deploy to Render (Separate Service)

You can deploy the frontend as a separate static site on Render.

### Steps

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Click "New +" → "Static Site"

2. **Connect Repository**
   - Connect your GitHub account
   - Select `HeartSpace` repository

3. **Configure Static Site**
   - **Name**: `heartspace-frontend` (or any name)
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**
   - Add: `VITE_API_URL` = `https://your-backend.onrender.com/api`

5. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment

---

## Option 4: Deploy to GitHub Pages

Free hosting option using GitHub Pages.

### Steps

1. **Update vite.config.js**
   Add this to your `client/vite.config.js`:
   ```js
   export default defineConfig({
     base: '/HeartSpace/', // Replace with your repo name
     // ... rest of config
   })
   ```

2. **Install gh-pages**
   ```bash
   cd client
   npm install --save-dev gh-pages
   ```

3. **Add deploy script to package.json**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: `gh-pages` branch
   - Your site: `https://yourusername.github.io/HeartSpace`

---

## Important Configuration

### Update API Configuration

Make sure your `client/src/utils/api.js` uses the environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
```

### CORS Configuration

If deploying frontend separately, ensure your backend allows CORS from your frontend domain:

In `server/index.js`, update CORS:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-frontend.netlify.app',
    'http://localhost:3000' // for local development
  ],
  credentials: true
}));
```

Or for all origins (less secure, but easier):
```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

### Environment Variables Summary

**For Frontend:**
- `VITE_API_URL` = Your backend API URL (e.g., `https://heartspace-backend.onrender.com/api`)

**For Backend (if separate):**
- `NODE_ENV` = `production`
- `MONGODB_URI` = Your MongoDB connection string
- `JWT_SECRET` = Your JWT secret
- `GEMINI_API_KEY` = Your Gemini API key
- `PORT` = `10000` (or let Render set it)

---

## Testing After Deployment

1. **Check API Connection**
   - Open browser console
   - Try logging in/registering
   - Check for CORS errors

2. **Verify Environment Variables**
   - Make sure `VITE_API_URL` is set correctly
   - Check network tab for API calls

3. **Test All Features**
   - Login/Register
   - Create journal entry
   - Generate AI insights
   - View entries

---

## Troubleshooting

### CORS Errors
- **Symptom**: `Access-Control-Allow-Origin` errors in console
- **Fix**: Update backend CORS configuration to include your frontend URL

### API Not Found (404)
- **Symptom**: API calls return 404
- **Fix**: Check that `VITE_API_URL` includes `/api` at the end

### Environment Variables Not Working
- **Symptom**: Still using localhost API
- **Fix**: 
  - Restart deployment after adding env vars
  - Check variable name is exactly `VITE_API_URL`
  - Rebuild the application

### Build Fails
- **Symptom**: Build errors during deployment
- **Fix**: 
  - Check build logs
  - Ensure all dependencies are in `package.json`
  - Try building locally: `cd client && npm run build`

---

## Recommended Setup

**Best Practice**: Deploy backend to Render and frontend to Vercel
- Backend: Render (handles API, database connections)
- Frontend: Vercel (optimized for React/Vite, fast CDN)

This gives you:
- ✅ Separate scaling
- ✅ Better performance (CDN for frontend)
- ✅ Independent deployments
- ✅ Free tiers for both

---

## Quick Reference

### Vercel
- **URL**: https://vercel.com
- **Best for**: React/Vite apps
- **Free tier**: Yes
- **Custom domain**: Yes

### Netlify
- **URL**: https://www.netlify.com
- **Best for**: Static sites, JAMstack
- **Free tier**: Yes
- **Custom domain**: Yes

### Render (Static Site)
- **URL**: https://render.com
- **Best for**: Simple static hosting
- **Free tier**: Yes
- **Custom domain**: Yes (paid)

### GitHub Pages
- **URL**: https://pages.github.com
- **Best for**: Open source projects
- **Free tier**: Yes
- **Custom domain**: Yes

