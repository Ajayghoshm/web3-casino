import React from "react";

const PlaceBet = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-lg">Place your bet</h1>
      <h2>Open bet</h2>
      <div className="space-x-6">
        <button className="border bg-blue-500 text-white px-4">Team A</button>
        <button className="border bg-blue-500 text-white px-4">Team B</button>
      </div>
      <button className="border bg-blue-500 text-white px-4">Sumbit</button>
    </div>
  );
};

export default PlaceBet;
