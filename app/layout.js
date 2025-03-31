import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Shopelio",
  description: "Best Ecom site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster position="top-center" />
              <ClientLayout>
                {children}
              </ClientLayout>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
