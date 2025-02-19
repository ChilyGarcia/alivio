import NavBar from "@/components/navbar";
import Hero from "@/components/hero";
import TabBar from "@/components/TabBar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <NavBar />
      <Hero />
      <TabBar></TabBar>
    </div>
  );
}
