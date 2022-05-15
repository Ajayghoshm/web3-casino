import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IntialPage = ({ isAuthenticated }) => {
  const history = useNavigate();
  useEffect(() => {
    isAuthenticated && history("/user");
  });

  return (
    <div>
      {!isAuthenticated && (
        <div className="py-20 text-lg font-bold">
          Please Login using the button above!
        </div>
      )}
    </div>
  );
};

export default IntialPage;
