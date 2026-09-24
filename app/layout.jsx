import './globals.css'

export const metadata = {
  title: 'YouTube Shorts Transcript Puller',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
