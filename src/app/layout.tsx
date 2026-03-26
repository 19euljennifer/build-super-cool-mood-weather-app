export const metadata = {
  title: "Mood Weather App",
  description: "Get weather tailored to your mood",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
