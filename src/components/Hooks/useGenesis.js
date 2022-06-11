import { useState } from "react";

//const { secondsToString } = useGenesis();
const useGenesis = ({ contract, account, token }) => {

    const [nftdata, setnftdata] = useState()
    const [NFTInprocces, setNFTInprocces] = useState(false);

    const loadNFTData = async () => {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(account, token).call()
        const NFTimage = await contract.methods.tokenURI(tokenId).call()
        const NFTName = await contract.methods.getTokenName(tokenId).call()
        if (NFTName != "InProcess") {
            const NFTBackground = await contract.methods.getTokenBackground(tokenId).call()
            const NFTBreeding = await contract.methods.getTokenBreeding(tokenId).call()
            const NFTColor = await contract.methods.getTokenColor(tokenId).call()
            const NFTNumber = await contract.methods.getTokenNumber(tokenId).call()
            const NFTPurity = await contract.methods.getTokenPurity(tokenId).call()
            setnftdata({
                img: NFTimage,
                bg: NFTBackground,
                color: NFTColor,
                purity: NFTPurity,
                tokenId: NFTNumber,
                breeding: NFTBreeding
            })
        } else {
            setNFTInprocces(true)
            const minPurity = await contract.methods.getMinPurity(tokenId).call();
            const tokenTimeToClaim = await contract.methods.getTokenTimeToClaim(tokenId).call();
            let unix_timestamp = tokenTimeToClaim
            var date = new Date(unix_timestamp * 1000);
            var now = new Date()
            var seconds = Math.trunc(((date - now) / 1000));
            if (seconds > 0) {
                setSeconds(seconds)
            }
            setnftdata({
                img: NFTimage,
                minPurity: minPurity
            })
        }
    }

    const secondsToString = (seconds) => {
        var hour = Math.floor(seconds / 3600);
        hour = (hour < 10) ? '0' + hour : hour;
        var minute = Math.floor((seconds / 60) % 60);
        minute = (minute < 10) ? '0' + minute : minute;
        var second = seconds % 60;
        second = (second < 10) ? '0' + second : second;
        return hour + ':' + minute + ':' + second;
    }

    const _climedToken = async (tokenId) => {
        let time = setTimeout(async () => {
            const NFTName = await contract.methods.getTokenName(tokenId).call()
            if (NFTName != "InProcess") {
                clearTimeout(time)
                loadNFTData()
            }
        }, 1000);
    }

    const claimToken = async () => {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(account, token).call()
        contract.methods.claimNFT(tokenId).estimateGas({
            from: account,
        }, function (error, gasAmount) {
            console.log(gasAmount);
            contract.methods.claimNFT(tokenId).send({
                from: account,
                gas: parseInt(gasAmount + (gasAmount * 0.4)),
            }, (err, hash) => { setLoandingNFT(false); setNFTInprocces(false); _climedToken(tokenId) })
        });
    }

    return {
        secondsToString, claimToken, loadNFTData,
        NFTInprocces, nftdata
    }
}

export default useGenesis