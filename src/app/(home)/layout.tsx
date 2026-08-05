import type { ReactNode } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export default function HomeLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			{children}
			<Footer />
		</>
	);
}
