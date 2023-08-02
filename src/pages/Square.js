import { useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import "./Square.css";
import { ethers } from './ethers';

const Square = ({onMint}) => {
  const onButtonDefaultClick = useCallback(async() => {
   try {
      // Call the onMint function passed as a prop
      await onMint();
    } catch (error) {
      console.error('Mint transaction failed', error);
    }  
  }, [onMint]);

  return (
    <div className="square">
      <img className="qkacz5i7-4x-1-icon" alt="" src="/qkacz5i7-4x-1@2x.png" />
      <div className="fractional">Fractional</div>
      <div className="about">About</div>
      <Button
        className="buttondefault"
        variant="danger"
        name="Mint Button"
        size="lg"
        onClick={onButtonDefaultClick}
      >
        MINT
      </Button>
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
