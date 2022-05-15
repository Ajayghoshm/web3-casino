import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import betting from "../../betting";

import PlaceBet from "./PlaceBet";
import Previous from "./Previous";
import web3 from "../../web3";

const Dashboard = () => {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [contractBalance, setContractBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      console.debug("betting", betting);
      const manager = await betting.methods.owner().call();
      const players = await betting.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(betting.options.address);

      setManager(manager);
      setPlayers(players);
      setContractBalance(balance);
    };

    init();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();

    // const accounts = await web3.eth.requestAccounts();
    await window.ethereum.enable();
    let accounts = await web3.eth.getAccounts();
    console.debug("account", accounts);
    setMessage("Waiting on transaction success...", "");
    // await lottery.methods.enter().send({
    //   from: "0x64252ad60f3D02b8eb12cc59E061F0cd58E6Ef33",
    //   value: web3.utils.toWei(value, "ether"),
    // });
    setMessage("You have been entered!");
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
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>
        There are currently {players.length} entered, competing to win{" "}
        {web3?.utils.fromWei(contractBalance, "ether")} ether!
      </p>
      <hr />
      <form onSubmit={submitForm}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            style={{ marginLeft: "1vw" }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button style={{ display: "block", marginTop: "1vh" }}>Enter</button>
        </div>
      </form>

      <hr />

      <div>
        <h4>Ready to pick a winner?</h4>
        <button onClick={onPickWinner}>Pick a winner!</button>
      </div>
      <hr />
      <h1>{message}</h1>
    </div>
  );
};

export default Dashboard;
