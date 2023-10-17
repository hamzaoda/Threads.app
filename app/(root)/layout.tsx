import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import BottomBar from '../../components/shared/BottomBar'
import TopBar from '@/components/shared/TopBar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import RightSideBar from '@/components/shared/RightSideBar'
import { dark } from "@clerk/themes";
import { ReactNode } from 'react'


export const metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Meta Data Application'
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}
  >
    <html lang="en">
      <body className={`${inter.className} bg-dark-1`} >
        <TopBar />

        <main className='flex flex-row'>
          <LeftSideBar />

            <section className='main-container'> 
              <div className='w-full max-w-4xl'>
                {children}
              </div>
            </section>

          <RightSideBar />
        </main>
        <BottomBar />
        </body>
    </html>
    </ClerkProvider>
  )
}
