import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';

class App extends Component{

  async componentDidMount(){
    await this.loadWeb3()
    await this.loadBlockChainData()
    window.ethereum.on('accountsChanged', function (accounts) {
      console.log(accounts);
    })
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
    }else{
      window.alert('install metamask wallet')
    }
  }

  async loadBlockChainData(){
    this.accounts = await window.ethereum.request({ method: 'eth_accounts' });
    console.log(this.accounts)
  }


  
  render(){
    return (
      <header>hello NFTs</header>
      )
  }

}


export default App;
