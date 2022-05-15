import React from "react";

import Newbet from "./Newbet";
import ResultDecide from "./ResultDecide";

const AdminDashboard = () => {
  const isBetOpen = false;

  if (isBetOpen) {
    return <Newbet />;
  } else {
    <ResultDecide />;
  }
};

export default AdminDashboard;
