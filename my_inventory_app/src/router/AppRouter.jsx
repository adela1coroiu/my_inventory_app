import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Dashboard from '../components/Dashboard';
import Home from '../components/Home';
import Inventory from '../components/Inventory';
import AddStock from '../components/AddStock';
import CreateOrder from '../components/CreateOrder';
import Profile from '../components/Profile';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/home' element={<Home />} />
                <Route path='/inventory' element={<Inventory />} />
                <Route path='/add-stock' element={<AddStock />} />
                <Route path='/orders' element={<CreateOrder />} />
                <Route path='/profile' element={<Profile />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;