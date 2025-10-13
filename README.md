# 🚀 Ecosystia - AI-Powered Ecosystem Management Platform

**Version:** 1.0.0  
**Date:** October 2025

Ecosystia is a comprehensive ecosystem management platform powered by AI, designed to empower teams and individuals across multiple sectors including education, entrepreneurship, project management, and workforce development.

## 🌟 Key Features

- **18 Functional Modules** covering workspace management, development, AI tools, and administration
- **19 User Roles** with granular permission system
- **AI Integration** with Google Gemini for intelligent assistance
- **Professional Exports** (PDF & Excel) for reports and data
- **Appwrite Backend** for scalable, secure data management
- **Multilingual Support** (English & French)

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Gemini API Key (Optional - app works in mock mode without it):
   - Get your API key from: https://aistudio.google.com/app/apikey
   - Create a `.env` file in the root directory
   - Add your API key:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open your browser to: http://localhost:5173

**Note:** The application works in mock mode if no API key is provided. AI features will return simulated responses.
