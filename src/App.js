import React, { useEffect, useState } from "react";
import betting from "./betting";
import web3 from "./web3";
import { TeamsList } from "./pages/constant";
import AdminDashboard from "./pages/Admin/Dashboard";
import Dashboard from "./pages/Users/Dashboard";

const App = () => {
  const [players, setPlayers] = useState([]);
  const [contractBalance, setContractBalance] = useState("");
  const [ismanager, setIsManager] = useState(false);
  const [teamPool, setTeampool] = useState([]);
  const [currentBetId, setCurrentBetId] = useState();
  const [currentAccount, setCurrentAccount] = useState();

  useEffect(() => {
    const init = async () => {
      console.debug("Intialize", betting);
      await window.ethereum.enable();
      let accounts = await web3.eth.getAccounts();
      setCurrentAccount(accounts[0]);
      const balance = await web3.eth.getBalance(betting.options.address);
      setContractBalance(balance);
      const manager = await betting.methods.owner().call();

      if (accounts[0] === manager) {
        console.debug("I am a manager");
        setIsManager(true);
      } else {
        console.debug("I am a player");
        setIsManager(false);
      }

      let matchID = await betting.methods.matchID().call();
      console.debug("Match Id", matchID);
      setCurrentBetId(matchID);

      const players = await betting.methods.getPlayers().call();
      setPlayers(players);

      let pool = TeamsList.map((item) => {
        return { label: item, value: item };
      });
      setTeampool(pool);
    };

    init();
  }, []);

  return (
    <div className="py-20 space-x-6">
      {ismanager ? (
        <AdminDashboard
          currentAccount={currentAccount}
          contractBalance={contractBalance}
          teamPool={teamPool}
          currentBetId={currentBetId}
        />
      ) : (
        <Dashboard
          currentBetId={currentBetId}
          currentAccount={currentAccount}
          contractBalance={contractBalance}
          teamPool={teamPool}
        />
      )}
    </div>
  );
};

export default App;
