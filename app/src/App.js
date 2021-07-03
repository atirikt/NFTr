import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import NftR from './NftR.json'
class App extends Component{

  async componentDidMount(){
    await this.loadWeb3()
    await this.loadBlockChainData()
    window.ethereum.on('accountsChanged', (account)=>{
      this.setState({account:account})
      console.log(this.state.account)
    })
  }

  constructor(props){
    super(props);
    this.state = { 
    account: undefined,
    contract: null,
    totalSupply: 0,
    links: []
    };
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
    }else{
      window.alert('install metamask wallet')
    }
  }

  async loadBlockChainData(){
    const account = await window.ethereum.request({ method: 'eth_accounts' });
    this.setState({account: account})
    console.log(this.state.account)

    const networkId = await window.ethereum.request({method: 'net_version'})
    console.log(networkId)
    const networkData = NftR.networks[networkId]
    if(networkData){
      const abi = NftR.abi
      const address = networkData.address
      var contract = new window.web3.eth.Contract(abi, address)
      this.setState({contract})
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({totalSupply})
      console.log(totalSupply)
      for (var i = 0; i < totalSupply; i++){
        const link = await contract.methods.links(i).call()
        console.log(link);
        this.setState({
          links: [...this.state.links, link]
        })
      }
      console.log(contract)
    }else{
      window.alert('smart contract not deployed on the network')
    }
  }

  mint = async (link) => {
    console.log(link);
    var ret = await this.state.contract.methods.linkGenerated(link).call();
    console.log(ret);
    if(ret == false){
      this.state.contract.methods.mintExtern(link).send({from:this.state.account.toString()}).once('receipt', (receipt)=>{
      this.setState({
        links:[...this.state.links, link]
      })
    })
    }else{
      window.alert('link taken');
    }
  }

  render(){
    return (
      <header>hello NFTs
      <p>account goes here = {this.state.account}</p>
    <div>
    tokens go here:
    {this.state.links.map((link, key)=>{
      return (link);
    })}
    </div>
    <form onSubmit = {(event)=>{
      event.preventDefault()
      const link = this.link.value
      this.mint(link)
    }}>
    <input className="mintinput" type="text" placeholder="link" ref={(input)=>{this.link = input}}></input>
    <input type="submit" className="btnNft" value="mint"></input>
    </form>
      </header>
      )
  }

}


export default App;
