import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const Challenge = ({ title, subtitle, times, challenge }) => {

    const { contract, wallet } = useSelector(state => state.data)
    const [ti1, setTi2] = useState([])
    const [complete, setComplete] = useState(false)
    const init = async () => {
        const time = await contract.methods.viewChallengesByAddress(wallet).call()
        setTi2(time)
        if (time[parseInt(challenge) - 1] >= parseInt(times)) {
            setComplete(true)
        }
    }
    useEffect(() => {
        if (wallet && contract) {
            init()
        }

    }, [wallet])
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 m-6 bg-zinc-900 rounded-xl">
            <div>
                <h2 className="text-2xl sm:text-3xl text-center sm:text-left font-bold text-white">
                    {title}
                </h2>
                <div className="mt-2 text-center text-sm text-gray-500">
                    {subtitle}
                </div>
            </div>
            {
                complete ?
                    <div className="mt-5 flex sm:mt-0 sm:ml-4 justify-center items-center">

                        <h1 className="text-white text-2xl font-semibold mx-2">
                            <span>{ti1[parseInt(challenge) - 1]}</span>/{times}
                        </h1>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="text-green-500" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                        </svg>

                    </div>
                    :
                    <div className="mt-5 flex sm:mt-0 sm:ml-4 justify-center items-center">

                        <h1 className="text-white text-2xl font-semibold mx-2">
                            <span className="text-red-500">{ti1[parseInt(challenge) - 1]}</span>/{times}
                        </h1>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="text-red-500" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>

                    </div>
            }

        </div>
    )
}
export default Challenge