/**
 * WishWash site config
 * -----------------
 * Edit this file to change copy, cities, pricing, FAQ, and links.
 * You never need to touch the components to update the website's words.
 */

// ── Launch market ────────────────────────────────────────────────────────────
// Change these to launch somewhere else. `zipPrefixes` decides which zip codes
// count as "in the launch area" (first 3 digits). `extraZips` adds single zips.
const market = {
  label: "Lincoln & Omaha", // short name used in headlines
  state: "Nebraska",
  cities: ["Lincoln", "Omaha"],
  zipPrefixes: ["680", "681", "685"], // Omaha metro = 680/681, Lincoln = 685
  extraZips: [] as string[],
};

// ── Service tiers (placeholder prices: change any time) ──────────────────────
const tiers = [
  {
    id: "exterior",
    name: "Exterior Wash",
    price: 39,
    unit: "per wash",
    duration: "About 45 min",
    blurb: "The quick refresh. Done while you're in a meeting.",
    features: [
      "Hand wash & dry",
      "Wheels, tires & tire shine",
      "Streak-free exterior glass",
      "Door jambs wiped",
    ],
    popular: false,
  },
  {
    id: "full",
    name: "Full Wash",
    price: 79,
    unit: "per wash",
    duration: "About 90 min",
    blurb: "Inside and out. The one most people actually need.",
    features: [
      "Everything in Exterior",
      "Full interior vacuum & mats",
      "Dash, console & doors wiped down",
      "Interior glass & screens",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium Detail",
    price: 179,
    unit: "per detail",
    duration: "About 3–4 hrs",
    blurb: "A showroom reset for the car you actually love.",
    features: [
      "Everything in Full Wash",
      "Clay bar & spray sealant",
      "Seat & carpet shampoo",
      "Leather clean & condition",
    ],
    popular: false,
  },
] as const;

export type TierId = (typeof tiers)[number]["id"];

const fromPrice = Math.min(...tiers.map((t) => t.price));

export const siteConfig = {
  name: "WishWash",
  slogan: "You wish. We wash.",
  // Your live URL. Vercel sets this automatically in production; you can also
  // set NEXT_PUBLIC_SITE_URL in Vercel once you have a custom domain.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  // Logo: leave empty to use the built-in text wordmark. To use your logo
  // file, save it in /public (e.g. /public/logo.png) and put the path here.
  // It sits on the cream nav bar, so the cream-background version works.
  logoSrc: "",
  logoWidth: 1254, // your image's pixel size (keeps it from looking stretched)
  logoHeight: 1254,

  contactEmail: "hello@yourdomain.com",
  social: {
    instagram: "https://instagram.com/yourhandle",
    tiktok: "https://tiktok.com/@yourhandle",
  },
  copyrightYear: 2026,

  market,
  tiers,

  seo: {
    title: `WishWash | You wish. We wash. Mobile car wash in ${market.label}`,
    description: `You wish. We wash. Book a car wash or detail from your phone. A vetted pro comes to your home, office, or campus lot in ${market.label}. Join the waitlist.`,
  },

  hero: {
    eyebrow: `Coming soon to ${market.label}`,
    headline: "You wish.",
    headlineAccent: "We wash.",
    subhead:
      "The car wash that comes to you. Book from your phone and a vetted pro washes your car at home, at work, or on campus. No driving. No lines.",
    trustLine: `Launching in ${market.label}. Be first in line.`,
  },

  howItWorks: {
    eyebrow: "How it works",
    title: "Three taps to a clean car.",
    steps: [
      {
        icon: "phone",
        title: "Book in the app",
        body: "Pick your wash, where the car is parked, and a time that works. It takes about thirty seconds.",
      },
      {
        icon: "pin",
        title: "We come to you",
        body: "A vetted pro shows up with everything: water, power, and supplies. You keep doing your thing.",
      },
      {
        icon: "sparkle",
        title: "Drive away gleaming",
        body: "Get a photo when it's done and pay in the app. No tunnel, no towel-drying, no tip jar awkwardness.",
      },
    ],
  },

  pricing: {
    eyebrow: "Services",
    title: "Pick your clean.",
    subtitle:
      "Estimated launch pricing. Tap the one you'd book and we'll save it with your spot.",
    cta: "I'd book this",
    note: "Prices may change before launch. Waitlist members hear about them first.",
  },

  benefits: {
    eyebrow: "Why WishWash",
    title: "A clean car without the car wash.",
    items: [
      {
        icon: "clock",
        title: "Get your time back",
        body: "No driving across town, no idling in line, no vacuuming in a parking lot. Your car gets washed while you work, study, or relax.",
      },
      {
        icon: "home",
        title: "We come to you",
        body: "Driveway, office lot, apartment complex, or dorm parking. If your car is parked there, we can wash it there.",
      },
      {
        icon: "shield",
        title: "Vetted pros only",
        body: "Every WishWash pro is background-checked, trained on our process, and insured before they touch a single car.",
      },
      {
        icon: "leaf",
        title: "Easy on water",
        body: "Our low-water method uses a fraction of what a driveway hose does, with biodegradable products and no runoff down the storm drain.",
      },
    ],
  },

  video: {
    // "vertical" for a phone-style (9:16) video, "horizontal" for 16:9.
    aspect: "vertical" as "vertical" | "horizontal",
    eyebrow: "See it in action",
    title: "Your driveway is the new car wash.",
    caption:
      "One tap to book. One pro at your door. One very clean car, without you leaving the house.",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered.",
    items: [
      {
        q: "When do you launch?",
        a: "Soon. We're opening bookings in waves, and the waitlist gets first access in the order people joined. Your spot number is your place in line, so the earlier you join, the sooner you book.",
      },
      {
        q: "Where is WishWash available?",
        a: `We're starting in ${market.cities.join(" and ")}, ${market.state}, including the surrounding suburbs. Outside the area? Join anyway. We save every zip code, and the places with the most signups get WishWash next.`,
      },
      {
        q: "How much does it cost?",
        a: `Washes start at $${fromPrice}. We're planning ${tiers
          .map((t) => `$${t.price} for the ${t.name}`)
          .join(", ")}. Final prices are set at launch, and waitlist members hear them first.`,
      },
      {
        q: "Do I need to be home?",
        a: "Nope. For an exterior wash, we just need to know where the car is parked. For interior service, you can hand off the keys in person or leave the car unlocked. Your call.",
      },
      {
        q: "What do you need from me?",
        a: "A parked car with a little room to walk around it, in a spot where washing is allowed. We bring our own water, power, and supplies, so you don't need to supply a hose or an outlet.",
      },
      {
        q: "How is my car protected?",
        a: "Our pros use pH-balanced soaps, fresh microfiber towels for every car, and a scratch-safe wash method. Every job is insured, and you get photos when it's done.",
      },
    ],
  },

  finalCta: {
    title: "Your car deserves better than a tunnel wash.",
    body: "Join the waitlist in ten seconds. First in line gets the first bookings.",
  },

  footer: {
    tagline: `You wish. We wash. The car wash that comes to you, launching in ${market.label}.`,
  },

  // Waitlist step-two questions (all optional for the visitor).
  waitlist: {
    frequencyOptions: [
      { id: "weekly", label: "Weekly" },
      { id: "biweekly", label: "Every 2 weeks" },
      { id: "monthly", label: "Monthly" },
      { id: "occasionally", label: "Occasionally" },
    ],
    // What people expect to pay per wash. Values are stored as numbers.
    priceOptions: [25, 40, 60, 90, 120],
    shareText: "You wish, we wash! I just joined the WishWash waitlist for a car wash that comes to you. Get in line:",
  },
};

export type SiteConfig = typeof siteConfig;
