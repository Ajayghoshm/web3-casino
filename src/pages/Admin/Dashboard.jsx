import React, { useEffect, useState } from "react";
import betting from "../../betting";

import Newbet from "./Newbet";
import ResultDecide from "./ResultDecide";

const AdminDashboard = ({
  currentAccount,
  contractBalance,
  teamPool,
  currentBetId,
}) => {
  const [betStatus, setBetStatus] = useState();

  useEffect(() => {
    const init = async () => {
      if (currentBetId) {
        let status = await betting.methods.isBetOpen(currentBetId).call();
        console.debug("status", status);
        if (status) {
          console.debug("the bet is already open");
          setBetStatus(true);
        } else {
          console.debug("the bet closed");
          setBetStatus(false);
        }
      }
    };
    init();
  }, [currentBetId]);

  const onOwnerResultSubmit = async (selectedTeam) => {
    console.debug("sumbitting the bet", selectedTeam);
    await window.ethereum.enable();
    let team;
    if (selectedTeam.value === teamPool[0].value) {
      team = 1;
    } else {
      team = 2;
    }
    console.debug("matchID", currentBetId, "Selected team", team);
    await betting.methods.result(currentBetId, team).send({
      from: currentAccount,
      gas: 100000,
    });
    console.debug("disabling the bet");
    await betting.methods
      .disableBetting(currentBetId)
      .send({ from: currentAccount });
    setBetStatus(false);
  };

  const onOwnerCreateBet = async (e) => {
    console.debug("creating bet");
    let value = Math.floor(Math.random() * 90000) + 10000;
    await betting.methods.enableBetting(value).send({ from: currentAccount });
    console.debug("Match Id", value);
    let status = await betting.methods.isBetOpen(value).call();
    console.debug("status", status);
    if (status) {
      console.debug("the bet is already open");
      setBetStatus(true);
    } else {
      console.debug("the bet closed");
      setBetStatus(false);
    }
  };

  if (!betStatus) {
    return <Newbet onOwnerCreateBet={onOwnerCreateBet} />;
  } else {
    return (
      <ResultDecide
        onOwnerResultSubmit={onOwnerResultSubmit}
        teamPool={teamPool}
      />
    );
  }
};

export default AdminDashboard;
