import { Request, Response } from "express";
import Story from "../models/story_model.js";
import { AuthRequest } from "../middleware/auth_middleware.js";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * @desc    Generates a story based on a topic using the OpenRouter API
 * @route   POST /api/story/generate
 */
export const generateStory = async (req: AuthRequest, res: Response) => {
  const { topic } = req.body;
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!topic) {
    return res.status(400).json({ message: "Hikaye konusu zorunludur." });
  }

  if (!openRouterApiKey) {
    console.error("OpenRouter API key not found in .env file");
    return res
      .status(500)
      .json({
        message: "Sunucu yapılandırma hatası: AI servisine bağlanılamadı.",
      });
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          {
            role: "user",
            content: `Bir çocuk için, konusu '${topic}' olan, hayal gücünü geliştiren, sürükleyici ve anlamlı bir hikaye yaz. Hikaye, başlangıcı, gelişmesi ve bir sonucu olan net bir olay örgüsüne sahip olmalı. Karakterler ilgi çekici ve olaylar çocuklar için anlaşılır olmalı. Hikayenin sonunda küçük bir ders veya pozitif bir mesaj içermesi harika olur. Lütfen hikayeyi en fazla 300 kelime olacak şekilde oluştur.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      throw new Error(`AI service failed with status: ${response.status}`);
    }

    const result = await response.json();
    const storyText = (result.choices[0]?.message?.content || "").replace(/<s>|<\/s>|\[\/?INST\]|\[\/?OUT\]/gi, "").trim();

    if (!storyText) {
      throw new Error("AI response did not contain a valid story.");
    }

    const story = await Story.create({
      topic,
      originalStory: storyText.trim(),
      user: user._id,
    });

    res.status(201).json({ story: story.originalStory, storyId: story._id });
  } catch (error) {
    console.error("Hikaye oluşturulurken hata:", error);
    res.status(500).json({ message: "Hikaye oluşturulamadı." });
  }
};

/**
 * @desc    Translates and simplifies a story to A1/A2 level
 * @route   POST /api/story/translate
 */
export const translateStory = async (req: Request, res: Response) => {
  const { storyId, story, language } = req.body;
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;

  if (!storyId || !story || !language) {
    return res.status(400).json({ message: "Hikaye, hikaye ID'si ve hedef dil zorunludur." });
  }

  if (!["english", "french"].includes(language.toLowerCase())) {
    return res
      .status(400)
      .json({
        message:
          "Çeviri şimdilik sadece İngilizce ve Fransızca için desteklenmektedir.",
      });
  }

  if (!openRouterApiKey) {
    console.error("OpenRouter API key not found in .env file");
    return res
      .status(500)
      .json({
        message: "Sunucu yapılandırma hatası: AI servisine bağlanılamadı.",
      });
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          {
            role: "user",
            content: `Translate the following Turkish story to ${language} at an A1/A2 level for a child. Keep the meaning and tone of the original story. Story: ${story}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      throw new Error(`AI service failed with status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Raw AI Response (translateStory):", result.choices[0]?.message?.content);
    const translatedStoryText = (result.choices[0]?.message?.content || "").replace(/<s>|<\/s>|\[\/?INST\]|\[\/?OUT\]/gi, "").trim();

    if (!translatedStoryText) {
      throw new Error("AI response did not contain a valid translation.");
    }

    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      {
        translatedStory: translatedStoryText.trim(),
        language: language,
      },
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ message: "Hikaye bulunamadı." });
    }

    res.status(200).json({ translatedStory: updatedStory.translatedStory });
  } catch (error) {
    console.error("Hikaye çevrilirken hata:", error);
    res.status(500).json({ message: "Hikaye çevrilemedi." });
  }
};

/**
 * @desc    Get all stories for a user
 * @route   GET /api/story
 */
export const getStories = async (req: AuthRequest, res: Response) => {
  try {
    const stories = await Story.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
};

/**
 * @desc    Get a story by ID
 * @route   GET /api/story/:id
 */
export const getStoryById = async (req: Request, res: Response) => {
  try {
    const story = await Story.findById(req.params.id);

    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ message: "Hikaye bulunamadı" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
};