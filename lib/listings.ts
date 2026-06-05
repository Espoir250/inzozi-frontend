export type Listing = {
  id: string;
  title: string;
  location: string;
  pricePerNight: string;
  rating: number;
  category: string;
  description: string;
  tags: string[];
  accent: string;
};

export const listings: Listing[] = [
  {
    id: "cozy-river-cabin",
    title: "Cozy River Cabin",
    location: "Nyungwe, Rwanda",
    pricePerNight: "₦45,000/night",
    rating: 4.9,
    category: "Cabin",
    description:
      "A forest retreat with river views, warm wood interiors, and direct access to nature trails.",
    tags: ["Forest", "Wellness", "Off-grid"],
    accent: "from-emerald-400 to-cyan-500",
  },
  {
    id: "city-vibe-studio",
    title: "City Vibe Studio",
    location: "Kigali, Rwanda",
    pricePerNight: "₦25,000/night",
    rating: 4.7,
    category: "Studio",
    description:
      "A modern studio in the heart of Kigali, perfect for work, culture, and weekend getaways.",
    tags: ["City", "Fast Wi-Fi", "Design"],
    accent: "from-pink-500 to-violet-500",
  },
  {
    id: "lakehouse-retreat",
    title: "Lakehouse Retreat",
    location: "Akagera, Rwanda",
    pricePerNight: "₦55,000/night",
    rating: 4.8,
    category: "Lakehouse",
    description:
      "A calm lakefront hideaway with panoramic views, private dock, and elegant natural finishes.",
    tags: ["Lake", "Private", "Luxury"],
    accent: "from-sky-400 to-blue-600",
  },
];
