import Link from "next/link";
import Logo from "@/ui/layout/logo";
import Sidebar from "../sidebar/Sidebar";
import SideNavToggler from "../sidebar/SideNavToggler";
import styles from "./header.module.css";
import { useFullscreenStore } from "@/lib/store/useFullScreen";

export default function Header() {
  const { isFullscreen } = useFullscreenStore();

  if (isFullscreen) return null;

  return (
    <header className={styles["web-header"]}>
      <SideNavToggler />
      <Link href="/" className={styles.logo}>
        <Logo color={"#005ca9"} />
      </Link>
      <Sidebar />
    </header>
  );
}
