export const overviewStats = [
  {
    label: "Messages automated",
    value: "89.2K",
    detail: "Across WhatsApp, SMS, and email from one control center.",
  },
  {
    label: "Active campaigns",
    value: "24",
    detail: "Lifecycle journeys, reminders, offers, and follow-ups in flight.",
  },
  {
    label: "Engagement rate",
    value: "18.5%",
    detail: "Higher response rates through better timing and channel mix.",
  },
  {
    label: "Time saved",
    value: "31 hrs",
    detail: "Manual outreach replaced by templates, scheduling, and queues.",
  },
];

export const channels = [
  {
    name: "WhatsApp",
    coverage: "High intent conversations",
    description:
      "Template-driven reminders, confirmations, and follow-ups for businesses that need quick replies.",
    accent: "emerald",
  },
  {
    name: "SMS",
    coverage: "Instant reach",
    description:
      "Short transactional nudges for urgent updates, reactivation campaigns, and appointment alerts.",
    accent: "amber",
  },
  {
    name: "Email",
    coverage: "Rich campaign storytelling",
    description:
      "Long-form promotions, onboarding sequences, invoices, and branded lifecycle communication.",
    accent: "sky",
  },
];

export const targetUsers = [
  "Clinics",
  "Coaching classes",
  "Retail shops",
  "Real estate agents",
  "Local service businesses",
];

export const featureHighlights = [
  {
    title: "Authentication and workspace access",
    text: "Separate business teams, role-safe access, and protected messaging operations.",
  },
  {
    title: "Contact management",
    text: "Store leads, tags, preferred channels, campaign history, and segmentation logic.",
  },
  {
    title: "Campaign creation",
    text: "Build targeted broadcasts with reusable templates and channel-specific copy.",
  },
  {
    title: "Message scheduling",
    text: "Queue messages in advance and let workers deliver them at the right moment.",
  },
  {
    title: "Analytics dashboard",
    text: "Track sent volume, delivery, responses, conversion signals, and ROI trends.",
  },
];

export const workflowSteps = [
  {
    title: "User logs in",
    detail: "Teams enter a secure workspace and choose the business they are operating.",
  },
  {
    title: "Contacts are added",
    detail: "Customer records are imported manually, via CSV, or from lead sources.",
  },
  {
    title: "Campaign is created",
    detail: "Operators select channel mix, write the message, and choose the audience.",
  },
  {
    title: "Send now or schedule",
    detail: "Messages move to Redis-backed queues and are handed to workers for delivery.",
  },
  {
    title: "Analytics are reviewed",
    detail: "Performance data comes back into the dashboard for optimization and reporting.",
  },
];

export const architectureSteps = [
  "Frontend",
  "Backend",
  "Queue",
  "Worker",
  "External APIs",
  "Customer",
];

export const stack = [
  { layer: "Frontend", choice: "React.js" },
  { layer: "Backend", choice: "Node.js" },
  { layer: "Database", choice: "PostgreSQL" },
  { layer: "Queue", choice: "Redis" },
  { layer: "Messaging APIs", choice: "Twilio, Fast2SMS, AWS SES" },
];

export const campaigns = [
  {
    name: "Appointment Reminder Burst",
    audience: "Clinics - 428 patients",
    channels: "WhatsApp + SMS",
    status: "Scheduled",
    sendAt: "Today, 6:00 PM",
    goal: "Reduce no-shows before tomorrow's bookings.",
    performance: "Projected 92% reach",
  },
  {
    name: "Weekend Demo Class Invite",
    audience: "Coaching leads - 312 parents",
    channels: "WhatsApp + Email",
    status: "Draft",
    sendAt: "Tomorrow, 9:30 AM",
    goal: "Drive registrations for the Saturday orientation batch.",
    performance: "Expected CTR 14%",
  },
  {
    name: "Property Follow-up Journey",
    audience: "Warm prospects - 186 buyers",
    channels: "SMS + Email",
    status: "Running",
    sendAt: "Recurring every 48 hours",
    goal: "Move site-visit leads toward call bookings.",
    performance: "11 closed deals influenced",
  },
];

export const contacts = [
  {
    name: "Priya Sharma",
    business: "Sunrise Clinic",
    preferredChannel: "WhatsApp",
    segment: "Appointment due",
    lastTouch: "2 hours ago",
    status: "Active",
  },
  {
    name: "Rohan Verma",
    business: "Bright Minds Academy",
    preferredChannel: "Email",
    segment: "High-intent parent lead",
    lastTouch: "Yesterday",
    status: "Nurturing",
  },
  {
    name: "Anika Patel",
    business: "Metro Realty",
    preferredChannel: "SMS",
    segment: "Site visit follow-up",
    lastTouch: "3 days ago",
    status: "Needs action",
  },
  {
    name: "Vikram Nair",
    business: "City Mart",
    preferredChannel: "WhatsApp",
    segment: "Loyal buyer",
    lastTouch: "5 days ago",
    status: "Active",
  },
];

export const segments = [
  {
    title: "High-value buyers",
    count: "1,248 contacts",
    insight: "Repeat shoppers and high-intent leads receiving premium offers.",
  },
  {
    title: "At-risk appointments",
    count: "386 contacts",
    insight: "Customers who need reminders within the next 24 hours.",
  },
  {
    title: "Fresh inbound leads",
    count: "572 contacts",
    insight: "Recently added leads ready for first-touch onboarding sequences.",
  },
];

export const scheduleItems = [
  {
    campaign: "Clinic reminder wave",
    channel: "WhatsApp",
    scheduledFor: "Apr 3, 6:00 PM",
    queueWindow: "5:45 PM",
    status: "Scheduled",
  },
  {
    campaign: "Evening stock alert",
    channel: "SMS",
    scheduledFor: "Apr 3, 7:15 PM",
    queueWindow: "7:10 PM",
    status: "Sending",
  },
  {
    campaign: "Open house follow-up",
    channel: "Email",
    scheduledFor: "Apr 4, 9:00 AM",
    queueWindow: "8:50 AM",
    status: "Queued",
  },
  {
    campaign: "Fee reminder drip",
    channel: "WhatsApp + Email",
    scheduledFor: "Apr 4, 11:30 AM",
    queueWindow: "11:20 AM",
    status: "Ready",
  },
];

export const analyticsCards = [
  {
    label: "Delivery success",
    value: "97.4%",
    trend: "+1.2% vs last week",
  },
  {
    label: "Response rate",
    value: "22.1%",
    trend: "+3.4% from better segmentation",
  },
  {
    label: "Revenue influenced",
    value: "Rs 4.8L",
    trend: "Tracked across offers, bookings, and renewals",
  },
  {
    label: "Manual tasks avoided",
    value: "1,920",
    trend: "Follow-ups handled automatically this month",
  },
];

export const channelPerformance = [
  {
    channel: "WhatsApp",
    sent: "34,800",
    delivered: "98.2%",
    engaged: "29.4%",
    insight: "Best for reminders, confirmations, and conversational follow-ups.",
  },
  {
    channel: "SMS",
    sent: "21,400",
    delivered: "96.7%",
    engaged: "14.8%",
    insight: "Strong for short notices and urgent alerts with immediate visibility.",
  },
  {
    channel: "Email",
    sent: "33,000",
    delivered: "95.1%",
    engaged: "18.9%",
    insight: "Works well for detailed promotions, offers, and onboarding flows.",
  },
];

export const businessValue = [
  "Saves time by automating repetitive follow-ups and reminders.",
  "Improves customer engagement through timely, channel-aware communication.",
  "Supports sales growth with nurture journeys, offers, and retention campaigns.",
  "Creates a product businesses can subscribe to as a scalable SaaS platform.",
];

export const roadmap = [
  {
    title: "AI campaign suggestions",
    detail: "Recommend the next best message, audience, and send time using performance history.",
  },
  {
    title: "Chatbot integration",
    detail: "Turn campaigns into two-way automated flows that capture intent and answer FAQs.",
  },
  {
    title: "Mobile app",
    detail: "Give owners and sales teams live visibility into campaigns while on the move.",
  },
];

export const integrations = [
  {
    name: "Twilio",
    type: "Messaging provider",
    status: "Connected",
    note: "Handles WhatsApp and fallback SMS delivery for verified templates.",
  },
  {
    name: "Fast2SMS",
    type: "Domestic SMS route",
    status: "Standby",
    note: "Used when regional delivery cost and speed are more important.",
  },
  {
    name: "AWS SES",
    type: "Email provider",
    status: "Connected",
    note: "Supports bulk email campaigns, onboarding, and transactional messages.",
  },
  {
    name: "Redis",
    type: "Queue engine",
    status: "Healthy",
    note: "Buffers scheduled jobs and smooths spikes before worker processing.",
  },
];

export const settingsGroups = [
  {
    title: "Workspace controls",
    items: [
      "Business profile, sender identity, and timezone configuration",
      "Role-based access for operators, managers, and owners",
      "Template approval workflow for regulated communication",
    ],
  },
  {
    title: "Delivery safeguards",
    items: [
      "Retry policy for failed jobs and external API throttling",
      "Quiet hours and consent-aware messaging rules",
      "Fallback routing between WhatsApp, SMS, and email",
    ],
  },
  {
    title: "Measurement",
    items: [
      "Campaign goals tied to bookings, leads, or conversions",
      "UTM and source attribution for outbound journeys",
      "Executive summaries for weekly team reporting",
    ],
  },
];
