import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'almanya101',
  description: 'Next.js migration shell for almanya101',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
