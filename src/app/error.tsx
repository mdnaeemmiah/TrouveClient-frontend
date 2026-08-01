"use client";

type ErrorPageProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	console.error(error);

	return (
		<main className="grid min-h-screen place-items-center bg-[#f7f7fa] p-6 text-[#1c1d22]">
			<div className="text-center">
				<h1 className="text-2xl font-bold">Something went wrong</h1>
				<button
					className="mt-5 rounded-lg bg-[#00663f] px-5 py-3 text-sm font-bold text-white"
					onClick={reset}
					type="button"
				>
					Try again
				</button>
			</div>
		</main>
	);
}
