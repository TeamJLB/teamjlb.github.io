import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

const Layout = () => {
  return (
    <>
      <header>
        <nav className={styles.navigation_wrapper}>
          <NavLink to={"/"} className={styles.logo}>
            MEETLOG
          </NavLink>
          <div className={styles.myPage}>
            <NavLink to={"/myPage"}>마이페이지</NavLink>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
