import React, { useEffect, useState } from "react";
import Select from "react-select";
import { TeamsList } from "../constant";

const Newbet = () => {
  const [firstTeam, setFirstTeam] = useState();
  const [secondTeam, setSecondTeam] = useState();
  const [teamPool, setTeampool] = useState([]);

  useEffect(() => {
    let pool = TeamsList.map((item) => {
      return { label: item, value: item };
    });
    setTeampool(pool);
  }, []);

  const onFirstTeamChange = (e) => {
    setFirstTeam(e);
    setTeampool((state) =>
      state.map((item) => {
        return item !== e.value;
      })
    );
  };

  const onSecondTeamChange = (e) => {
    setSecondTeam(e);
    setTeampool((state) =>
      state.map((item) => {
        return item !== e.value;
      })
    );
  };

  const onSubmit = () => {
    console.debug("sumbitting the bet");
    //call the bet sumbiting api
  };

  return (
    <div className="flex justify-between ">
      <Select
        options={teamPool}
        value={firstTeam}
        onChange={(e) => onFirstTeamChange(e)}
      />
      <Select
        options={teamPool}
        value={secondTeam}
        onChange={(e) => onSecondTeamChange(e)}
      />
      <button
        onClick={() => {
          onSubmit();
        }}
      >
        Sumbit
      </button>
    </div>
  );
};

export default Newbet;
