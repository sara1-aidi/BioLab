import { GeistSans, GeistMono } from "geist/font";
import { AuthProvider } from "./context/authContext";
import "./globals.css";

export const metadata = {
  title: "BioLab Research",
  description: "Advanced Diagnostic Solutions through Responsive AI Technology",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans bg-pastel-blue-light min-h-screen">
        <AuthProvider>
         
            {children}
         
        </AuthProvider>
      </body>
    </html>
  );
}