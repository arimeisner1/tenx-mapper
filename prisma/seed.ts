import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface SoftwareCatalogEntry {
  name: string;
  slug: string;
  logoUrl: string;
  category: string;
  description: string;
  defaultColor: string;
}

const catalog: SoftwareCatalogEntry[] = [
  // ─── AI & ML ────────────────────────────────────────────────
  { name: "OpenAI", slug: "openai", logoUrl: "https://cdn.simpleicons.org/openai", category: "AI & ML", description: "AI research lab offering GPT models, DALL-E, and enterprise AI APIs.", defaultColor: "#8B5CF6" },
  { name: "Anthropic", slug: "anthropic", logoUrl: "https://cdn.simpleicons.org/anthropic", category: "AI & ML", description: "AI safety company building Claude, a helpful and harmless AI assistant.", defaultColor: "#8B5CF6" },
  { name: "Hugging Face", slug: "hugging-face", logoUrl: "https://cdn.simpleicons.org/huggingface", category: "AI & ML", description: "Open-source platform for sharing and deploying machine learning models.", defaultColor: "#8B5CF6" },
  { name: "Replicate", slug: "replicate", logoUrl: "https://cdn.simpleicons.org/replicate", category: "AI & ML", description: "Platform to run open-source machine learning models in the cloud.", defaultColor: "#8B5CF6" },
  { name: "Midjourney", slug: "midjourney", logoUrl: "https://cdn.simpleicons.org/midjourney", category: "AI & ML", description: "AI-powered image generation tool that creates art from text prompts.", defaultColor: "#8B5CF6" },
  { name: "ElevenLabs", slug: "elevenlabs", logoUrl: "https://cdn.simpleicons.org/elevenlabs", category: "AI & ML", description: "AI voice synthesis platform for realistic text-to-speech and voice cloning.", defaultColor: "#8B5CF6" },
  { name: "Cohere", slug: "cohere", logoUrl: "https://cdn.simpleicons.org/cohere", category: "AI & ML", description: "Enterprise AI platform providing natural language understanding and generation APIs.", defaultColor: "#8B5CF6" },
  { name: "Stability AI", slug: "stability-ai", logoUrl: "https://cdn.simpleicons.org/stabilityai", category: "AI & ML", description: "Open-source generative AI company behind Stable Diffusion image models.", defaultColor: "#8B5CF6" },
  { name: "Google AI", slug: "google-ai", logoUrl: "https://cdn.simpleicons.org/googlegemini", category: "AI & ML", description: "Google's AI division offering Gemini models and AI infrastructure.", defaultColor: "#8B5CF6" },
  { name: "Jasper", slug: "jasper", logoUrl: "https://cdn.simpleicons.org/jasper", category: "AI & ML", description: "AI content creation platform for marketing copy, blogs, and social media.", defaultColor: "#8B5CF6" },
  { name: "Copy.ai", slug: "copy-ai", logoUrl: "https://cdn.simpleicons.org/copyai", category: "AI & ML", description: "AI-powered writing assistant for generating marketing copy and content.", defaultColor: "#8B5CF6" },
  { name: "Runway", slug: "runway", logoUrl: "https://cdn.simpleicons.org/runwayml", category: "AI & ML", description: "Creative AI toolkit for video editing, generation, and visual effects.", defaultColor: "#8B5CF6" },
  { name: "Pinecone", slug: "pinecone", logoUrl: "https://cdn.simpleicons.org/pinecone", category: "AI & ML", description: "Managed vector database for building high-performance AI applications.", defaultColor: "#8B5CF6" },
  { name: "Weaviate", slug: "weaviate", logoUrl: "https://cdn.simpleicons.org/weaviate", category: "AI & ML", description: "Open-source vector database for scalable AI-powered search and retrieval.", defaultColor: "#8B5CF6" },
  { name: "Qdrant", slug: "qdrant", logoUrl: "https://cdn.simpleicons.org/qdrant", category: "AI & ML", description: "High-performance vector similarity search engine for AI applications.", defaultColor: "#8B5CF6" },
  { name: "LangChain", slug: "langchain", logoUrl: "https://cdn.simpleicons.org/langchain", category: "AI & ML", description: "Framework for building applications powered by large language models.", defaultColor: "#8B5CF6" },
  { name: "Perplexity", slug: "perplexity", logoUrl: "https://cdn.simpleicons.org/perplexity", category: "AI & ML", description: "AI-powered search engine that provides cited, conversational answers.", defaultColor: "#8B5CF6" },
  { name: "Mistral", slug: "mistral", logoUrl: "https://cdn.simpleicons.org/mistral", category: "AI & ML", description: "European AI lab building efficient open-weight large language models.", defaultColor: "#8B5CF6" },
  { name: "Cursor", slug: "cursor", logoUrl: "https://cdn.simpleicons.org/cursor", category: "AI & ML", description: "AI-first code editor built for pair programming with language models.", defaultColor: "#8B5CF6" },
  { name: "v0", slug: "v0", logoUrl: "https://cdn.simpleicons.org/v0", category: "AI & ML", description: "Vercel's AI-powered UI generation tool that creates React components from prompts.", defaultColor: "#8B5CF6" },

  // ─── Automation ─────────────────────────────────────────────
  { name: "Zapier", slug: "zapier", logoUrl: "https://cdn.simpleicons.org/zapier", category: "Automation", description: "No-code automation platform connecting thousands of apps with trigger-action workflows.", defaultColor: "#F59E0B" },
  { name: "Make", slug: "make", logoUrl: "https://cdn.simpleicons.org/make", category: "Automation", description: "Visual automation platform for building complex multi-step workflows.", defaultColor: "#F59E0B" },
  { name: "n8n", slug: "n8n", logoUrl: "https://cdn.simpleicons.org/n8n", category: "Automation", description: "Open-source workflow automation tool with a fair-code distribution model.", defaultColor: "#F59E0B" },
  { name: "Power Automate", slug: "power-automate", logoUrl: "https://cdn.simpleicons.org/powerautomate", category: "Automation", description: "Microsoft's automation platform for streamlining repetitive tasks and business processes.", defaultColor: "#F59E0B" },
  { name: "IFTTT", slug: "ifttt", logoUrl: "https://cdn.simpleicons.org/ifttt", category: "Automation", description: "Simple automation service connecting apps and devices with conditional triggers.", defaultColor: "#F59E0B" },
  { name: "Workato", slug: "workato", logoUrl: "https://cdn.simpleicons.org/workato", category: "Automation", description: "Enterprise integration and automation platform for complex business workflows.", defaultColor: "#F59E0B" },
  { name: "Tray.io", slug: "tray-io", logoUrl: "https://cdn.simpleicons.org/trayio", category: "Automation", description: "General-purpose automation platform for connecting and orchestrating business processes.", defaultColor: "#F59E0B" },
  { name: "Activepieces", slug: "activepieces", logoUrl: "https://cdn.simpleicons.org/activepieces", category: "Automation", description: "Open-source no-code automation tool and a self-hostable alternative to Zapier.", defaultColor: "#F59E0B" },
  { name: "Pipedream", slug: "pipedream", logoUrl: "https://cdn.simpleicons.org/pipedream", category: "Automation", description: "Developer-focused integration platform with code-level control over workflows.", defaultColor: "#F59E0B" },
  { name: "Parabola", slug: "parabola", logoUrl: "https://cdn.simpleicons.org/parabola", category: "Automation", description: "Drag-and-drop data workflow tool for automating manual data processes.", defaultColor: "#F59E0B" },
  { name: "Bardeen", slug: "bardeen", logoUrl: "https://cdn.simpleicons.org/bardeen", category: "Automation", description: "Browser-based automation tool for scraping, data entry, and repetitive web tasks.", defaultColor: "#F59E0B" },

  // ─── CRM ────────────────────────────────────────────────────
  { name: "Salesforce", slug: "salesforce", logoUrl: "https://cdn.simpleicons.org/salesforce", category: "CRM", description: "Enterprise CRM platform for sales, service, and marketing management.", defaultColor: "#3B82F6" },
  { name: "HubSpot", slug: "hubspot", logoUrl: "https://cdn.simpleicons.org/hubspot", category: "CRM", description: "All-in-one CRM platform with marketing, sales, and customer service tools.", defaultColor: "#3B82F6" },
  { name: "Pipedrive", slug: "pipedrive", logoUrl: "https://cdn.simpleicons.org/pipedrive", category: "CRM", description: "Sales-focused CRM with visual pipeline management and deal tracking.", defaultColor: "#3B82F6" },
  { name: "Close", slug: "close", logoUrl: "https://cdn.simpleicons.org/close", category: "CRM", description: "CRM built for inside sales teams with built-in calling and email automation.", defaultColor: "#3B82F6" },
  { name: "Zoho CRM", slug: "zoho-crm", logoUrl: "https://cdn.simpleicons.org/zoho", category: "CRM", description: "Affordable CRM suite with sales automation, analytics, and multichannel communication.", defaultColor: "#3B82F6" },
  { name: "Copper", slug: "copper", logoUrl: "https://cdn.simpleicons.org/copper", category: "CRM", description: "Google Workspace-native CRM for managing contacts and sales pipelines.", defaultColor: "#3B82F6" },
  { name: "Freshsales", slug: "freshsales", logoUrl: "https://cdn.simpleicons.org/freshworks", category: "CRM", description: "AI-powered CRM by Freshworks for lead scoring and sales engagement.", defaultColor: "#3B82F6" },
  { name: "Insightly", slug: "insightly", logoUrl: "https://cdn.simpleicons.org/insightly", category: "CRM", description: "CRM and project management platform for growing businesses.", defaultColor: "#3B82F6" },
  { name: "Attio", slug: "attio", logoUrl: "https://cdn.simpleicons.org/attio", category: "CRM", description: "Modern CRM that automatically enriches contacts and syncs relationship data.", defaultColor: "#3B82F6" },
  { name: "Folk", slug: "folk", logoUrl: "https://cdn.simpleicons.org/folk", category: "CRM", description: "Lightweight CRM for managing personal and professional relationships.", defaultColor: "#3B82F6" },
  { name: "Streak", slug: "streak", logoUrl: "https://cdn.simpleicons.org/streak", category: "CRM", description: "CRM built directly inside Gmail for managing deals and workflows.", defaultColor: "#3B82F6" },

  // ─── Communication ──────────────────────────────────────────
  { name: "Slack", slug: "slack", logoUrl: "https://cdn.simpleicons.org/slack", category: "Communication", description: "Team messaging platform with channels, integrations, and real-time collaboration.", defaultColor: "#EC4899" },
  { name: "Microsoft Teams", slug: "microsoft-teams", logoUrl: "https://cdn.simpleicons.org/microsoftteams", category: "Communication", description: "Microsoft's collaboration hub combining chat, video, and file sharing.", defaultColor: "#EC4899" },
  { name: "Discord", slug: "discord", logoUrl: "https://cdn.simpleicons.org/discord", category: "Communication", description: "Voice, video, and text communication platform for communities and teams.", defaultColor: "#EC4899" },
  { name: "Twilio", slug: "twilio", logoUrl: "https://cdn.simpleicons.org/twilio", category: "Communication", description: "Cloud communication APIs for SMS, voice, video, and authentication.", defaultColor: "#EC4899" },
  { name: "SendGrid", slug: "sendgrid", logoUrl: "https://cdn.simpleicons.org/sendgrid", category: "Communication", description: "Cloud-based email delivery service for transactional and marketing emails.", defaultColor: "#EC4899" },
  { name: "Mailchimp", slug: "mailchimp", logoUrl: "https://cdn.simpleicons.org/mailchimp", category: "Communication", description: "Email marketing and automation platform for newsletters and campaigns.", defaultColor: "#EC4899" },
  { name: "Intercom", slug: "intercom", logoUrl: "https://cdn.simpleicons.org/intercom", category: "Communication", description: "Customer messaging platform with live chat, bots, and support tools.", defaultColor: "#EC4899" },
  { name: "Zendesk", slug: "zendesk", logoUrl: "https://cdn.simpleicons.org/zendesk", category: "Communication", description: "Customer service and engagement platform with ticketing and live chat.", defaultColor: "#EC4899" },
  { name: "Crisp", slug: "crisp", logoUrl: "https://cdn.simpleicons.org/crisp", category: "Communication", description: "All-in-one business messaging platform with live chat and chatbots.", defaultColor: "#EC4899" },
  { name: "Drift", slug: "drift", logoUrl: "https://cdn.simpleicons.org/drift", category: "Communication", description: "Conversational marketing platform with AI chatbots and live chat.", defaultColor: "#EC4899" },
  { name: "Front", slug: "front", logoUrl: "https://cdn.simpleicons.org/front", category: "Communication", description: "Shared inbox platform for managing customer communication across channels.", defaultColor: "#EC4899" },
  { name: "WhatsApp Business", slug: "whatsapp-business", logoUrl: "https://cdn.simpleicons.org/whatsapp", category: "Communication", description: "Business messaging platform for customer engagement on WhatsApp.", defaultColor: "#EC4899" },
  { name: "Telegram", slug: "telegram", logoUrl: "https://cdn.simpleicons.org/telegram", category: "Communication", description: "Cloud-based messaging app with bots, channels, and group capabilities.", defaultColor: "#EC4899" },

  // ─── Databases & Storage ────────────────────────────────────
  { name: "Airtable", slug: "airtable", logoUrl: "https://cdn.simpleicons.org/airtable", category: "Databases & Storage", description: "Spreadsheet-database hybrid for organizing and collaborating on structured data.", defaultColor: "#10B981" },
  { name: "Supabase", slug: "supabase", logoUrl: "https://cdn.simpleicons.org/supabase", category: "Databases & Storage", description: "Open-source Firebase alternative with PostgreSQL, auth, and real-time subscriptions.", defaultColor: "#10B981" },
  { name: "Firebase", slug: "firebase", logoUrl: "https://cdn.simpleicons.org/firebase", category: "Databases & Storage", description: "Google's app development platform with real-time database, auth, and hosting.", defaultColor: "#10B981" },
  { name: "MongoDB", slug: "mongodb", logoUrl: "https://cdn.simpleicons.org/mongodb", category: "Databases & Storage", description: "Document-oriented NoSQL database for flexible, scalable data storage.", defaultColor: "#10B981" },
  { name: "PostgreSQL", slug: "postgresql", logoUrl: "https://cdn.simpleicons.org/postgresql", category: "Databases & Storage", description: "Powerful open-source relational database with advanced SQL compliance.", defaultColor: "#10B981" },
  { name: "MySQL", slug: "mysql", logoUrl: "https://cdn.simpleicons.org/mysql", category: "Databases & Storage", description: "Popular open-source relational database for web applications.", defaultColor: "#10B981" },
  { name: "Snowflake", slug: "snowflake", logoUrl: "https://cdn.simpleicons.org/snowflake", category: "Databases & Storage", description: "Cloud data warehouse for large-scale analytics and data sharing.", defaultColor: "#10B981" },
  { name: "BigQuery", slug: "bigquery", logoUrl: "https://cdn.simpleicons.org/googlebigquery", category: "Databases & Storage", description: "Google's serverless enterprise data warehouse for SQL-based analytics.", defaultColor: "#10B981" },
  { name: "Amazon S3", slug: "amazon-s3", logoUrl: "https://cdn.simpleicons.org/amazons3", category: "Databases & Storage", description: "Scalable object storage service from AWS for any amount of data.", defaultColor: "#10B981" },
  { name: "Google Sheets", slug: "google-sheets", logoUrl: "https://cdn.simpleicons.org/googlesheets", category: "Databases & Storage", description: "Cloud-based spreadsheet app for collaborative data management.", defaultColor: "#10B981" },
  { name: "Redis", slug: "redis", logoUrl: "https://cdn.simpleicons.org/redis", category: "Databases & Storage", description: "In-memory data store used as a cache, message broker, and database.", defaultColor: "#10B981" },
  { name: "DynamoDB", slug: "dynamodb", logoUrl: "https://cdn.simpleicons.org/amazondynamodb", category: "Databases & Storage", description: "AWS managed NoSQL database with single-digit millisecond latency.", defaultColor: "#10B981" },
  { name: "PlanetScale", slug: "planetscale", logoUrl: "https://cdn.simpleicons.org/planetscale", category: "Databases & Storage", description: "Serverless MySQL platform with branching and non-blocking schema changes.", defaultColor: "#10B981" },
  { name: "Neon", slug: "neon", logoUrl: "https://cdn.simpleicons.org/neon", category: "Databases & Storage", description: "Serverless PostgreSQL with autoscaling, branching, and bottomless storage.", defaultColor: "#10B981" },
  { name: "Upstash", slug: "upstash", logoUrl: "https://cdn.simpleicons.org/upstash", category: "Databases & Storage", description: "Serverless Redis and Kafka for low-latency data at the edge.", defaultColor: "#10B981" },
  { name: "Cloudflare R2", slug: "cloudflare-r2", logoUrl: "https://cdn.simpleicons.org/cloudflare", category: "Databases & Storage", description: "S3-compatible object storage with zero egress fees from Cloudflare.", defaultColor: "#10B981" },

  // ─── Design ─────────────────────────────────────────────────
  { name: "Figma", slug: "figma", logoUrl: "https://cdn.simpleicons.org/figma", category: "Design", description: "Collaborative interface design tool for UI/UX prototyping and design systems.", defaultColor: "#F472B6" },
  { name: "Canva", slug: "canva", logoUrl: "https://cdn.simpleicons.org/canva", category: "Design", description: "Online graphic design platform with templates for social media, presentations, and more.", defaultColor: "#F472B6" },
  { name: "Adobe Creative Cloud", slug: "adobe-creative-cloud", logoUrl: "https://cdn.simpleicons.org/adobecreativecloud", category: "Design", description: "Suite of creative applications including Photoshop, Illustrator, and Premiere Pro.", defaultColor: "#F472B6" },
  { name: "Miro", slug: "miro", logoUrl: "https://cdn.simpleicons.org/miro", category: "Design", description: "Online collaborative whiteboard for brainstorming, planning, and diagramming.", defaultColor: "#F472B6" },
  { name: "Sketch", slug: "sketch", logoUrl: "https://cdn.simpleicons.org/sketch", category: "Design", description: "macOS design toolkit for creating user interfaces and digital products.", defaultColor: "#F472B6" },
  { name: "InVision", slug: "invision", logoUrl: "https://cdn.simpleicons.org/invision", category: "Design", description: "Digital product design platform for prototyping and collaboration.", defaultColor: "#F472B6" },
  { name: "Framer", slug: "framer", logoUrl: "https://cdn.simpleicons.org/framer", category: "Design", description: "Web design and publishing platform with interactive animations and CMS.", defaultColor: "#F472B6" },
  { name: "Webflow", slug: "webflow", logoUrl: "https://cdn.simpleicons.org/webflow", category: "Design", description: "Visual web development platform for building responsive sites without code.", defaultColor: "#F472B6" },
  { name: "Spline", slug: "spline", logoUrl: "https://cdn.simpleicons.org/spline", category: "Design", description: "3D design tool for creating interactive web experiences in the browser.", defaultColor: "#F472B6" },

  // ─── Dev Tools ──────────────────────────────────────────────
  { name: "GitHub", slug: "github", logoUrl: "https://cdn.simpleicons.org/github", category: "Dev Tools", description: "Code hosting platform for version control and collaboration using Git.", defaultColor: "#6366F1" },
  { name: "GitLab", slug: "gitlab", logoUrl: "https://cdn.simpleicons.org/gitlab", category: "Dev Tools", description: "Complete DevOps platform with Git repos, CI/CD, and project management.", defaultColor: "#6366F1" },
  { name: "Bitbucket", slug: "bitbucket", logoUrl: "https://cdn.simpleicons.org/bitbucket", category: "Dev Tools", description: "Atlassian's Git solution with built-in CI/CD and Jira integration.", defaultColor: "#6366F1" },
  { name: "Vercel", slug: "vercel", logoUrl: "https://cdn.simpleicons.org/vercel", category: "Dev Tools", description: "Frontend deployment platform optimized for Next.js and modern web frameworks.", defaultColor: "#6366F1" },
  { name: "Netlify", slug: "netlify", logoUrl: "https://cdn.simpleicons.org/netlify", category: "Dev Tools", description: "Platform for deploying and hosting modern web applications with CI/CD.", defaultColor: "#6366F1" },
  { name: "Railway", slug: "railway", logoUrl: "https://cdn.simpleicons.org/railway", category: "Dev Tools", description: "Cloud platform for deploying apps, databases, and services instantly.", defaultColor: "#6366F1" },
  { name: "Docker", slug: "docker", logoUrl: "https://cdn.simpleicons.org/docker", category: "Dev Tools", description: "Container platform for building, shipping, and running applications.", defaultColor: "#6366F1" },
  { name: "AWS", slug: "aws", logoUrl: "https://cdn.simpleicons.org/amazonwebservices", category: "Dev Tools", description: "Amazon's comprehensive cloud computing platform with 200+ services.", defaultColor: "#6366F1" },
  { name: "GCP", slug: "gcp", logoUrl: "https://cdn.simpleicons.org/googlecloud", category: "Dev Tools", description: "Google Cloud Platform offering compute, storage, AI, and data analytics services.", defaultColor: "#6366F1" },
  { name: "Azure", slug: "azure", logoUrl: "https://cdn.simpleicons.org/microsoftazure", category: "Dev Tools", description: "Microsoft's cloud computing platform for building and managing applications.", defaultColor: "#6366F1" },
  { name: "Cloudflare", slug: "cloudflare", logoUrl: "https://cdn.simpleicons.org/cloudflare", category: "Dev Tools", description: "Web infrastructure company providing CDN, DNS, DDoS protection, and edge computing.", defaultColor: "#6366F1" },
  { name: "Render", slug: "render", logoUrl: "https://cdn.simpleicons.org/render", category: "Dev Tools", description: "Cloud platform for deploying web services, databases, and static sites.", defaultColor: "#6366F1" },
  { name: "Fly.io", slug: "fly-io", logoUrl: "https://cdn.simpleicons.org/flydotio", category: "Dev Tools", description: "Platform for running full-stack apps close to users with global edge deployment.", defaultColor: "#6366F1" },
  { name: "Sentry", slug: "sentry", logoUrl: "https://cdn.simpleicons.org/sentry", category: "Dev Tools", description: "Application monitoring and error tracking platform for developers.", defaultColor: "#6366F1" },
  { name: "Datadog", slug: "datadog", logoUrl: "https://cdn.simpleicons.org/datadog", category: "Dev Tools", description: "Cloud monitoring and observability platform for infrastructure and applications.", defaultColor: "#6366F1" },
  { name: "Postman", slug: "postman", logoUrl: "https://cdn.simpleicons.org/postman", category: "Dev Tools", description: "API development platform for designing, testing, and documenting APIs.", defaultColor: "#6366F1" },

  // ─── Documents & Knowledge ──────────────────────────────────
  { name: "Notion", slug: "notion", logoUrl: "https://cdn.simpleicons.org/notion", category: "Documents & Knowledge", description: "All-in-one workspace for notes, wikis, databases, and project management.", defaultColor: "#8B5CF6" },
  { name: "Confluence", slug: "confluence", logoUrl: "https://cdn.simpleicons.org/confluence", category: "Documents & Knowledge", description: "Atlassian's team workspace for creating and sharing documentation.", defaultColor: "#8B5CF6" },
  { name: "Google Docs", slug: "google-docs", logoUrl: "https://cdn.simpleicons.org/googledocs", category: "Documents & Knowledge", description: "Cloud-based word processor for collaborative document editing.", defaultColor: "#8B5CF6" },
  { name: "Coda", slug: "coda", logoUrl: "https://cdn.simpleicons.org/coda", category: "Documents & Knowledge", description: "Document platform that blends docs, spreadsheets, and apps into one surface.", defaultColor: "#8B5CF6" },
  { name: "Obsidian", slug: "obsidian", logoUrl: "https://cdn.simpleicons.org/obsidian", category: "Documents & Knowledge", description: "Private knowledge base with linked markdown notes and graph visualization.", defaultColor: "#8B5CF6" },
  { name: "Slite", slug: "slite", logoUrl: "https://cdn.simpleicons.org/slite", category: "Documents & Knowledge", description: "Knowledge base tool for teams to organize and share internal documentation.", defaultColor: "#8B5CF6" },
  { name: "GitBook", slug: "gitbook", logoUrl: "https://cdn.simpleicons.org/gitbook", category: "Documents & Knowledge", description: "Documentation platform for creating beautiful technical docs and knowledge bases.", defaultColor: "#8B5CF6" },
  { name: "ReadMe", slug: "readme", logoUrl: "https://cdn.simpleicons.org/readme", category: "Documents & Knowledge", description: "Developer hub platform for creating interactive API documentation.", defaultColor: "#8B5CF6" },

  // ─── E-commerce ─────────────────────────────────────────────
  { name: "Shopify", slug: "shopify", logoUrl: "https://cdn.simpleicons.org/shopify", category: "E-commerce", description: "E-commerce platform for building online stores with payments and inventory.", defaultColor: "#059669" },
  { name: "Stripe", slug: "stripe", logoUrl: "https://cdn.simpleicons.org/stripe", category: "E-commerce", description: "Payment processing platform for internet businesses with powerful APIs.", defaultColor: "#059669" },
  { name: "Square", slug: "square", logoUrl: "https://cdn.simpleicons.org/square", category: "E-commerce", description: "Financial services platform for payments, POS, and business management.", defaultColor: "#059669" },
  { name: "WooCommerce", slug: "woocommerce", logoUrl: "https://cdn.simpleicons.org/woocommerce", category: "E-commerce", description: "Open-source e-commerce plugin for WordPress with extensive customization.", defaultColor: "#059669" },
  { name: "Gumroad", slug: "gumroad", logoUrl: "https://cdn.simpleicons.org/gumroad", category: "E-commerce", description: "Simple platform for creators to sell digital products and memberships.", defaultColor: "#059669" },
  { name: "LemonSqueezy", slug: "lemonsqueezy", logoUrl: "https://cdn.simpleicons.org/lemonsqueezy", category: "E-commerce", description: "All-in-one platform for selling digital products with global tax compliance.", defaultColor: "#059669" },
  { name: "Paddle", slug: "paddle", logoUrl: "https://cdn.simpleicons.org/paddle", category: "E-commerce", description: "Payment infrastructure for SaaS companies handling billing, taxes, and compliance.", defaultColor: "#059669" },
  { name: "BigCommerce", slug: "bigcommerce", logoUrl: "https://cdn.simpleicons.org/bigcommerce", category: "E-commerce", description: "Enterprise e-commerce platform for building scalable online stores.", defaultColor: "#059669" },

  // ─── Finance & Accounting ───────────────────────────────────
  { name: "QuickBooks", slug: "quickbooks", logoUrl: "https://cdn.simpleicons.org/quickbooks", category: "Finance & Accounting", description: "Accounting software for small businesses with invoicing and expense tracking.", defaultColor: "#0EA5E9" },
  { name: "Xero", slug: "xero", logoUrl: "https://cdn.simpleicons.org/xero", category: "Finance & Accounting", description: "Cloud-based accounting software for small and medium-sized businesses.", defaultColor: "#0EA5E9" },
  { name: "Wave", slug: "wave", logoUrl: "https://cdn.simpleicons.org/wave", category: "Finance & Accounting", description: "Free accounting and invoicing software for freelancers and small businesses.", defaultColor: "#0EA5E9" },
  { name: "Plaid", slug: "plaid", logoUrl: "https://cdn.simpleicons.org/plaid", category: "Finance & Accounting", description: "Financial data connectivity platform linking apps with bank accounts.", defaultColor: "#0EA5E9" },
  { name: "Mercury", slug: "mercury", logoUrl: "https://cdn.simpleicons.org/mercury", category: "Finance & Accounting", description: "Banking platform designed for startups with powerful financial tools.", defaultColor: "#0EA5E9" },
  { name: "Brex", slug: "brex", logoUrl: "https://cdn.simpleicons.org/brex", category: "Finance & Accounting", description: "Corporate card and spend management platform for growing companies.", defaultColor: "#0EA5E9" },
  { name: "Ramp", slug: "ramp", logoUrl: "https://cdn.simpleicons.org/ramp", category: "Finance & Accounting", description: "Corporate card and expense management platform focused on saving money.", defaultColor: "#0EA5E9" },
  { name: "Wise", slug: "wise", logoUrl: "https://cdn.simpleicons.org/wise", category: "Finance & Accounting", description: "International money transfer service with low-cost currency exchange.", defaultColor: "#0EA5E9" },
  { name: "PayPal", slug: "paypal", logoUrl: "https://cdn.simpleicons.org/paypal", category: "Finance & Accounting", description: "Online payment platform for sending and receiving money globally.", defaultColor: "#0EA5E9" },
  { name: "FreshBooks", slug: "freshbooks", logoUrl: "https://cdn.simpleicons.org/freshbooks", category: "Finance & Accounting", description: "Cloud accounting software built for freelancers with time tracking and invoicing.", defaultColor: "#0EA5E9" },

  // ─── HR & Recruiting ────────────────────────────────────────
  { name: "BambooHR", slug: "bamboohr", logoUrl: "https://cdn.simpleicons.org/bamboohr", category: "HR & Recruiting", description: "HR software for small and medium businesses with employee data management.", defaultColor: "#D946EF" },
  { name: "Gusto", slug: "gusto", logoUrl: "https://cdn.simpleicons.org/gusto", category: "HR & Recruiting", description: "Payroll, benefits, and HR platform for small businesses.", defaultColor: "#D946EF" },
  { name: "Lever", slug: "lever", logoUrl: "https://cdn.simpleicons.org/lever", category: "HR & Recruiting", description: "Talent acquisition suite combining ATS and CRM for recruiting teams.", defaultColor: "#D946EF" },
  { name: "Greenhouse", slug: "greenhouse", logoUrl: "https://cdn.simpleicons.org/greenhouse", category: "HR & Recruiting", description: "Hiring platform for structured recruiting with interview management.", defaultColor: "#D946EF" },
  { name: "Rippling", slug: "rippling", logoUrl: "https://cdn.simpleicons.org/rippling", category: "HR & Recruiting", description: "Unified workforce platform for HR, IT, and finance management.", defaultColor: "#D946EF" },
  { name: "Deel", slug: "deel", logoUrl: "https://cdn.simpleicons.org/deel", category: "HR & Recruiting", description: "Global payroll and compliance platform for hiring international teams.", defaultColor: "#D946EF" },
  { name: "Remote", slug: "remote", logoUrl: "https://cdn.simpleicons.org/remote", category: "HR & Recruiting", description: "Global employment platform for hiring, payroll, and benefits worldwide.", defaultColor: "#D946EF" },
  { name: "Workday", slug: "workday", logoUrl: "https://cdn.simpleicons.org/workday", category: "HR & Recruiting", description: "Enterprise cloud platform for HR, finance, and planning.", defaultColor: "#D946EF" },
  { name: "ADP", slug: "adp", logoUrl: "https://cdn.simpleicons.org/adp", category: "HR & Recruiting", description: "Human capital management platform for payroll, HR, and talent.", defaultColor: "#D946EF" },
  { name: "Lattice", slug: "lattice", logoUrl: "https://cdn.simpleicons.org/lattice", category: "HR & Recruiting", description: "People management platform for performance reviews, goals, and engagement.", defaultColor: "#D946EF" },

  // ─── Marketing ──────────────────────────────────────────────
  { name: "Google Ads", slug: "google-ads", logoUrl: "https://cdn.simpleicons.org/googleads", category: "Marketing", description: "Online advertising platform for search, display, and video campaigns.", defaultColor: "#F97316" },
  { name: "Meta Ads", slug: "meta-ads", logoUrl: "https://cdn.simpleicons.org/meta", category: "Marketing", description: "Advertising platform for Facebook, Instagram, and Messenger campaigns.", defaultColor: "#F97316" },
  { name: "Semrush", slug: "semrush", logoUrl: "https://cdn.simpleicons.org/semrush", category: "Marketing", description: "All-in-one digital marketing toolkit for SEO, PPC, and content research.", defaultColor: "#F97316" },
  { name: "Ahrefs", slug: "ahrefs", logoUrl: "https://cdn.simpleicons.org/ahrefs", category: "Marketing", description: "SEO toolset for backlink analysis, keyword research, and site audits.", defaultColor: "#F97316" },
  { name: "Buffer", slug: "buffer", logoUrl: "https://cdn.simpleicons.org/buffer", category: "Marketing", description: "Social media management tool for scheduling and analyzing posts.", defaultColor: "#F97316" },
  { name: "Hootsuite", slug: "hootsuite", logoUrl: "https://cdn.simpleicons.org/hootsuite", category: "Marketing", description: "Social media management platform for scheduling, monitoring, and analytics.", defaultColor: "#F97316" },
  { name: "Later", slug: "later", logoUrl: "https://cdn.simpleicons.org/later", category: "Marketing", description: "Social media scheduling and planning tool with visual content calendar.", defaultColor: "#F97316" },
  { name: "Sprout Social", slug: "sprout-social", logoUrl: "https://cdn.simpleicons.org/sproutsocial", category: "Marketing", description: "Social media management and analytics platform for enterprise teams.", defaultColor: "#F97316" },
  { name: "ConvertKit", slug: "convertkit", logoUrl: "https://cdn.simpleicons.org/convertkit", category: "Marketing", description: "Email marketing platform designed for creators with automation and landing pages.", defaultColor: "#F97316" },
  { name: "Beehiiv", slug: "beehiiv", logoUrl: "https://cdn.simpleicons.org/beehiiv", category: "Marketing", description: "Newsletter platform for creators with growth tools and monetization.", defaultColor: "#F97316" },
  { name: "Substack", slug: "substack", logoUrl: "https://cdn.simpleicons.org/substack", category: "Marketing", description: "Publishing platform for independent writers with paid subscriptions.", defaultColor: "#F97316" },
  { name: "Unbounce", slug: "unbounce", logoUrl: "https://cdn.simpleicons.org/unbounce", category: "Marketing", description: "Landing page builder with A/B testing and conversion optimization.", defaultColor: "#F97316" },

  // ─── Project Management ─────────────────────────────────────
  { name: "Asana", slug: "asana", logoUrl: "https://cdn.simpleicons.org/asana", category: "Project Management", description: "Work management platform for teams to plan, organize, and track projects.", defaultColor: "#14B8A6" },
  { name: "Monday", slug: "monday", logoUrl: "https://cdn.simpleicons.org/mondaydotcom", category: "Project Management", description: "Visual project management platform with customizable workflows.", defaultColor: "#14B8A6" },
  { name: "Jira", slug: "jira", logoUrl: "https://cdn.simpleicons.org/jira", category: "Project Management", description: "Issue tracking and agile project management tool for software teams.", defaultColor: "#14B8A6" },
  { name: "Linear", slug: "linear", logoUrl: "https://cdn.simpleicons.org/linear", category: "Project Management", description: "Streamlined project management tool built for modern software teams.", defaultColor: "#14B8A6" },
  { name: "ClickUp", slug: "clickup", logoUrl: "https://cdn.simpleicons.org/clickup", category: "Project Management", description: "All-in-one productivity platform with tasks, docs, and collaboration.", defaultColor: "#14B8A6" },
  { name: "Trello", slug: "trello", logoUrl: "https://cdn.simpleicons.org/trello", category: "Project Management", description: "Kanban-style project management tool with boards, lists, and cards.", defaultColor: "#14B8A6" },
  { name: "Basecamp", slug: "basecamp", logoUrl: "https://cdn.simpleicons.org/basecamp", category: "Project Management", description: "Project management and team communication tool with simple, opinionated design.", defaultColor: "#14B8A6" },
  { name: "Shortcut", slug: "shortcut", logoUrl: "https://cdn.simpleicons.org/shortcut", category: "Project Management", description: "Project management platform for software teams with epics and iterations.", defaultColor: "#14B8A6" },
  { name: "Wrike", slug: "wrike", logoUrl: "https://cdn.simpleicons.org/wrike", category: "Project Management", description: "Collaborative work management platform for cross-functional teams.", defaultColor: "#14B8A6" },
  { name: "Height", slug: "height", logoUrl: "https://cdn.simpleicons.org/height", category: "Project Management", description: "Autonomous project management tool with AI-powered task organization.", defaultColor: "#14B8A6" },
  { name: "Plane", slug: "plane", logoUrl: "https://cdn.simpleicons.org/plane", category: "Project Management", description: "Open-source project management tool and a self-hostable Jira alternative.", defaultColor: "#14B8A6" },

  // ─── Sales & Outreach ───────────────────────────────────────
  { name: "Apollo", slug: "apollo", logoUrl: "https://cdn.simpleicons.org/apollo", category: "Sales & Outreach", description: "Sales intelligence platform with prospecting, enrichment, and outreach tools.", defaultColor: "#EF4444" },
  { name: "Outreach", slug: "outreach", logoUrl: "https://cdn.simpleicons.org/outreach", category: "Sales & Outreach", description: "Sales engagement platform for managing multi-channel outreach sequences.", defaultColor: "#EF4444" },
  { name: "SalesLoft", slug: "salesloft", logoUrl: "https://cdn.simpleicons.org/salesloft", category: "Sales & Outreach", description: "Revenue orchestration platform for sales engagement and pipeline management.", defaultColor: "#EF4444" },
  { name: "Lemlist", slug: "lemlist", logoUrl: "https://cdn.simpleicons.org/lemlist", category: "Sales & Outreach", description: "Cold email outreach platform with personalization and deliverability tools.", defaultColor: "#EF4444" },
  { name: "Clay", slug: "clay", logoUrl: "https://cdn.simpleicons.org/clay", category: "Sales & Outreach", description: "Data enrichment and outreach platform for building targeted prospect lists.", defaultColor: "#EF4444" },
  { name: "Instantly", slug: "instantly", logoUrl: "https://cdn.simpleicons.org/instantly", category: "Sales & Outreach", description: "Cold email platform with unlimited sending accounts and AI warmup.", defaultColor: "#EF4444" },
  { name: "Smartlead", slug: "smartlead", logoUrl: "https://cdn.simpleicons.org/smartlead", category: "Sales & Outreach", description: "Cold email outreach tool with multi-channel inbox rotation.", defaultColor: "#EF4444" },
  { name: "Reply.io", slug: "reply-io", logoUrl: "https://cdn.simpleicons.org/replyio", category: "Sales & Outreach", description: "AI-powered sales engagement platform for multichannel outreach.", defaultColor: "#EF4444" },
  { name: "Snov.io", slug: "snov-io", logoUrl: "https://cdn.simpleicons.org/snovio", category: "Sales & Outreach", description: "Sales automation platform with email finder, verifier, and drip campaigns.", defaultColor: "#EF4444" },
  { name: "Hunter", slug: "hunter", logoUrl: "https://cdn.simpleicons.org/hunter", category: "Sales & Outreach", description: "Email finder and verification tool for professional outreach.", defaultColor: "#EF4444" },
  { name: "ZoomInfo", slug: "zoominfo", logoUrl: "https://cdn.simpleicons.org/zoominfo", category: "Sales & Outreach", description: "B2B data platform providing contact and company intelligence for sales.", defaultColor: "#EF4444" },
  { name: "Clearbit", slug: "clearbit", logoUrl: "https://cdn.simpleicons.org/clearbit", category: "Sales & Outreach", description: "Data enrichment platform for turning leads into complete customer profiles.", defaultColor: "#EF4444" },

  // ─── Scheduling ─────────────────────────────────────────────
  { name: "Calendly", slug: "calendly", logoUrl: "https://cdn.simpleicons.org/calendly", category: "Scheduling", description: "Scheduling automation platform for booking meetings without back-and-forth.", defaultColor: "#06B6D4" },
  { name: "Cal.com", slug: "cal-com", logoUrl: "https://cdn.simpleicons.org/caldotcom", category: "Scheduling", description: "Open-source scheduling infrastructure for individuals and businesses.", defaultColor: "#06B6D4" },
  { name: "Acuity", slug: "acuity", logoUrl: "https://cdn.simpleicons.org/acuityscheduling", category: "Scheduling", description: "Online appointment scheduling software with client self-booking.", defaultColor: "#06B6D4" },
  { name: "Doodle", slug: "doodle", logoUrl: "https://cdn.simpleicons.org/doodle", category: "Scheduling", description: "Group scheduling tool for finding the best meeting time across participants.", defaultColor: "#06B6D4" },
  { name: "SavvyCal", slug: "savvycal", logoUrl: "https://cdn.simpleicons.org/savvycal", category: "Scheduling", description: "Scheduling tool with personalized links and calendar overlay for recipients.", defaultColor: "#06B6D4" },
  { name: "TidyCal", slug: "tidycal", logoUrl: "https://cdn.simpleicons.org/tidycal", category: "Scheduling", description: "Simple, affordable scheduling tool with a lifetime deal option.", defaultColor: "#06B6D4" },
  { name: "Reclaim.ai", slug: "reclaim-ai", logoUrl: "https://cdn.simpleicons.org/reclaimai", category: "Scheduling", description: "AI-powered calendar assistant for smart scheduling and time blocking.", defaultColor: "#06B6D4" },

  // ─── Security & Compliance ──────────────────────────────────
  { name: "Okta", slug: "okta", logoUrl: "https://cdn.simpleicons.org/okta", category: "Security & Compliance", description: "Identity and access management platform for secure single sign-on.", defaultColor: "#64748B" },
  { name: "Auth0", slug: "auth0", logoUrl: "https://cdn.simpleicons.org/auth0", category: "Security & Compliance", description: "Authentication and authorization platform for web and mobile applications.", defaultColor: "#64748B" },
  { name: "1Password", slug: "1password", logoUrl: "https://cdn.simpleicons.org/1password", category: "Security & Compliance", description: "Password manager for teams and businesses with secure credential sharing.", defaultColor: "#64748B" },
  { name: "Vanta", slug: "vanta", logoUrl: "https://cdn.simpleicons.org/vanta", category: "Security & Compliance", description: "Automated security compliance platform for SOC 2, HIPAA, and ISO 27001.", defaultColor: "#64748B" },
  { name: "Drata", slug: "drata", logoUrl: "https://cdn.simpleicons.org/drata", category: "Security & Compliance", description: "Compliance automation platform for continuous security monitoring.", defaultColor: "#64748B" },
  { name: "Snyk", slug: "snyk", logoUrl: "https://cdn.simpleicons.org/snyk", category: "Security & Compliance", description: "Developer security platform for finding and fixing vulnerabilities in code.", defaultColor: "#64748B" },
  { name: "Cloudflare Security", slug: "cloudflare-security", logoUrl: "https://cdn.simpleicons.org/cloudflare", category: "Security & Compliance", description: "Web security suite with WAF, DDoS protection, and bot management.", defaultColor: "#64748B" },
  { name: "Clerk", slug: "clerk", logoUrl: "https://cdn.simpleicons.org/clerk", category: "Security & Compliance", description: "Drop-in authentication and user management for modern web applications.", defaultColor: "#64748B" },
  { name: "Stytch", slug: "stytch", logoUrl: "https://cdn.simpleicons.org/stytch", category: "Security & Compliance", description: "Passwordless authentication platform with biometrics and magic links.", defaultColor: "#64748B" },

  // ─── Video & Meetings ───────────────────────────────────────
  { name: "Zoom", slug: "zoom", logoUrl: "https://cdn.simpleicons.org/zoom", category: "Video & Meetings", description: "Video conferencing platform for meetings, webinars, and virtual events.", defaultColor: "#2563EB" },
  { name: "Google Meet", slug: "google-meet", logoUrl: "https://cdn.simpleicons.org/googlemeet", category: "Video & Meetings", description: "Google's video conferencing solution integrated with Google Workspace.", defaultColor: "#2563EB" },
  { name: "Loom", slug: "loom", logoUrl: "https://cdn.simpleicons.org/loom", category: "Video & Meetings", description: "Async video messaging tool for recording and sharing screen recordings.", defaultColor: "#2563EB" },
  { name: "Riverside", slug: "riverside", logoUrl: "https://cdn.simpleicons.org/riverside", category: "Video & Meetings", description: "Studio-quality podcast and video recording platform for remote interviews.", defaultColor: "#2563EB" },
  { name: "Descript", slug: "descript", logoUrl: "https://cdn.simpleicons.org/descript", category: "Video & Meetings", description: "All-in-one video and podcast editing tool with AI transcription.", defaultColor: "#2563EB" },
  { name: "Otter.ai", slug: "otter-ai", logoUrl: "https://cdn.simpleicons.org/otter", category: "Video & Meetings", description: "AI meeting assistant for real-time transcription and meeting summaries.", defaultColor: "#2563EB" },
  { name: "Fireflies.ai", slug: "fireflies-ai", logoUrl: "https://cdn.simpleicons.org/fireflies", category: "Video & Meetings", description: "AI notetaker that records, transcribes, and summarizes meetings.", defaultColor: "#2563EB" },
  { name: "Grain", slug: "grain", logoUrl: "https://cdn.simpleicons.org/grain", category: "Video & Meetings", description: "Meeting recording tool that captures highlights and shares insights.", defaultColor: "#2563EB" },

  // ─── Voice & Phone ──────────────────────────────────────────
  { name: "Aircall", slug: "aircall", logoUrl: "https://cdn.simpleicons.org/aircall", category: "Voice & Phone", description: "Cloud-based phone system for sales and support teams.", defaultColor: "#7C3AED" },
  { name: "Dialpad", slug: "dialpad", logoUrl: "https://cdn.simpleicons.org/dialpad", category: "Voice & Phone", description: "AI-powered business communications platform with voice, video, and messaging.", defaultColor: "#7C3AED" },
  { name: "RingCentral", slug: "ringcentral", logoUrl: "https://cdn.simpleicons.org/ringcentral", category: "Voice & Phone", description: "Cloud communications platform with phone, video, and team messaging.", defaultColor: "#7C3AED" },
  { name: "Vonage", slug: "vonage", logoUrl: "https://cdn.simpleicons.org/vonage", category: "Voice & Phone", description: "Cloud communications platform with voice, messaging, and video APIs.", defaultColor: "#7C3AED" },
  { name: "Twilio Voice", slug: "twilio-voice", logoUrl: "https://cdn.simpleicons.org/twilio", category: "Voice & Phone", description: "Programmable voice API for building custom phone call experiences.", defaultColor: "#7C3AED" },
  { name: "OpenPhone", slug: "openphone", logoUrl: "https://cdn.simpleicons.org/openphone", category: "Voice & Phone", description: "Modern business phone system with shared numbers and CRM integration.", defaultColor: "#7C3AED" },
  { name: "JustCall", slug: "justcall", logoUrl: "https://cdn.simpleicons.org/justcall", category: "Voice & Phone", description: "Cloud phone system for sales and support with SMS and call tracking.", defaultColor: "#7C3AED" },

  // ─── Forms & Surveys ────────────────────────────────────────
  { name: "Typeform", slug: "typeform", logoUrl: "https://cdn.simpleicons.org/typeform", category: "Forms & Surveys", description: "Interactive form and survey builder with conversational design.", defaultColor: "#A855F7" },
  { name: "Tally", slug: "tally", logoUrl: "https://cdn.simpleicons.org/tally", category: "Forms & Surveys", description: "Free form builder with a simple, notion-like interface.", defaultColor: "#A855F7" },
  { name: "Google Forms", slug: "google-forms", logoUrl: "https://cdn.simpleicons.org/googleforms", category: "Forms & Surveys", description: "Free form and survey tool integrated with Google Workspace.", defaultColor: "#A855F7" },
  { name: "SurveyMonkey", slug: "surveymonkey", logoUrl: "https://cdn.simpleicons.org/surveymonkey", category: "Forms & Surveys", description: "Online survey platform for creating polls, quizzes, and market research.", defaultColor: "#A855F7" },
  { name: "Jotform", slug: "jotform", logoUrl: "https://cdn.simpleicons.org/jotform", category: "Forms & Surveys", description: "Online form builder with templates, payments, and workflow automation.", defaultColor: "#A855F7" },
  { name: "Fillout", slug: "fillout", logoUrl: "https://cdn.simpleicons.org/fillout", category: "Forms & Surveys", description: "Form builder that connects directly to databases like Airtable and Notion.", defaultColor: "#A855F7" },
  { name: "Paperform", slug: "paperform", logoUrl: "https://cdn.simpleicons.org/paperform", category: "Forms & Surveys", description: "Beautiful form builder for surveys, bookings, and e-commerce.", defaultColor: "#A855F7" },

  // ─── Analytics ──────────────────────────────────────────────
  { name: "Google Analytics", slug: "google-analytics", logoUrl: "https://cdn.simpleicons.org/googleanalytics", category: "Analytics", description: "Web analytics service for tracking website traffic and user behavior.", defaultColor: "#F43F5E" },
  { name: "Mixpanel", slug: "mixpanel", logoUrl: "https://cdn.simpleicons.org/mixpanel", category: "Analytics", description: "Product analytics platform for tracking user interactions and funnel analysis.", defaultColor: "#F43F5E" },
  { name: "Amplitude", slug: "amplitude", logoUrl: "https://cdn.simpleicons.org/amplitude", category: "Analytics", description: "Digital analytics platform for understanding user behavior and product usage.", defaultColor: "#F43F5E" },
  { name: "PostHog", slug: "posthog", logoUrl: "https://cdn.simpleicons.org/posthog", category: "Analytics", description: "Open-source product analytics suite with feature flags and session replay.", defaultColor: "#F43F5E" },
  { name: "Hotjar", slug: "hotjar", logoUrl: "https://cdn.simpleicons.org/hotjar", category: "Analytics", description: "Behavior analytics tool with heatmaps, session recordings, and surveys.", defaultColor: "#F43F5E" },
  { name: "FullStory", slug: "fullstory", logoUrl: "https://cdn.simpleicons.org/fullstory", category: "Analytics", description: "Digital experience analytics platform with session replay and frustration signals.", defaultColor: "#F43F5E" },
  { name: "Heap", slug: "heap", logoUrl: "https://cdn.simpleicons.org/heap", category: "Analytics", description: "Auto-capture analytics platform that tracks every user interaction.", defaultColor: "#F43F5E" },
  { name: "Segment", slug: "segment", logoUrl: "https://cdn.simpleicons.org/segment", category: "Analytics", description: "Customer data platform for collecting and routing analytics data.", defaultColor: "#F43F5E" },
  { name: "Plausible", slug: "plausible", logoUrl: "https://cdn.simpleicons.org/plausible", category: "Analytics", description: "Privacy-friendly web analytics alternative to Google Analytics.", defaultColor: "#F43F5E" },
  { name: "Fathom", slug: "fathom", logoUrl: "https://cdn.simpleicons.org/fathom", category: "Analytics", description: "Simple, privacy-focused website analytics without cookie banners.", defaultColor: "#F43F5E" },

  // ─── Customer Success ───────────────────────────────────────
  { name: "Gainsight", slug: "gainsight", logoUrl: "https://cdn.simpleicons.org/gainsight", category: "Customer Success", description: "Customer success platform for driving retention and expansion revenue.", defaultColor: "#0D9488" },
  { name: "ChurnZero", slug: "churnzero", logoUrl: "https://cdn.simpleicons.org/churnzero", category: "Customer Success", description: "Customer success software for reducing churn and increasing adoption.", defaultColor: "#0D9488" },
  { name: "Vitally", slug: "vitally", logoUrl: "https://cdn.simpleicons.org/vitally", category: "Customer Success", description: "Customer success platform with health scores and automated workflows.", defaultColor: "#0D9488" },
  { name: "Pendo", slug: "pendo", logoUrl: "https://cdn.simpleicons.org/pendo", category: "Customer Success", description: "Product experience platform with analytics, in-app guides, and feedback.", defaultColor: "#0D9488" },
  { name: "Totango", slug: "totango", logoUrl: "https://cdn.simpleicons.org/totango", category: "Customer Success", description: "Customer success platform for managing customer health and lifecycle.", defaultColor: "#0D9488" },
  { name: "Catalyst", slug: "catalyst", logoUrl: "https://cdn.simpleicons.org/catalyst", category: "Customer Success", description: "Customer success platform built for revenue-focused CS teams.", defaultColor: "#0D9488" },
  { name: "Planhat", slug: "planhat", logoUrl: "https://cdn.simpleicons.org/planhat", category: "Customer Success", description: "Customer platform for managing onboarding, health scores, and renewals.", defaultColor: "#0D9488" },
];

async function main() {
  console.log("Starting software catalog seed...");
  console.log(`Seeding ${catalog.length} software entries across 21 categories...`);

  for (const entry of catalog) {
    await prisma.softwareCatalog.upsert({
      where: { slug: entry.slug },
      update: {
        name: entry.name,
        logoUrl: entry.logoUrl,
        category: entry.category,
        description: entry.description,
        defaultColor: entry.defaultColor,
      },
      create: {
        name: entry.name,
        slug: entry.slug,
        logoUrl: entry.logoUrl,
        category: entry.category,
        description: entry.description,
        defaultColor: entry.defaultColor,
      },
    });
  }

  console.log(`Successfully seeded ${catalog.length} software catalog entries.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
