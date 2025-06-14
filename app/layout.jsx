import "./global.css"
import Header from "../components/Header"

export const metadata = {
  title: 'Drift',
  description: 'Minimalist journaling app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Header/>
      <main className="container mx-auto p-10">
        {children}
      </main>
      <footer className="text-gray-400 text-center py-5 text-xs">
          <p>Copyright &copy; {new Date().getFullYear()} yihfei - All rights reserved</p>
      </footer>
      </body>
    </html>
  )
}
