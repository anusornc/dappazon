// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    // name of the contract
    string public name;

    // owner of the contract
    address public owner;

    struct Product {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    // mapping of product id to product
    mapping(uint256 => Product) public products;

    // events ListProduct
    event ListProduct(
        string name,
        uint256 cost,
        uint256 quantity
    );

    // q: what is constructor?
    // a: constructor is a function that is called when the contract is created
    constructor() {
        name = "Dappazon";

        // set the owner of the contract
        owner = msg.sender;
    }

    // modifier to check if the caller is the owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // add product to the Blockchain
    function addProduct(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public  {
        // check if the product with the given id already exists
        require(
            products[_id].id != _id,
            "Product with the given id already exists"
        );

        // create a new product
        Product memory newProduct = Product(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );

        // add the product to the mapping of products
        products[_id] = newProduct;

        // emit the event ListProduct
        emit ListProduct(_name, _cost, _stock);
    }

    // buy product from the Blockchain
    function buyProduct(uint256 _id, uint256 _quantity) public payable {
        // check if the product with the given id exists
        require(
            products[_id].id == _id,
            "Product with the given id does not exist"
        );

        // check if the product is in stock
        require(
            products[_id].stock >= _quantity,
            "Product is out of stock"
        );

        // check if the caller has enough ether to buy the product
        require(
            msg.sender.balance >= products[_id].cost * _quantity,
           
            "Caller does not have enough ether to buy the product"
        );

        // reduce the stock of the product
        products[_id].stock -= _quantity;
    }
}
