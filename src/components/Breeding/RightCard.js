import { useState } from "react";
import Modal from 'react-modal';
import { useSelector } from "react-redux";
import NFTImage from "../NFTImage";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '30%',
        bottom: 'auto',
        marginRight: '-70%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#18181b',
        border: '0',
        overflow: 'auto'
    },
    overlay: {
        backgroundColor: 'rgba(100, 100, 100, 0.75)'
    }
};
Modal.setAppElement('#root');
const RightCard = ({ token1, token2, setToken2 }) => {
    const NFTdata = useSelector(state => state.nfts)
    const [modalIsOpen2, setIsOpen2] = useState(false);
    function openModal2() {
        setIsOpen2(true);
        setToken2(undefined)
    }

    function closeModal2() {
        setIsOpen2(false);
    }
    return (
        <div>
            <Modal
                isOpen={modalIsOpen2}
                onRequestClose={closeModal2}
                style={customStyles}
                contentLabel="Example Modal"
                closeTimeoutMS={100}
            >
                <div className='flex justify-between sm:justify-center'>
                    <div className='text-zinc-100 cursor-pointer absolute top-5 right-10  py-5' onClick={closeModal2}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" ame="bi bi-x-lg" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
                            <path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
                        </svg>
                    </div>

                    <div className="card bg-zinc-900 w-80 rounded-xl py-5">
                        <h1 className='text-zinc-100 text-center font-bold text-3xl'>BREEDING</h1>
                    </div>
                </div >
                <div className="flex overflow-auto">
                    {
                        NFTdata.map((_) => (
                            token1 != _ && !_.inProcess &&
                            <div key={_.tokenId} onClick={() => { setToken2(_); closeModal2(); }} >
                                < NFTImage nftdata={_} />
                            </div>
                        ))
                    }
                </div >
            </Modal>
            {
                token2 != undefined ?
                    <div onClick={() => { openModal2() }}>
                        < NFTImage nftdata={token2} />
                    </div>
                    :
                    <div onClick={() => { openModal2() }} className="card bg-zinc-300 border-8 border-zinc-900 w-72 rounded-xl m-4 p-6 space-y-4 cursor-pointer">
                        <div className="flex items-center justify-center font-semibold text-2xl border-slate-500 py-6">
                            <span id="price" className="text-zinc-900 flex justify-between items-center font-bold">
                                NFT 2
                            </span>
                        </div>
                        <div className="flex items-center justify-center font-semibold text-2xl border-slate-500 py-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
                            </svg>
                        </div>
                    </div>
            }
        </div>
    )
}
export default RightCard