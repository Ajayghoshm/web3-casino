import React, { useEffect, useState } from "react";
import betting from "../../betting";
import web3 from "../../web3";
import Select from "react-select";

const Dashboard = ({ currentAccount, teamPool, currentBetId }) => {
  const [sumbitedAnswer, setSubmittedAnswer] = useState({ Result: "" });
  const [isExist, setIsExist] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState();
  const [value, setValue] = useState("");

  useEffect(() => {
    const init = async () => {
      //Check if the player already submitted bet
      if (currentAccount) {
        let checkExist = await betting.methods
          .checkPlayerExists(currentAccount)
          .call();
        setIsExist(checkExist);
        if (checkExist) {
          console.debug("I already betted");
          let selected = await betting.methods
            .playerInfo(currentAccount)
            .call();
          console.debug(selected, "selected");
          setSubmittedAnswer(selected);
        }
      }
    };
    init();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    await window.ethereum.enable();

    let team;
    if (selectedTeam === teamPool[0]) {
      team = 1;
    } else {
      team = 2;
    }
    let price = (value * 1000000000000000).toString();
    await betting.methods
      .bet(currentBetId, team)
      .send({ from: currentAccount, value: price, gas: "10000000" });
  };

  return (
    <form onSubmit={submitForm}>
      {!isExist ? (
        <>
          <h2>Place your bet</h2>
          <label>Amount of ether to enter</label>
          <input
            style={{ marginLeft: "1vw" }}
            value={value}
            onChange={(e) => {
              let value = e.target.value.toString();
              setValue(value);
            }}
            disabled={isExist}
          />
          <Select
            options={teamPool}
            value={selectedTeam}
            disabled={isExist}
            onChange={(e) => setSelectedTeam(e)}
          />
          {selectedTeam && (
            <h3> you will be betting on {selectedTeam.label}</h3>
          )}
          <button type="submit" disabled={isExist || !selectedTeam || !value}>
            Sumbit
          </button>
        </>
      ) : (
        <>
          <h4>Already Sumbitted </h4>
          <div>Amount:{sumbitedAnswer.amountBet}</div>
          <div>Selected Team:{sumbitedAnswer.teamSelected}</div>
        </>
      )}
    </form>
  );
};

export default Dashboard;
