import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useComponentVisible from "../utils/OutsideClick";

const Navbar = ({ isAuthenticated, login, logOut }) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const history = useNavigate();

  return (
    <>
      <div className="justify-between hidden w-full h-10 px-6 text-black bg-yellow-1000 md:flex border-b border-gray-200">
        <div
          className="cursor-pointer text-center py-2"
          onClick={() => history("/")}
        >
          Home
        </div>
        <button
          className="cursor-pointer"
          icon="ri-user-fill"
          iconPosition="left"
          label="Login"
          onClick={() => {
            isAuthenticated ? logOut() : login();
          }}
        >
          {isAuthenticated ? "Logout" : "Login"}
        </button>
      </div>
    </>
  );
};

export default Navbar;
