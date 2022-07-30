import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Breeding from '../Breeding/Breeding';
import Challenges from '../Challenges/Challenges';
import Craft from '../Craft/Craft';
import Inventory from '../Inventory/Inventory';
import Menu from '../Menu';

export default function Routess() {

    return (
        <BrowserRouter>
            <Menu />
            <Routes>
                <Route path="/" element={<Inventory />} />
                <Route path="/breeding" element={<Breeding />} />
                <Route path="/craft" element={<Craft />} />
                <Route path="/challenges" element={<Challenges />} />
            </Routes>
        </BrowserRouter>
    );
}