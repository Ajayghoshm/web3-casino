import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const history = useNavigate();
  return (
    <div className="flex flex-wrap justify-end flex-auto w-full h-auto px-2 py-2 text-xs font-semibold text-black border-t border-black bg-yellow-1000">
      <div>
        <div className="cursor-pointer" onClick={() => history("/admin")}>
          Admin Login
        </div>
      </div>
    </div>
  );
};

export default Footer;
