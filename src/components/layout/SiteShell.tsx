import { ReactNode } from "react";
import TopBar from "./TopBar";
import HeaderBanner from "./HeaderBanner";
import MainNav from "./MainNav";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
  withSidebar?: boolean;
};

export default function SiteShell({ children, withSidebar = true }: Props) {
  return (
    <>
      <TopBar />
      <HeaderBanner />
      <MainNav />

      <main
        className={
          withSidebar
            ? "w-[970px] mx-auto py-3 grid grid-cols-[1fr_300px] gap-2"
            : "w-[970px] mx-auto py-3"
        }
      >
        <div>{children}</div>
        {withSidebar && <Sidebar />}
      </main>

      <Footer />
    </>
  );
}
