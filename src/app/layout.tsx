import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Get a free cover letter from your resume',
	description:
		'Get a free cover letter from your resume, add job description or url and get a clean and strong cover letter',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
