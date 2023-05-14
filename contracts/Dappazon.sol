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

    // q: what is constructor?
    // a: constructor is a function that is called when the contract is created
    constructor() {
        name = "Dappazon";

        // set the owner of the contract
        owner = msg.sender;
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
    ) public {
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
    }
}
