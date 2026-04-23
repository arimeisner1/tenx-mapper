export interface SoftwareInfo {
  description: string;
  useCases: string[];
  commonIntegrations: string[];
  apiType: string;
  pricingTier: string;
}

export const SOFTWARE_DATABASE: Record<string, SoftwareInfo> = {
  "Slack": {
    description: "Team communication and collaboration platform",
    useCases: [
      "Team notifications and alerts",
      "Workflow status updates",
      "Customer support channel",
      "Bot integrations for automation",
      "File sharing and collaboration"
    ],
    commonIntegrations: ["Zapier", "HubSpot", "Jira", "GitHub", "Google Drive", "Salesforce", "Asana", "Trello", "Linear", "Notion", "Datadog", "Sentry", "PagerDuty"],
    apiType: "REST API + WebSocket (Real-time Events)",
    pricingTier: "Free / Pro $7.25/mo / Business+ $12.50/mo"
  },
  "OpenAI": {
    description: "AI research lab providing GPT models, DALL-E, and Whisper APIs",
    useCases: [
      "Text generation and completion",
      "Chatbot and conversational AI",
      "Image generation with DALL-E",
      "Speech-to-text with Whisper",
      "Code generation and assistance",
      "Content summarization"
    ],
    commonIntegrations: ["LangChain", "Zapier", "Make", "n8n", "Vercel", "Supabase", "Pinecone", "Weaviate"],
    apiType: "REST API (Chat Completions, Embeddings, Images)",
    pricingTier: "Pay-per-token / Plus $20/mo / Team $25/mo"
  },
  "Anthropic": {
    description: "AI safety company providing Claude language models",
    useCases: [
      "Long-form content generation",
      "Complex reasoning and analysis",
      "Code generation and review",
      "Document summarization",
      "Customer support automation",
      "Research assistance"
    ],
    commonIntegrations: ["LangChain", "Vercel", "AWS Bedrock", "Zapier", "Make", "n8n", "Pinecone", "Weaviate"],
    apiType: "REST API (Messages API)",
    pricingTier: "Pay-per-token / Claude Pro $20/mo / Team $25/mo"
  },
  "Zapier": {
    description: "No-code automation platform connecting 6,000+ apps",
    useCases: [
      "Automate repetitive workflows",
      "Connect apps without coding",
      "Data synchronization between tools",
      "Trigger-based notifications",
      "Lead routing and CRM updates"
    ],
    commonIntegrations: ["Slack", "HubSpot", "Salesforce", "Google Sheets", "Mailchimp", "Stripe", "Shopify", "Notion", "Airtable", "Gmail"],
    apiType: "REST API + Webhooks",
    pricingTier: "Free (100 tasks) / Starter $19.99/mo / Professional $49/mo"
  },
  "Make": {
    description: "Visual automation platform (formerly Integromat) for complex workflows",
    useCases: [
      "Complex multi-step automations",
      "Data transformation pipelines",
      "API orchestration",
      "Scheduled batch processing",
      "Error handling workflows"
    ],
    commonIntegrations: ["Slack", "Google Sheets", "HubSpot", "Shopify", "Airtable", "Notion", "Stripe", "OpenAI", "Anthropic"],
    apiType: "REST API + Webhooks",
    pricingTier: "Free (1,000 ops) / Core $9/mo / Pro $16/mo"
  },
  "n8n": {
    description: "Open-source workflow automation tool with fair-code license",
    useCases: [
      "Self-hosted workflow automation",
      "Custom API integrations",
      "Data pipeline orchestration",
      "DevOps automation",
      "AI agent workflows"
    ],
    commonIntegrations: ["Slack", "GitHub", "PostgreSQL", "MongoDB", "OpenAI", "Anthropic", "Google Sheets", "HubSpot", "Supabase"],
    apiType: "REST API + Webhooks",
    pricingTier: "Free (self-hosted) / Starter $20/mo / Pro $50/mo"
  },
  "HubSpot": {
    description: "All-in-one CRM, marketing, sales, and service platform",
    useCases: [
      "Customer relationship management",
      "Email marketing campaigns",
      "Sales pipeline tracking",
      "Landing page creation",
      "Customer support ticketing",
      "Marketing automation"
    ],
    commonIntegrations: ["Slack", "Salesforce", "Zapier", "Google Sheets", "Mailchimp", "Stripe", "Shopify", "Calendly", "Zoom", "LinkedIn"],
    apiType: "REST API (v3)",
    pricingTier: "Free / Starter $20/mo / Professional $890/mo"
  },
  "Salesforce": {
    description: "Enterprise CRM and cloud computing platform",
    useCases: [
      "Enterprise CRM and lead management",
      "Sales forecasting and analytics",
      "Customer service management",
      "Marketing cloud campaigns",
      "Custom app development on platform",
      "Partner relationship management"
    ],
    commonIntegrations: ["Slack", "HubSpot", "Zapier", "DocuSign", "Outlook", "Jira", "Tableau", "Snowflake", "MuleSoft"],
    apiType: "REST + SOAP API / GraphQL",
    pricingTier: "Essentials $25/user/mo / Professional $80/user/mo / Enterprise $165/user/mo"
  },
  "Stripe": {
    description: "Payment processing and financial infrastructure for the internet",
    useCases: [
      "Online payment processing",
      "Subscription billing management",
      "Marketplace payment splitting",
      "Invoice generation and management",
      "Fraud detection and prevention",
      "Financial reporting"
    ],
    commonIntegrations: ["Shopify", "Zapier", "QuickBooks", "HubSpot", "Slack", "Notion", "Supabase", "Firebase", "Vercel"],
    apiType: "REST API + Webhooks",
    pricingTier: "Pay-as-you-go: 2.9% + 30c per transaction"
  },
  "Shopify": {
    description: "E-commerce platform for online stores and retail POS",
    useCases: [
      "Online store creation and management",
      "Inventory and order management",
      "Multi-channel selling",
      "Payment processing",
      "Dropshipping integration",
      "Customer analytics"
    ],
    commonIntegrations: ["Stripe", "Zapier", "HubSpot", "Mailchimp", "Google Analytics", "Facebook", "Klaviyo", "ShipStation"],
    apiType: "REST + GraphQL API",
    pricingTier: "Basic $39/mo / Shopify $105/mo / Advanced $399/mo"
  },
  "Notion": {
    description: "All-in-one workspace for notes, docs, wikis, and project management",
    useCases: [
      "Team knowledge base and wiki",
      "Project management and tracking",
      "Meeting notes and documentation",
      "Content calendar planning",
      "Database management",
      "Personal productivity"
    ],
    commonIntegrations: ["Slack", "Zapier", "Google Drive", "GitHub", "Figma", "Linear", "Jira", "Calendar"],
    apiType: "REST API",
    pricingTier: "Free / Plus $10/mo / Business $18/mo"
  },
  "Airtable": {
    description: "Low-code platform combining spreadsheets with database functionality",
    useCases: [
      "Project tracking and management",
      "Content planning and calendars",
      "CRM and lead tracking",
      "Inventory management",
      "Event planning",
      "Product roadmap management"
    ],
    commonIntegrations: ["Slack", "Zapier", "Make", "Google Sheets", "Jira", "Salesforce", "Mailchimp", "Stripe"],
    apiType: "REST API + Webhooks",
    pricingTier: "Free / Team $20/seat/mo / Business $45/seat/mo"
  },
  "Google Sheets": {
    description: "Cloud-based spreadsheet application with collaboration features",
    useCases: [
      "Data collection and analysis",
      "Financial modeling and budgeting",
      "Reporting dashboards",
      "Data import/export hub",
      "Collaborative planning",
      "Lightweight database"
    ],
    commonIntegrations: ["Zapier", "Make", "n8n", "HubSpot", "Salesforce", "Slack", "Google Analytics", "Airtable"],
    apiType: "REST API (Google Sheets API v4)",
    pricingTier: "Free (personal) / Google Workspace $6/user/mo"
  },
  "GitHub": {
    description: "Code hosting, version control, and collaboration platform",
    useCases: [
      "Source code management",
      "CI/CD with GitHub Actions",
      "Code review and pull requests",
      "Project management with Issues",
      "Open source collaboration",
      "Package registry hosting"
    ],
    commonIntegrations: ["Slack", "Jira", "Linear", "Vercel", "AWS", "Sentry", "Datadog", "Notion", "Figma"],
    apiType: "REST + GraphQL API",
    pricingTier: "Free / Team $4/user/mo / Enterprise $21/user/mo"
  },
  "Vercel": {
    description: "Frontend cloud platform for deploying web applications",
    useCases: [
      "Next.js application hosting",
      "Serverless function deployment",
      "Edge computing and CDN",
      "Preview deployments for PRs",
      "Analytics and performance monitoring",
      "A/B testing with Edge Config"
    ],
    commonIntegrations: ["GitHub", "Supabase", "Firebase", "Stripe", "OpenAI", "Anthropic", "Sentry", "Datadog", "PlanetScale"],
    apiType: "REST API + CLI",
    pricingTier: "Hobby (Free) / Pro $20/mo / Enterprise custom"
  },
  "AWS": {
    description: "Amazon Web Services - comprehensive cloud computing platform",
    useCases: [
      "Cloud infrastructure and hosting",
      "Serverless computing (Lambda)",
      "Object storage (S3)",
      "Database services (RDS, DynamoDB)",
      "Machine learning (SageMaker)",
      "Container orchestration (ECS, EKS)"
    ],
    commonIntegrations: ["GitHub", "Vercel", "Datadog", "Sentry", "MongoDB", "Snowflake", "Stripe", "Auth0", "Okta"],
    apiType: "REST API + SDK (Boto3, AWS SDK)",
    pricingTier: "Pay-as-you-go / Free tier available"
  },
  "Supabase": {
    description: "Open-source Firebase alternative with PostgreSQL database",
    useCases: [
      "Backend-as-a-service for web/mobile apps",
      "Real-time database subscriptions",
      "Authentication and user management",
      "File storage and CDN",
      "Edge functions (Deno)",
      "Vector embeddings for AI"
    ],
    commonIntegrations: ["Vercel", "Next.js", "Stripe", "OpenAI", "GitHub", "Zapier", "n8n", "Auth0"],
    apiType: "REST + GraphQL + Realtime WebSocket",
    pricingTier: "Free / Pro $25/mo / Team $599/mo"
  },
  "Firebase": {
    description: "Google's app development platform with real-time database and hosting",
    useCases: [
      "Real-time database and Firestore",
      "User authentication",
      "Push notifications (FCM)",
      "Serverless functions",
      "App hosting and CDN",
      "Analytics and crash reporting"
    ],
    commonIntegrations: ["Google Analytics", "Stripe", "Vercel", "Zapier", "BigQuery", "Google Sheets", "Slack"],
    apiType: "REST + SDK (Web, iOS, Android)",
    pricingTier: "Spark (Free) / Blaze (pay-as-you-go)"
  },
  "MongoDB": {
    description: "Document-oriented NoSQL database platform",
    useCases: [
      "Flexible document storage",
      "Real-time analytics",
      "Content management systems",
      "IoT data storage",
      "Mobile app backends",
      "Vector search for AI applications"
    ],
    commonIntegrations: ["AWS", "Vercel", "n8n", "Zapier", "Datadog", "GitHub", "Supabase"],
    apiType: "Driver API + Atlas Data API (REST)",
    pricingTier: "Free (512MB) / Shared $0/mo / Dedicated from $57/mo"
  },
  "PostgreSQL": {
    description: "Open-source relational database management system",
    useCases: [
      "Relational data storage",
      "Complex query processing",
      "ACID-compliant transactions",
      "Geospatial data (PostGIS)",
      "Full-text search",
      "JSON document storage"
    ],
    commonIntegrations: ["Supabase", "AWS", "Vercel", "Prisma", "n8n", "Datadog", "dbt", "Fivetran", "Airbyte"],
    apiType: "Wire protocol / SQL interface",
    pricingTier: "Free (open-source) / Managed: varies by provider"
  },
  "Twilio": {
    description: "Cloud communications platform for SMS, voice, and video",
    useCases: [
      "SMS and MMS messaging",
      "Voice calls and IVR",
      "Two-factor authentication",
      "Video conferencing API",
      "WhatsApp business messaging",
      "Email via SendGrid"
    ],
    commonIntegrations: ["Zapier", "HubSpot", "Salesforce", "Slack", "SendGrid", "Auth0", "Stripe"],
    apiType: "REST API + WebSocket (Voice/Video)",
    pricingTier: "Pay-per-use / SMS from $0.0079/msg"
  },
  "SendGrid": {
    description: "Cloud-based email delivery and marketing platform (Twilio)",
    useCases: [
      "Transactional email delivery",
      "Email marketing campaigns",
      "Email template management",
      "Deliverability optimization",
      "Email analytics and tracking"
    ],
    commonIntegrations: ["Zapier", "HubSpot", "Shopify", "Stripe", "Twilio", "Salesforce", "n8n"],
    apiType: "REST API (v3) + SMTP",
    pricingTier: "Free (100/day) / Essentials $19.95/mo / Pro $89.95/mo"
  },
  "Mailchimp": {
    description: "Email marketing and automation platform",
    useCases: [
      "Email newsletter campaigns",
      "Marketing automation sequences",
      "Audience segmentation",
      "Landing page creation",
      "A/B testing for emails",
      "E-commerce email marketing"
    ],
    commonIntegrations: ["Shopify", "Zapier", "HubSpot", "Salesforce", "Google Analytics", "Facebook", "Stripe", "WordPress"],
    apiType: "REST API (v3)",
    pricingTier: "Free (500 contacts) / Essentials $13/mo / Standard $20/mo"
  },
  "Intercom": {
    description: "Customer messaging and engagement platform",
    useCases: [
      "Live chat support",
      "Chatbot automation",
      "Customer onboarding tours",
      "In-app messaging",
      "Help center and knowledge base",
      "Customer data platform"
    ],
    commonIntegrations: ["Slack", "Salesforce", "HubSpot", "Zapier", "Stripe", "Jira", "GitHub", "Segment"],
    apiType: "REST API + WebSocket (Messenger)",
    pricingTier: "Starter $74/mo / Pro custom pricing"
  },
  "Zendesk": {
    description: "Customer service and engagement platform",
    useCases: [
      "Customer support ticketing",
      "Help center and knowledge base",
      "Live chat and messaging",
      "Call center management",
      "Customer satisfaction surveys",
      "Agent productivity tools"
    ],
    commonIntegrations: ["Slack", "Salesforce", "Jira", "Shopify", "Zapier", "HubSpot", "Intercom"],
    apiType: "REST API + Webhooks",
    pricingTier: "Suite Team $55/agent/mo / Suite Growth $89/agent/mo"
  },
  "Calendly": {
    description: "Scheduling automation platform for meetings and appointments",
    useCases: [
      "Meeting scheduling automation",
      "Sales demo booking",
      "Interview scheduling",
      "Customer onboarding calls",
      "Team availability management",
      "Round-robin meeting routing"
    ],
    commonIntegrations: ["Zoom", "Google Calendar", "Slack", "HubSpot", "Salesforce", "Zapier", "Stripe", "Cal.com"],
    apiType: "REST API (v2) + Webhooks",
    pricingTier: "Free / Standard $10/seat/mo / Teams $16/seat/mo"
  },
  "Zoom": {
    description: "Video conferencing and virtual meeting platform",
    useCases: [
      "Video meetings and webinars",
      "Screen sharing and collaboration",
      "Recording and transcription",
      "Virtual events and conferences",
      "Phone system (Zoom Phone)",
      "Whiteboard collaboration"
    ],
    commonIntegrations: ["Slack", "Calendly", "HubSpot", "Salesforce", "Google Calendar", "Zapier", "Notion"],
    apiType: "REST API + WebSocket (Real-time)",
    pricingTier: "Basic (Free) / Pro $13.33/mo / Business $21.99/mo"
  },
  "Loom": {
    description: "Async video messaging platform for screen recordings",
    useCases: [
      "Async video communication",
      "Screen recording tutorials",
      "Bug report recordings",
      "Sales outreach videos",
      "Product demos and walkthroughs",
      "Team updates and standups"
    ],
    commonIntegrations: ["Slack", "Notion", "GitHub", "Jira", "Linear", "HubSpot", "Gmail"],
    apiType: "REST API + oEmbed",
    pricingTier: "Starter (Free) / Business $12.50/creator/mo / Enterprise custom"
  },
  "Figma": {
    description: "Collaborative interface design and prototyping tool",
    useCases: [
      "UI/UX design and prototyping",
      "Design system management",
      "Collaborative design reviews",
      "Developer handoff",
      "Interactive prototypes",
      "Design token management"
    ],
    commonIntegrations: ["Slack", "Jira", "Linear", "GitHub", "Notion", "Storybook", "Zeplin"],
    apiType: "REST API + Plugin API",
    pricingTier: "Free / Professional $15/editor/mo / Organization $45/editor/mo"
  },
  "Canva": {
    description: "Online graphic design platform with templates",
    useCases: [
      "Social media graphics",
      "Presentation design",
      "Marketing materials",
      "Brand kit management",
      "Video editing",
      "Print design and ordering"
    ],
    commonIntegrations: ["Google Drive", "Dropbox", "HubSpot", "Mailchimp", "Buffer", "Hootsuite"],
    apiType: "REST API (Connect API)",
    pricingTier: "Free / Pro $12.99/mo / Teams $14.99/person/mo"
  },
  "Webflow": {
    description: "No-code website builder with CMS and hosting",
    useCases: [
      "Marketing website creation",
      "CMS-driven content sites",
      "E-commerce storefronts",
      "Landing page design",
      "Blog and content publishing",
      "Client website projects"
    ],
    commonIntegrations: ["Zapier", "HubSpot", "Google Analytics", "Mailchimp", "Stripe", "Airtable", "Figma"],
    apiType: "REST API (CMS + Data)",
    pricingTier: "Free / Basic $14/mo / CMS $23/mo / Business $39/mo"
  },
  "Framer": {
    description: "Interactive design and publishing platform for websites",
    useCases: [
      "Interactive website design",
      "Animated landing pages",
      "Portfolio websites",
      "Marketing sites with CMS",
      "Localized multi-language sites",
      "Component-driven design"
    ],
    commonIntegrations: ["Figma", "Google Analytics", "HubSpot", "Zapier", "Notion"],
    apiType: "REST API + Plugin SDK",
    pricingTier: "Free / Mini $5/mo / Basic $15/mo / Pro $25/mo"
  },
  "Linear": {
    description: "Project management and issue tracking for software teams",
    useCases: [
      "Sprint planning and tracking",
      "Bug tracking and management",
      "Product roadmap planning",
      "Engineering workflow management",
      "Release management",
      "Cross-team project coordination"
    ],
    commonIntegrations: ["GitHub", "Slack", "Figma", "Notion", "Sentry", "Vercel", "Zapier", "GitLab"],
    apiType: "GraphQL API + Webhooks",
    pricingTier: "Free / Standard $8/user/mo / Plus $14/user/mo"
  },
  "Jira": {
    description: "Project management and issue tracking by Atlassian",
    useCases: [
      "Agile project management",
      "Bug and issue tracking",
      "Scrum and Kanban boards",
      "Release planning",
      "Custom workflow management",
      "Time tracking and reporting"
    ],
    commonIntegrations: ["Slack", "GitHub", "Confluence", "Figma", "Sentry", "Datadog", "Zapier", "Salesforce"],
    apiType: "REST API (v3) + Webhooks",
    pricingTier: "Free (10 users) / Standard $8.15/user/mo / Premium $16/user/mo"
  },
  "Asana": {
    description: "Work management platform for teams",
    useCases: [
      "Task and project management",
      "Team collaboration workflows",
      "Goal tracking and OKRs",
      "Portfolio management",
      "Workload management",
      "Custom workflow automation"
    ],
    commonIntegrations: ["Slack", "Google Drive", "Zapier", "HubSpot", "Jira", "GitHub", "Salesforce", "Figma"],
    apiType: "REST API + Webhooks",
    pricingTier: "Basic (Free) / Premium $10.99/user/mo / Business $24.99/user/mo"
  },
  "ClickUp": {
    description: "All-in-one productivity and project management platform",
    useCases: [
      "Project and task management",
      "Document collaboration",
      "Goal and OKR tracking",
      "Time tracking",
      "Whiteboard brainstorming",
      "Sprint management"
    ],
    commonIntegrations: ["Slack", "GitHub", "Google Drive", "Zapier", "HubSpot", "Figma", "Sentry"],
    apiType: "REST API (v2) + Webhooks",
    pricingTier: "Free / Unlimited $7/member/mo / Business $12/member/mo"
  },
  "Trello": {
    description: "Kanban-style project management tool by Atlassian",
    useCases: [
      "Visual task management",
      "Kanban board workflows",
      "Content calendar planning",
      "Simple project tracking",
      "Personal to-do lists",
      "Team collaboration boards"
    ],
    commonIntegrations: ["Slack", "Google Drive", "Zapier", "Jira", "GitHub", "Confluence", "Salesforce"],
    apiType: "REST API + Webhooks",
    pricingTier: "Free / Standard $5/user/mo / Premium $10/user/mo"
  },
  "Monday": {
    description: "Work operating system for teams (monday.com)",
    useCases: [
      "Project management and tracking",
      "CRM and sales management",
      "Marketing campaign management",
      "Software development workflows",
      "HR and recruiting processes",
      "Custom workflow automation"
    ],
    commonIntegrations: ["Slack", "Google Drive", "Zapier", "HubSpot", "Jira", "GitHub", "Salesforce", "Outlook"],
    apiType: "GraphQL API + Webhooks",
    pricingTier: "Free (2 seats) / Basic $9/seat/mo / Standard $12/seat/mo"
  },
  "Typeform": {
    description: "Interactive form and survey builder with conversational UI",
    useCases: [
      "Customer surveys and feedback",
      "Lead generation forms",
      "Quizzes and assessments",
      "Registration and signup forms",
      "Order forms and payments",
      "Employee feedback surveys"
    ],
    commonIntegrations: ["Zapier", "HubSpot", "Google Sheets", "Slack", "Mailchimp", "Notion", "Airtable"],
    apiType: "REST API + Webhooks",
    pricingTier: "Free / Basic $25/mo / Plus $50/mo / Business $83/mo"
  },
  "Google Analytics": {
    description: "Web analytics service for tracking website traffic and behavior",
    useCases: [
      "Website traffic analysis",
      "User behavior tracking",
      "Conversion funnel analysis",
      "Marketing campaign measurement",
      "Audience demographics",
      "Real-time visitor monitoring"
    ],
    commonIntegrations: ["Google Sheets", "BigQuery", "Shopify", "HubSpot", "Zapier", "Segment", "Webflow"],
    apiType: "REST API (GA4 Data API)",
    pricingTier: "Free (GA4) / GA 360 custom pricing"
  },
  "Mixpanel": {
    description: "Product analytics platform for user behavior tracking",
    useCases: [
      "Product usage analytics",
      "User funnel analysis",
      "Retention and cohort analysis",
      "A/B test measurement",
      "User journey mapping",
      "Custom event tracking"
    ],
    commonIntegrations: ["Segment", "Zapier", "Slack", "HubSpot", "Amplitude", "BigQuery", "Snowflake"],
    apiType: "REST API + SDK (Web, Mobile)",
    pricingTier: "Free (20M events) / Growth $25/mo / Enterprise custom"
  },
  "PostHog": {
    description: "Open-source product analytics, feature flags, and session replay",
    useCases: [
      "Product analytics and insights",
      "Feature flag management",
      "Session recording and replay",
      "A/B testing and experiments",
      "User path analysis",
      "Self-hosted analytics"
    ],
    commonIntegrations: ["Segment", "Slack", "GitHub", "Vercel", "Sentry", "Zapier", "HubSpot", "BigQuery"],
    apiType: "REST API + SDK",
    pricingTier: "Free (1M events) / Pay-as-you-go from $0/mo"
  },
  "Segment": {
    description: "Customer data platform for collecting and routing analytics data",
    useCases: [
      "Customer data collection and routing",
      "Event tracking standardization",
      "Data warehouse integration",
      "Audience segmentation",
      "Real-time data streaming",
      "Identity resolution"
    ],
    commonIntegrations: ["Google Analytics", "Mixpanel", "Amplitude", "BigQuery", "Snowflake", "HubSpot", "Salesforce", "Slack"],
    apiType: "REST API + SDK (Analytics.js)",
    pricingTier: "Free (1,000 visitors) / Team $120/mo / Business custom"
  },
  "Amplitude": {
    description: "Digital analytics platform for product intelligence",
    useCases: [
      "Product analytics and insights",
      "User behavior analysis",
      "Funnel and retention analysis",
      "Predictive analytics",
      "Experiment tracking",
      "Customer journey analysis"
    ],
    commonIntegrations: ["Segment", "Snowflake", "BigQuery", "Slack", "HubSpot", "Salesforce", "Mixpanel"],
    apiType: "REST API + SDK",
    pricingTier: "Free / Plus $49/mo / Growth custom"
  },
  "Snowflake": {
    description: "Cloud data warehouse and analytics platform",
    useCases: [
      "Cloud data warehousing",
      "Data lake and lakehouse",
      "Data sharing and marketplace",
      "ETL/ELT data pipelines",
      "Business intelligence analytics",
      "Machine learning data prep"
    ],
    commonIntegrations: ["dbt", "Fivetran", "Airbyte", "Tableau", "Looker", "Segment", "AWS", "Salesforce"],
    apiType: "SQL + REST API (Snowpark)",
    pricingTier: "Pay-per-use (compute + storage) / $2+/credit"
  },
  "BigQuery": {
    description: "Google Cloud serverless data warehouse",
    useCases: [
      "Serverless data warehousing",
      "Big data analytics and ML",
      "Real-time data analysis",
      "Geospatial analytics",
      "BI and reporting backend",
      "Streaming data ingestion"
    ],
    commonIntegrations: ["Google Analytics", "Google Sheets", "dbt", "Fivetran", "Airbyte", "Looker", "Segment", "Firebase"],
    apiType: "REST API + SQL interface",
    pricingTier: "Free (1TB queries/mo) / On-demand $6.25/TB"
  },
  "dbt": {
    description: "Data transformation tool for analytics engineering (dbt Labs)",
    useCases: [
      "SQL-based data transformation",
      "Data modeling and documentation",
      "Data testing and validation",
      "Analytics engineering workflows",
      "Data lineage tracking",
      "Version-controlled data models"
    ],
    commonIntegrations: ["Snowflake", "BigQuery", "PostgreSQL", "Fivetran", "Airbyte", "GitHub", "Looker", "Redshift"],
    apiType: "CLI + REST API (dbt Cloud)",
    pricingTier: "dbt Core (Free/OSS) / dbt Cloud Team $100/mo"
  },
  "Fivetran": {
    description: "Automated data integration and ELT pipeline platform",
    useCases: [
      "Automated data ingestion",
      "Source-to-warehouse replication",
      "Database and SaaS data sync",
      "Real-time data streaming",
      "Schema change management",
      "Log-based change data capture"
    ],
    commonIntegrations: ["Snowflake", "BigQuery", "dbt", "Salesforce", "HubSpot", "PostgreSQL", "MongoDB", "Slack"],
    apiType: "REST API + Webhooks",
    pricingTier: "Free (limited) / Starter $1/MAR / Standard $1.50/MAR"
  },
  "Airbyte": {
    description: "Open-source data integration platform for ELT pipelines",
    useCases: [
      "Data pipeline orchestration",
      "Custom connector development",
      "Database replication",
      "API data extraction",
      "Self-hosted data integration",
      "CDC (Change Data Capture)"
    ],
    commonIntegrations: ["Snowflake", "BigQuery", "PostgreSQL", "dbt", "MongoDB", "Salesforce", "HubSpot", "GitHub"],
    apiType: "REST API + Connector SDK",
    pricingTier: "Free (OSS) / Cloud from $2.50/credit"
  },
  "Redis": {
    description: "In-memory data store for caching, messaging, and real-time data",
    useCases: [
      "Application caching layer",
      "Session storage",
      "Real-time leaderboards",
      "Message queue and pub/sub",
      "Rate limiting",
      "Vector similarity search"
    ],
    commonIntegrations: ["AWS", "Vercel", "Supabase", "PostgreSQL", "MongoDB", "Node.js", "Python"],
    apiType: "Redis Protocol + REST API (Redis Cloud)",
    pricingTier: "Free (OSS) / Redis Cloud from $5/mo"
  },
  "Pinecone": {
    description: "Vector database for AI/ML similarity search and embeddings",
    useCases: [
      "Semantic search with embeddings",
      "Recommendation systems",
      "RAG (Retrieval-Augmented Generation)",
      "Image similarity search",
      "Anomaly detection",
      "Question answering systems"
    ],
    commonIntegrations: ["OpenAI", "Anthropic", "LangChain", "Vercel", "AWS", "Cohere", "Hugging Face"],
    apiType: "REST + gRPC API",
    pricingTier: "Free (100K vectors) / Standard $70/mo / Enterprise custom"
  },
  "Weaviate": {
    description: "Open-source vector database for AI-native applications",
    useCases: [
      "Vector search and retrieval",
      "Hybrid search (vector + keyword)",
      "Generative search with LLMs",
      "Multi-modal data search",
      "RAG applications",
      "Classification and clustering"
    ],
    commonIntegrations: ["OpenAI", "Anthropic", "LangChain", "Cohere", "Hugging Face", "AWS", "Google Cloud"],
    apiType: "REST + GraphQL API",
    pricingTier: "Free (OSS) / Serverless from $25/mo"
  },
  "LangChain": {
    description: "Framework for building applications powered by language models",
    useCases: [
      "LLM application development",
      "RAG pipeline construction",
      "AI agent and tool usage",
      "Document Q&A systems",
      "Chatbot development",
      "Multi-step reasoning chains"
    ],
    commonIntegrations: ["OpenAI", "Anthropic", "Pinecone", "Weaviate", "Supabase", "Redis", "PostgreSQL", "Chroma"],
    apiType: "Python/JS SDK + LangServe REST API",
    pricingTier: "Free (OSS) / LangSmith from $39/mo"
  },
  "Cursor": {
    description: "AI-powered code editor built on VS Code",
    useCases: [
      "AI-assisted code generation",
      "Codebase-aware auto-complete",
      "Code refactoring with AI",
      "Natural language code editing",
      "Bug detection and fixing",
      "Documentation generation"
    ],
    commonIntegrations: ["GitHub", "OpenAI", "Anthropic", "Vercel", "Supabase", "VS Code extensions"],
    apiType: "Editor-based (no public API)",
    pricingTier: "Free / Pro $20/mo / Business $40/mo"
  },
  "Midjourney": {
    description: "AI image generation platform via Discord",
    useCases: [
      "AI art and image generation",
      "Concept art and ideation",
      "Marketing visual creation",
      "Product mockup generation",
      "Brand asset exploration",
      "Illustration and design inspiration"
    ],
    commonIntegrations: ["Discord", "Zapier", "Canva", "Figma", "Adobe Creative Suite"],
    apiType: "Discord Bot API (no official REST API)",
    pricingTier: "Basic $10/mo / Standard $30/mo / Pro $60/mo"
  },
  "ElevenLabs": {
    description: "AI voice synthesis and text-to-speech platform",
    useCases: [
      "Text-to-speech generation",
      "Voice cloning",
      "Audiobook production",
      "Video voiceover creation",
      "Podcast content generation",
      "Multi-language voice dubbing"
    ],
    commonIntegrations: ["Zapier", "Make", "n8n", "OpenAI", "Anthropic", "Vercel"],
    apiType: "REST API + WebSocket (Streaming)",
    pricingTier: "Free / Starter $5/mo / Creator $22/mo / Pro $99/mo"
  },
  "Stability AI": {
    description: "Open-source AI company behind Stable Diffusion image generation",
    useCases: [
      "Image generation (Stable Diffusion)",
      "Image editing and inpainting",
      "Image upscaling",
      "Text-to-video generation",
      "3D asset generation",
      "Custom model fine-tuning"
    ],
    commonIntegrations: ["AWS", "Google Cloud", "Zapier", "Canva", "Figma", "ComfyUI"],
    apiType: "REST API (Stability API)",
    pricingTier: "Free (25 credits) / Pay-per-generation"
  },
  "Buffer": {
    description: "Social media management and scheduling platform",
    useCases: [
      "Social media post scheduling",
      "Multi-platform publishing",
      "Social media analytics",
      "Team collaboration on content",
      "Content calendar management",
      "Audience engagement tracking"
    ],
    commonIntegrations: ["Canva", "Zapier", "Google Analytics", "Shopify", "WordPress", "Hootsuite"],
    apiType: "REST API",
    pricingTier: "Free (3 channels) / Essentials $6/channel/mo / Team $12/channel/mo"
  },
  "Hootsuite": {
    description: "Social media management platform for enterprises",
    useCases: [
      "Social media management",
      "Content scheduling and publishing",
      "Social listening and monitoring",
      "Team approval workflows",
      "Social media advertising",
      "Compliance and governance"
    ],
    commonIntegrations: ["Canva", "Salesforce", "HubSpot", "Google Analytics", "Zapier", "Slack"],
    apiType: "REST API",
    pricingTier: "Professional $99/mo / Team $249/mo / Enterprise custom"
  },
  "Semrush": {
    description: "Digital marketing and SEO analytics toolkit",
    useCases: [
      "SEO keyword research",
      "Competitive analysis",
      "Site audit and optimization",
      "Content marketing tools",
      "PPC advertising research",
      "Social media tracking"
    ],
    commonIntegrations: ["Google Analytics", "Google Sheets", "Zapier", "HubSpot", "WordPress", "Ahrefs"],
    apiType: "REST API",
    pricingTier: "Pro $129.95/mo / Guru $249.95/mo / Business $499.95/mo"
  },
  "Ahrefs": {
    description: "SEO toolset for backlink analysis, keyword research, and site audits",
    useCases: [
      "Backlink analysis and monitoring",
      "Keyword research and tracking",
      "Content gap analysis",
      "Site audit for SEO issues",
      "Competitor research",
      "Rank tracking and reporting"
    ],
    commonIntegrations: ["Google Analytics", "Google Sheets", "Zapier", "Semrush", "WordPress", "Slack"],
    apiType: "REST API",
    pricingTier: "Lite $99/mo / Standard $199/mo / Advanced $399/mo"
  },
  "ConvertKit": {
    description: "Email marketing platform for creators and newsletters",
    useCases: [
      "Newsletter creation and sending",
      "Email automation sequences",
      "Landing page creation",
      "Subscriber management",
      "Digital product sales",
      "Creator monetization"
    ],
    commonIntegrations: ["Zapier", "Shopify", "WordPress", "Stripe", "Typeform", "Teachable", "Webflow"],
    apiType: "REST API (v3) + Webhooks",
    pricingTier: "Free (1,000 subscribers) / Creator $25/mo / Creator Pro $50/mo"
  },
  "Beehiiv": {
    description: "Newsletter platform built for growth and monetization",
    useCases: [
      "Newsletter publishing and growth",
      "Subscriber acquisition tools",
      "Newsletter monetization",
      "Referral program management",
      "A/B testing for newsletters",
      "Analytics and audience insights"
    ],
    commonIntegrations: ["Zapier", "Stripe", "Google Analytics", "WordPress", "Slack", "ConvertKit"],
    apiType: "REST API",
    pricingTier: "Launch (Free) / Grow $49/mo / Scale $99/mo"
  },
  "Cal.com": {
    description: "Open-source scheduling infrastructure",
    useCases: [
      "Meeting scheduling automation",
      "Team availability management",
      "Custom booking pages",
      "Round-robin scheduling",
      "Recurring event management",
      "White-label scheduling"
    ],
    commonIntegrations: ["Zoom", "Google Calendar", "Slack", "Zapier", "HubSpot", "Stripe", "Calendly"],
    apiType: "REST API + Webhooks",
    pricingTier: "Free (OSS) / Team $15/user/mo / Enterprise custom"
  },
  "Apollo": {
    description: "Sales intelligence and engagement platform",
    useCases: [
      "B2B lead prospecting",
      "Email outreach sequences",
      "Contact data enrichment",
      "Sales pipeline management",
      "Meeting booking automation",
      "Revenue intelligence"
    ],
    commonIntegrations: ["Salesforce", "HubSpot", "Slack", "Zapier", "Outreach", "LinkedIn", "Gmail"],
    apiType: "REST API",
    pricingTier: "Free / Basic $49/user/mo / Professional $79/user/mo"
  },
  "Outreach": {
    description: "Sales execution platform for revenue teams",
    useCases: [
      "Sales email sequencing",
      "Pipeline management",
      "Sales forecasting",
      "Rep coaching and analytics",
      "Meeting scheduling",
      "Deal intelligence"
    ],
    commonIntegrations: ["Salesforce", "HubSpot", "Slack", "LinkedIn", "Gong", "Apollo", "Zoom", "Gmail"],
    apiType: "REST API + Webhooks",
    pricingTier: "Custom pricing (contact sales)"
  },
  "Clay": {
    description: "Data enrichment and outbound automation platform",
    useCases: [
      "Lead data enrichment",
      "Automated outbound campaigns",
      "Contact list building",
      "Personalized email at scale",
      "Account research automation",
      "CRM data hygiene"
    ],
    commonIntegrations: ["Apollo", "HubSpot", "Salesforce", "Slack", "Instantly", "OpenAI", "LinkedIn", "Zapier"],
    apiType: "REST API + Webhooks",
    pricingTier: "Free / Starter $149/mo / Explorer $349/mo / Pro $800/mo"
  },
  "Instantly": {
    description: "Cold email outreach and deliverability platform",
    useCases: [
      "Cold email campaigns",
      "Email warm-up and deliverability",
      "Multi-inbox management",
      "A/B testing email sequences",
      "Lead list management",
      "Campaign analytics"
    ],
    commonIntegrations: ["Clay", "Apollo", "HubSpot", "Zapier", "Slack", "Google Workspace", "Outlook"],
    apiType: "REST API",
    pricingTier: "Growth $30/mo / Hypergrowth $77.6/mo"
  },
  "Gong": {
    description: "Revenue intelligence platform with conversation analytics",
    useCases: [
      "Sales call recording and analysis",
      "Deal intelligence and forecasting",
      "Coaching and rep performance",
      "Competitive intelligence",
      "Customer voice insights",
      "Pipeline visibility"
    ],
    commonIntegrations: ["Salesforce", "HubSpot", "Slack", "Zoom", "Outreach", "LinkedIn", "Teams"],
    apiType: "REST API",
    pricingTier: "Custom pricing (contact sales)"
  },
  "DocuSign": {
    description: "Electronic signature and agreement cloud platform",
    useCases: [
      "Electronic signature workflows",
      "Contract lifecycle management",
      "Document automation",
      "Compliance and audit trails",
      "Remote notarization",
      "Agreement analytics"
    ],
    commonIntegrations: ["Salesforce", "HubSpot", "Google Drive", "Slack", "Zapier", "Microsoft 365", "Box"],
    apiType: "REST API (eSignature API)",
    pricingTier: "Personal $10/mo / Standard $25/user/mo / Business Pro $40/user/mo"
  },
  "PandaDoc": {
    description: "Document automation and e-signature platform",
    useCases: [
      "Proposal and quote generation",
      "Contract management",
      "E-signature collection",
      "Document templates and automation",
      "CPQ (Configure Price Quote)",
      "Payment collection with documents"
    ],
    commonIntegrations: ["Salesforce", "HubSpot", "Zapier", "Stripe", "Slack", "Google Drive", "Dropbox"],
    apiType: "REST API + Webhooks",
    pricingTier: "Free (eSign) / Essentials $19/user/mo / Business $49/user/mo"
  },
  "QuickBooks": {
    description: "Accounting and bookkeeping software by Intuit",
    useCases: [
      "Small business accounting",
      "Invoice and billing management",
      "Expense tracking and categorization",
      "Financial reporting",
      "Payroll processing",
      "Tax preparation"
    ],
    commonIntegrations: ["Stripe", "Shopify", "HubSpot", "Zapier", "Gusto", "Plaid", "PayPal", "Square"],
    apiType: "REST API (QuickBooks Online API)",
    pricingTier: "Simple Start $30/mo / Plus $60/mo / Advanced $200/mo"
  },
  "Plaid": {
    description: "Financial data connectivity and banking API platform",
    useCases: [
      "Bank account linking and verification",
      "Transaction data aggregation",
      "Identity verification",
      "Income verification",
      "Asset reporting",
      "Payment initiation"
    ],
    commonIntegrations: ["Stripe", "Mercury", "QuickBooks", "Venmo", "Cash App", "Robinhood"],
    apiType: "REST API",
    pricingTier: "Pay-per-connection / Free (100 test connections)"
  },
  "Mercury": {
    description: "Banking platform designed for startups and tech companies",
    useCases: [
      "Business banking and checking",
      "Treasury management",
      "Team expense management",
      "Wire and ACH transfers",
      "Venture debt facility",
      "Financial dashboards"
    ],
    commonIntegrations: ["QuickBooks", "Plaid", "Stripe", "Gusto", "Brex", "Ramp", "Zapier"],
    apiType: "REST API",
    pricingTier: "Free / Plus custom pricing"
  },
  "Gusto": {
    description: "Payroll, benefits, and HR management platform",
    useCases: [
      "Payroll processing and compliance",
      "Employee benefits administration",
      "HR onboarding workflows",
      "Time tracking and PTO",
      "Tax filing and compliance",
      "Workers compensation"
    ],
    commonIntegrations: ["QuickBooks", "Slack", "Zapier", "Rippling", "Deel", "Mercury", "Plaid"],
    apiType: "REST API (Partner API)",
    pricingTier: "Simple $40/mo + $6/person / Plus $80/mo + $12/person"
  },
  "Lever": {
    description: "Talent acquisition and applicant tracking platform",
    useCases: [
      "Applicant tracking and management",
      "Candidate sourcing",
      "Interview scheduling and scorecards",
      "Hiring pipeline analytics",
      "Offer management",
      "DEI reporting"
    ],
    commonIntegrations: ["Slack", "LinkedIn", "Greenhouse", "Zapier", "Google Calendar", "Zoom", "HubSpot"],
    apiType: "REST API + Webhooks",
    pricingTier: "Custom pricing (contact sales)"
  },
  "Greenhouse": {
    description: "Hiring and onboarding platform for growing companies",
    useCases: [
      "Structured hiring workflows",
      "Candidate tracking and management",
      "Interview kits and scorecards",
      "Job board distribution",
      "Onboarding automation",
      "Hiring analytics and reporting"
    ],
    commonIntegrations: ["Slack", "LinkedIn", "Lever", "Zapier", "BambooHR", "Okta", "Google Calendar", "Zoom"],
    apiType: "REST API (Harvest API) + Webhooks",
    pricingTier: "Custom pricing (contact sales)"
  },
  "Rippling": {
    description: "Unified workforce management platform (HR, IT, Finance)",
    useCases: [
      "Employee onboarding and offboarding",
      "Payroll and benefits management",
      "IT device and app management",
      "Identity and access management",
      "Expense management",
      "Global workforce management"
    ],
    commonIntegrations: ["Slack", "Okta", "Google Workspace", "Gusto", "QuickBooks", "Greenhouse", "Lever", "1Password"],
    apiType: "REST API",
    pricingTier: "Custom pricing (starts at $8/user/mo)"
  },
  "Deel": {
    description: "Global payroll and compliance platform for remote teams",
    useCases: [
      "International contractor payments",
      "Global payroll processing",
      "EOR (Employer of Record) services",
      "Compliance and tax management",
      "Contract generation",
      "Global workforce management"
    ],
    commonIntegrations: ["Slack", "QuickBooks", "Xero", "BambooHR", "Gusto", "Rippling", "Zapier", "Greenhouse"],
    apiType: "REST API",
    pricingTier: "Free (contractors) / EOR from $599/mo"
  },
  "Okta": {
    description: "Identity and access management platform",
    useCases: [
      "Single sign-on (SSO)",
      "Multi-factor authentication",
      "User lifecycle management",
      "API access management",
      "Directory integration",
      "Zero trust security"
    ],
    commonIntegrations: ["AWS", "Salesforce", "Slack", "Google Workspace", "GitHub", "1Password", "Rippling", "Datadog"],
    apiType: "REST API (SCIM, OAuth 2.0, SAML)",
    pricingTier: "Workforce Identity from $2/user/mo / Customer Identity free tier"
  },
  "Auth0": {
    description: "Identity platform for authentication and authorization (by Okta)",
    useCases: [
      "User authentication (login/signup)",
      "Social login integration",
      "Multi-factor authentication",
      "Role-based access control",
      "Passwordless authentication",
      "Machine-to-machine auth"
    ],
    commonIntegrations: ["Vercel", "Supabase", "AWS", "Stripe", "Okta", "Twilio", "Zapier", "Next.js"],
    apiType: "REST API + SDK (Universal Login)",
    pricingTier: "Free (7,500 MAU) / Essential $35/mo / Professional $240/mo"
  },
  "1Password": {
    description: "Password manager and secrets management platform",
    useCases: [
      "Team password management",
      "Secrets management for DevOps",
      "Secure credential sharing",
      "SSH key management",
      "CI/CD secrets injection",
      "Security compliance"
    ],
    commonIntegrations: ["Slack", "GitHub", "Okta", "Rippling", "AWS", "Vercel", "Terraform"],
    apiType: "REST API (Connect Server) + CLI",
    pricingTier: "Individual $2.99/mo / Teams $3.99/user/mo / Business $7.99/user/mo"
  },
  "Vanta": {
    description: "Security compliance automation platform (SOC 2, HIPAA, ISO 27001)",
    useCases: [
      "SOC 2 compliance automation",
      "Continuous security monitoring",
      "Vendor risk management",
      "Employee security training",
      "Trust center / security page",
      "HIPAA and ISO 27001 compliance"
    ],
    commonIntegrations: ["AWS", "GitHub", "Okta", "Google Workspace", "Slack", "1Password", "Datadog", "Jira"],
    apiType: "REST API",
    pricingTier: "Custom pricing (contact sales)"
  },
  "Datadog": {
    description: "Cloud monitoring, APM, and observability platform",
    useCases: [
      "Infrastructure monitoring",
      "Application performance monitoring (APM)",
      "Log management and analysis",
      "Real-time alerting",
      "Cloud cost management",
      "Security monitoring (SIEM)"
    ],
    commonIntegrations: ["AWS", "Slack", "GitHub", "Jira", "PagerDuty", "Sentry", "Vercel", "Okta"],
    apiType: "REST API + Agent-based",
    pricingTier: "Free (5 hosts) / Pro $15/host/mo / Enterprise $23/host/mo"
  },
  "Sentry": {
    description: "Application monitoring and error tracking platform",
    useCases: [
      "Error tracking and debugging",
      "Performance monitoring",
      "Release health tracking",
      "Session replay",
      "Distributed tracing",
      "Cron job monitoring"
    ],
    commonIntegrations: ["GitHub", "Slack", "Jira", "Linear", "Vercel", "Datadog", "PagerDuty", "GitLab"],
    apiType: "REST API + SDK (multi-platform)",
    pricingTier: "Free (5K errors) / Team $26/mo / Business $80/mo"
  },
  "Google Drive": {
    description: "Cloud file storage and collaboration service by Google",
    useCases: [
      "Cloud file storage and sharing",
      "Document collaboration",
      "Team file management",
      "Backup and sync",
      "File versioning",
      "Access control and permissions"
    ],
    commonIntegrations: ["Slack", "Zapier", "Notion", "Asana", "Google Sheets", "HubSpot", "Trello", "Canva"],
    apiType: "REST API (Drive API v3)",
    pricingTier: "Free (15GB) / Google One from $1.99/mo / Workspace $6/user/mo"
  },
};

/**
 * Look up software info by name (case-insensitive).
 * Returns undefined if not found.
 */
export function lookupSoftware(name: string): SoftwareInfo | undefined {
  // Try exact match first
  if (SOFTWARE_DATABASE[name]) return SOFTWARE_DATABASE[name];
  // Case-insensitive match
  const lower = name.toLowerCase();
  for (const [key, value] of Object.entries(SOFTWARE_DATABASE)) {
    if (key.toLowerCase() === lower) return value;
  }
  return undefined;
}

/**
 * Given a list of tool names currently on the canvas,
 * find which ones are common integrations for a given tool.
 */
export function findSuggestedConnections(
  toolName: string,
  canvasToolNames: string[]
): string[] {
  const info = lookupSoftware(toolName);
  if (!info) return [];
  const integrations = new Set(info.commonIntegrations.map((i) => i.toLowerCase()));
  return canvasToolNames.filter((name) =>
    integrations.has(name.toLowerCase()) && name.toLowerCase() !== toolName.toLowerCase()
  );
}
