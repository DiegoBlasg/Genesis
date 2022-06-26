import { useDispatch } from "react-redux";

const useNFTs = () => {
    const dispatch = useDispatch()

    function sortArrayDescendingByNumber(array) {
        for (let i = array.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                if (parseInt(array[j].tokenId) < parseInt(array[j + 1].tokenId)) {
                    let value = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = value;
                }
            }
        }
        return array
    }

    const loadNFTData = async (contract, wallet, totalSuply, actualNFTs) => {
        let nfts = [];
        let nftlength;
        if (actualNFTs)
            nftlength = (parseInt(totalSuply) - 1) - actualNFTs
        else
            nftlength = parseInt(totalSuply) - 1
        if (nftlength < 0) {
            dispatch({
                type: '@loanding/change',
                payload: false
            })
            return
        }
        for (let i = nftlength; i >= (nftlength - 11 <= 0 ? 0 : nftlength - 10); i--) {
            const tokenId = await contract.methods.tokenOfOwnerByIndex(wallet, i).call()
            const NFTimage = await contract.methods.tokenURI(tokenId).call()
            const NFTName = await contract.methods.getTokenName(tokenId).call()
            const NFTNumber = await contract.methods.getTokenNumber(tokenId).call()
            if (NFTName != "InProcess") {
                const NFTBackground = await contract.methods.getTokenBackground(tokenId).call()
                const NFTBreeding = await contract.methods.getTokenBreeding(tokenId).call()
                const NFTColor = await contract.methods.getTokenColor(tokenId).call()
                const NFTPurity = await contract.methods.getTokenPurity(tokenId).call()
                const winnersPosition = await contract.methods.getWinnersPosition().call()
                if (!winnersPosition) winnersPosition = "not Winer"
                const nftdata = {
                    inProcess: false,
                    img: NFTimage,
                    bg: NFTBackground,
                    color: NFTColor,
                    purity: NFTPurity,
                    tokenId: NFTNumber,
                    breeding: NFTBreeding,
                    winnersPosition
                }
                nfts.push(nftdata)
            } else {
                let nftdata = []
                const minPurity = await contract.methods.getMinPurity(tokenId).call();
                const tokenTimeToClaim = await contract.methods.getTokenTimeToClaim(tokenId).call();
                const date = new Date(tokenTimeToClaim * 1000);
                const now = new Date()
                const secondsToClimb = Math.trunc(((date - now) / 1000));
                if (secondsToClimb <= 0) {
                    const NFTPurity = await contract.methods.getTokenPurity(tokenId).call()
                    const NFTColor = await contract.methods.getTokenColor(tokenId).call()
                    nftdata = {
                        inProcess: true,
                        img: NFTimage,
                        purity: NFTPurity,
                        tokenId: NFTNumber,
                        dateToClimb: date,
                        color: NFTColor,
                        minPurity
                    }
                } else {
                    nftdata = {
                        tokenId: NFTNumber,
                        inProcess: true,
                        img: NFTimage,
                        dateToClimb: date,
                        minPurity,
                    }
                }
                nfts.push(nftdata)

            }

        }
        sortArrayDescendingByNumber(nfts)
        if (actualNFTs) {

            dispatch({
                type: '@nfts/update',
                payload: nfts
            })
        } else {

            dispatch({
                type: '@nfts/init',
                payload: nfts
            })
        }

        dispatch({
            type: '@loanding/change',
            payload: false
        })
    }
    return {
        loadNFTData
    }
}

export default useNFTs