import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";

export default function HomeLayout() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="w-full h-full overflow-hidden">
        <Outlet />
      </main>
      <Footer isHomepage />
    </div>
  );
}
