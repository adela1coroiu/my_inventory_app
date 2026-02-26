import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Inventory from '../components/Inventory';
import AddStock from '../components/AddStock';
import CreateOrder from '../components/CreateOrder';
import ContactPage from '../components/ContactPage';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/contact-page' element={<ContactPage />} />
                <Route path='/inventory' element={<Inventory />} />
                <Route path='/add-stock' element={<AddStock />} />
                <Route path='/orders' element={<CreateOrder />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;