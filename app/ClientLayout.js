"use client";

import { usePathname } from 'next/navigation';
import NavBar from "./(components)/NavBar";
import Footer from "./(components)/Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <>
      {!isAuthPage && <NavBar />}
      <main className={`min-h-screen ${!isAuthPage ? 'pt-16' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
} 