import React, { useEffect, useState } from "react";
import Select from "react-select";
import { TeamsList } from "../constant";

const Newbet = ({ onOwnerCreateBet }) => {
  const [firstTeam, setFirstTeam] = useState();
  const [secondTeam, setSecondTeam] = useState();
  const [teamPool, setTeampool] = useState([]);

  useEffect(() => {
    console.debug("newbetapge");
    let pool = TeamsList.map((item) => {
      return { label: item, value: item };
    });
    setTeampool(pool);
  }, []);

  const onFirstTeamChange = (e) => {
    setFirstTeam(e);
    setTeampool((state) => {
      let value = [...state];
      return value.filter((item) => {
        return item.value !== e.value;
      });
    });
  };

  const onSecondTeamChange = (e) => {
    setSecondTeam(e);
    setTeampool((state) => {
      let value = [...state];
      return value.filter((item) => {
        return item.value !== e.value;
      });
    });
  };

  return (
    <div className="flex w-1/2">
      <h2>Create a new bet</h2>
      <h3>select First team</h3>
      <Select
        options={teamPool}
        value={firstTeam}
        onChange={(e) => onFirstTeamChange(e)}
      />
      <h3>select Secondteam</h3>
      <Select
        options={teamPool}
        value={secondTeam}
        onChange={(e) => onSecondTeamChange(e)}
      />
      {firstTeam && secondTeam && (
        <h3>
          {firstTeam.label} VS {secondTeam.label}
        </h3>
      )}
      <button
        onClick={() => {
          onOwnerCreateBet();
        }}
      >
        Sumbit
      </button>
    </div>
  );
};

export default Newbet;
