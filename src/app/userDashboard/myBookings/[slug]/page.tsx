import { notFound } from "next/navigation";
import BookingDetails from "@/src/components/userDashboard/BookingDetails";
import { getBookingBySlug } from "@/src/data/bookings";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const booking = getBookingBySlug(slug);

  if (!booking) {
    notFound();
  }

  return <BookingDetails booking={booking} />;
}
