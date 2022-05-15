pragma solidity ^0.4.17;

contract Betting {

   struct Player {
      uint256 amountBet;
      uint16 teamSelected;
    }

   address  public owner;
   uint256 public totalBetsOne;
   uint256 public totalBetsTwo;
   address[] public players;
   uint256 private _matchId;

   mapping (uint256 => bool) public isMatchEnabled;
   
   mapping(address => Player) public playerInfo;
    
    function Betting() public {
      owner = msg.sender;
    }

        

function enableBetting(uint16 _id) public onlyOwner returns(uint256) {
    isMatchEnabled[_id] = true;
    _matchId=_id;
    return _id;
}

function matchID() public view returns (uint256){
   return _matchId;
}

   function disableBetting(uint16 _id) public onlyOwner returns(uint16) {
    isMatchEnabled[_id] = false;
    return _id;
}

function isBetOpen(uint256 _id) public view returns(bool){
   if(isMatchEnabled[_id] == true){
      return true;
   }
   else{
      return false;
   }
}



    function checkPlayerExists(address player) public view returns(bool){
      for(uint256 i = 0; i < players.length; i++){
         if(players[i] == player) return true;
      }
      return false;
    }

    function bet(uint16 _matchSelected,uint16 _teamSelected) public payable {
      require(!checkPlayerExists(msg.sender));
      require(isMatchEnabled[_matchSelected] == true);
      playerInfo[msg.sender].amountBet = msg.value;
      playerInfo[msg.sender].teamSelected = _teamSelected;
      players.push(msg.sender);
      if ( _teamSelected == 1){
          totalBetsOne += msg.value;
      }
      else{
          totalBetsTwo += msg.value;
      }
    }

      function result(uint16 _matchSelected,uint16 teamWinner) public {
      require(isMatchEnabled[_matchSelected] == true);
      address [1000] memory winners;
      uint256 count = 0; 
      uint256 LoserBet = 0; 
      uint256 WinnerBet = 0; 
      address add;
      uint256 betValue;
      address playerAddress;
      for(uint256 i = 0; i < players.length; i++){
         playerAddress = players[i];
         if(playerInfo[playerAddress].teamSelected == teamWinner){
            winners[count] = playerAddress;
            count++;
         }
      }
      if ( teamWinner == 1){
         LoserBet = totalBetsTwo;
         WinnerBet = totalBetsOne;
      }
      else{
          LoserBet = totalBetsOne;
          WinnerBet = totalBetsTwo;
      }

      for(uint256 j = 0; j < count; j++){
         if(winners[j] != address(0))
         {
            add = winners[j];
            betValue = playerInfo[add].amountBet;
            winners[j].transfer((betValue+(1/WinnerBet*LoserBet)) );
         }
    
      }
      owner.transfer(address(this).balance);
      delete playerInfo[playerAddress]; 
      players.length = 0;
      LoserBet = 0; 
      WinnerBet = 0;
      totalBetsOne = 0;
      totalBetsTwo = 0;
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }


   function getBalance() public view returns (uint256){
      return address(this).balance;
   }

    modifier onlyOwner() {
require (owner == msg.sender);
_;
}

}   