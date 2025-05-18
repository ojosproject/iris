/**
 * File:     Layout.tsx
 * Purpose:  A Layout component to use to wrap around pages.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import { ReactNode } from "react";
import styles from "./Layout.module.css";
import BackButton from "./BackButton";

type LayoutProps = {
  children: ReactNode;
  title: string;
  disabledBackButton?: boolean;
  handleBackClick?: () => void | undefined | null;
};

export default function Layout({
  children,
  title,
  disabledBackButton,
  handleBackClick,
}: LayoutProps) {
  return (
    <>
      <header className={styles.header}>
        <div>
          {!disabledBackButton && <BackButton onClick={handleBackClick} />}
        </div>
        <h1>{title}</h1>
        <div></div>
      </header>
      <main>{children}</main>
    </>
  );
}
