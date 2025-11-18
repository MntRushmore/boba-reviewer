import type { Metadata } from 'next'
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import './globals.css'

export const metadata: Metadata = {
  title: 'Boba Drops Reviewer Portal',
  description: 'for the boba slupers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body><StackProvider app={stackClientApp}><StackTheme>{children}</StackTheme></StackProvider></body>
    </html>
  )
}
