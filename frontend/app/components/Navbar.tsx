import React from "react";


type NavbarProps = {
  title: string;
};

const Navbar = (props: NavbarProps) => {

  const { title } = props;

  return (
    <nav >
      <h3>{title}</h3>
      <a href="/" style={{ marginRight: "10px" }}>Home</a>
      <a href="/login" style={{ marginRight: "10px" }}>Login</a>
      <a href="/register">Register</a>
    </nav>
  );
};

export default Navbar;
