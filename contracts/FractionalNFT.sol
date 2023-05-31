// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing required OpenZeppelin contracts
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// FractionalRealEstate contract inherits from ERC721 and Ownable
contract FractionalRealEstate is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds; // Counter for token IDs
    uint256 public constant MAX_SUPPLY = 1000; // Maximum supply of tokens
    string private _tokenBaseURI;

    string private baseExtension = ".json";

    // Returns the total supply of tokens
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function tokenBaseURI() public view returns (string memory) {
    return _tokenBaseURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
    _tokenBaseURI = baseURI;
    }

    // Constructor to set the token name and symbol
    constructor() ERC721("FractionalRealEstate", "FRE") {}

    // Function to mint a new token with the given IPFS hash
    function mint() public payable {
        require(totalSupply() < MAX_SUPPLY, "Maximum supply reached");
        require(msg.value == 0.1 ether, "Incorrect price");

        _tokenIds.increment(); // Increment the token ID counter
        uint256 newTokenId = _tokenIds.current(); // Get the new token ID
        _mint(msg.sender, newTokenId); // Mint the new token
    }

    // Mapping to store IPFS hash for each token
    mapping (uint256 => string) private _tokenImages;

    // Function to return the token URI for a given token ID
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _tokenBaseURI;
        string memory tokenImageHash = _tokenImages[tokenId];
        return bytes(baseURI).length > 0
        ? string(abi.encodePacked(_tokenBaseURI, tokenImageHash, "/", Strings.toString(tokenId), baseExtension)): "";
    }

    // Function to withdraw the contract balance to the owner
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // Function to set the IPFS hash for all tokens
    function setTokenImages(
        string memory folderIPFSHash,
        uint256 tokenId) public onlyOwner {
        _tokenImages[tokenId] = folderIPFSHash;
    }

    // Function to distribute rent payments to token holders
    function payRent() public payable {
        uint256 totalTokens = totalSupply();
        require(totalTokens > 0, "No tokens have been minted yet");
        uint256 rentPerToken = msg.value / totalTokens;
        for (uint256 i = 1; i <= totalTokens; i++) {
            address tokenHolder = ownerOf(i);
            uint256 rentOwed = balanceOf(tokenHolder) * rentPerToken;
            payable(tokenHolder).transfer(rentOwed);
        }
    }
}
