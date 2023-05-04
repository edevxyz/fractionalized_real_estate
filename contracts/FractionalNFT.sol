//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FractionalRealEstate is ERC721, Ownable {
using Counters for Counters.Counter;
Counters.Counter private _tokenIds;
uint256 public constant MAX_SUPPLY = 1000;
uint256 public constant MINT_PRICE = 0.1 ether;
mapping (uint256 => string) private _tokenImages; // Added mapping to store IPFS hash for each token

constructor() ERC721("FractionalRealEstate", "FRE") {}

}

function mint(string memory imageIPFSHash) public payable {
    require(totalSupply() < MAX_SUPPLY, "Maximum supply reached");
    require(msg.value == MINT_PRICE, "Incorrect price");

    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _tokenImages[newTokenId] = imageIPFSHash; // Stored IPFS hash in _tokenImages mapping
    _mint(msg.sender, newTokenId);
}

function tokenURI(uint256 tokenId) public view override returns (string memory) {
require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

string memory baseURI = "https://ipfs.io/ipfs/";  
return string(abi.encodePacked(baseURI, _tokenImages[tokenId]));   

}
