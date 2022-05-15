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
   bool public betStatus;
   
   mapping(address => Player) public playerInfo;
    
    function Betting() public {
        owner = msg.sender;
    }

   function createBet() public {
      if(betStatus){
         return false;
      }
      else{
         destroyBet();
         Betting();
      }
    }

    function destroyBet() public {
      if(msg.sender == owner) selfdestruct(owner);
    }
    
    function checkPlayerExists(address player) public view returns(bool){
      for(uint256 i = 0; i < players.length; i++){
         if(players[i] == player) return true;
      }
      return false;
    }

    function bet(uint8 _teamSelected) public payable {
      require(!checkPlayerExists(msg.sender));
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

      function result(uint16 teamWinner) public {
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
            add = winners[j];
            betValue = playerInfo[add].amountBet;
            winners[j].transfer((betValue+(1/WinnerBet*LoserBet)) );
            //bet + (1/total_bets_your_team * total_bets_other_team)
      }
      
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

}   