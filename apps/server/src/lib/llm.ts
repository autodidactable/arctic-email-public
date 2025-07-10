import OpenAI from 'openai'


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function callOpenAI(prompt: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that only replies with valid JSON. Do not include explanation, greetings, or markdown. Just output valid, parseable JSON that matches the expected schema.`,
        },
        {
          role: 'user',
          content: prompt,
        }
      ]
    })
    console.log('🔍 LLM Raw Output:', response)
    return response.choices[0].message?.content ?? ''
  }
  