pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NftR is ERC721 {

  address public minter;
  address payable public admin;
  string[] public links;
  mapping(string=>bool) public linkGenerated;
  uint256 public totalSupply = 0;

  constructor() ERC721("NftR", "NftR") public {
    admin = payable(msg.sender);
    minter = address(this);
  }

  function setMinter(address _minter) public{
    require(msg.sender == admin, 'address not admin');
    minter = _minter;
  }

  function mint(string memory _link, address _to) public {
    require(msg.sender == minter, 'address not minter');
    require(linkGenerated[_link] == false, 'link taken');
    links.push(_link);
    uint256 _id = links.length;
    _safeMint(_to, _id);
    linkGenerated[_link] = true;
    totalSupply++;
  }

  function mintExtern(string memory _link) public{
    mint(_link, msg.sender);
  }
}