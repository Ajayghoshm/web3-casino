import React from "react";
import { previousHistory } from "../constant";

const Previous = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <table>
        <thead>
          <th className="px-4">Team 1</th>
          <th>Team 2</th>
          <th>Result</th>
          <th>Prize pool</th>
        </thead>
        <tbody>
          {previousHistory.map((item) => {
            return (
              <tr>
                <td>{item.team1}</td>
                <td> {item.team2}</td>
                <td>{item.result}</td>
                <td>{item.prizePool}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Previous;
