const ProportionalDistributor = artifacts.require("ProportionalDistributor");

contract("ProportionalDistributor", (accounts) => {
  let contract;
  const [owner, addr1, addr2] = accounts;

  beforeEach(async () => {
    contract = await ProportionalDistributor.new({ from: owner });
  });

  it("should set owner correctly", async () => {
    const contractOwner = await contract.owner();
    assert.equal(contractOwner, owner);
  });

  it("should set and get proportions correctly", async () => {
    await contract.setProportions([addr1, addr2], [50, 50], { from: owner });
    const prop1 = await contract.proportions(addr1);
    const prop2 = await contract.proportions(addr2);
    assert.equal(prop1.toNumber(), 50);
    assert.equal(prop2.toNumber(), 50);
  });

  it("should revert if not the owner", async () => {
    try {
      await contract.setProportions([addr1, addr2], [50, 50], { from: addr1 });
    } catch (error) {
      assert(error.message.indexOf("Not authorized") >= 0);
    }
  });

  it("should revert if proportions don't sum to 100", async () => {
    try {
      await contract.setProportions([addr1, addr2], [30, 40], { from: owner });
    } catch (error) {
      assert(error.message.indexOf("Proportions must sum to 100") >= 0);
    }
  });

  it("should distribute ether proportionally", async () => {
    await contract.setProportions([addr1, addr2], [50, 50], { from: owner });

    // Initial balances
    const initialBalance1 = await web3.eth.getBalance(addr1);
    const initialBalance2 = await web3.eth.getBalance(addr2);

    // Send ether to the contract
    await web3.eth.sendTransaction({ from: owner, to: contract.address, value: web3.utils.toWei('1', 'ether') });

    // Final balances
    const finalBalance1 = await web3.eth.getBalance(addr1);
    const finalBalance2 = await web3.eth.getBalance(addr2);

    // Check if balances increased proportionally
    assert.equal(finalBalance1 - initialBalance1, web3.utils.toWei('0.5', 'ether'));
    assert.equal(finalBalance2 - initialBalance2, web3.utils.toWei('0.5', 'ether'));
  });
});
