// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721, ERC721Enumerable, Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 MINT_PRICE = 10 ether;
    string[4] colors = ["azul", "verde", "rosa", "marron"];
    string[11] numbers = [
        "000",
        "001",
        "002",
        "003",
        "004",
        "005",
        "006",
        "007",
        "008",
        "009",
        "010"
    ];
    string[4] backgroundStrings = ["1", "2", "3", "4"];

    mapping(uint256 => string) tokenName;
    mapping(uint256 => uint256) tokenBreeding;

    constructor() ERC721("MyToken", "MTK") {}

    function getTokenName(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        return tokenName[_tokenId];
    }

    function random(uint256 number) public view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender
                    )
                )
            ) % number;
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://gateway.pinata.cloud/ipfs/QmepZyq6fCvqiadx173ZGfXBnnmYJDtefLN27ZPZhPfqCL/";
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "Balance is zero");
        payable(owner()).transfer(address(this).balance);
    }

    function safeMint(address to) public payable {
        require(msg.value >= MINT_PRICE, "Not enough ether sent.");
        uint256 tokenId = _tokenIdCounter.current();
        uint256 purity = random(11);
        uint256 background = random(6) + 1;
        string memory color = colors[random(4) + 1];
        string memory name = string(
            abi.encodePacked(
                "f",
                backgroundStrings[background],
                "per",
                color,
                "pur",
                numbers[purity]
            )
        );
        tokenName[tokenId] = name;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        string memory baseURI = _baseURI();
        return string(abi.encodePacked(baseURI, tokenName[tokenId], ".json"));
    }
}
