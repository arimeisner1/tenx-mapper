import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function randomShareToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ─── Workflow 1: AI Content Pipeline ──────────────────────────────────────────

const aiContentPipelineCanvas = {
  nodes: [
    {
      id: "node-1",
      type: "softwareNode",
      position: { x: 50, y: 250 },
      data: {
        label: "ChatGPT",
        logoUrl: "https://cdn.simpleicons.org/openai",
        category: "AI & ML",
        color: "#8B5CF6",
        subtitle: "Generates blog post draft from topic brief",
      },
    },
    {
      id: "node-2",
      type: "softwareNode",
      position: { x: 300, y: 250 },
      data: {
        label: "Grammarly",
        logoUrl: "https://cdn.simpleicons.org/grammarly",
        category: "AI & ML",
        color: "#15C39A",
        subtitle: "Proofreads and polishes the draft",
      },
    },
    {
      id: "node-3",
      type: "softwareNode",
      position: { x: 550, y: 100 },
      data: {
        label: "Canva",
        logoUrl: "https://cdn.simpleicons.org/canva",
        category: "Design",
        color: "#F472B6",
        subtitle: "Creates featured image and social graphics",
      },
    },
    {
      id: "node-4",
      type: "softwareNode",
      position: { x: 550, y: 400 },
      data: {
        label: "Zapier",
        logoUrl: "https://cdn.simpleicons.org/zapier",
        category: "Automation",
        color: "#F59E0B",
        subtitle: "Orchestrates the entire content pipeline",
      },
    },
    {
      id: "node-5",
      type: "softwareNode",
      position: { x: 800, y: 250 },
      data: {
        label: "WordPress",
        logoUrl: "https://cdn.simpleicons.org/wordpress",
        category: "Marketing",
        color: "#21759B",
        subtitle: "Publishes the final blog post",
      },
    },
    {
      id: "node-6",
      type: "softwareNode",
      position: { x: 1050, y: 100 },
      data: {
        label: "Buffer",
        logoUrl: "https://cdn.simpleicons.org/buffer",
        category: "Marketing",
        color: "#F97316",
        subtitle: "Distributes content to social media channels",
      },
    },
    {
      id: "node-7",
      type: "softwareNode",
      position: { x: 1050, y: 250 },
      data: {
        label: "Slack",
        logoUrl: "https://cdn.simpleicons.org/slack",
        category: "Communication",
        color: "#EC4899",
        subtitle: "Notifies content team of new publication",
      },
    },
    {
      id: "node-8",
      type: "softwareNode",
      position: { x: 1050, y: 400 },
      data: {
        label: "Airtable",
        logoUrl: "https://cdn.simpleicons.org/airtable",
        category: "Databases & Storage",
        color: "#10B981",
        subtitle: "Logs content in editorial calendar",
      },
    },
    {
      id: "node-9",
      type: "softwareNode",
      position: { x: 1300, y: 250 },
      data: {
        label: "Google Analytics",
        logoUrl: "https://cdn.simpleicons.org/googleanalytics",
        category: "Analytics",
        color: "#F43F5E",
        subtitle: "Tracks post performance and traffic",
      },
    },
  ],
  edges: [
    {
      id: "edge-1-2",
      source: "node-1",
      target: "node-2",
      label: "Raw draft text",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-2-3",
      source: "node-2",
      target: "node-3",
      label: "Polished copy for visuals",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-2-4",
      source: "node-2",
      target: "node-4",
      label: "Edited draft triggers automation",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-3-5",
      source: "node-3",
      target: "node-5",
      label: "Featured image URL",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-4-5",
      source: "node-4",
      target: "node-5",
      label: "Formatted post payload",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-5-6",
      source: "node-5",
      target: "node-6",
      label: "Published post URL",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-5-7",
      source: "node-5",
      target: "node-7",
      label: "Publish notification",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-5-8",
      source: "node-5",
      target: "node-8",
      label: "Post metadata row",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-5-9",
      source: "node-5",
      target: "node-9",
      label: "Tracking pixel / UTM links",
      type: "smoothstep",
      animated: true,
    },
  ],
};

// ─── Workflow 2: Client Onboarding Automation ─────────────────────────────────

const clientOnboardingCanvas = {
  nodes: [
    {
      id: "node-1",
      type: "softwareNode",
      position: { x: 50, y: 300 },
      data: {
        label: "Typeform",
        logoUrl: "https://cdn.simpleicons.org/typeform",
        category: "Forms & Surveys",
        color: "#A855F7",
        subtitle: "Client intake form with qualification questions",
      },
    },
    {
      id: "node-2",
      type: "softwareNode",
      position: { x: 300, y: 300 },
      data: {
        label: "Zapier",
        logoUrl: "https://cdn.simpleicons.org/zapier",
        category: "Automation",
        color: "#F59E0B",
        subtitle: "Triggers onboarding automation on form submit",
      },
    },
    {
      id: "node-3",
      type: "softwareNode",
      position: { x: 550, y: 150 },
      data: {
        label: "HubSpot",
        logoUrl: "https://cdn.simpleicons.org/hubspot",
        category: "CRM",
        color: "#FF7A59",
        subtitle: "Creates contact and deal record",
      },
    },
    {
      id: "node-4",
      type: "softwareNode",
      position: { x: 550, y: 300 },
      data: {
        label: "Slack",
        logoUrl: "https://cdn.simpleicons.org/slack",
        category: "Communication",
        color: "#EC4899",
        subtitle: "Notifies sales team in #new-clients channel",
      },
    },
    {
      id: "node-5",
      type: "softwareNode",
      position: { x: 550, y: 450 },
      data: {
        label: "Stripe",
        logoUrl: "https://cdn.simpleicons.org/stripe",
        category: "E-commerce",
        color: "#635BFF",
        subtitle: "Creates customer and sends payment link",
      },
    },
    {
      id: "node-6",
      type: "softwareNode",
      position: { x: 800, y: 75 },
      data: {
        label: "Calendly",
        logoUrl: "https://cdn.simpleicons.org/calendly",
        category: "Scheduling",
        color: "#06B6D4",
        subtitle: "Sends onboarding call scheduling link",
      },
    },
    {
      id: "node-7",
      type: "softwareNode",
      position: { x: 800, y: 225 },
      data: {
        label: "Google Drive",
        logoUrl: "https://cdn.simpleicons.org/googledrive",
        category: "Documents & Knowledge",
        color: "#4285F4",
        subtitle: "Creates shared folder and stores contracts",
      },
    },
    {
      id: "node-8",
      type: "softwareNode",
      position: { x: 800, y: 375 },
      data: {
        label: "Notion",
        logoUrl: "https://cdn.simpleicons.org/notion",
        category: "Documents & Knowledge",
        color: "#8B5CF6",
        subtitle: "Creates client workspace from template",
      },
    },
    {
      id: "node-9",
      type: "softwareNode",
      position: { x: 800, y: 525 },
      data: {
        label: "Asana",
        logoUrl: "https://cdn.simpleicons.org/asana",
        category: "Project Management",
        color: "#14B8A6",
        subtitle: "Creates onboarding task project from template",
      },
    },
    {
      id: "node-10",
      type: "softwareNode",
      position: { x: 1050, y: 75 },
      data: {
        label: "Zoom",
        logoUrl: "https://cdn.simpleicons.org/zoom",
        category: "Video & Meetings",
        color: "#2563EB",
        subtitle: "Hosts the onboarding kickoff call",
      },
    },
    {
      id: "node-11",
      type: "softwareNode",
      position: { x: 1050, y: 300 },
      data: {
        label: "SendGrid",
        logoUrl: "https://cdn.simpleicons.org/sendgrid",
        category: "Communication",
        color: "#1A82E2",
        subtitle: "Sends welcome email drip sequence",
      },
    },
    {
      id: "node-12",
      type: "softwareNode",
      position: { x: 1050, y: 525 },
      data: {
        label: "Intercom",
        logoUrl: "https://cdn.simpleicons.org/intercom",
        category: "Communication",
        color: "#6AFDEF",
        subtitle: "Activates in-app chat and product tour",
      },
    },
  ],
  edges: [
    {
      id: "edge-1-2",
      source: "node-1",
      target: "node-2",
      label: "Form submission data",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-2-3",
      source: "node-2",
      target: "node-3",
      label: "Contact + company info",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-2-4",
      source: "node-2",
      target: "node-4",
      label: "New client alert",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-2-5",
      source: "node-2",
      target: "node-5",
      label: "Customer + pricing tier",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-3-6",
      source: "node-3",
      target: "node-6",
      label: "Deal owner + client email",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-3-7",
      source: "node-3",
      target: "node-7",
      label: "Client name + project folder",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-4-8",
      source: "node-4",
      target: "node-8",
      label: "Client details for workspace",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-5-9",
      source: "node-5",
      target: "node-9",
      label: "Payment confirmed → create tasks",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-6-10",
      source: "node-6",
      target: "node-10",
      label: "Meeting link + calendar event",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-3-11",
      source: "node-3",
      target: "node-11",
      label: "Contact triggers email sequence",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "edge-5-12",
      source: "node-5",
      target: "node-12",
      label: "Activated user ID",
      type: "smoothstep",
      animated: true,
    },
  ],
};

// ─── Node Metadata ────────────────────────────────────────────────────────────

const workflow1Metadata = [
  {
    nodeId: "node-1",
    name: "ChatGPT",
    description: "Uses GPT-4o to generate long-form blog post drafts from a topic brief and outline. Configured with a custom system prompt for brand voice consistency.",
    notes: "Use the 'Blog Writer' custom GPT. Temperature set to 0.7 for creativity. Average generation time: 30-60 seconds for 1500-word posts.",
    links: JSON.stringify([
      { label: "OpenAI API Docs", url: "https://platform.openai.com/docs" },
      { label: "Custom GPT Dashboard", url: "https://chat.openai.com/gpts" },
    ]),
    costEstimate: "$20/mo (Plus) or ~$0.03/post via API",
    apiEndpoint: "https://api.openai.com/v1/chat/completions",
    status: "active",
    customFields: JSON.stringify({ model: "gpt-4o", avgTokensPerPost: 2000 }),
  },
  {
    nodeId: "node-2",
    name: "Grammarly",
    description: "Runs the draft through Grammarly Business for grammar, clarity, engagement, and delivery checks. Also enforces brand style guide rules.",
    notes: "Team account with custom style guide uploaded. Catches ~15 issues per draft on average. Review suggestions before accepting all.",
    links: JSON.stringify([
      { label: "Grammarly Business", url: "https://www.grammarly.com/business" },
    ]),
    costEstimate: "$15/user/mo (Business plan)",
    status: "active",
    customFields: JSON.stringify({ goals: ["clarity", "engagement", "delivery"] }),
  },
  {
    nodeId: "node-3",
    name: "Canva",
    description: "Generates featured images using brand templates. The content title and key themes are used to customize the template automatically via Canva API.",
    notes: "Use the 'Blog Featured Image' template (1200x630px). Brand kit colors are pre-loaded. Export as WebP for performance.",
    links: JSON.stringify([
      { label: "Canva Brand Kit", url: "https://www.canva.com/brand" },
      { label: "Template Library", url: "https://www.canva.com/templates" },
    ]),
    costEstimate: "$13/mo (Pro plan)",
    status: "active",
    customFields: JSON.stringify({ templateSize: "1200x630", format: "webp" }),
  },
  {
    nodeId: "node-4",
    name: "Zapier",
    description: "Central automation hub connecting all pipeline steps. Triggers on new Airtable record, orchestrates draft generation, editing, image creation, and publishing.",
    notes: "Multi-step Zap with 8 actions. Uses Paths for conditional logic. Error notifications go to #content-ops Slack channel.",
    links: JSON.stringify([
      { label: "Zap Editor", url: "https://zapier.com/app/zaps" },
      { label: "Task History", url: "https://zapier.com/app/history" },
    ]),
    costEstimate: "$69/mo (Professional - 2000 tasks)",
    status: "active",
    customFields: JSON.stringify({ tasksPerMonth: 450, zapCount: 3 }),
  },
  {
    nodeId: "node-5",
    name: "WordPress",
    description: "Self-hosted WordPress instance where the final post is published. Receives formatted HTML, featured image, categories, tags, and SEO metadata.",
    notes: "Using Yoast SEO plugin for meta descriptions. Posts are set to 'Draft' status first for final human review before publishing.",
    links: JSON.stringify([
      { label: "WP Admin", url: "https://blog.example.com/wp-admin" },
      { label: "REST API", url: "https://blog.example.com/wp-json/wp/v2/posts" },
    ]),
    costEstimate: "$25/mo (hosting + plugins)",
    apiEndpoint: "https://blog.example.com/wp-json/wp/v2/posts",
    status: "active",
    customFields: JSON.stringify({ wpVersion: "6.5", theme: "Flavor Theme" }),
  },
  {
    nodeId: "node-6",
    name: "Buffer",
    description: "Schedules and publishes social media posts across Twitter/X, LinkedIn, and Facebook. Uses the blog post title, excerpt, and featured image.",
    notes: "Posts are scheduled for optimal times (Tue/Thu 10am EST). LinkedIn gets a longer excerpt. Twitter gets a thread for long posts.",
    links: JSON.stringify([
      { label: "Buffer Dashboard", url: "https://publish.buffer.com" },
    ]),
    costEstimate: "$6/mo/channel (Essentials plan)",
    status: "active",
    customFields: JSON.stringify({ channels: ["twitter", "linkedin", "facebook"] }),
  },
  {
    nodeId: "node-7",
    name: "Slack",
    description: "Posts a notification to #content-published channel with the post title, URL, author, and a preview. Team can react with emoji to acknowledge.",
    notes: "Uses a custom Slack bot with rich message formatting. Also sends a DM to the content lead for high-priority posts.",
    links: JSON.stringify([
      { label: "Slack Webhook", url: "https://api.slack.com/messaging/webhooks" },
    ]),
    costEstimate: "$7.25/user/mo (Pro plan)",
    status: "active",
    customFields: JSON.stringify({ channel: "#content-published", botName: "ContentBot" }),
  },
  {
    nodeId: "node-8",
    name: "Airtable",
    description: "Maintains the editorial calendar with all content entries. Each published post creates or updates a row with title, URL, publish date, status, and performance metrics.",
    notes: "Base: 'Content Operations'. Table: 'Editorial Calendar'. Linked to 'Authors' and 'Categories' tables. Weekly review view for content planning.",
    links: JSON.stringify([
      { label: "Airtable Base", url: "https://airtable.com/appXXXXXX" },
    ]),
    costEstimate: "$20/user/mo (Team plan)",
    status: "active",
    customFields: JSON.stringify({ baseName: "Content Operations", recordsPerMonth: 30 }),
  },
  {
    nodeId: "node-9",
    name: "Google Analytics",
    description: "Tracks post performance including page views, time on page, bounce rate, and conversion events. UTM parameters are automatically appended to social media links.",
    notes: "GA4 property with custom content performance dashboard. Goals: newsletter signups and demo requests from blog posts. Weekly digest report sent to team.",
    links: JSON.stringify([
      { label: "GA4 Dashboard", url: "https://analytics.google.com" },
      { label: "UTM Builder", url: "https://ga-dev-tools.google/ga4/campaign-url-builder/" },
    ]),
    costEstimate: "Free (GA4)",
    status: "active",
    customFields: JSON.stringify({ propertyId: "G-XXXXXXXXXX", goals: ["newsletter_signup", "demo_request"] }),
  },
];

const workflow2Metadata = [
  {
    nodeId: "node-1",
    name: "Typeform",
    description: "Client intake form capturing company name, size, industry, project goals, budget range, and preferred start date. Includes conditional logic for different service tiers.",
    notes: "Form ID: 'client-intake-v3'. Average completion rate: 78%. Embedded on /get-started page. Hidden field captures UTM source for attribution.",
    links: JSON.stringify([
      { label: "Form Editor", url: "https://admin.typeform.com/form/XXXXX/create" },
      { label: "Responses", url: "https://admin.typeform.com/form/XXXXX/results" },
    ]),
    costEstimate: "$25/mo (Basic plan)",
    status: "active",
    customFields: JSON.stringify({ formId: "client-intake-v3", completionRate: "78%" }),
  },
  {
    nodeId: "node-2",
    name: "Zapier",
    description: "Central automation hub that triggers on Typeform submission and fans out to HubSpot, Slack, and Stripe simultaneously. Includes error handling and retry logic.",
    notes: "Multi-path Zap with 3 parallel branches. Uses Formatter for data transformation. Filter step rejects submissions from free email domains.",
    links: JSON.stringify([
      { label: "Zap Editor", url: "https://zapier.com/app/zaps" },
    ]),
    costEstimate: "$69/mo (Professional)",
    status: "active",
    customFields: JSON.stringify({ branches: 3, avgTasksPerDay: 8 }),
  },
  {
    nodeId: "node-3",
    name: "HubSpot",
    description: "Creates a new contact and associated deal in the sales pipeline. Auto-assigns deal owner based on territory/industry. Sets lifecycle stage to 'Opportunity'.",
    notes: "Pipeline: 'Client Onboarding'. Deal stage: 'Qualification'. Contact properties include all Typeform responses. Workflow enrolls contact in nurture sequence.",
    links: JSON.stringify([
      { label: "HubSpot Deals", url: "https://app.hubspot.com/contacts/XXXXX/deals" },
      { label: "API Docs", url: "https://developers.hubspot.com/docs/api" },
    ]),
    costEstimate: "$45/mo (Starter CRM)",
    apiEndpoint: "https://api.hubapi.com/crm/v3/objects/contacts",
    status: "active",
    customFields: JSON.stringify({ pipeline: "Client Onboarding", dealStage: "Qualification" }),
  },
  {
    nodeId: "node-4",
    name: "Slack",
    description: "Posts a rich notification to #new-clients channel with client details, deal value, and quick-action buttons for the sales rep to claim the lead.",
    notes: "Uses Block Kit for formatted messages. Includes client name, company, budget range, and a link to the HubSpot deal. @mentions the sales team lead.",
    links: JSON.stringify([
      { label: "Slack Channel", url: "https://app.slack.com/client/TXXXXX/CXXXXX" },
    ]),
    costEstimate: "$7.25/user/mo (Pro plan)",
    status: "active",
    customFields: JSON.stringify({ channel: "#new-clients", mentionsRole: "sales-lead" }),
  },
  {
    nodeId: "node-5",
    name: "Stripe",
    description: "Creates a Stripe customer record and generates a payment link for the selected service tier. Supports monthly/annual billing with automatic tax calculation.",
    notes: "Products: Starter ($499/mo), Growth ($999/mo), Enterprise (custom). Uses Stripe Tax for automatic tax compliance. Webhook confirms payment to trigger downstream.",
    links: JSON.stringify([
      { label: "Stripe Dashboard", url: "https://dashboard.stripe.com" },
      { label: "Payment Links", url: "https://dashboard.stripe.com/payment-links" },
    ]),
    costEstimate: "2.9% + $0.30 per transaction",
    apiEndpoint: "https://api.stripe.com/v1/customers",
    status: "active",
    customFields: JSON.stringify({ products: ["starter", "growth", "enterprise"] }),
  },
  {
    nodeId: "node-6",
    name: "Calendly",
    description: "Sends a personalized scheduling link for the 45-minute onboarding kickoff call. Pre-fills client name and email. Assigns to the deal owner's calendar.",
    notes: "Event type: 'Client Onboarding Kickoff (45 min)'. Buffer time: 15 min before/after. Available Mon-Fri 9am-4pm EST. Confirmation email includes prep checklist.",
    links: JSON.stringify([
      { label: "Calendly Admin", url: "https://calendly.com/event_types" },
    ]),
    costEstimate: "$10/user/mo (Standard plan)",
    status: "active",
    customFields: JSON.stringify({ duration: "45min", bufferTime: "15min" }),
  },
  {
    nodeId: "node-7",
    name: "Google Drive",
    description: "Creates a shared client folder from a template structure with subfolders for Contracts, Assets, Deliverables, and Meeting Notes. Sets permissions for the client and internal team.",
    notes: "Template folder: 'CLIENT_TEMPLATE'. Auto-generates SOW from Google Docs template with client details populated. Shares with client via their business email.",
    links: JSON.stringify([
      { label: "Drive Template", url: "https://drive.google.com/drive/folders/XXXXX" },
    ]),
    costEstimate: "$12/user/mo (Google Workspace Business)",
    status: "active",
    customFields: JSON.stringify({ templateFolders: ["Contracts", "Assets", "Deliverables", "Meeting Notes"] }),
  },
  {
    nodeId: "node-8",
    name: "Notion",
    description: "Duplicates the client workspace template with project tracker, meeting notes database, shared docs area, and a branded client portal page.",
    notes: "Template: 'Client Workspace v2'. Includes pre-built databases for milestones, deliverables, and feedback. Client gets view-only access to the portal page.",
    links: JSON.stringify([
      { label: "Notion Template", url: "https://notion.so/templates/XXXXX" },
    ]),
    costEstimate: "$10/user/mo (Plus plan)",
    status: "active",
    customFields: JSON.stringify({ template: "Client Workspace v2", databases: 4 }),
  },
  {
    nodeId: "node-9",
    name: "Asana",
    description: "Creates a new project from the 'Client Onboarding' template with 28 pre-defined tasks across 5 sections: Setup, Kickoff, Discovery, Implementation, and Handoff.",
    notes: "Template has task dependencies and due date offsets (relative to project start). Assigns tasks to CSM, designer, and developer roles. Portfolio: 'Active Clients'.",
    links: JSON.stringify([
      { label: "Asana Project Template", url: "https://app.asana.com/0/XXXXX" },
    ]),
    costEstimate: "$11/user/mo (Premium plan)",
    status: "active",
    customFields: JSON.stringify({ taskCount: 28, sections: 5, template: "Client Onboarding" }),
  },
  {
    nodeId: "node-10",
    name: "Zoom",
    description: "Hosts the onboarding kickoff call with the client. Meeting is auto-created when the Calendly event is booked. Recording is saved to Google Drive.",
    notes: "Uses Zoom Pro with cloud recording enabled. AI companion generates meeting summary. Recording auto-uploads to the client's Google Drive folder.",
    links: JSON.stringify([
      { label: "Zoom Settings", url: "https://zoom.us/profile/setting" },
    ]),
    costEstimate: "$13/user/mo (Pro plan)",
    status: "active",
    customFields: JSON.stringify({ recording: true, aiCompanion: true }),
  },
  {
    nodeId: "node-11",
    name: "SendGrid",
    description: "Triggers a 5-email welcome sequence over 14 days: Welcome, Getting Started Guide, Resource Library, Team Introduction, and 30-Day Check-in.",
    notes: "Dynamic templates with client name and project details. Open rate avg: 62%. Click rate avg: 18%. Unsubscribe handling via preferences center.",
    links: JSON.stringify([
      { label: "SendGrid Templates", url: "https://mc.sendgrid.com/dynamic-templates" },
      { label: "API Docs", url: "https://docs.sendgrid.com/api-reference" },
    ]),
    costEstimate: "$20/mo (Essentials - 50k emails)",
    apiEndpoint: "https://api.sendgrid.com/v3/mail/send",
    status: "active",
    customFields: JSON.stringify({ emailCount: 5, sequenceDays: 14, avgOpenRate: "62%" }),
  },
  {
    nodeId: "node-12",
    name: "Intercom",
    description: "Activates the in-app messenger for the client's account. Starts a product tour highlighting key features. Assigns a dedicated support inbox.",
    notes: "Product tour: 'New Client Onboarding'. Custom bot greets users on first login. Support SLA: 2-hour first response during business hours.",
    links: JSON.stringify([
      { label: "Intercom Inbox", url: "https://app.intercom.com/a/apps/XXXXX/inbox" },
      { label: "Product Tours", url: "https://app.intercom.com/a/apps/XXXXX/tours" },
    ]),
    costEstimate: "$74/mo (Essential plan)",
    status: "active",
    customFields: JSON.stringify({ productTour: "New Client Onboarding", sla: "2h" }),
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Starting workflow seed...");

  // 1. Find or create default user
  const passwordHash = await hash("admin123", 10);
  const user = await prisma.user.upsert({
    where: { email: "admin@tenxmapper.com" },
    update: {},
    create: {
      email: "admin@tenxmapper.com",
      name: "Admin",
      password: passwordHash,
    },
  });
  console.log(`User ready: ${user.email} (${user.id})`);

  // 2. Create project
  const project = await prisma.project.create({
    data: {
      name: "Demo Workflows",
      description: "Pre-built demo workflows showcasing real-world automation pipelines",
      ownerId: user.id,
    },
  });
  console.log(`Project created: ${project.name} (${project.id})`);

  // 3. Create Workflow 1: AI Content Pipeline
  const workflow1 = await prisma.workflow.create({
    data: {
      name: "AI Content Pipeline",
      description:
        "End-to-end content creation workflow: AI generates a blog post draft, which is proofread, paired with a featured image, published to WordPress, distributed across social channels, and tracked for performance.",
      canvasData: aiContentPipelineCanvas,
      isTemplate: true,
      shareToken: randomShareToken(),
      projectId: project.id,
    },
  });
  console.log(`Workflow 1 created: ${workflow1.name} (${workflow1.id})`);

  // Create node metadata for workflow 1
  for (const meta of workflow1Metadata) {
    await prisma.nodeMetadata.create({
      data: {
        ...meta,
        links: JSON.parse(meta.links as string),
        customFields: JSON.parse(meta.customFields as string),
        workflowId: workflow1.id,
      },
    });
  }
  console.log(`  -> ${workflow1Metadata.length} node metadata entries created`);

  // 4. Create Workflow 2: Client Onboarding Automation
  const workflow2 = await prisma.workflow.create({
    data: {
      name: "Client Onboarding Automation",
      description:
        "Automated client onboarding flow: intake form triggers CRM record creation, team notifications, payment processing, and workspace setup — all running in parallel after the initial trigger.",
      canvasData: clientOnboardingCanvas,
      isTemplate: true,
      shareToken: randomShareToken(),
      projectId: project.id,
    },
  });
  console.log(`Workflow 2 created: ${workflow2.name} (${workflow2.id})`);

  // Create node metadata for workflow 2
  for (const meta of workflow2Metadata) {
    await prisma.nodeMetadata.create({
      data: {
        ...meta,
        links: JSON.parse(meta.links as string),
        customFields: JSON.parse(meta.customFields as string),
        workflowId: workflow2.id,
      },
    });
  }
  console.log(`  -> ${workflow2Metadata.length} node metadata entries created`);

  console.log("\nWorkflow seed complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding workflows:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
