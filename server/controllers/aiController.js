// @desc    Generate a bio or project description draft using Groq's LLM API
// @route   POST /api/ai/generate
// @access  Private
const generateText = async (req, res, next) => {
    try {
      const { type, keywords } = req.body;
  
      if (!type || !['bio', 'projectDescription'].includes(type)) {
        res.status(400);
        throw new Error('Invalid generation type');
      }
  
      if (!keywords || !keywords.trim()) {
        res.status(400);
        throw new Error('Please provide a few keywords to generate from');
      }
  
      const prompts = {
        bio: `Write a short, natural-sounding developer bio (max 2-3 sentences, under 300 characters) for a developer collaboration platform profile. Base it on these keywords/notes from the user: "${keywords}". Write in first person. Do not use hashtags, emojis, or markdown formatting. Return ONLY the bio text, nothing else.`,
        projectDescription: `Write a clear, concise project description (max 3-4 sentences, under 1000 characters) for a project recruiting page, where developers will read this to decide whether to apply. Base it on these keywords/notes from the user: "${keywords}". Do not use hashtags, emojis, or markdown formatting. Return ONLY the description text, nothing else.`,
      };
  
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompts[type] }],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });
  
      if (!response.ok) {
        const errText = await response.text();
        console.error('Groq API error:', errText);
        res.status(502);
        throw new Error('AI generation service failed. Please try again.');
      }
  
      const data = await response.json();
      const generatedText = data.choices?.[0]?.message?.content?.trim();
  
      if (!generatedText) {
        res.status(502);
        throw new Error('AI service returned an empty response');
      }
  
      res.status(200).json({ success: true, text: generatedText });
    } catch (error) {
      next(error);
    }
  };
  
  export { generateText };