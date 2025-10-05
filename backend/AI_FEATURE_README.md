# AI Image Analysis Feature

## Overview
This feature allows users to upload an image of food items and automatically extract food information and estimated expiry dates using AI.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenAI API Key
Create a `.env` file in the backend directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start the Server
```bash
npm run dev
```

## API Endpoint

### POST `/api/items/analyze-image`

Upload an image to analyze food items and automatically create items.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `image` field containing the image file

**Response:**
```json
{
  "success": true,
  "message": "Successfully analyzed image and created 3 items",
  "items": [
    {
      "id": "generated_id",
      "name": "Apples",
      "expiryDate": "2025-01-20",
      "addedDate": "2025-01-10",
      "category": "produce"
    }
  ],
  "createdCount": 3,
  "totalDetected": 3
}
```

## Features

- **Image Processing**: Automatically resizes and optimizes images for AI analysis
- **AI Analysis**: Uses OpenAI GPT-4 Vision to identify food items
- **Smart Categorization**: Automatically categorizes items (dairy, meat, produce, beverages, other)
- **Expiry Estimation**: AI estimates expiry dates based on food freshness
- **Bulk Creation**: Creates multiple items from a single image
- **Error Handling**: Graceful handling of AI failures and validation errors

## Supported Image Formats
- JPEG, PNG, GIF, WebP
- Maximum file size: 10MB
- Images are automatically resized to 1024x1024 for optimal AI analysis

## AI Response Schema
The AI returns a JSON array with this structure:
```json
[
  {
    "name": "string",
    "category": "dairy|meat|produce|pantry|other",
    "expiryDate": "YYYY-MM-DD"
  }
]
```

**Note**: Categories are dynamically configured in `config/index.js` under `business.supportedCategories`.

## Error Handling
- Invalid image files
- Missing API key
- AI analysis failures
- Item creation errors
- Network timeouts

## Testing
You can test the endpoint using curl:
```bash
curl -X POST \
  -F "image=@/path/to/your/image.jpg" \
  http://localhost:3001/api/items/analyze-image
```
