import { Roboto } from "next/font/google";

// The shared layout loads Roboto regular and medium. The About page also sets
// school names in light and the book title in medium italic, so those two cuts load here.
export const robotoLight = Roboto({
  subsets: ["latin"],
  weight: "300",
  variable: "--font-roboto-light",
  display: "swap",
});

export const robotoItalic = Roboto({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
  variable: "--font-roboto-italic",
  display: "swap",
});
