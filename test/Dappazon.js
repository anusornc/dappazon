const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Dappazon", () => {
  // declare variables
  let dappazon
  let owner
  let buyer
  let seller


  // run before each test
  beforeEach(async () => {
    // Setup Accounts
    [owner, buyer, seller] = await ethers.getSigners();
    console.log("owner address: ", owner.address);
    console.log("owner value: ", ethers.utils.formatEther(await owner.getBalance()));
    console.log("buyer address: ", buyer.address);
    console.log("seller address: ", seller.address);

    // get the contract factory
    const Dappazon = await ethers.getContractFactory("Dappazon");

    // deploy the contract and wait for it to be mined
    dappazon = await Dappazon.deploy();
  });


  // test cases
  describe("Deployment", async () => {
    // test case 1 - check if the contract name is correct
    it("Should set the right name", async () => {
      const name = await dappazon.name();
      expect(name).to.equal(name);
    });

    // test case 2 - check if the deployer is the owner
    it("Should set the right owner", async () => {
      const ownerAddress = await dappazon.owner();
      expect(ownerAddress).to.equal(owner.address);
    });

  });

  describe("Products", async () => {
    // list of products
    let result
    let productCount

    // run before each test
    beforeEach(async () => {
      let product

      // add products
      product = await dappazon.connect(owner).addProduct(
        1,              // id
        "iPhone 12",    // name
        "Mobile Phone", // category
        "url",          // image      
        1,              // cost
        4,              // rating
        5               // stock
      )

      // add products to the list of products and wait for it to be mined
      await product.wait()

    });

    // test case 1 - check if the product was added
    it("Should add a product", async () => {
      const product = await dappazon.products(1);
      expect(product.id).to.equal(1);
      expect(product.name).to.equal("iPhone 12");
      expect(product.category).to.equal("Mobile Phone");
      expect(product.image).to.equal("url");
      expect(product.cost).to.equal(1);
      expect(product.rating).to.equal(4);
      expect(product.stock).to.equal(5);

      

    });

    

  });


});
