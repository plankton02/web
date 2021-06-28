import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import contractAbi from './Tokens/abi'; //nft
import React, { Component } from 'react';
import ConnectBtn from './Components/ConnectBtn';
import LockToken from './Components/LockToken';
import UnlockToken from './Components/UnlockToken';
import Web3Modal from "web3modal";

//import ConnectButton from "./Components/ConnectButton";


class App extends Component {

  constructor(props) {
    super(props);

    this.bChainId = '0x61';
    this.bNetworkId = 97;

    this.state = {
      isConnected: false,
      isLocked: false,
      contractInstance: null,
      account: null,
      isLoading: false,
      chainId: 0, //bsc testnet
      networkId: '0', //bsc testnet
      contractAddress: '0xa4a8d3E5A436EE537c83f83c9b70E91242e7a8D7',
      isLoading: false
    };

    const providerOptions = {
    };

    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    this.connectMetamask = this.connectMetamask.bind(this);
    this.lockToken = this.lockToken.bind(this);
    this.unlockToken = this.unlockToken.bind(this);
    this.isTokenLocked = this.isTokenLocked.bind(this);

  }

  componentDidMount(){
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  componentDidUpdate(){
  }

  async onConnect () {
    // get metamask provider
    this.web3Modal.connect().then((res) => {
      if (window.ethereum){
        this.provider = window.ethereum;
      } else if (window.web3){
        this.provider = window.web3.currentProvider
      } else {
        this.provider = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      
      this.subscribeProvider();

      // creste web3 with current provider
      this.web3 = new Web3(this.provider);

      // retreive account info
      this.web3.eth.getAccounts().then((res) => {

        // create contract instance
        const contract = new this.web3.eth.Contract(contractAbi, this.state.contractAddress);
        
        // get network chain and check token status
        this.getChain();

        this.setState({
          account: res[0],
          contractInstance: contract,
          isConnected: true
        });

      }).catch((err) => {
        console.log("err getAccount: " + err);  
      });
    }).catch((err) => {
      console.log("err web3Modal.connect: " + err);
    });
}

  async getChain(){
    const chainId =  await this.web3.eth.getChainId();
    const networkId =  await this.web3.eth.net.getId();
    await this.setState({chainId: chainId, networkId: networkId});
    this.isTokenLocked();
  }

  isTokenLocked() {
    if(this.checkNetworkChain()){
      this.setState({isLoading: true});
      this.state.contractInstance.methods.isLocked().call({
        from: this.state.account,
      }).then((receipt) => {
        console.log("isTokenLocked receipt:")
        console.log(receipt);
        this.setState({
          isLocked: receipt,
          isLoading: false
        });
      }).catch((err) => {
        console.log("isTokenLocked err: ");
        console.log(err);
        this.setState({isLoading: false});
      });
    }
  }

  lockToken() {
    if(this.checkNetworkChain()){
      console.log('locktoken')
      this.setState({isLoading: true});
      this.state.contractInstance.methods.lock().send({
      from: this.state.account,
      }).then((receipt) => {
        console.log("lockToken receipt: ");
        console.log(receipt);
        this.setState({
          isLocked: true,
          isLoading: false
        });
        this.state.setState({isLoading: false});
      }).catch((err) => {
        this.setState({isLoading: false});
        console.log("lockToken err: ");
        console.log(err);
      });
    }
  }

  unlockToken() {
    if(this.checkNetworkChain()){
        this.setState({isLoading: true});
        this.state.contractInstance.methods.unlock().send({
        from: this.state.account,
      }).then((receipt) => {
        this.setState({
          isLocked: false,
          isLoading: false
        });
        console.log("unlockToken receipt: ");
        console.log(receipt);
      }).catch((err) => {
        this.setState({isLoading: false});
        console.log("unlockToken err: ");
        console.log(err);
      });
    }
  }

  connectMetamask() {
    this.onConnect();
  }

  async subscribeProvider () {
    if (!this.provider.on) {
      return;
    }

    this.provider.on("accountsChanged", async (accounts) => {
      await this.setState({ account: accounts[0] });
    });

    this.provider.on("chainChanged", async (chainId) => {
      const networkId = await this.web3.eth.net.getId();
      await this.setState({ chainId, networkId });
    });

    // this.provider.on("networkChanged", async (networkId) => {
    //   const chainId = await this.web3.eth.getChainId();
    //   await this.setState({ chainId, networkId });
    // });
  }

  async checkNetworkChain(){
    console.log("cnetworkId: " + this.bNetworkId + "  snetworkId: " + this.state.networkId +"  cchainId: " + this.bChainId  + "  schainId: " + this.state.chainId);
    if(!((this.state.chainId === this.bNetworkId) || (this.state.networkId === this.bNetworkId))){
      alert("Please connect to BSC Chain!");
      return false;
    }
    console.log("network true")
    return true;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.isLoading && 
            <div className="backdrop">
              <div id="loader"></div>
            </div>
          }
          <div> Text: {this.state.isLocked?<div>Lock</div>:<div>Not Lock</div>}<br></br></div>
          {!this.state.isConnected ? <ConnectBtn 
            connectMetamask={this.connectMetamask}/>
          : <div>
              Logged as <br />
              {this.state.account}
            </div>
          }
          
          {
            !this.state.isLocked 
            ?  <LockToken 
                lockToken={this.lockToken}/>
            : <UnlockToken 
                unlockToken={this.unlockToken}/> 
          }
            <br></br>
            <button onClick={() => this.isTokenLocked() } className="button is-outlined is-small is-danger">
              Check Token
            </button>
        </header>
      </div>
    );
  }
}

export default App;
