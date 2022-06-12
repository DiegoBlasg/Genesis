import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Breeding from '../Breeding/Breeding';
import Inventory from '../Inventory/Inventory';
import Menu from '../Menu';
import NFTtrash from '../Trash/NFTtrash';

export default function Routess() {

    return (
        <BrowserRouter>
            <Menu />
            <Routes>
                <Route path="/" element={<Inventory />} />
                <Route path="/breeding" element={<Breeding />} />
                <Route path="/trash" element={/*<NFTtrash />*/<Inventory />} />
            </Routes>
        </BrowserRouter>
    );
}