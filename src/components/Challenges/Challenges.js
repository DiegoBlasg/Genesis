import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Challenge from './Challenge'
import '../patterns.css'
const Challenges = () => {
    const [winnerPosition, setWinnerPosition] = useState()
    const [players, setPlayers] = useState()
    const [winners, setWinners] = useState()
    const { contract, wallet } = useSelector(state => state.data)
    const start = async () => {
        const winnerPos = await contract.methods.getWinnersPosition(wallet).call()
        const players = await contract.methods.getNumberOfPlayers().call()
        const winners = await contract.methods.getNumberOfWinners().call()
        setWinners(winners)
        setWinnerPosition(winnerPos)
        setPlayers(players)
    }
    useEffect(() => {
        if (contract && wallet) {
            start()
        }
    }, [contract])
    return (
        <div>
            <div className='pattern-yellow fixed w-full h-full -z-10'></div>
            <div className='sm:ml-24 pt-20 sm:pt-5'>
                {
                    winnerPosition > 0 ?

                        <div className="flex flex-col items-center justify-center py-9 p-6 m-6 bg-green-700 rounded-xl">
                            <h1 className='text-zinc-100 text-center font-bold text-3xl'>WINNERS {winners}/{players}</h1>
                            <h1 className='text-zinc-100 text-center font-bold text-3xl pt-3'>YOU'RE {winnerPosition}</h1>
                        </div>
                        :
                        <div className="flex flex-col items-center justify-center py-9 p-6 m-6 bg-zinc-900 rounded-xl">
                            <h1 className='text-zinc-100 text-center font-bold text-3xl'>WINNERS {winners}/{players}</h1>
                            <h1 className='text-zinc-100 text-center font-bold text-3xl pt-3'>YOU AREN'T</h1>
                        </div>
                }
                <Challenge title="Craft" subtitle="Usa la opcion de craft en el apartado craft 10 veces" times="10" challenge="1" />
                <Challenge title="Mint" subtitle="Usa la opcion de mint en el apartado inventario 5 veces" times="5" challenge="2" />
                <Challenge title="Breed" subtitle="Usa la opcion de breed en el apartado breed 25 veces" times="25" challenge="3" />
                <Challenge title="Claim" subtitle="Usa la opcion de claim en el apartado inventario 25 veces" times="25" challenge="4" />
                <Challenge title="Zero Breed" subtitle="Deja un nft sin posivilidad de breedear" times="1" challenge="5" />
                <Challenge title="40 NFTs" subtitle="Consigue 40 nfts" times="40" challenge="6" />
                <Challenge title="Purity 100" subtitle="Hacer claim y obtener un nft de 100 de pureza" times="1" challenge="7" />
            </div>
        </div>
    )
}
export default Challenges