import type { ContactContext, CrmContext } from 'types/llm';

type SummarizeThreadInput = {
  threadId: string;
  messages: {
    id: string;
    sender: string;
    recipients: string[];
    timestamp: string;
    subject: string;
    body: string;
  }[];
  contactContext?: ContactContext;
  crmContext?: CrmContext;
};

type SummarizeThreadResponse = {
  summary: string;
  followUps: {
    task: string;
    dueBy: string | null;
    confidence: number;
    assignee?: string | null;
  }[];
};

export async function summarizeThread({
  threadId,
  messages,
  contactContext,
  crmContext,
}: SummarizeThreadInput): Promise<SummarizeThreadResponse> {
    const API_BASE = import.meta.env.VITE_PUBLIC_BACKEND_URL || 'http://localhost:8787';
    const response = await fetch(`${API_BASE}/api/threads/intelligence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      threadId,
      messages,
      contactContext,
      crmContext,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to summarize thread');
  }

  return await response.json();
}
