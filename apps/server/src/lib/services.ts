import { env } from 'cloudflare:workers';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

export const resend = () =>
  env.RESEND_API_KEY
    ? new Resend(env.RESEND_API_KEY)
    : { emails: { send: async (...args: unknown[]) => console.log(args) } };

export const redis = () => new Redis({ url: env.REDIS_URL, token: env.REDIS_TOKEN });

export const twilio = (forceUseRealService = false) => {
  const isConfigured =
    env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_PHONE_NUMBER;

  if (!isConfigured && !forceUseRealService) {
    console.warn('⚠️ Twilio is not configured — using mock implementation.');
    return {
      messages: {
        send: async (to: string, body: string) =>
          console.log(`[MOCK TWILIO] To: ${to}, Body: ${body}`),
      },
    };
  }

  if (!isConfigured) {
    throw new Error('Twilio is not configured correctly');
  }

  const send = async (to: string, body: string) => {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(
            `${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`,
          )}`,
        },
        body: new URLSearchParams({
          To: to,
          From: env.TWILIO_PHONE_NUMBER,
          Body: body,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send OTP: ${error}`);
    }
  };

  return {
    messages: {
      send,
    },
  };
};
