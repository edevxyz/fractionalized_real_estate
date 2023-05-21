//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FractionalRealEstate is ERC721, Ownable {
using Counters for Counters.Counter;
Counters.Counter private _tokenIds;
uint256 public constant MAX_SUPPLY = 1000;

function totalSupply() public view returns (uint256) {
    return _tokenIds.current();   
}

constructor() ERC721("FractionalRealEstate", "FRE") {}

function mint(string memory imageIPFSHash) public payable {
    require(totalSupply() < MAX_SUPPLY, "Maximum supply reached");
    require(msg.value == 0.1 ether, "Incorrect price");

    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _tokenImages[newTokenId] = imageIPFSHash; // Stored IPFS hash in _tokenImages mapping
    _mint(msg.sender, newTokenId);
}

mapping (uint256 => string) private _tokenImages; // Added mapping to store IPFS hash for each token

function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    string memory baseURI = "https://ipfs.io/ipfs/";
    string memory tokenImageHash = _tokenImages[tokenId];
    return string(abi.encodePacked(baseURI, tokenImageHash));
}

function withdraw() public onlyOwner {
    uint256 balance = address(this).balance;
    payable(owner()).transfer(balance);  
}
function setTokenImages(string memory folderIPFSHash) public onlyOwner {
    for (uint256 i = 1; i <= MAX_SUPPLY; i++) {
        _tokenImages[i] = folderIPFSHash;
    }
}

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
