import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import betting from "./betting";
import web3 from "./web3";
import Select from "react-select";
import { TeamsList } from "./pages/constant";
import Web3 from "web3";

const Dashboard = () => {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [contractBalance, setContractBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [ismanager, setIsManager] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState();
  const [isExist, setIsExist] = useState(false);
  const [sumbitedAnswer, setSubmittedAnswer] = useState({ Result: "" });

  const [firstTeam, setFirstTeam] = useState();
  const [secondTeam, setSecondTeam] = useState();
  const [teamPool, setTeampool] = useState([]);
  const [betStatus, setBetStatus] = useState();
  const [winnerTeam, setWinnerTeam] = useState();
  const [currentBetId, setCurrentBetId] = useState();

  const [currentAccount, setCurrentAccount] = useState();

  useEffect(() => {
    let pool = TeamsList.map((item) => {
      return { label: item, value: item };
    });
    setTeampool(pool);
  }, [firstTeam, secondTeam]);

  const onFirstTeamChange = (e) => {
    setFirstTeam(e);
  };

  useEffect(() => {
    const init = async () => {
      console.debug("Intialize", betting);
      await window.ethereum.enable();
      let accounts = await web3.eth.getAccounts();
      setCurrentAccount(accounts[0]);

      const balance = await web3.eth.getBalance(betting.options.address);
      setContractBalance(balance);

      const manager = await betting.methods.owner().call();
      setManager(manager);
      if (accounts[0] === manager) {
        console.debug("I am a manager");
        setIsManager(true);
      } else {
        console.debug("I am a player");
        setIsManager(false);
        let checkExist = await betting.methods
          .checkPlayerExists(accounts[0])
          .call();
        setIsExist(checkExist);
        if (checkExist) {
          console.debug("I already betted");
          let selected = await betting.methods.playerInfo(accounts[0]).call();
          console.debug(selected, "selected");
          setSubmittedAnswer(selected);
        }
      }

      let matchID = await betting.methods.matchID().call();
      console.debug("Match Id", matchID);
      setCurrentBetId(matchID);
      let status = await betting.methods.isBetOpen(matchID).call();
      console.debug("currentBet Status", status);
      setBetStatus(status);

      const players = await betting.methods.getPlayers().call();
      setPlayers(players);
    };

    init();
  }, []);

  const onSecondTeamChange = (e) => {
    setSecondTeam(e);
  };

  const onOwnerResultSubmit = async (e) => {
    e.preventDefault();
    console.debug("sumbitting the bet");
    // const accounts = await web3.eth.requestAccounts();
    await window.ethereum.enable();
    let accounts = await web3.eth.getAccounts();
    let team;
    if (selectedTeam === winnerTeam) {
      team = 1;
    } else {
      team = 2;
    }
    await betting.methods.result(currentBetId, team).send({
      from: accounts[0],
      gas: 100000,
    });
    await betting.methods
      .disableBetting(currentBetId)
      .send({ from: currentAccount });
  };

  const onOwnerCreateBet = async (e) => {
    e.preventDefault();
    console.debug("creating bet");
    let value = Math.floor(Math.random() * 90000) + 10000;
    await betting.methods.enableBetting(value).send({ from: currentAccount });
    console.debug("Match Id", value);
    let status = await betting.methods
      .isBetOpen(value)
      .call(function (err, res) {
        if (err) {
          console.log("An error occured", err);
          return;
        }
        console.log("is the bet open ", res);
      });
    if (status) {
      setBetStatus(true);
    } else {
      setBetStatus(false);
    }
  };

  const onPlayerSubmit = async (e) => {
    e.preventDefault();
    await window.ethereum.enable();
    let accounts = await web3.eth.getAccounts();
    let team;
    if (selectedTeam === teamPool[0]) {
      team = 1;
    } else {
      team = 2;
    }
    await betting.methods
      .bet(currentBetId, team)
      .send({ from: accounts[0], value: value, gas: "1000000" });
  };

  return (
    // <div className="py-20 space-x-6">
    //   <button
    //     className="px-4 text-white bg-blue-500 border"
    //     onClick={() => {
    //       history("/user/place-bet");
    //     }}
    //   >
    //     Place bet
    //   </button>
    //   <button
    //     className="px-4 text-white bg-blue-500 border"
    //     onClick={() => {
    //       history("/user/previous-bet");
    //     }}
    //   >
    //     Previous bets
    //   </button>
    // </div>

    <div>
      <h2 className="text-bold">Betting</h2>
      <p>This contract is managed by admin with address: {manager}</p>
      {ismanager
        ? "You are Logined as the manager"
        : "You are logined as a player"}
      <p>
        There are currently {players.length} entered, competing to win pool
        prize of {web3?.utils.fromWei(contractBalance, "ether")} ether!
      </p>
      <hr />
      <form
        onSubmit={
          !ismanager
            ? onPlayerSubmit
            : betStatus
            ? onOwnerResultSubmit
            : onOwnerCreateBet
        }
      >
        {!ismanager ? (
          <>
            {!isExist ? (
              <div>
                <h4>Do you want to bet</h4>
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
                />
                <button type="submit" disabled={isExist}>
                  Sumbit
                </button>
              </div>
            ) : (
              <>
                <h4>Already Sumbitted </h4>
                <div>Amount:{sumbitedAnswer.amountBet}</div>
                <div>Selected Team:{sumbitedAnswer.teamSelected}</div>
              </>
            )}
          </>
        ) : (
          <>
            {!betStatus ? (
              <div className="flex justify-between ">
                <h2>start a bet</h2>
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
                <button type="submit">Sumbit</button>
              </div>
            ) : (
              <div className="flex justify-between ">
                <h2>Announce the result</h2>
                <Select
                  options={teamPool}
                  value={firstTeam}
                  onChange={(e) => setWinnerTeam(e)}
                />
                <button type="submit">Sumbit</button>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default Dashboard;
