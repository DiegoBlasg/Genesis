import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Breeding from '../Breeding/Breeding';
import Craft from '../Craft/Craft';
import Inventory from '../Inventory/Inventory';
import Menu from '../Menu';
import World from '../World/World';

export default function Routess() {

    return (
        <BrowserRouter>
            <Menu />
            <Routes>
                <Route path="/" element={<Inventory />} />
                <Route path="/breeding" element={<Breeding />} />
                <Route path="/craft" element={<Craft />} />
                <Route path="/world" element={<World />} />
            </Routes>
        </BrowserRouter>
    );
}