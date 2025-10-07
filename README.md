# 🌊 WaveX - Smart Fridge Tracker

> Demo Video

## 📱 Overview

WaveX is an intelligent fridge management system that helps reduce food waste by tracking your fridge contents and never missing expiration dates. Built with AI-powered camera recognition and smart notifications.

## ✨ Key Features

- Instant item detection using camera and OpenAI API
- Visual calendar with expiration date management
- Filter and organize items by dairy, meat, produce, pantry, and more
- Get alerts for expiring items
- Dark theme with modern UI

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router - Client-side routing
- Vite - Fast build tool and dev server
- Tailwind CSS
- Lucide React - Icon library

### Backend
- Node.js
- Express - Web framework
- OpenAI API - AI image analysis
- Sharp - Image processing
- Node-cron - Scheduled notifications
- CORS - Cross-origin resource sharing
- Multer - File upload handling

### Development Tools
- ESLint
- Nodemon
- Figma

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wavex
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

4. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📱 Application Pages

- **🏠 Home**: Overview of fridge contents with category analytics
- **📅 Calendar**: Visual calendar showing item expiration dates
- **🔔 Notifications**: Manage expiring item alerts
- **📷 Camera**: AI-powered item detection and recognition

## 🔧 API Endpoints

### Items API
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `POST /api/items/analyze-image` - AI image analysis

### Notifications API
- `GET /api/notifications` - Get notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id` - Update notification
- `DELETE /api/notifications` - Delete notifications

For detailed API documentation, see [API_EXAMPLES.md](backend/API_EXAMPLES.md)

## 👥 Team

Created by **[Arya](https://github.com/aryasync), [Mark](https://github.com/mbaclagan), Ella, and Nidhi** for **HelloHacks 2025** (UBC BizTech)

[Our Devpost Submission](https://devpost.com/software/wavex-c5hfbo)
