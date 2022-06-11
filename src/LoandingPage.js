const LoandingPage = () => {
    return (
        <>
            <div className='absolute w-full h-full flex flex-col justify-center items-center'>
                <div className='absolute w-full h-full bg-zinc-900 opacity-60 flex flex-col justify-center items-center'></div>
            </div>
            <div className='absolute w-full h-full flex flex-col justify-center items-center'>

                <div className='absolute w-72 p-6'>
                    <svg version="1.1" id="L3" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="-10 -10 120 120" enableBackground="new 0 0 0 0" >
                        <circle fill="none" stroke="#fff" strokeWidth="6" cx="50" cy="50" r="44" style={{ opacity: "0.8" }} />
                        <circle fill="#67e8f9" stroke="#06b6d4" strokeWidth="6" cx="8" cy="54" r="6" >
                            <animateTransform
                                attributeName="transform"
                                dur="2s"
                                type="rotate"
                                from="0 50 48"
                                to="360 50 52"
                                repeatCount="indefinite" />

                        </circle>
                    </svg>
                </div>

            </div>
            <div className='absolute w-full h-full flex flex-col justify-center items-center'>

                <h1 className='text-white text-2xl font-bold'>LOADING...</h1>

            </div>
        </>

    )
}
export default LoandingPage