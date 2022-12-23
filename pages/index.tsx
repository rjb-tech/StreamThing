import Head from "next/head";
import { Inter } from "@next/font/google";
import { NetworkHomePage } from "../components/NetworkHomePage";
import { useAuth0 } from "@auth0/auth0-react";
import { LandingPage } from "../components/LandingPage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? <NetworkHomePage /> : <LandingPage />;
}
