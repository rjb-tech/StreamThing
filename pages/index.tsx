import Head from "next/head";
import { Inter } from "@next/font/google";
import { ChannelGuidePage } from "../components/ChannelGuidePage";
import { useAuth0 } from "@auth0/auth0-react";
import { LandingPage } from "../components/LandingPage";
import { TheaterView } from "../components/TheaterView";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? <TheaterView /> : <LandingPage />;
}
