import { Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import {
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
} from "../constants";
import styles from "../styles/Home.module.css";
import truncateEthAddress from "truncate-eth-address";
import Timer from "./timer";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isOwnerAddress, setIsOwnerAddress] = useState("");
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const [isMaximum, setIsMaximum] = useState(0);

  const web3ModalRef = useRef();

  const presaleMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const presaleContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      const tx = await presaleContract.presaleMint({
        value: utils.parseEther("0.01"),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("You successfully minted a Panda NFT");
    } catch (err) {
      console.error(err);
    }
  };
  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const presaleContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      const tx = await presaleContract.mint({
        value: utils.parseEther("0.01"),
      });
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      window.alert("You successfully minted a Pandas");
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const startPresale = async (owner) => {
    try {
      const signer = await getProviderOrSigner(true);

      const presaleContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      const tx = await presaleContract.startPresale();
      setLoading(true);

      await tx.wait();
      setLoading(false);
      // set the presale started to true
      await checkIfPresaleStarted();
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );

      const _presaleStarted = await nftContract.presaleStarted();
      if (!_presaleStarted) {
        await getOwner();
      }
      setPresaleStarted(_presaleStarted);
      return _presaleStarted;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const checkIfPresaleEnded = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );
      const _presaleEnded = await nftContract.presaleEnded();

      const hasEnded = _presaleEnded.lt(Math.floor(Date.now() / 1000));
      if (hasEnded) {
        setPresaleEnded(true);
      } else {
        setPresaleEnded(false);
      }
      return hasEnded;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getOwner = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );

      const _owner = await nftContract.owner();

      const signer = await getProviderOrSigner(true);

      const address = await signer.getAddress();

      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwnerAddress(address);
        console.log(address);
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getReveal = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      const reveal = await nftContract.reveal();
      console.log("Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const getTokenIdsMinted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );

      const _tokenIds = await nftContract.totalSupply();

      setTokenIdsMinted(_tokenIds.toString());
    } catch (err) {
      console.error(err);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Rinkeby network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();

      const _presaleStarted = checkIfPresaleStarted();
      if (_presaleStarted) {
        checkIfPresaleEnded();
      }

      getTokenIdsMinted();
      // getMaximum();

      const presaleEndedInterval = setInterval(async function () {
        const _presaleStarted = await checkIfPresaleStarted();
        if (_presaleStarted) {
          const _presaleEnded = await checkIfPresaleEnded();
          if (_presaleEnded) {
            clearInterval(presaleEndedInterval);
          }
        }
      }, 5 * 1000);

      setInterval(async function () {
        await getTokenIdsMinted();
      }, 5 * 1000);
    }
  }, [walletConnected]);

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    // if (isOwner && !presaleStarted) {
    //   return (
    //     <button className={styles.button} onClick={startPresale}>
    //       Start Presale!
    //     </button>
    //   );
    // }

    // If connected user is not the owner but presale hasn't started yet, tell them that
    if (!presaleStarted) {
      return (
        <div>
          <div className={styles.description}>Presale has not started!</div>
        </div>
      );
    }

    // If presale started, but hasn't ended yet, allow for minting during the presale period
    if (presaleStarted && !presaleEnded) {
      // const getDetails = async () => {
      //   try {
      //     const signer = await getProviderOrSigner(true);
      //     const details = new Contract(
      //       PRESALE_CONTRACT_ADDRESS,
      //       PRESALE_CONTRACT_ABI,
      //       signer
      //     );
      //     const reveal = await details.presaleAddresses(msg.sender);

      //     console.log("Successfully");
      //   } catch (err) {
      //     console.error(err);
      //   }
      // };
      return (
        <div>
          <div className={styles.description}>Presale has started</div>
          <button className={styles.button} onClick={presaleMint}>
            Presale Mint
          </button>
        </div>
      );
    }

    // If presale started and has ended, its time for public minting
    if (presaleStarted && presaleEnded) {
      return (
        <button className={styles.button} onClick={publicMint}>
          Public Mint
        </button>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>Pandas</title>
        <meta name="description" content="Presale-Dapp" />
      </Head>

      <div className={styles.main}>
        <div className="flex flex-col">
          {isOwner ? (
            <button className={styles.button} onClick={startPresale}>
              Start Presale!
            </button>
          ) : (
            <button className={styles.button}>Presale Ended</button>
          )}
          <button className={styles.button} onClick={getOwner}>
            Get Owner
          </button>
          {isOwner && (
            <button className={styles.button} onClick={getReveal}>
              Reveal
            </button>
          )}
          {isOwner && <h1>Owner is :{truncateEthAddress(isOwnerAddress)}</h1>}
        </div>
        <div>
          <h1 className={styles.title}>Welcome to NFT Pandas</h1>
          <div className={styles.description}>
            Its an NFT collection for Pandas
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/1000 have been minted
          </div>
          {renderButton()}
        </div>
      </div>
    </div>
  );
}
