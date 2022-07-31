import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { PRESALE_CONTRACT_ADDRESS, PRESALE_CONTRACT_ABI } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);

  const [joinedWhitelist, setJoinedWhitelist] = useState(false);

  const [loading, setLoading] = useState(false);

  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [maxAddressed, setMaxAddressed] = useState(0);

  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

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

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const whitelistContract = new Contract(
        PRESALE_CONTRACT_ADDRESS,
        PRESALE_CONTRACT_ABI,
        signer
      );

      const tx = await whitelistContract.addAddress();
      setLoading(true);

      await tx.wait();
      setLoading(false);

      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const whitelistContract = new Contract(
        PRESALE_CONTRACT_ADDRESS,
        PRESALE_CONTRACT_ABI,
        provider
      );

      const _numberOfWhitelisted = await whitelistContract.countAddr();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        PRESALE_CONTRACT_ADDRESS,
        PRESALE_CONTRACT_ABI,
        signer
      );

      const address = await signer.getAddress();

      const _joinedWhitelist = await whitelistContract.presaleAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  const maxAddress = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        PRESALE_CONTRACT_ADDRESS,
        PRESALE_CONTRACT_ABI,
        provider
      );
      const _maxPresaleAddr = await whitelistContract.maxPresaleAddr();
      setMaxAddressed(_maxPresaleAddr);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            You are already a member.Thanks for joining the Panda Presale!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Presale
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      maxAddress();
    }
  }, [walletConnected]);

  return (
    <div>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Pandas PreSale Register</h1>
          <div className={styles.description}>
            Its an NFT collection for pandas in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted}/{maxAddressed} have already joined the
            Whitelist
          </div>
          {renderButton()}
        </div>
      </div>
    </div>
  );
}
