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
    })
  })
})