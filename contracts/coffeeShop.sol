// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract coffeeShop{
    address payable  owner;

    constructor(){
        owner =payable(msg.sender);
    }

    struct Coffee {
        uint amt;
        address buyer;
        bool isPending;
    }

    Coffee[] orders;
    mapping (address => uint) indexing;

    
    event boughtCoffee(address buyer, uint amt, bool isPending );

    modifier onlyOwner {
        require(msg.sender == owner, "you are not allowed this action!");
        _;
    }

    //buy coffee with 10wei each
    function buyCoffee () public payable {
        require(msg.value >=10, "not enough funds to buy coffee!");
        uint amount = msg.value / 10 ;
        address buyer = msg.sender;
        
        emit boughtCoffee(buyer, amount, true);

        orders.push(Coffee(amount,buyer,true));
        
    }

    //deliver coffee to costumer
    function deliverCoffee(address costumer) public onlyOwner{
        uint idx = indexing[costumer];
        orders[idx].isPending = false;

        emit boughtCoffee(costumer, orders[idx].amt, false);
         
    }
    
    //get all orders
    function getAllOrders() public onlyOwner view returns(Coffee[] memory) {
        return orders;
    }

    function getOrderAmount(address addr) public onlyOwner view returns(uint ) {
        uint idx = indexing[addr];
        return orders[idx].amt;
    }

    function withdrawTips() public onlyOwner {
        bool res = owner.send(address(this).balance);
        require(res, "could not transfer funds!");
    }

    function getBalance() public onlyOwner view returns(uint){
        return address(this).balance;
    }

    function getStatus(address addr) public onlyOwner view returns(bool ) {
        uint idx = indexing[addr];
        return (!orders[idx].isPending);
    }
}