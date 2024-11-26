import './globals.css'

export const metadata = {
  title: 'Imagen - Generatore di Immagini',
  description: 'Genera immagini con Ideogram AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
