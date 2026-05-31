export interface ClientRecord {
  id: string;
  name: string;
  industry: string;
  venture: string;
  primaryContact: string;
  role: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  status: string;
  relationshipOwner: string;
  firstEngagement: string;
  lastContact: string;
  totalRevenue: number;
  servicesProvided: string[];
  notes: string;
  tags: string[];
}

export const CLIENT_STATUSES = ["Active", "Dormant", "Churned", "Prospect"];
export const CLIENT_VENTURES = ["Wasla Solutions", "Wasla Education", "Wasla Tourism", "Wasla Ventures"];

export const CLIENT_DIRECTORY_SEED: ClientRecord[] = [
  { id: "smg", name: "SMG Automotive", industry: "Automotive", venture: "Wasla Solutions", primaryContact: "Contact TBD", role: "", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2025-09-15", lastContact: "2025-09-15", totalRevenue: 300000, servicesProvided: ["Framer Website"], notes: "SMG & Scania brands", tags: ["automotive", "enterprise"] },
  { id: "pico", name: "PICO Engineering", industry: "Engineering", venture: "Wasla Solutions", primaryContact: "", role: "", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2025-10-01", lastContact: "2025-10-01", totalRevenue: 200000, servicesProvided: ["Framer Website"], notes: "", tags: ["engineering"] },
  { id: "cairo-capital", name: "Cairo Capital", industry: "Finance", venture: "Wasla Solutions", primaryContact: "Ahmed Fawzy", role: "", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2025-10-15", lastContact: "2026-04-01", totalRevenue: 150000, servicesProvided: ["Web Development"], notes: "In negotiation for full digital partner retainer (1.8M EGP).", tags: ["finance", "high-priority"] },
  { id: "sports-alliance", name: "Sports Alliance", industry: "Sports", venture: "Wasla Solutions", primaryContact: "", role: "", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2025-10-15", lastContact: "2025-10-15", totalRevenue: 25000, servicesProvided: ["Framer Website"], notes: "", tags: ["sports"] },
  { id: "ecmf", name: "ECMF", industry: "Finance", venture: "Wasla Solutions", primaryContact: "", role: "", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2025-11-01", lastContact: "2026-01-26", totalRevenue: 165000, servicesProvided: ["Subscriptions", "Google Emails"], notes: "Recurring subscriptions client", tags: ["finance", "recurring"] },
  { id: "ekhdem", name: "Ekhdem", industry: "Services", venture: "Wasla Solutions", primaryContact: "", role: "", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2025-11-25", lastContact: "2025-11-25", totalRevenue: 15000, servicesProvided: ["App Development"], notes: "", tags: [] },
  { id: "hiba-abdo", name: "Hiba Abdo", industry: "Personal Brand", venture: "Wasla Solutions", primaryContact: "Hiba Abdo", role: "Personal", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2026-01-15", lastContact: "2026-01-15", totalRevenue: 90000, servicesProvided: ["Web Development"], notes: "", tags: ["personal-brand"] },
  { id: "mw-fashion", name: "MW Fashion", industry: "Retail / Fashion", venture: "Wasla Solutions", primaryContact: "", role: "", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2026-02-10", lastContact: "2026-02-10", totalRevenue: 75000, servicesProvided: ["Web Development"], notes: "", tags: ["fashion"] },
  { id: "ejb", name: "EJB", industry: "Services", venture: "Wasla Solutions", primaryContact: "Amr Nabil", role: "", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2026-02-25", lastContact: "2026-02-25", totalRevenue: 100000, servicesProvided: ["App Development"], notes: "SLA retainer ongoing", tags: ["retainer"] },
  { id: "baraka-cosmetics", name: "Baraka Cosmetics", industry: "Beauty / Cosmetics", venture: "Wasla Solutions", primaryContact: "", role: "", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2026-03-03", lastContact: "2026-03-03", totalRevenue: 60000, servicesProvided: ["Website", "E-Store"], notes: "", tags: ["e-commerce"] },
  { id: "plus-one", name: "Plus One", industry: "Services", venture: "Wasla Solutions", primaryContact: "", role: "", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2026-03-05", lastContact: "2026-03-05", totalRevenue: 60000, servicesProvided: ["UI/UX Design"], notes: "Full platform design", tags: ["design"] },
  { id: "bling-beyond", name: "Bling & Beyond", industry: "E-commerce", venture: "Wasla Solutions", primaryContact: "", role: "", email: "", phone: "", website: "", location: "Cairo, Egypt", status: "Active", relationshipOwner: "Bassel El Aroussy", firstEngagement: "2026-03-08", lastContact: "2026-03-08", totalRevenue: 75000, servicesProvided: ["Shopify Store"], notes: "", tags: ["e-commerce"] },
];
