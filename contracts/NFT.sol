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

    uint256 TX_PRICE = 0.2 ether;
    string[4] colors = ["azul", "verde", "rosa", "marron"];
    string[10] numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
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

    struct challenge {
        string title;
        string subtitle;
        uint8 totalTimes;
    }

    struct individualChallenge {
        bool complete;
        uint8 times;
    }

    mapping(uint8 => challenge) challenges;
    mapping(address => mapping(uint8 => individualChallenge)) completeChallengesByAddres;

    mapping(address => uint256) winningAddresses;
    uint256 winners = 0;

    mapping(address => uint256) playersAddresses;
    uint256 players = 0;

    /* CHALLENGES
1: Craft
Usa la opcion de craft en el apartado craft 10 veces

2: Mint
Usa la opcion de mint en el apartado inventario 5 veces

3: Breed
Usa la opcion de breed en el apartado breed 25 veces

4: Claim
Usa la opcion de claim en el apartado inventario 25 veces

5: Zero Breed
Deja un nft sin posivilidad de breedear

6: 40 NFTs
Consigue 40 nfts

7: Purity 100
Hacer claim y obtener un nft de 100 de pureza
*/
    constructor() ERC721("MyToken", "MTK") {
        challenges[1].totalTimes = 10;

        challenges[2].totalTimes = 5;

        challenges[3].totalTimes = 25;

        challenges[4].totalTimes = 25;

        challenges[5].totalTimes = 1;

        challenges[6].totalTimes = 40;

        challenges[7].totalTimes = 1;
    }

    function ChallengeAddOneTime(address _address, uint8 _challenge) internal {
        if (
            completeChallengesByAddres[_address][_challenge].complete == false
        ) {
            completeChallengesByAddres[_address][_challenge].times++;
            if (
                completeChallengesByAddres[_address][_challenge].times >=
                challenges[_challenge].totalTimes
            ) {
                completeChallengesByAddres[_address][_challenge]
                    .complete = true;
                if (checkChallenges(_address)) {
                    winners++;
                    winningAddresses[_address] = winners;
                }
            }
        }
    }

    function viewChallengesByAddress(address _address)
        public
        view
        returns (uint8[7] memory)
    {
        uint8[7] memory array = [1, 2, 3, 4, 5, 6, 7];
        for (uint8 i = 1; i <= 7; i++) {
            array[i - 1] = completeChallengesByAddres[_address][i].times;
        }
        return array;
    }

    function checkChallenges(address _address) public view returns (bool) {
        for (uint8 i = 1; i <= 7; i++) {
            if (completeChallengesByAddres[_address][i].complete != true) {
                return false;
            }
        }
        return true;
    }

    //------------
    function safeMint(address to) public payable {
        require(msg.value >= TX_PRICE, "Not enough ether sent.");
        uint256 tokenId = _tokenIdCounter.current();
        uint256 purity = random(1, 10);
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
        ChallengeAddOneTime(msg.sender, 2);
        ChallengeAddOneTime(msg.sender, 6);
        _safeMint(to, tokenId);
    }

    function breed(uint256 _idToken1, uint256 _idToken2) public payable {
        require(msg.value >= TX_PRICE, "Not enough ether sent.");
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
        if (
            tokenInfo[_idToken1].breeding == 0 ||
            tokenInfo[_idToken2].breeding == 0
        ) {
            ChallengeAddOneTime(msg.sender, 5);
        }
        ChallengeAddOneTime(msg.sender, 3);
    }

    function internalSafeMint(
        address to,
        uint256 purityToken1,
        uint256 purityToken2
    ) internal {
        uint256 randomMin = (purityToken1 + purityToken2) / 2;
        uint256 purity = random(randomMin, randomMin + 10);
        uint256 tokenId = _tokenIdCounter.current();
        uint256 timeToClaim = block.timestamp +
            /*12 hours*/
            10 seconds;
        string memory name = "InProcess";
        uint256 background = random(0, 6);
        string memory color;
        if (purity >= 100) {
            purity = 100;
            color = "dorado";
            tokenInfo[tokenId].breeding = 0;
        } else {
            color = colors[random(0, 4)];
            tokenInfo[tokenId].breeding = 4;
        }
        tokenMinPurity[tokenId] = randomMin;
        tokenInfo[tokenId].timeToClaim = timeToClaim;
        tokenInfo[tokenId].name = name;
        tokenInfo[tokenId].purity = purity;
        tokenInfo[tokenId].color = color;
        tokenInfo[tokenId].background = background;
        actualTokenNumber = actualTokenNumber + 1;
        tokenInfo[tokenId].number = actualTokenNumber;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function claimNFT(uint256 _tokenId) public payable {
        require(msg.value >= TX_PRICE, "Not enough ether sent.");
        require(
            (keccak256(abi.encodePacked(tokenInfo[_tokenId].name))) ==
                (keccak256(abi.encodePacked("InProcess"))),
            "the NFT is already claimed"
        );
        if (tokenInfo[_tokenId].purity >= 35) {
            if (playersAddresses[msg.sender] == 0) {
                players++;
                playersAddresses[msg.sender] = players;
            }
        }
        if (tokenInfo[_tokenId].purity == 100) {
            tokenInfo[_tokenId].name = "pur100";
            ChallengeAddOneTime(msg.sender, 7);
        } else {
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
        ChallengeAddOneTime(msg.sender, 4);
        ChallengeAddOneTime(msg.sender, 6);
    }

    function craft(uint256 _idToken1, uint256 _idToken2) public payable {
        require(msg.value >= TX_PRICE, "Not enough ether sent.");
        require(_idToken1 != _idToken2, "NFTs are the same");
        require(ownerOf(_idToken1) == msg.sender, "The token is not yours");
        require(ownerOf(_idToken2) == msg.sender, "The token is not yours");
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

        uint256 numberOfBreeds = tokenInfo[_idToken1].breeding +
            tokenInfo[_idToken2].breeding;

        if (numberOfBreeds >= 4) {
            tokenInfo[_idToken1].breeding = 4;
        } else {
            tokenInfo[_idToken1].breeding = numberOfBreeds;
        }

        tokenInfo[_idToken1].color = tokenInfo[_idToken2].color;

        if (tokenInfo[_idToken1].purity > tokenInfo[_idToken2].purity) {
            tokenInfo[_idToken1].purity = random(
                tokenInfo[_idToken2].purity,
                tokenInfo[_idToken1].purity
            );
        } else if (tokenInfo[_idToken1].purity < tokenInfo[_idToken2].purity) {
            tokenInfo[_idToken1].purity = random(
                tokenInfo[_idToken1].purity,
                tokenInfo[_idToken2].purity
            );
        }

        string memory name = string(
            abi.encodePacked(
                "f",
                backgroundStrings[tokenInfo[_idToken1].background],
                "per",
                tokenInfo[_idToken1].color,
                "pur",
                numbers[tokenInfo[_idToken1].purity / 100],
                numbers[tokenInfo[_idToken1].purity / 10],
                numbers[
                    tokenInfo[_idToken1].purity -
                        ((uint256(tokenInfo[_idToken1].purity / 10)) * 10)
                ]
            )
        );
        ChallengeAddOneTime(msg.sender, 1);
        tokenInfo[_idToken1].name = name;
        _burn(_idToken2);
    }

    //NFT base

    function _baseURI() internal pure override returns (string memory) {
        return "./NFTs/";
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "Balance is zero");
        payable(owner()).transfer(address(this).balance);
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

    //Getters
    function getWinnersPosition(address _wallet) public view returns (uint256) {
        return winningAddresses[_wallet];
    }

    function getNumberOfWinners() public view returns (uint256) {
        return winners;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return players;
    }

    function getTokenTimeToClaim(uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        return tokenInfo[_tokenId].timeToClaim;
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

    function getTokenBreeding(uint256 _tokenId) public view returns (uint256) {
        return tokenInfo[_tokenId].breeding;
    }

    function getTokenBackground(uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        /*require(
            tokenInfo[_tokenId].timeToClaim < block.timestamp,
            "NFT is not ready"
        );*/
        return tokenInfo[_tokenId].background;
    }

    function getTokenColor(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        /*require(
            tokenInfo[_tokenId].timeToClaim < block.timestamp,
            "NFT is not ready"
        );*/
        return tokenInfo[_tokenId].color;
    }

    function getTokenNumber(uint256 _tokenId) public view returns (uint256) {
        /*provisional
        require(
            tokenInfo[_tokenId].timeToClaim < block.timestamp,
            "NFT is not ready"
        );*/
        return tokenInfo[_tokenId].number;
    }

    function getTokenPurity(uint256 _tokenId) public view returns (uint256) {
        /*require(
            tokenInfo[_tokenId].timeToClaim < block.timestamp,
            "NFT is not ready"
        );*/
        return tokenInfo[_tokenId].purity;
    }
}
