const Web3 = require("web3");

// Connect to Ganache (or your Ethereum node)
const web3 = new Web3("http://localhost:7545");

const contractABI = [{
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "addresses",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "proportions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "stateMutability": "payable",
      "type": "receive",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_addresses",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_proportions",
          "type": "uint256[]"
        }
      ],
      "name": "setProportions",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }]  // Copy ABI from the build/contracts/ProportionalDistributor.json file
const contractAddress = "0x2FA765f47C517C47A3B2AE6FB61183567885d1a4"  // Replace with your contract's deployed address

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function main() {
  // Get accounts
  const accounts = await web3.eth.getAccounts();

  // Call owner function
  const owner = await contract.methods.owner().call();
  console.log(`Owner: ${owner}`);

  // Test setProportions function
  await contract.methods.setProportions(
    [accounts[1], accounts[2]],
    [50, 50]
  ).send({ from: accounts[0] });

  // Send Ether to contract and test distribution
  await web3.eth.sendTransaction({
    from: accounts[0],
    to: contractAddress,
    value: web3.utils.toWei("1", "ether")
  });

  // Log new balances for accounts[1] and accounts[2]
  const balance1 = await web3.eth.getBalance(accounts[1]);
  const balance2 = await web3.eth.getBalance(accounts[2]);
  console.log(`New balance for account 1: ${web3.utils.fromWei(balance1, 'ether')} ETH`);
  console.log(`New balance for account 2: ${web3.utils.fromWei(balance2, 'ether')} ETH`);
}

main().catch(console.error);
