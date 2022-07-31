// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../Register.sol";

contract NFTS is ERC721Enumerable, Ownable {
    using Strings for uint256;
    Register presale;
    //Variables
    string baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.001 ether;
    bool public paused = false;
    uint256 public maxSupply = 1000;
    uint256 public supply;
    uint256 public tokenIds;
    bool public revealed = false;
    string public notRevealedUri;
    bool public presaleStarted;
    uint256 public presaleEnded;

    modifier onlyWhenNotPaused() {
        require(!paused, "Contract is Paused by owner");
        _;
    }

    constructor(
        string memory _BaseURI,
        string memory _NotRevealedUri,
        address presaleContract
    ) ERC721("Pandas", "PA") {
        setBaseURI(_BaseURI);
        setNotRevealedURI(_NotRevealedUri);
        presale = Register(presaleContract);
    }

    function startPresale() public onlyOwner {
        presaleStarted = true;
        presaleEnded = block.timestamp + 1 minutes;
    }

    function presaleMint() public payable onlyWhenNotPaused {
        require(
            presaleStarted && block.timestamp < presaleEnded,
            "Presale is not started"
        );
        require(presale.presaleAddresses(msg.sender), "You are not Registered");
        require(tokenIds < maxSupply, "No NFT to mint");
        require(msg.value >= cost, "Amount is greater than the Cost");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    function mint() public payable onlyWhenNotPaused {
        supply = totalSupply();
        require(
            presaleStarted && block.timestamp >= presaleEnded,
            "Presale has not ended "
        );
        require(tokenIds < maxSupply, "No NFT to mint");
        require(msg.value >= cost, "Amount is greater than the Cost");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "URI is not present");

        if (revealed == false) {
            return notRevealedUri;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    //owner only access
    function reveal() public onlyOwner {
        revealed = true;
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        tokenIds = _newmaxMintAmount;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}

// NFT Contract Address: 0x2E1b8f5ee108beA98Ea33E4524506878472A79B7
