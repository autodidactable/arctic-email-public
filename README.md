# Arctic

**A Custom Email Client for Salespeople – Powered by CRM Context**

Arctic is a customized email client built on top of [Zero](https://0.email/), designed to enhance the productivity of customer-facing teams—especially Account Executives, SEs, and CSMs—by embedding CRM workflows directly into their inbox.

Instead of toggling between tools, Arctic gives reps everything they need—contact context, deal stages, notes, and follow-up intelligence—inline with their email threads.

---

## Why Arctic?

Modern sales teams spend an overwhelming amount of time navigating between email and CRM tools. Arctic eliminates this friction by integrating bidirectional sync with HubSpot via [Statsync](https://statsync.dev/), making the CRM accessible, editable, and intelligent—right from the inbox.

### Key Features

- **HubSpot CRM Sync (via Statsync)**  
  Sync deals, contacts, and notes bidirectionally. Updates in Arctic reflect in HubSpot and vice versa.

- **Context-Aware Email Threads**  
  Each thread surfaces CRM context: account, deal stage, contact info, and related notes.

- **Inline Deal Editing**  
  Modify deal stages or log notes directly from the Arctic UI—no CRM tab-hopping.

- **Composable Side Panels**  
  Extendable UI for surfacing future AI copilots or playbooks during threads.

---

## Architecture & Stack

- **Frontend**: React, Next.js, TypeScript, TailwindCSS, ShadCN UI  
- **Backend**: Hono (Cloudflare Workers), TRPC, Drizzle ORM  
- **Database**: PostgreSQL  
- **Auth**: Google OAuth  
- **CRM Integration**: HubSpot via Statsync  
- **Base Framework**: [Zero](https://0.email/) – forked and customized

---

## Getting Started

```bash
git clone https://github.com/autodidactable/arctic-email-public.git
cd arctic-email-public
pnpm install
pnpm docker:db:up
pnpm db:push
pnpm dev
Then visit: [http://localhost:3000](http://localhost:3000)

> **Note**: You’ll need to configure your `.env` file for Google OAuth, Autumn, and Statsync. See `.env.example` for reference.

---

## Project Goals

- Reduce context-switching between CRM and email  
- Improve deal hygiene and sales note-taking  
- Lay the foundation for future AI-powered in-thread copilots  
- Empower AEs to work from where they already spend most of their time—their inbox

---

## Forked From

This project is a fork of [Zero](https://github.com/Mail-0/Zero), an open-source email client. Significant modifications have been made to adapt it for CRM-powered sales workflows.
