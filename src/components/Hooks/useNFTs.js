import { useDispatch } from "react-redux";

const useNFTs = () => {
    const dispatch = useDispatch()

    function sortArrayDescendingByNumber(array) {
        for (let i = array.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                if (parseInt(array[j].number) < parseInt(array[j + 1].number)) {
                    let value = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = value;
                }
            }
        }
        return array
    }

    const loadNFTData = async (contract, wallet, totalSuply) => {
        let arrayOfIds = [];
        for (let i = parseInt(totalSuply) - 1; i >= 0; i--) {
            const tokenId = await contract.methods.tokenOfOwnerByIndex(wallet, i).call()
            const NFTTimeToClaim = await contract.methods.getTokenTimeToClaim(tokenId).call()
            const date = new Date(NFTTimeToClaim * 1000);
            const now = new Date()

            if (date < now) {
                const NFTNumber = await contract.methods.getTokenNumber(tokenId).call()
                const NFTPurity = await contract.methods.getTokenPurity(tokenId).call()
                arrayOfIds.push({ id: i, number: NFTNumber, purity: NFTPurity });
            } else {
                arrayOfIds.push({ id: i, number: 1000000000000000, purity: 200 });
            }

        }
        sortArrayDescendingByNumber(arrayOfIds)
        dispatch({
            type: '@nfts/init',
            payload: arrayOfIds
        })

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