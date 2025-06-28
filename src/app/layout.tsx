import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from './_components/Navbar';

export const metadata: Metadata = {
	title: 'Daily Weather Briefing',
	description: 'A simple weather app that provides daily weather updates.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`bg-white! antialiased`}>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
