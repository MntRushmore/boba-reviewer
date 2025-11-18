import type { Metadata } from 'next'
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import './globals.css'

const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Boba Drops'
const appSubtitle = process.env.NEXT_PUBLIC_APP_SUBTITLE || 'Submission Reviewer'

export const metadata: Metadata = {
  title: `${appName} - ${appSubtitle}`,
  description: `${appSubtitle} Portal for ${appName}`,
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
