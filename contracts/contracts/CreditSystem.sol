// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CreditSystem {
    struct User {
        uint256 credits;  // carbon credits balance
        bool registered;
    }

    mapping(address => User) public users;

    event Registered(address user);
    event CreditsAdded(address user, uint256 amount);
    event CreditsTransferred(address from, address to, uint256 amount);

    // Register new user
    function registerUser() public {
        require(!users[msg.sender].registered, "Already registered");
        users[msg.sender] = User(0, true);
        emit Registered(msg.sender);
    }

    // Add credits to user (e.g., for producing green hydrogen)
    function addCredits(address user, uint256 amount) public {
        require(users[user].registered, "User not registered");
        users[user].credits += amount;
        emit CreditsAdded(user, amount);
    }

    // Transfer credits between users
    function transferCredits(address to, uint256 amount) public {
        require(users[msg.sender].registered, "You must register first");
        require(users[to].registered, "Recipient not registered");
        require(users[msg.sender].credits >= amount, "Insufficient credits");

        users[msg.sender].credits -= amount;
        users[to].credits += amount;

        emit CreditsTransferred(msg.sender, to, amount);
    }

    // Get user credits
    function getCredits(address user) public view returns (uint256) {
        return users[user].credits;
    }
}