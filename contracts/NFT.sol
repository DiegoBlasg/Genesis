// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFT is ERC721, Ownable, ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 MINT_PRICE = 10 ether;
    string[4] colors = ["azul", "verde", "rosa", "marron"];
    string[11] numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    string[6] backgroundStrings = ["1", "2", "3", "4", "5", "6"];

    struct token {
        string name;
        uint256 breeding;
        string color;
        uint256 number;
        uint256 purity;
        uint256 background;
        uint256 timeToClaim;
    }

    mapping(uint256 => token) tokenInfo;
    mapping(uint256 => uint256) tokenMinPurity;
    uint256 actualTokenNumber = 0;

    constructor() ERC721("MyToken", "MTK") {}

    function breed(uint256 _idToken1, uint256 _idToken2) public {
        require(_idToken1 != _idToken2, "NFTs are the same");
        require(ownerOf(_idToken1) == msg.sender, "The token is not yours");
        require(ownerOf(_idToken2) == msg.sender, "The token is not yours");
        require(
            (keccak256(abi.encodePacked(tokenInfo[_idToken1].color))) ==
                (keccak256(abi.encodePacked(tokenInfo[_idToken2].color))),
            "The tokens are not the same color"
        );
        require(
            tokenInfo[_idToken1].breeding > 0,
            "this NFT has no more breeding opportunities"
        );
        require(
            tokenInfo[_idToken2].breeding > 0,
            "this NFT has no more breeding opportunities"
        );
        require(
            (keccak256(abi.encodePacked(tokenInfo[_idToken1].name))) !=
                (keccak256(abi.encodePacked("InProcess"))),
            "NFT is not ready"
        );
        require(
            (keccak256(abi.encodePacked(tokenInfo[_idToken2].name))) !=
                (keccak256(abi.encodePacked("InProcess"))),
            "NFT is not ready"
        );
        tokenInfo[_idToken1].breeding = tokenInfo[_idToken1].breeding - 1;
        tokenInfo[_idToken2].breeding = tokenInfo[_idToken2].breeding - 1;
        internalSafeMint(
            msg.sender,
            tokenInfo[_idToken1].purity,
            tokenInfo[_idToken2].purity
        );
    }

    function claimNFT(uint256 _tokenId) public {
        require(
            tokenInfo[_tokenId].timeToClaim < block.timestamp,
            "NFT is not ready"
        );
        tokenInfo[_tokenId].name = string(
            abi.encodePacked(
                "f",
                backgroundStrings[tokenInfo[_tokenId].background],
                "per",
                tokenInfo[_tokenId].color,
                "pur",
                numbers[tokenInfo[_tokenId].purity / 100],
                numbers[tokenInfo[_tokenId].purity / 10],
                numbers[
                    tokenInfo[_tokenId].purity -
                        ((uint256(tokenInfo[_tokenId].purity / 10)) * 10)
                ]
            )
        );
    }

    function internalSafeMint(
        address to,
        uint256 purityToken1,
        uint256 purityToken2
    ) internal {
        //require(msg.value >= MINT_PRICE, "Not enough ether sent.");
        uint256 randomMin = (purityToken1 + purityToken2) / 2;
        uint256 tokenId = _tokenIdCounter.current();
        uint256 purity = random(randomMin, randomMin + 11);
        uint256 background = random(0, 6);
        string memory color = colors[random(0, 4)];
        string memory name = "InProcess";
        uint256 timeToClaim = block.timestamp + 2 minutes;

        tokenMinPurity[tokenId] = randomMin;
        tokenInfo[tokenId].timeToClaim = timeToClaim;
        tokenInfo[tokenId].name = name;
        tokenInfo[tokenId].breeding = 4;
        tokenInfo[tokenId].purity = purity;
        tokenInfo[tokenId].color = color;
        tokenInfo[tokenId].background = background;
        actualTokenNumber = actualTokenNumber + 1;
        tokenInfo[tokenId].number = actualTokenNumber;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function getTokenName(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        return tokenInfo[_tokenId].name;
    }

    function getMinPurity(uint256 _tokenId) public view returns (uint256) {
        return tokenMinPurity[_tokenId];
    }

    function getTokenBackground(uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        require(
            tokenInfo[_tokenId].timeToClaim < block.timestamp,
            "NFT is not ready"
        );
        return tokenInfo[_tokenId].background;
    }

    function getTokenBreeding(uint256 _tokenId) public view returns (uint256) {
        return tokenInfo[_tokenId].breeding;
    }

    function getTokenColor(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        require(
            tokenInfo[_tokenId].timeToClaim < block.timestamp,
            "NFT is not ready"
        );
        return tokenInfo[_tokenId].color;
    }

    function getTokenNumber(uint256 _tokenId) public view returns (uint256) {
        require(
            tokenInfo[_tokenId].timeToClaim < block.timestamp,
            "NFT is not ready"
        );
        return tokenInfo[_tokenId].number;
    }

    function getTokenPurity(uint256 _tokenId) public view returns (uint256) {
        require(
            tokenInfo[_tokenId].timeToClaim < block.timestamp,
            "NFT is not ready"
        );
        return tokenInfo[_tokenId].purity;
    }

    function getTokenTimeToClaim(uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        return tokenInfo[_tokenId].timeToClaim;
    }

    function random(uint256 _numberMin, uint256 _numberMax)
        internal
        view
        returns (uint256)
    {
        uint256 rodom = (uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.difficulty, msg.sender)
            )
        ) % (_numberMax - _numberMin));
        return rodom + _numberMin;
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://gateway.pinata.cloud/ipfs/Qmbnrpdrm1McB4o19LR9BR7ZdMkTfzoajRMgUzqKvYNdby/";
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "Balance is zero");
        payable(owner()).transfer(address(this).balance);
    }

    function safeMint(address to) public {
        //require(msg.value >= MINT_PRICE, "Not enough ether sent.");
        uint256 tokenId = _tokenIdCounter.current();
        uint256 purity = random(1, 11);
        uint256 background = random(0, 6);
        string memory color = colors[random(0, 4)];
        string memory name = string(
            abi.encodePacked(
                "f",
                backgroundStrings[background],
                "per",
                color,
                "pur",
                numbers[purity / 100],
                numbers[purity / 10],
                numbers[purity - ((uint256(purity / 10)) * 10)]
            )
        );
        tokenInfo[tokenId].name = name;
        tokenInfo[tokenId].breeding = 4;
        tokenInfo[tokenId].purity = purity;
        tokenInfo[tokenId].color = color;
        tokenInfo[tokenId].background = background;
        actualTokenNumber = actualTokenNumber + 1;
        tokenInfo[tokenId].number = actualTokenNumber;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function multipleburn(uint256[] memory _ids) public {
        for (uint256 i = 0; i < _ids.length; i++) {
            _burn(_ids[i] - 1);
        }
    }

    function simpleburn(uint256 _id) public {
        _burn(_id - 1);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        string memory baseURI = _baseURI();
        return
            string(abi.encodePacked(baseURI, tokenInfo[tokenId].name, ".png"));
    }

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
}
