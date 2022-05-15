import React, { useState } from "react";
import Select from "react-select";

const ResultDecide = ({ betOpen }) => {
  const [winner, setWinner] = useState();

  const onSumbit = () => {
    console.debug("sumbiting the result");
    //call api for sumbiting the result
  };

  return (
    <div>
      <h1>Existing bet</h1>
      <Select
        options={[]}
        value={winner}
        onChange={(e) => setWinner(e.target.value)}
      />
      <button
        onClick={() => {
          onSumbit();
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default ResultDecide;
