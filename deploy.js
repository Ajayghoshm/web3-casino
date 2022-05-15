const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

console.debug("interFace", interface);
console.debug("bte", bytecode);

const provider = new HDWalletProvider({
  mnemonic: {
    phrase:
      // "ensure renew spatial wall flame agree figure barrel renew fiber attract typical",
      "sock record verify advice bless filter nominee pottery midnight champion unable tragic",
  },
  providerOrUrl:
    "wss://rinkeby.infura.io/ws/v3/186313ff9e3948a6a3f6a0f31b75253d",
});
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: "1000000", from: accounts[0] });
  console.log("interface");
  console.log(interface);
  console.log("Contract deployed to", result.options.address);
};
deploy();
