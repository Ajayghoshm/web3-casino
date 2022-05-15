import React, { useEffect, useState } from "react";
import Select from "react-select";

const ResultDecide = ({ onOwnerResultSubmit, teamPool }) => {
  const [winner, setWinner] = useState();

  return (
    <div>
      <h1>Existing bet result publish</h1>
      <h3>Select the Winner</h3>
      <Select
        options={teamPool}
        value={winner}
        onChange={(e) => setWinner(e)}
      />
      {winner && <h3>The winner will be {winner.label}</h3>}
      <button
        onClick={() => {
          onOwnerResultSubmit(winner);
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default ResultDecide;
