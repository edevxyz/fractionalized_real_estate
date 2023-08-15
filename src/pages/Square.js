import React, { useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import "./Square.css";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "./ethers";

const Square = () => {
  const onButtonDefaultClick = useCallback(async () => {
    try {
      // Call the mint function 
      await mint();
    } catch (error) {
      console.error("Mint transaction failed", error);
    }
  }, []);

  async function connect() {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // Initialize your web3 or ethers.js provider here
    } else {
      console.log("No wallet");
    }
  }

 async function mint() {
    // Get the user's connected wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Call the mint function from the smart contract
    try {
      const mintTx = await contract.mint({ value: ethers.utils.parseEther("0.1") });
      await mintTx.wait();
      console.log("Mint transaction successful");
    } catch (error) {
      console.error("Mint transaction failed", error);
    }
  }

  return (
    <div className="square">
      <img className="qkacz5i7-4x-1-icon" alt="" src="/qkacz5i7-4x-1@2x.png" />
      <div className="fractional">Fractional</div>
      <div className="about">About</div>
      <div className="button-container">
        <Button
          className="buttondefault"
          variant="danger"
          name="Mint Button"
          size="lg"
          onClick={onButtonDefaultClick}
        >
          MINT
        </Button>
        <Button
        className="connect-wallet"
          variant="danger"
          onClick={connect}
          style={{ backgroundColor: '#dc3545', position: 'relative', zIndex: 1000 }}
        >
          Connect Wallet
        </Button>
      </div>
      <div className="faq">FAQ :</div>
      <iframe
        className="square-child"
        src="https://ipfs.io/ipfs/QmS6yjQq75XZMekMzrPzmKJVdcDhymDqCuFWENMznX2dYT"
      />
      <div className="real-estate-nfts">Real Estate NFTs</div>
    </div>
  );
};

export default Square;
