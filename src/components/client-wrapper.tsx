'use client';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div suppressHydrationWarning>{children}</div>;
}
