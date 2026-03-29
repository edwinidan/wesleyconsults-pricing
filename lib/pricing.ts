export interface FeatureItem {
  id: string;
  label: string;
  description: string;
  value: number;
  default?: boolean;
  category: 'core' | 'functionality' | 'content' | 'extras';
}

export interface ProjectType {
  id: string;
  label: string;
  baseRate: number;
  icon: string;
}

export const projectTypes: ProjectType[] = [
  { id: 'restaurant', label: 'Restaurant / Food', baseRate: 1800, icon: '🍽' },
  { id: 'portfolio', label: 'Portfolio / Personal', baseRate: 1500, icon: '💼' },
  { id: 'business', label: 'Business / SMB', baseRate: 2000, icon: '🏢' },
  { id: 'ecommerce', label: 'E-commerce / Store', baseRate: 2500, icon: '🛒' },
  { id: 'nonprofit', label: 'NGO / Non-profit', baseRate: 1800, icon: '🤝' },
];

export const features: FeatureItem[] = [
  // Core
  { id: 'responsive', label: 'Mobile responsive', description: 'Works perfectly on all devices', value: 0, default: true, category: 'core' },
  { id: 'seo', label: 'Basic SEO setup', description: 'Meta tags, sitemap, Google indexing', value: 300, category: 'core' },
  { id: 'analytics', label: 'Google Analytics', description: 'Track visitors and behavior', value: 150, category: 'core' },
  { id: 'ssl', label: 'SSL certificate', description: 'Secure HTTPS connection', value: 0, default: true, category: 'core' },

  // Functionality
  { id: 'contact', label: 'Contact form', description: 'Email submission form', value: 150, category: 'functionality' },
  { id: 'whatsapp', label: 'WhatsApp integration', description: 'Click-to-chat button', value: 200, category: 'functionality' },
  { id: 'maps', label: 'Google Maps', description: 'Interactive location map', value: 150, category: 'functionality' },
  { id: 'booking', label: 'Booking / reservation', description: 'Online appointment system', value: 500, category: 'functionality' },
  { id: 'gallery', label: 'Photo gallery', description: 'Image grid with lightbox', value: 300, category: 'functionality' },
  { id: 'menu', label: 'Menu / product listing', description: 'Organized product or food menu', value: 350, category: 'functionality' },
  { id: 'blog', label: 'Blog section', description: 'CMS-powered blog posts', value: 400, category: 'functionality' },
  { id: 'socials', label: 'Social media links', description: 'Social icons and feed embed', value: 100, category: 'functionality' },

  // Content
  { id: 'content', label: 'Content writing', description: 'Professional copywriting for all pages', value: 500, category: 'content' },
  { id: 'logo', label: 'Logo / branding', description: 'Custom logo and brand identity', value: 600, category: 'content' },
  { id: 'photography', label: 'Photo sourcing', description: 'Professional stock photos', value: 300, category: 'content' },

  // Extras
  { id: 'animations', label: 'Custom animations', description: 'Scroll effects and transitions', value: 400, category: 'extras' },
  { id: 'multilang', label: 'Multi-language', description: 'Support for 2+ languages', value: 500, category: 'extras' },
  { id: 'training', label: 'Client training', description: '1-hour walkthrough session', value: 200, category: 'extras' },
  { id: 'emailsetup', label: 'Business email setup', description: 'Professional email (info@domain)', value: 250, category: 'extras' },
];

export const timelines = [
  { id: 'relaxed', label: 'Relaxed (3–4 weeks)', multiplier: 1 },
  { id: 'normal', label: 'Standard (2 weeks)', multiplier: 1 },
  { id: 'rush', label: 'Rush (under 1 week)', multiplier: 1.3 },
];

export const revisionOptions = [
  { id: '2', label: '2 rounds (standard)', cost: 0 },
  { id: '3', label: '3 rounds', cost: 300 },
  { id: 'unlimited', label: 'Unlimited', cost: 600 },
];

export const hostingTiers = {
  domain: { label: 'Domain registration', min: 80, max: 150 },
  hosting: { label: 'Web hosting', min: 100, max: 200 },
  management: { label: 'Management & support', min: 150, max: 250 },
};

export function calculatePrice(config: {
  projectType: string;
  pages: number;
  selectedFeatures: string[];
  timeline: string;
  revisions: string;
}) {
  const project = projectTypes.find(p => p.id === config.projectType)!;
  let base = project.baseRate;

  // Extra pages beyond 5
  const extraPages = Math.max(0, config.pages - 5);
  const pageCost = extraPages * 250;
  base += pageCost;

  // Features
  let featureCost = 0;
  const selectedFeatureDetails: { label: string; cost: number }[] = [];
  config.selectedFeatures.forEach(fId => {
    const feature = features.find(f => f.id === fId);
    if (feature && feature.value > 0) {
      featureCost += feature.value;
      selectedFeatureDetails.push({ label: feature.label, cost: feature.value });
    }
  });

  // Revisions
  const revision = revisionOptions.find(r => r.id === config.revisions)!;
  const revisionCost = revision.cost;

  const subtotal = base + featureCost + revisionCost;

  // Timeline
  const timelineConfig = timelines.find(t => t.id === config.timeline)!;
  const rushCost = config.timeline === 'rush' ? Math.round(subtotal * 0.3) : 0;
  const total = Math.round(subtotal * timelineConfig.multiplier);

  // Buffer
  const buffer = Math.round(total * 0.15);
  const minPrice = total;
  const maxPrice = total + buffer;

  // Tier
  let tier: string;
  if (maxPrice <= 2500) tier = 'Starter';
  else if (maxPrice <= 5500) tier = 'Professional';
  else tier = 'Premium';

  // Payment split
  const deposit = Math.round(minPrice * 0.3);
  const balance = minPrice - deposit;

  // Hosting
  const hostingMin = hostingTiers.domain.min + hostingTiers.hosting.min + hostingTiers.management.min;
  const hostingMax = hostingTiers.domain.max + hostingTiers.hosting.max + hostingTiers.management.max;

  return {
    baseRate: project.baseRate,
    pageCost,
    pages: config.pages,
    featureCost,
    selectedFeatureDetails,
    revisionCost,
    rushCost,
    subtotal,
    total,
    buffer,
    minPrice,
    maxPrice,
    tier,
    deposit,
    balance,
    hostingMin,
    hostingMax,
    projectLabel: project.label,
    timelineLabel: timelineConfig.label,
    revisionLabel: revision.label,
  };
}
