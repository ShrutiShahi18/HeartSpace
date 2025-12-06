# Your Deployment Configuration

## Your URLs

- **Frontend**: https://heartspace-frame.onrender.com
- **Backend**: https://heartspace-3yuq.onrender.com

## Frontend Configuration (Render Static Site)

### Environment Variable to Set:

In your **frontend** Render service dashboard:

1. Go to your static site: `heartspace-frame`
2. Click **"Environment"** tab
3. Add/Update environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://heartspace-3yuq.onrender.com/api`
   - ⚠️ **IMPORTANT**: Include `/api` at the end!

4. **Redeploy** after adding/updating the variable

## Backend Configuration (Render Web Service)

### Environment Variables to Set:

In your **backend** Render service dashboard:

1. Go to your web service: `heartspace-3yuq`
2. Click **"Environment"** tab
3. Make sure these are set:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Your JWT secret
   - `GEMINI_API_KEY` = Your Gemini API key
   - `PORT` = `10000` (or leave empty, Render sets it automatically)
   - `FRONTEND_URL` = `https://heartspace-frame.onrender.com` (optional, for CORS)

4. **Redeploy** if you added `FRONTEND_URL`

## Quick Checklist

### Frontend:
- [ ] `VITE_API_URL` = `https://heartspace-3yuq.onrender.com/api`
- [ ] Redeployed after setting environment variable

### Backend:
- [ ] All required environment variables are set
- [ ] `FRONTEND_URL` = `https://heartspace-frame.onrender.com` (optional)
- [ ] Backend is running and accessible

## Testing

1. **Test Frontend**: Visit https://heartspace-frame.onrender.com
2. **Test Backend API**: Visit https://heartspace-3yuq.onrender.com/api/health
   - Should return: `{"status":"OK","message":"HeartSpace API is running"}`
3. **Test Connection**:
   - Open https://heartspace-frame.onrender.com
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try to register/login
   - Check if API calls are going to `https://heartspace-3yuq.onrender.com/api`

## Troubleshooting

### Frontend shows blank page or errors:
- Check browser console (F12) for errors
- Verify `VITE_API_URL` is set correctly
- Redeploy frontend after setting environment variable

### CORS errors:
- Backend CORS is configured to allow all origins
- If you still get CORS errors, add `FRONTEND_URL` to backend environment variables

### API calls failing:
- Check that backend URL is correct: `https://heartspace-3yuq.onrender.com/api`
- Verify backend is running (check Render dashboard)
- Check backend logs in Render dashboard

### 404 errors:
- Make sure `VITE_API_URL` includes `/api` at the end
- Verify backend routes are working: https://heartspace-3yuq.onrender.com/api/health

## How to Update Environment Variables in Render

### Frontend (Static Site):
1. Go to Render dashboard
2. Click on `heartspace-frame` service
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"** or edit existing
5. Set `VITE_API_URL` = `https://heartspace-3yuq.onrender.com/api`
6. Click **"Save Changes"**
7. **Redeploy** (or wait for auto-deploy)

### Backend (Web Service):
1. Go to Render dashboard
2. Click on `heartspace-3yuq` service
3. Go to **"Environment"** tab
4. Add/Update environment variables
5. Click **"Save Changes"**
6. Service will automatically redeploy

