import './globals.css';

export const metadata = {
  title: 'GitHub Chart API',
  description: 'Build a custom GitHub contribution chart for your site',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
