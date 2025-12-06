# Gemini API Setup Guide

## Step-by-Step Instructions to Enable Gemini API

### 1. Enable Generative AI API in Google Cloud Console

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Navigate to APIs & Services:**
   - Click on the hamburger menu (☰) in the top left
   - Go to **APIs & Services** → **Library**

3. **Search for Generative AI API:**
   - In the search bar, type: `Generative Language API`
   - Or go directly to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

4. **Enable the API:**
   - Click on "Generative Language API"
   - Click the **"Enable"** button
   - Wait for it to activate (usually takes 1-2 minutes)

### 2. Create or Get Your API Key

**Option A: Using Google AI Studio (Recommended - Easier)**
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select your Google Cloud project (or create a new one)
5. Copy the API key

**Option B: Using Google Cloud Console**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the API key
4. (Optional) Click "Restrict Key" and select "Restrict key" → Choose "Generative Language API" under API restrictions

### 3. Add API Key to Your Project

1. Open `server/.env` file
2. Add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. **Important:** Don't add quotes around the API key
4. Save the file

### 4. Restart Your Server

After adding the API key, restart your server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 5. Verify It's Working

1. Check your server console - you should see:
   - ✅ No warnings about missing GEMINI_API_KEY
   - When you generate insights, you'll see: "Trying model: gemini-1.5-flash" or "Successfully used model: ..."

2. Try generating insights on a journal entry
3. If it works, you'll see AI insights appear!

## Troubleshooting

### "Model not available" Error
- Make sure the **Generative Language API** is enabled (not just "Generative AI API")
- Wait a few minutes after enabling - it takes time to activate
- Try creating a new API key

### "API key invalid" Error
- Check that your API key is copied correctly (no extra spaces)
- Make sure there are no quotes around the key in `.env`
- Verify the key is active in Google Cloud Console

### "Permission denied" Error
- Check API key restrictions in Google Cloud Console
- Make sure the key has access to "Generative Language API"
- Try removing restrictions temporarily to test

### Still Not Working?
1. Check server console for detailed error messages
2. Verify your `.env` file is in the `server` folder (not root)
3. Make sure you restarted the server after adding the key
4. Try creating a fresh API key

## Quick Links

- **Enable API**: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
- **Get API Key**: https://makersuite.google.com/app/apikey
- **API Documentation**: https://ai.google.dev/gemini-api/docs

