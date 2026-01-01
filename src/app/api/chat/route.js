import { NextResponse } from 'next/server';

const MODEL_CONFIG = {
  'mistralai/Mistral-7B-Instruct-v0.3': {
    parameters: {
      max_new_tokens: 300,
      temperature: 0.7,
      return_full_text: false
    },
    prompt: (message) => `<s>[INST]You are a medical expert. Answer clearly and concisely: ${message}[/INST]`,
    retries: 2 // Retry Mistral twice before falling back
  },
  'google/flan-t5-large': {
    parameters: {
      max_new_tokens: 200,
      temperature: 0.4
    },
    prompt: (message) => `Medical question: ${message}\nProfessional response:`
  }
};

const TIMEOUT = 8000;

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    const models = Object.keys(MODEL_CONFIG);
    let lastError = null;

    // Try Mistral first with retries
    for (let attempt = 0; attempt < MODEL_CONFIG[models[0]].retries + 1; attempt++) {
      try {
        const result = await queryModel(models[0], message);
        return NextResponse.json(result);
      } catch (error) {
        lastError = error.message;
        console.error(`Mistral attempt ${attempt + 1} failed:`, error.message);
      }
    }

    // Fallback to Flan-T5 if all Mistral attempts fail
    try {
      const result = await queryModel(models[1], message);
      return NextResponse.json({ ...result, fallback: true });
    } catch (error) {
      lastError = error.message;
      console.error('Flan-T5 fallback failed:', error.message);
    }

    return NextResponse.json(
      { reply: "Our medical AI services are temporarily unavailable. Please try again later." },
      { status: 503 }
    );

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { reply: "An error occurred processing your request. Please try again." },
      { status: 500 }
    );
  }
}

async function queryModel(model, message) {
  const { parameters, prompt } = MODEL_CONFIG[model];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt(message),
        parameters
      }),
      signal: controller.signal
    }
  );
  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Model request failed");
  }

  const data = await response.json();
  const rawResponse = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
  
  const cleanResponse = rawResponse
    .replace(/<\/?s>|\[INST\]|\[\/INST\]/gi, '')
    .replace(/(\n\s*){2,}/g, '\n\n')
    .trim();

  return {
    reply: cleanResponse || "I couldn't process that. Please consult a healthcare professional.",
    model
  };
}