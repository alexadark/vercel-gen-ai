import './globals.css';
import { AI } from './actions';
import { Inter as FontSans, Space_Mono as FontBody } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = FontBody({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '700'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AI>
      <html lang="en" className="dark">
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          {children}
        </body>
      </html>
    </AI>
  );
}
