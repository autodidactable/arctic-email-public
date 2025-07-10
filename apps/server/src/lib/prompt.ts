// lib/prompt.ts

type Message = {
    sender: string
    recipients: string[]
    timestamp: string
    subject: string
    body: string
  }
  
  type ContactContext = {
    [email: string]: {
      name: string;
      title?: string;
    };
  };
  
  type CRMContext = {
    dealId?: string;
    accountId?: string;
    dealStage?: string;
  };
  
  export function buildLLMPrompt(
    messages: Message[],
    contactContext?: ContactContext,
    crmContext?: CRMContext
  ): string {
    const contactList = Object.entries(contactContext ?? {})
      .map(([email, { name, title }]) => `- ${name} (${title ?? "Unknown"}) <${email}>`)
      .join('\n') || 'Unknown'
  
    const threadText = messages
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(msg => `From: ${msg.sender}\nTo: ${msg.recipients.join(', ')}\nDate: ${msg.timestamp}\n\n${msg.body}\n\n---`)
      .join('\n')
  
    return `
  You are a Sales Analyst AI. Read the email thread below and:
  1. Write a 2-paragraph natural-sounding summary.
  2. Extract all follow-up tasks with due dates and confidence levels.
  
  Context:
  - Account: ${crmContext?.accountId ?? "Unknown"}
  - Deal Stage: ${crmContext?.dealStage ?? "Unknown"}
  - Participants:\n${contactList}
  
  Thread:
  ${threadText}
  
  Respond strictly in this JSON format:
  {
    "summary": "string",
    "followUps": [
      { "task": "string", "dueBy": "YYYY-MM-DD | null", "confidence": number, "assignee": "string | null" }
    ]
  }
  `
  }
  
  export function parseLLMResponse(raw: string): { summary: string, followUps: any[] } {
    try {
      const clean = raw.trim()
        .replace(/^```json/, '')
        .replace(/^```/, '')
        .replace(/```$/, '')
        .trim()
  
      const parsed = JSON.parse(clean)
  
      // ✅ This ensures it's an actual object, not a JSON string
      return {
        summary: parsed.summary ?? '',
        followUps: parsed.followUps ?? []
      }
    } catch (err) {
      console.error('LLM returned invalid JSON:', raw)
      throw new Error('Failed to parse LLM response')
    }
  }
    
  