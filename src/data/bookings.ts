import type { StaticImageData } from "next/image";
import img1 from "@/src/assets/details/img1.png";
import img2 from "@/src/assets/details/img2.png";
import img3 from "@/src/assets/details/img3.png";

export type Booking = {
  slug: string;
  image: StaticImageData | string;
  name: string;
  detail: string;
  date: string;
  time: string;
  status: "Confirmed" | "Completed" | "Cancelled";
  reference: string;
  service: string;
  guests: string;
  address: string;
  phone: string;
  email: string;
  notes: string;
  cancellationPolicy: string;
  arrivalInstructions: string;
};

export const upcomingBookings: Booking[] = [
  {
    slug: "le-bistrot-parisien",
    image: img1,
    name: "Le Bistrot Parisien",
    detail: "Table for 2",
    date: "Nov 20, 2024",
    time: "19:30",
    status: "Confirmed",
    reference: "#TC-88291",
    service: "Gourmet Dinner",
    guests: "2 People",
    address: "15 Rue de Rivoli, 75004 Paris, France",
    phone: "+33 1 42 77 00 00",
    email: "contact@lebistrotparisien.fr",
    notes: "Table near the window if possible, we are celebrating a wedding anniversary. Thank you!",
    cancellationPolicy: "Free cancellation up to 24 hours before the scheduled time. Late cancellations may incur a fee of €25 per person.",
    arrivalInstructions: "Please arrive at the reception 10 minutes before your reservation. Tables are held for 15 minutes.",
  },
  {
    slug: "latelier-coiffure",
    image: img2,
    name: "L'Atelier Coiffure",
    detail: "Haircut & Styling",
    date: "Nov 24, 2024",
    time: "14:00",
    status: "Confirmed",
    reference: "#TC-71053",
    service: "Haircut & Styling",
    guests: "1 Person",
    address: "8 Avenue Montaigne, 75008 Paris, France",
    phone: "+33 1 45 62 11 22",
    email: "contact@latelier-coiffure.fr",
    notes: "First visit, would like a consultation before the cut.",
    cancellationPolicy: "Free cancellation up to 12 hours before the scheduled time. Late cancellations may incur a fee of €15.",
    arrivalInstructions: "Please arrive on time. Parking is available on Avenue Montaigne.",
  },
];

export const pastBookings: Booking[] = [
  {
    slug: "cabinet-juridique-maitre",
    image: img3,
    name: "Cabinet Juridique Maître",
    detail: "Consultation",
    date: "Oct 3, 2024",
    time: "11:00",
    status: "Completed",
    reference: "#TC-64827",
    service: "Legal Consultation",
    guests: "1 Person",
    address: "22 Rue Saint-Honoré, 75001 Paris, France",
    phone: "+33 1 40 15 33 44",
    email: "contact@cabinet-juridique-maitre.fr",
    notes: "Follow-up on contract review.",
    cancellationPolicy: "Free cancellation up to 48 hours before the scheduled time.",
    arrivalInstructions: "Please bring a valid ID and any relevant documents.",
  },
];

export const allBookings: Booking[] = [...upcomingBookings, ...pastBookings];

export function getBookingBySlug(slug: string): Booking | undefined {
  return allBookings.find((booking) => booking.slug === slug);
}
