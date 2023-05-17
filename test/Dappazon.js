const { expect } = require("chai");

// q: what is tokens do?

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether"); // 
};

const id = 1
const name = "iPhone 12"    // name
const category = "Mobile Phone" // category
const image = "https://gateway.ipfs.io/ipfs/QmPPFpFhdJSB4T6pn3vKinsDMgJeiqQ3JTDoLarvBsug3w/product-5.jpg"          // image      
const cost = tokens(1)              // cost
const rating = 4              // rating
const stock = 5               // stock

describe("Dappazon", () => {
  // declare variables
  let dappazon
  let owner
  let buyer



  // run before each test
  beforeEach(async () => {
    // Setup Accounts
    [owner, buyer] = await ethers.getSigners();
    console.log("owner address: ", owner.address);
    console.log("owner value: ", ethers.utils.formatEther(await owner.getBalance()));
    console.log("buyer address: ", buyer.address);
    console.log("buyer value: ", ethers.utils.formatEther(await buyer.getBalance()));

    // get the contract factory
    const Dappazon = await ethers.getContractFactory("Dappazon");

    // deploy the contract and wait for it to be mined
    dappazon = await Dappazon.deploy();

    // smart contract address
    console.log("dappazon address: ", dappazon.address);
    // smart contract balance
    ethers.provider.getBalance(dappazon.address).then(balance => {
      console.log("dappazon balance: ", ethers.utils.formatEther(balance));
    });
    // show gas fee
    ethers.provider.getGasPrice().then(gasPrice => {
      console.log("Gas price: ", ethers.utils.formatEther(gasPrice));
    });

  });


  // test cases
  describe("Deployment", async () => {
    // test case 1 - check if the contract name is correct
    it("Should set the right name when deploy", async () => {
      const name = await dappazon.name();
      expect(name).to.equal(name);
    });

    // test case 2 - check if the deployer is the owner
    it("Should set the right owner when deploy", async () => {
      const ownerAddress = await dappazon.owner();
      expect(ownerAddress).to.equal(owner.address);
    });

  });

  describe("Owner Add Products", async () => {
    // list of products
    let result
    let productCount

    // run before each test
    beforeEach(async () => {
      let product

      // add products
      product = await dappazon.connect(owner).addProduct(
        id,
        name,
        category,
        image,         // image      
        cost,              // cost
        rating,              // rating
        stock               // stock
      )

      // add products to the list of products and wait for it to be mined
      await product.wait()

    });

    // test case 1 - check if the product was added
    it("Should list the added a product correctly", async () => {
      const product = await dappazon.products(1);   // get the product

      expect(product.id).to.equal(id);
      expect(product.name).to.equal(name);
      expect(product.category).to.equal(category);
      expect(product.image).to.equal(image);
      expect(product.cost).to.equal(cost);
      expect(product.rating).to.equal(rating);
      expect(product.stock).to.equal(stock);
    });

    // test case 2 - check if the product was listed correctly by event emitted
    it("Should list a product with event emitted", async () => {
      const product = await dappazon.products(1);   // get the product
      expect(product).to.emit(dappazon, "ListProduct")
    });
  });

  describe("Buy Products", async () => {
    // list of products
    let result
    let productCount

    // run before each test
    beforeEach(async () => {
      let product

      // add products
      product = await dappazon.connect(owner).addProduct(
        id,
        name,
        category,
        image,         // image      
        cost,              // cost
        rating,              // rating
        stock               // stock
      )

      // add products to the list of products and wait for it to be mined
      await product.wait()

      // buy the product
      result = await dappazon.connect(buyer).buyProduct(id, 1, { value: cost });
      
      // get the product count


    });

    // test case 1 - check stock decrease
    it("stock should decrease", async () => {

      // get the product
      const product = await dappazon.products(1);
      expect(product.stock).to.equal(4);
    });

    // test case 2 - check balance of buyer decrease
    it("buyer balance should decrease", async () => {

      // get the product
      const balance = await ethers.provider.getBalance(buyer.address);

      // expect the balance to be less than the original balance
      expect(balance).to.be.lessThan(tokens(10000));
    });

    // test case 3 - check order count of buyer increase
    it("buyer order count should increase", async () => {
     

      // get the product
      const orderCount = await dappazon.orderCount(buyer.address);

      // expect the order count to be 1
      expect(orderCount).to.equal(1);
    });

    // test case 4 - check name of the product
    it("product name should be correct", async () => {
      // get the product order
      const order = await dappazon.orders(buyer.address, 1)

      // expect the name to be correct
      expect(order.product.name).to.equal(name);
    } );
  });
});
