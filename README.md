This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Complete Flow
Step	What happens
1. QR Scan	Customer scans wa.me/number?text=Table5 → WhatsApp opens with pre-filled message
2. Webhook	Meta POSTs to /api/webhook → extracts phone + table number from "Table5" message
3. Claude AI	waiter.ts sends menu context to Claude, which guides: Snacks → Thalis → Desserts → Drinks (bilingual DE/EN)
4. WhatsApp Reply	Claude's response sent back via WhatsApp Messages API
5. Order → Kitchen	When Claude detects confirmation, JSON is parsed → order created in DB → Pusher triggers kitchen display beep
6. Kitchen flow	Chef: Start Cooking → Mark Ready → kitchen display updates in real-time
7. Customer notified	When marked "Served" → WhatsApp message sent: "Ihre Bestellung ist fertig!"


The WhatsApp integration works via the WhatsApp Business API. Here's the full setup:

1. Environment Variables Needed
Add these to your .env.local:



WHATSAPP_TOKEN=your_whatsapp_business_api_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=any_secret_string_you_choose
2. WhatsApp Business Setup
Go to Meta for Developers
Create an app → select Business type
Add WhatsApp product
Get your Phone Number ID and Permanent Token from the WhatsApp API dashboard
3. Webhook Configuration
In your Meta app dashboard, configure the webhook:

Callback URL: https://your-domain.com/api/webhook
Verify Token: same as WHATSAPP_VERIFY_TOKEN in your .env.local
Subscribe to messages events
⚠️ The webhook needs a public HTTPS URL — localhost won't work. Use ngrok for testing:



ngrok http 3000
Then use the ngrok URL as your webhook callback.

4. Customer Flow
Customer scans QR code at their table → opens wa.me/your_number?text=Table5
WhatsApp sends the message to your webhook (/api/webhook)
The webhook extracts the table number, calls the Groq AI waiter (Bella)
Bella guides the customer through the menu via WhatsApp chat
When the customer confirms, the order is created in the DB and the kitchen gets notified in real-time
When the kitchen marks the order as served, the customer gets a WhatsApp notification
5. Generate QR Codes
For each table, create QR codes pointing to:



https://wa.me/YOUR_PHONE_NUMBER?text=Table1
https://wa.me/YOUR_PHONE_NUMBER?text=Table2
...
6. For Local Testing (without WhatsApp)
The kitchen page has simulate buttons at the bottom — click "Table 1", "Table 3", etc. to create test orders without needing WhatsApp set up.



New WhatsApp Flow


Customer scans QR → WhatsApp opens → sends "Hallo"
         ↓
Bella: "Welcome to Bella Cucina! 🍛
        Here are the available tables:
        🪑 Table 1 (2 seats) — Available
        🪑 Table 3 (4 seats) — Available
        🪑 Table 5 (6 seats) — Available
        Which table would you like?"
         ↓
Customer: "Table 3"
         ↓
Bella: "Great! Table 3 it is. 
        What can I get you? Here are our categories..."
         ↓
(ordering continues...)
Single QR code → https://wa.me/YOUR_NUMBER (no table number needed)

The AI now:

Fetches real-time table availability from the database
Shows available tables to the customer
Customer picks one in the chat
Then ordering begins naturally
The /chat page (web demo) mirrors this exactly — on load it auto-sends "Hallo" and Bella responds with available tables.