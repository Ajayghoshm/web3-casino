import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import betting from "./betting";
import web3 from "./web3";
import Select from "react-select";
import { TeamsList } from "./pages/constant";

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
      console.debug("betting", betting);
      const manager = await betting.methods.owner().call();
      await window.ethereum.enable();
      let accounts = await web3.eth.getAccounts();
      console.debug("account", accounts[0], manager);
      let checkExist = await betting.methods
        .checkPlayerExists(accounts[0])
        .call();
      setIsExist(checkExist);
      if (checkExist) {
        let selected = await betting.methods.playerInfo(accounts[0]).call();
        console.debug(selected, "selected");
        setSubmittedAnswer(selected);
      }

      // const players = await betting.methods.players().call();
      // setPlayers(players);
      const balance = await web3.eth.getBalance(betting.options.address);

      setManager(manager);

      setContractBalance(balance);
      if (accounts[0] == manager) {
        setIsManager(true);
      } else {
        setIsManager(false);
      }
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
    if (selectedTeam === teamPool[0]) {
      team = 1;
    } else {
      team = 2;
    }
    await betting.methods.result(team).send({
      from: accounts[0],
    });
    await betting.methods.destroyBet().call();
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
    await betting.methods.bet(team).send({ from: accounts[0], value: value });
  };

  const onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await betting.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("A winner has been picked!");
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
      <h2>Betting Contract</h2>
      <p>This contract is managed by admin with address: {manager}</p>
      {ismanager
        ? "You are Logined as the manager"
        : "You are logined as a player"}
      <p>
        There are currently {players.length} entered, competing to win pool
        prize of {web3?.utils.fromWei(contractBalance, "ether")} ether!
      </p>
      <hr />
      <form onSubmit={!ismanager ? onPlayerSubmit : onOwnerResultSubmit}>
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
              <button type="submit">Sumbit</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Dashboard;
