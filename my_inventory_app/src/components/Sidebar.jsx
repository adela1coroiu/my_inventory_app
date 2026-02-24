import { useState } from 'react';
import '../styles/Sidebar.css';
import { NavLink } from 'react-router-dom';
import home from '../assets/house.png';
import inventory from '../assets/inventory.png';
import add_stock from '../assets/add_stock.png';
import create_order from '../assets/create_order.png';
import user from '../assets/user.png';
import logout from '../assets/logout.png';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* mobile hamburger button */}
            <button className="hamburger-button" onClick={toggleSidebar}>
                {isOpen ? '✕' : '☰'}
            </button>

            {/* dark overlay when side bar is active on a mobile device */}
            {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <p className='sidebar-title'>InventSync</p>

                <nav className='sidebar-nav'>
                    <NavLink to='/home' onClick={closeSidebar} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <img src={home} className='nav-icon' alt='Home'/>
                        Home
                    </NavLink>

                    <NavLink to='/inventory' onClick={closeSidebar} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <img src={inventory} className='nav-icon' alt='Inventory'/>
                        Inventory
                    </NavLink>

                    <NavLink to='/add-stock' onClick={closeSidebar} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <img src={add_stock} className='nav-icon' alt='Add Stock'/>
                        Add stock
                    </NavLink>

                    <NavLink to='/orders' onClick={closeSidebar} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <img src={create_order} className='nav-icon' alt='Orders'/>
                        Create order
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <NavLink to='/profile' onClick={closeSidebar} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <img src={user} className='nav-icon' alt='Profile'/>
                        Profile settings
                    </NavLink>
                    
                    <NavLink to='/' className='nav-item'>
                        <img src={logout} className='nav-icon' alt='Logout'/>
                        Log out
                    </NavLink>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;