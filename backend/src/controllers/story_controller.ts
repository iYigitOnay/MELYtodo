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
    return res.status(500).json({
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
        temperature: 0.7,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates short stories in Turkish for children and young people learning English. Your stories should be simple (A1/A2 level), engaging, and meaningful. Pay close attention to grammar rules, sentence structure, and ensure the story has a clear plot with a beginning, middle, and end. The story should also convey a small lesson or a positive message.",
          },
          {
            role: "user",
            content: `Konusu '${topic}' olan, hayal gücünü geliştiren, sürükleyici ve anlamlı, **KESİNLİKLE TÜRKÇE** kısa bir hikaye yaz. Hikaye, başlangıcı, gelişmesi ve bir sonucu olan net bir olay örgüsüne sahip olmalı. Karakterler ilgi çekici ve olaylar çocuklar için anlaşılır olmalı. Hikayenin sonunda küçük bir ders veya pozitif bir mesaj içermesi harika olur.`,
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
    console.log(
      "OpenRouter API Result (generateStory):",
      JSON.stringify(result, null, 2)
    );
    const storyText = (result.choices[0]?.message?.content || "")
      .replace(
        /\[?\[BOS\]\]?|\[?\[EOS\]\]?|<s>|<\/s>|\[\/?INST\]|\[\/?OUT\]|\n\n/gi,
        ""
      )
      .trim();

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
    return res
      .status(400)
      .json({ message: "Hikaye, hikaye ID'si ve hedef dil zorunludur." });
  }

  if (!["english", "french"].includes(language.toLowerCase())) {
    return res.status(400).json({
      message:
        "Çeviri şimdilik sadece İngilizce ve Fransızca için desteklenmektedir.",
    });
  }

  if (!openRouterApiKey) {
    console.error("OpenRouter API key not found in .env file");
    return res.status(500).json({
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
        temperature: 0.7,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that translates Turkish stories into simple English (A1/A2 level) for children and young people learning English. Pay close attention to grammar rules, sentence structure, and ensure the translated story preserves the original meaning and tone.",
          },
          {
            role: "user",
            content: `Translate the following Turkish story to ${language}. Simplify the language for an A1/A2 level learner. Story: ${story}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error (translateStory):", errorText); // Added context to log
      throw new Error(`AI service failed with status: ${response.status}`);
    }

    const result = await response.json();
    console.log("OpenRouter API Result (translateStory):", JSON.stringify(result, null, 2));
    const rawAiContent = result.choices[0]?.message?.content;
    console.log("Raw AI Response (translateStory):", rawAiContent); // Existing log
    // Add a log for the full result to inspect its structure if needed
    console.log(
      "Full AI Result (translateStory):",
      JSON.stringify(result, null, 2)
    );

    if (!rawAiContent) {
      throw new Error("AI did not return any content for translation.");
    }

    let translatedStoryText = (rawAiContent || "")
      .replace(
        /\[?\[BOS\]\]?|\[?\[EOS\]\]?|<s>|<\/s>|\[\/?INST\]|\[\/?OUT\]|\n\n/gi,
        ""
      )
      .trim();

    if (!translatedStoryText) {
      // If AI fails to provide a translation, set a default message

      translatedStoryText = "Çeviri yapılamadı.";
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

    console.error("Detailed translation error:", error);

    res.status(500).json({ message: "Hikaye çevrilemedi." });
  }
};

/**
 * @desc    Get all stories for a user
 * @route   GET /api/story
 */
export const getStories = async (req: AuthRequest, res: Response) => {
  try {
    const stories = await Story.find({ user: req.user?._id }).sort({
      createdAt: -1,
    });
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

/**
 * @desc    Delete a story by ID
 * @route   DELETE /api/story/:id
 */
export const deleteStory = async (req: AuthRequest, res: Response) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Hikaye bulunamadı" });
    }

    if (story.user.toString() !== req.user?._id.toString()) {
      return res
        .status(401)
        .json({ message: "Bu hikayeyi silmeye yetkiniz yok" });
    }

    await story.deleteOne();

    res.json({ message: "Hikaye başarıyla silindi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
};
