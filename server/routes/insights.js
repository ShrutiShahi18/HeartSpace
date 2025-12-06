const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const JournalEntry = require('../models/JournalEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize Gemini AI
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not set in environment variables');
}

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Generate AI insights for a journal entry
router.post('/generate/:entryId', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.entryId,
      user: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if Gemini API is configured
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        message: 'AI service is not configured. Please set GEMINI_API_KEY in your server/.env file.\n\nSteps:\n1. Get API key from https://makersuite.google.com/app/apikey\n2. Enable Generative Language API: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com\n3. Add GEMINI_API_KEY=your_key to server/.env\n4. Restart server',
        error: 'GEMINI_API_KEY missing'
      });
    }

    // Try ALL available Gemini models in order of preference
    // Newer models first, then fallback to older ones
    const modelNames = [
      'gemini-2.0-flash-exp',      // Latest experimental
      'gemini-2.0-flash',          // Latest stable
      'gemini-1.5-flash-latest',   // Latest 1.5 flash
      'gemini-1.5-pro-latest',     // Latest 1.5 pro
      'gemini-1.5-flash',          // Stable 1.5 flash
      'gemini-1.5-pro',            // Stable 1.5 pro
      'gemini-pro',                // Original pro
      'gemini-1.0-pro'             // Original 1.0 pro
    ];

    // Create comprehensive prompt for AI insights
    const prompt = `You are a compassionate mental health AI assistant. Analyze the following journal entry and provide detailed insights.

**Your task:**
1. Detect mental health states (rate each 0-100):
   - Anxiety: Signs of worry, stress, nervousness, panic
   - Burnout: Signs of exhaustion, overwhelm, lack of motivation, feeling drained
   - Sadness: Signs of low mood, grief, disappointment, melancholy
   - Confidence: Signs of self-assurance, positivity, self-belief, empowerment

2. Provide insights and positivity recommendations:
   - Acknowledge their feelings with empathy and validation
   - Highlight positive aspects and strengths you notice in their writing
   - Offer gentle, constructive feedback and perspective
   - Be warm, supportive, and non-judgmental

3. Suggest actionable recommendations:
   - A specific meditation practice (type, duration, focus area)
   - 2-3 concrete tasks or activities they can do today

**Format your response as JSON only:**
{
  "detectedStates": {
    "anxiety": <0-100>,
    "burnout": <0-100>,
    "sadness": <0-100>,
    "confidence": <0-100>
  },
  "insights": "<warm, empathetic analysis (200-300 words)>",
  "positivityRecommendation": "<specific positive affirmation or reframing (2-3 sentences)>",
  "meditation": "<specific meditation suggestion with type and focus (2-3 sentences)>",
  "tasks": ["<task 1>", "<task 2>", "<task 3>"]
}

**Journal Entry:**
Title: ${entry.title}
Mood: ${entry.mood}
Content: ${entry.content}
${entry.tags.length > 0 ? `Tags: ${entry.tags.join(', ')}` : ''}

**Important:** Respond ONLY with valid JSON, no additional text, markdown, or code blocks before or after the JSON.`;

    // Generate content with error handling and model fallback
    let result, response, insightsText;
    let lastError = null;
    let model;
    
    // Try each model in order until one works
    console.log(`\n🔄 Attempting to use Gemini API with ${modelNames.length} available models...\n`);
    
    for (let i = 0; i < modelNames.length; i++) {
      const modelName = modelNames[i];
      try {
        console.log(`[${i + 1}/${modelNames.length}] 🔍 Trying model: ${modelName}`);
        model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        response = await result.response;
        insightsText = response.text();
        
        if (!insightsText || insightsText.trim().length === 0) {
          throw new Error('Empty response from Gemini API');
        }
        
        // Success! Break out of the loop
        console.log(`\n✅ SUCCESS! Using model: ${modelName}\n`);
        break;
      } catch (apiError) {
        const apiErrorMsg = (apiError.message || '').toLowerCase();
        const errorCode = apiError.code || apiError.response?.status || 'N/A';
        
        console.error(`❌ Model ${modelName} failed:`, apiError.message);
        console.error(`   Error code: ${errorCode}`);
        
        // Only log full details for non-404 errors (404 means model doesn't exist, which is expected)
        if (errorCode !== 404 && errorCode !== '404') {
          console.error('   Full error details:', {
            message: apiError.message,
            code: apiError.code,
            status: apiError.response?.status,
            data: apiError.response?.data
          });
        }
        
        lastError = apiError;
        
        // Check for API access/permission errors - don't try other models if it's an access issue
        // These errors indicate a fundamental API access problem, not just model unavailability
        if (apiErrorMsg.includes('permission') || 
            apiErrorMsg.includes('api key') || 
            apiErrorMsg.includes('not enabled') ||
            apiErrorMsg.includes('access denied') ||
            apiErrorMsg.includes('invalid') ||
            errorCode === 401 ||
            errorCode === 403) {
          const detailedError = `API access issue detected.\n\nPlease:\n1. Verify your API key at https://makersuite.google.com/app/apikey\n2. Enable Generative Language API: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com\n3. Wait 2-3 minutes after enabling\n4. Ensure your API key has proper permissions\n\nOriginal error: ${apiError.message}`;
          throw new Error(detailedError);
        }
        
        // If this is the last model, throw the error
        if (i === modelNames.length - 1) {
          console.error(`\n❌ All ${modelNames.length} models failed. Last error: ${apiError.message}\n`);
          throw new Error(`All ${modelNames.length} models failed. Last error: ${apiError.message || 'Failed to generate content. Please check your API key and access permissions.'}`);
        }
        
        // Otherwise, continue to next model
        console.log(`   ⏭️  Trying next model...\n`);
        continue;
      }
    }
    
    // If we get here and insightsText is still undefined, something went wrong
    if (!insightsText) {
      throw new Error(`Failed to generate content with any available model. ${lastError?.message || ''}`);
    }
    
    // Clean up the response (remove markdown code blocks if present)
    insightsText = insightsText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let insightsData;
    try {
      insightsData = JSON.parse(insightsText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', insightsText);
      // Fallback: create a basic response
      insightsData = {
        detectedStates: {
          anxiety: 50,
          burnout: 50,
          sadness: 50,
          confidence: 50
        },
        insights: insightsText.substring(0, 500) || 'Thank you for sharing your thoughts. Your feelings are valid and important.',
        positivityRecommendation: 'Remember that every day is a new opportunity for growth and healing.',
        meditation: 'Try a 10-minute breathing meditation focusing on deep, slow breaths.',
        tasks: ['Take a short walk outside', 'Write down three things you\'re grateful for', 'Connect with a friend or loved one']
      };
    }

    // Update entry with structured insights
    try {
      entry.aiInsights = insightsData.insights;
      entry.detectedStates = insightsData.detectedStates;
      entry.recommendations = {
        positivity: insightsData.positivityRecommendation,
        meditation: insightsData.meditation,
        tasks: insightsData.tasks || []
      };
      entry.aiInsightsGenerated = true;
      await entry.save();

      res.json({ 
        insights: insightsData.insights,
        detectedStates: insightsData.detectedStates,
        recommendations: {
          positivity: insightsData.positivityRecommendation,
          meditation: insightsData.meditation,
          tasks: insightsData.tasks
        }
      });
    } catch (saveError) {
      console.error('Error saving insights to database:', saveError);
      // Still return the insights even if save fails
      res.json({ 
        insights: insightsData.insights,
        detectedStates: insightsData.detectedStates,
        recommendations: {
          positivity: insightsData.positivityRecommendation,
          meditation: insightsData.meditation,
          tasks: insightsData.tasks
        }
      });
    }
  } catch (error) {
    console.error('\n=== Gemini API Error ===');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      console.error('Error response headers:', error.response.headers);
    }
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
    console.error('Full error:', error);
    console.error('========================\n');
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to generate insights';
    const errorMsg = (error.message || '').toLowerCase();
    const errorResponse = error.response?.data || {};
    const errorResponseStr = JSON.stringify(errorResponse).toLowerCase();
    
    // Check for specific error types
    if (errorMsg.includes('api_key') || errorMsg.includes('api key') || errorMsg.includes('invalid') || errorResponseStr.includes('api key')) {
      errorMessage = 'Invalid or missing Gemini API key.\n\nPlease:\n1. Check server/.env file has GEMINI_API_KEY=your_key\n2. Verify the key at https://makersuite.google.com/app/apikey\n3. Restart your server after adding the key';
    } else if (errorMsg.includes('quota') || errorMsg.includes('rate limit') || errorMsg.includes('429') || errorResponseStr.includes('quota')) {
      errorMessage = 'API quota exceeded. Please try again later or check your API usage limits.';
    } else if (errorMsg.includes('model') || errorMsg.includes('not available') || errorMsg.includes('not found') || errorMsg.includes('403') || errorMsg.includes('permission') || errorResponseStr.includes('model')) {
      errorMessage = 'Model not available. Please check:\n\n1. Enable Generative Language API: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com\n2. Verify API key at https://makersuite.google.com/app/apikey\n3. Wait a few minutes after enabling the API\n4. Check API key has proper permissions';
    } else if (errorMsg.includes('safety') || errorMsg.includes('blocked') || errorResponseStr.includes('safety')) {
      errorMessage = 'Content was blocked by safety filters. Please try rephrasing your journal entry.';
    } else {
      // Show the actual error message for debugging
      errorMessage = `Error: ${error.message || 'Unknown error'}\n\nCheck server console for detailed logs.`;
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: error.message,
      apiError: error.response?.data || null,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get insights for an entry
router.get('/:entryId', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.entryId,
      user: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ 
      insights: entry.aiInsights,
      detectedStates: entry.detectedStates,
      recommendations: entry.recommendations,
      generated: entry.aiInsightsGenerated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

