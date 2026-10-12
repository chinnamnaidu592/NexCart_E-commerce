import '../index.css';
import Providers from './providers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'NexCart - Modern E-Commerce Platform',
  description:
    'A high-converting, accessible, API-driven e-commerce platform built with React and Tailwind CSS.',
  openGraph: {
    title: 'NexCart - Modern E-Commerce Platform',
    description:
      'A high-converting, accessible, API-driven e-commerce platform built with React and Tailwind CSS.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-indigo-600 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
