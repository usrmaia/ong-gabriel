export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className={`flex-1 self-center w-screen`}>{children}</main>;
}
