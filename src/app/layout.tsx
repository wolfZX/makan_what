"use client";
// import type { Metadata } from "next";
import "@fontsource/poppins/700.css"; // Poppins Bold
import "@fontsource/poppins/600.css"; // Poppins Semibold
import "@fontsource/inter/400.css"; // Inter Regular
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";

// export const metadata: Metadata = {
//   title: "Makan Where?",
//   description: "Find your next meal spot!",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, sans-serif", background: "#FFF8F0" }}>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </body>
    </html>
  );
}
