import './globals.css';
export const metadata = { title: 'KAMDRIDI EMPIRE', description: 'Built for empire. Designed to scale.' };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
