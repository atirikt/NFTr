const NftR = artifacts.require("./NftR.sol")

contract('NftR', function(accounts){
  var nftObj;

  it('deploya successfully', function(){
    return NftR.deployed().then(function(obj){
      nftObj = obj;
      return nftObj.address;
    }).then(function(address){
      console.log(address);
      assert.notEqual(address, null, "address ok");
      return nftObj.name();
    }).then(function(name){
      assert.equal(name, 'NftR');
      return nftObj.symbol();
    }).then(function(sym){
      assert.equal(sym, 'NftR');
    })
  })

  it('minting', function(){
    var string = "https://HttpIsCentralized.com";
    return NftR.deployed().then(function(obj){
      nftObj = obj;
      return nftObj.minter();
    }).then(function(minter){
      assert.equal(minter, nftObj.address,'minter ok');
      return nftObj.admin();
    }).then(function(admin){
      assert.equal(admin, accounts[0], 'admin ok');
      console.log(nftObj.address);
      return nftObj.setMinter(accounts[0], {from:admin});
    }).then(function(receipt){
      return nftObj.mint(string , accounts[1], {from: accounts[0]});
    }).then(function(receipt){
      //console.log(receipt.logs[0].args);
      assert.equal(receipt.logs.length, 1, 'log length ok');
      assert.equal(receipt.logs[0].event, 'Transfer', 'event ok');
      assert.equal(receipt.logs[0].args.to, accounts[1], 'receipt receiver ok');
      return nftObj.linkGenerated(string);
    }).then(function(ret){
      assert.equal(ret, true);
      return nftObj.totalSupply();
    }).then(function(supply){
      assert.equal(supply, 1, 'total supply ok');
      return nftObj.mintExtern(string , {from:accounts[1]});
    }).then(assert.fail).catch(async function(error){
      //console.log(error.message);
      assert(error.message.indexOf('revert')>=0,'same token revert ok');
      for(var i = 0; i <= nftObj.links.length; i++){
        let link = await nftObj.links(i);
        assert(link.indexOf('Http')>=0); 
      }
   })
  })
})