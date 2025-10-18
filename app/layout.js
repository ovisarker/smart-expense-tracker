import "./globals.css";

export const metadata = {
  title: "Smart Expense Tracker",
  description: "Track, analyze, and control your spending"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-gray-50 dark:bg-gray-950">
      <body className="text-gray-900 dark:text-gray-100">{children}</body>
    </html>
  );
}
