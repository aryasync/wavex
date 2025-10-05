import OpenAI from "openai";
import sharp from "sharp";
import { config } from "../config/index.js";
import { ItemValidator } from "../utils/validation.util.js";
import dotenv from "dotenv";
dotenv.config();

class AIService {
  constructor() {
    // Check if API key is provided
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY not found. AI features will not work.');
      this.openai = null;
      return;
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Process and optimize image for AI analysis
   */
  async processImage(imageBuffer) {
    try {
      // Resize image to optimal size for AI analysis (max 1024x1024)
      const processedBuffer = await sharp(imageBuffer)
        .resize(1024, 1024, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      return processedBuffer;
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  /**
   * Analyze image and extract food items with expiry dates
   */
  async analyzeImage(imageBuffer) {
    // Check if OpenAI is initialized
    if (!this.openai) {
      throw new Error(
        "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
      );
    }

    try {
      const processedImage = await this.processImage(imageBuffer);
      const base64Image = processedImage.toString("base64");

      // Get categories from config
      const validCategories = config.business.supportedCategories;
      const categoryList = validCategories.join('|');
      
      const prompt = `Analyze this image of food items (either receipt or image of food items) and identify all visible food products. For each item, estimate:
1. The name of the food item
2. The category (${validCategories.join(', ')})
3. The estimated shelf life in days (expiryPeriod) based on the food's freshness and typical shelf life

Consider factors like:
- Freshness indicators (color, texture, packaging condition)
- Typical shelf life of each food type
- Storage conditions visible in the image
- Any visible expiry dates on packaging

Return ONLY a JSON array of objects with this exact structure:
[
  {
    "name": "string",
    "category": "${categoryList}",
    "expiryPeriod": 7
  }
]

expiryPeriod should be a positive integer representing the number of days the item will stay fresh.
If no food items are visible, return an empty array [].`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;

      // Extract JSON from response (handle cases where AI adds extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in AI response");
      }

      const aiResponse = JSON.parse(jsonMatch[0]);
      return this.validateAIResponse(aiResponse);
    } catch (error) {
      if (error.message.includes("API key")) {
        throw new Error(
          "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
        );
      }
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Validate AI response against expected schema
   */
  validateAIResponse(response) {
    if (!Array.isArray(response)) {
      throw new Error("AI response must be an array");
    }

    const validatedItems = response.map((item, index) => {
      return ItemValidator.validateAndProcessItem(item, {
        throwOnError: true,
        itemIndex: index
      });
    });

    return validatedItems;
  }
}

export default AIService;
