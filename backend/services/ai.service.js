import OpenAI from "openai";
// import sharp from "sharp"; // Temporarily disabled for deployment
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
      // Temporarily disabled Sharp for deployment - using original image
      // TODO: Re-enable Sharp after deployment
      return imageBuffer;
      
      // Original Sharp code (commented out):
      // const processedBuffer = await sharp(imageBuffer)
      //   .resize(1024, 1024, {
      //     fit: "inside",
      //     withoutEnlargement: true,
      //   })
      //   .jpeg({ quality: 85 })
      //   .toBuffer();
      // return processedBuffer;
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

      const validCategories = config.business.validCategories.join('|');
      const validSources = config.business.validSources.join('|');
      
      const prompt = `Analyze this image and determine:
1. The source type: "${validSources}" (if this is a receipt/paper document) or "groceries" (if this is a photo of actual food items)
2. All visible food products and their details

For the source type, consider:
- "${config.business.validSources[0]}": Paper document with text, prices, store information, barcodes
- "${config.business.validSources[1]}": Actual food items visible in the image, fresh produce, packaged goods

For each food item detected, estimate:
1. The name of the food item
2. The category (${validCategories})
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
    "category": "${validCategories}",
    "expiryPeriod": 7,
    "source": "${validSources}"
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
      
      // Validate each item in the array using the validation utility
      return aiResponse.map((item, index) => {
        return ItemValidator.validateAndProcessItem(item, {
          throwOnError: true,
          itemIndex: index
        });
      });
    } catch (error) {
      if (error.message.includes("API key")) {
        throw new Error(
          "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
        );
      }
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

}

export default AIService;
