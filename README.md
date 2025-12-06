# HeartSpace - Mental Health Journal with AI Insights

A beautiful, full-stack MERN application for mental health journaling with AI-powered insights using Google's Gemini API.

## ✨ Features

- 📝 **Journal Entries**: Create, edit, and delete journal entries with mood tracking
- 😊 **Mood Tracking**: Track your emotional state with each entry
- 🤖 **AI Insights**: Get AI-powered insights using Google Gemini API that:
  - Detects anxiety, burnout, sadness, and confidence levels
  - Provides empathetic insights and analysis
  - Offers positivity recommendations
  - Suggests specific meditation practices
  - Recommends actionable tasks
- 🔐 **Authentication**: Secure user authentication with JWT
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **AI**: Google Gemini API
- **Authentication**: JWT

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

## 🚀 Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd HeartSpace
```

2. **Install all dependencies:**
```bash
npm run install-all
```

3. **Set up environment variables:**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/heartspace
   JWT_SECRET=your_super_secret_jwt_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   Or copy the example file:
   ```bash
   cp server/env.example.txt server/.env
   ```
   Then edit `server/.env` and add your actual values.

4. **Get your Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key and add it to your `.env` file
   - **Important**: Make sure the Generative AI API is enabled in your Google Cloud project
   - If you get "model not available" errors, check:
     - Your API key is valid and active
     - Generative AI API is enabled in [Google Cloud Console](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com)
     - Your API key has the necessary permissions

## 🏃 Running the Application

### Development Mode

From the root directory:
```bash
npm run dev
```

This will start:
- **Backend server** on `http://localhost:5000`
- **Frontend** on `http://localhost:3000`

### Or run separately:

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

## 📁 Project Structure

```
HeartSpace/
├── server/
│   ├── models/          # MongoDB models (User, JournalEntry)
│   ├── routes/          # API routes (auth, journal, insights)
│   ├── middleware/      # Auth middleware
│   ├── index.js         # Server entry point
│   └── .env            # Environment variables (create this)
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context (Auth)
│   │   └── utils/       # Utility functions
│   └── vite.config.js   # Vite configuration
└── package.json         # Root package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Journal Entries
- `GET /api/journal` - Get all entries
- `GET /api/journal/:id` - Get single entry
- `POST /api/journal` - Create entry
- `PUT /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry

### AI Insights
- `POST /api/insights/generate/:entryId` - Generate AI insights
- `GET /api/insights/:entryId` - Get insights for entry

## 💡 Usage

1. **Register/Login**: Create an account or sign in
2. **Create Entry**: Click "New Entry" to write about your thoughts and feelings
3. **Select Mood**: Choose how you're feeling
4. **Save Entry**: Your entry is saved automatically
5. **Generate Insights**: Click "Generate Insights" to get AI-powered analysis
6. **View Insights**: See detected states, recommendations, meditation suggestions, and tasks

## 🎨 UI Features

- Gradient backgrounds with smooth transitions
- Animated components using Framer Motion
- Color-coded mental health state indicators
- Beautiful card-based layouts
- Responsive design for all devices

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Use a strong, random JWT_SECRET in production
- Keep your Gemini API key secure
- The `.env` file is already in `.gitignore`

## 📝 License

ISC

## 🙏 Acknowledgments

- Google Gemini API for AI insights
- Tailwind CSS for styling
- React and Vite for the frontend framework

