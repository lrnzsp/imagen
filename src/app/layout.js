import './globals.css'

export const metadata = {
  title: 'Generatore di Immagini',
  description: 'Crea immagini con AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
