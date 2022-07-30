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

    const getNFTData = async (contract, wallet, id) => {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(wallet, id).call()
        const NFTimage = await contract.methods.tokenURI(tokenId).call()
        const NFTName = await contract.methods.getTokenName(tokenId).call()
        const NFTNumber = await contract.methods.getTokenNumber(tokenId).call()
        if (NFTName != "InProcess") {
            const NFTBackground = await contract.methods.getTokenBackground(tokenId).call()
            const NFTBreeding = await contract.methods.getTokenBreeding(tokenId).call()
            const NFTColor = await contract.methods.getTokenColor(tokenId).call()
            const NFTPurity = await contract.methods.getTokenPurity(tokenId).call()
            const nftdata = {
                inProcess: false,
                img: NFTimage,
                bg: NFTBackground,
                color: NFTColor,
                purity: NFTPurity,
                tokenId: NFTNumber,
                breeding: NFTBreeding,
            }
            return nftdata
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
            return nftdata
        }

    }

    const loadNFTData = async (contract, wallet, totalSuply, page = 1) => {
        dispatch({
            type: '@loanding/change',
            payload: true
        })
        dispatch({
            type: '@nfts/reset'
        })
        let nfts = [];
        if (totalSuply <= 0) {
            dispatch({
                type: '@loanding/change',
                payload: false
            })
            return
        }
        const initialIndex = parseInt(totalSuply - 1) - (10 * (page - 1))
        const finalIndex = totalSuply - (10 * page) < 0 ? 0 : totalSuply - (10 * page)
        for (let i = initialIndex; i >= finalIndex; i--) {
            const nftData = await getNFTData(contract, wallet, i)
            nfts.push(nftData)
        }
        nfts = nfts.sort((a, b) => b.tokenId - a.tokenId)
        dispatch({
            type: '@nfts/init',
            payload: nfts
        })

        dispatch({
            type: '@loanding/change',
            payload: false
        })
    }

    const modifyNFT = async (id, contract, inProcess = false) => {
        dispatch({
            type: '@loanding/change',
            payload: true
        })
        const tokenId = id
        const NFTimage = await contract.methods.tokenURI(tokenId).call()
        const NFTNumber = await contract.methods.getTokenNumber(tokenId).call()
        const minPurity = await contract.methods.getMinPurity(tokenId).call();
        const NFTColor = await contract.methods.getTokenColor(tokenId).call()
        const NFTPurity = await contract.methods.getTokenPurity(tokenId).call()
        const NFTBackground = await contract.methods.getTokenBackground(tokenId).call()
        const NFTBreeding = await contract.methods.getTokenBreeding(tokenId).call()
        const tokenTimeToClaim = await contract.methods.getTokenTimeToClaim(tokenId).call();
        const date = new Date(tokenTimeToClaim * 1000);
        const nftdata = {
            inProcess: inProcess,
            img: NFTimage,
            purity: NFTPurity,
            tokenId: NFTNumber,
            dateToClimb: date,
            color: NFTColor,
            breeding: NFTBreeding,
            bg: NFTBackground,
            minPurity
        }
        dispatch({
            type: '@nfts/modify',
            payload: nftdata
        })
        dispatch({
            type: '@loanding/change',
            payload: false
        })
    }
    const getDataFromNewNFTs = async (wallet, contract, totalSuply) => {
        dispatch({
            type: '@loanding/change',
            payload: true
        })
        const newTotalSupply = await contract.methods.balanceOf(wallet).call()
        if (totalSuply >= newTotalSupply) {
            console.log("error");
            dispatch({
                type: '@loanding/change',
                payload: false
            })
            return
        }
        for (let i = parseInt(totalSuply) + 1; i <= newTotalSupply; i++) {
            console.log(i);
            const nftdata = await getNFTData(contract, wallet, i - 1)
            dispatch({
                type: '@nfts/add',
                payload: nftdata
            })
            dispatch({
                type: '@data/modifyTotalSupply',
                payload: newTotalSupply
            })
            dispatch({
                type: '@loanding/change',
                payload: false
            })
        }

    }
    return {
        loadNFTData, modifyNFT, getDataFromNewNFTs
    }
}

export default useNFTs