import type { StaticImageData } from "next/image";
import businessOneImage from "@/src/assets/landing/img1.svg";
import businessTwoImage from "@/src/assets/landing/img2.svg";
import businessThreeImage from "@/src/assets/landing/img3.svg";
import businessFourImage from "@/src/assets/landing/img4.svg";
import detailOneImage from "@/src/assets/details/img1.png";
import detailTwoImage from "@/src/assets/details/img2.png";
import detailThreeImage from "@/src/assets/details/img3.png";
import detailFourImage from "@/src/assets/details/img4.png";

export interface OpeningHour {
  day: string;
  hours: string;
  closed?: boolean;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  location: string;
  details: string;
  rating: string;
  trustScore: number;
  image: StaticImageData;
  detailImage: StaticImageData;
  additionalPhotosCount: number;
  description: string;
  amenities: string[];
  website: string;
  status: "Open Now" | "Closed Now";
  priceRange: string;
  openingHours: OpeningHour[];
}

const DEFAULT_OPENING_HOURS: OpeningHour[] = [
  { day: "Monday", hours: "12:00 - 23:00" },
  { day: "Tuesday", hours: "12:00 - 23:00" },
  { day: "Wednesday", hours: "12:00 - 23:00" },
  { day: "Thursday", hours: "12:00 - 23:00" },
  { day: "Friday", hours: "12:00 - 00:00" },
  { day: "Saturday", hours: "10:00 - 00:00" },
  { day: "Sunday", hours: "Closed", closed: true },
];

export const businesses: Business[] = [
  {
    id: "le-bistrot-parisien",
    name: "Le Bistrot Parisien",
    category: "Restaurant",
    location: "75001 Paris, France",
    details: "Restaurant • Paris",
    rating: "4.8 (124 reviews)",
    trustScore: 98,
    image: businessOneImage,
    detailImage: detailOneImage,
    additionalPhotosCount: 12,
    description:
      "Experience the quintessential charm of Paris at Le Bistrot Parisien. Located in the heart of the 1st arrondissement, we offer a curated selection of traditional French delicacies reimagined with a modern flair. From our signature onion soup to locally sourced seasonal specials, every dish is a celebration of French culinary heritage.",
    amenities: [
      "Traditional French Cuisine",
      "Outdoor Terrace",
      "Wine Tasting Room",
      "Private Events Room",
      "Vegetarian Options",
      "Free High-Speed Wi-Fi",
    ],
    website: "lebistrotparisien.fr",
    status: "Open Now",
    priceRange: "€€ - €€€",
    openingHours: DEFAULT_OPENING_HOURS,
  },
  {
    id: "salon-elegance",
    name: "Salon Élégance",
    category: "Hair Salon",
    location: "69002 Lyon, France",
    details: "Hair Salon • Lyon",
    rating: "4.9 (98 reviews)",
    trustScore: 96,
    image: businessTwoImage,
    detailImage: detailTwoImage,
    additionalPhotosCount: 8,
    description:
      "Salon Élégance brings premium hair care to the heart of Lyon. Our experienced stylists specialize in precision cuts, color correction, and modern styling, using only professional-grade products in a calm, welcoming space.",
    amenities: [
      "Precision Haircuts",
      "Color & Balayage",
      "Bridal Styling",
      "Scalp Treatments",
      "Private Styling Rooms",
      "Free High-Speed Wi-Fi",
    ],
    website: "salon-elegance.fr",
    status: "Open Now",
    priceRange: "€€ - €€€",
    openingHours: DEFAULT_OPENING_HOURS,
  },
  {
    id: "garage-auto-plus",
    name: "Garage Auto Plus",
    category: "Garage",
    location: "13001 Marseille, France",
    details: "Garage • Marseille",
    rating: "4.7 (86 reviews)",
    trustScore: 94,
    image: businessThreeImage,
    detailImage: detailThreeImage,
    additionalPhotosCount: 6,
    description:
      "Garage Auto Plus is Marseille's trusted address for vehicle repair and maintenance. Our certified technicians handle everything from routine servicing to full diagnostics, for all makes and models, with transparent pricing.",
    amenities: [
      "Full Diagnostics",
      "Tire & Brake Service",
      "Air Conditioning Repair",
      "Courtesy Vehicles",
      "Waiting Lounge",
      "Free High-Speed Wi-Fi",
    ],
    website: "garageautoplus.fr",
    status: "Open Now",
    priceRange: "€ - €€",
    openingHours: DEFAULT_OPENING_HOURS,
  },
  {
    id: "plomberie-express",
    name: "Plomberie Express",
    category: "Plumber",
    location: "06000 Nice, France",
    details: "Plumber • Nice",
    rating: "4.6 (64 reviews)",
    trustScore: 92,
    image: businessFourImage,
    detailImage: detailFourImage,
    additionalPhotosCount: 5,
    description:
      "Plomberie Express delivers fast, reliable plumbing services across Nice, from emergency call-outs to scheduled installations. Our licensed plumbers arrive on time and get the job done right, the first time.",
    amenities: [
      "24/7 Emergency Call-Outs",
      "Leak Detection",
      "Boiler Installation",
      "Drain Unblocking",
      "Free Quotes",
      "Free High-Speed Wi-Fi",
    ],
    website: "plomberie-express.fr",
    status: "Open Now",
    priceRange: "€€",
    openingHours: DEFAULT_OPENING_HOURS,
  },
];

export function getBusinessById(id: string): Business | undefined {
  return businesses.find((business) => business.id === id);
}
