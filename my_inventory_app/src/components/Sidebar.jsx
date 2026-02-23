import '../styles/Sidebar.css'
import { NavLink } from 'react-router-dom'
import home from '../assets/house.png'
import inventory from '../assets/inventory.png'
import add_stock from '../assets/add_stock.png'
import create_order from '../assets/create_order.png'
import user from '../assets/user.png'
import logout from '../assets/logout.png'

function Sidebar() {
    return (
        <aside className="sidebar">
            <p className='sidebar-title'>InventSync</p>

            <nav className='sidebar-nav'>
                <NavLink to='/home' className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                    <img src={home} className='nav-icon'/>
                    Home
                </NavLink>

                <NavLink to='/inventory' className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                    <img src={inventory} className='nav-icon'/>
                    Inventory
                </NavLink>

                <NavLink to='/add-stock' className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                    <img src={add_stock} className='nav-icon'/>
                    Add stock
                </NavLink>

                <NavLink to='/orders' className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                    <img src={create_order} className='nav-icon'/>
                    Create order
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <NavLink to='/profile' className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                    <img src={user} className='nav-icon'/>
                    Profile settings
                </NavLink>
                
                <NavLink to='/' className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                    <img src={logout} className='nav-icon'/>
                    Log out
                </NavLink>
            </div>
        </aside>
    )
}

export default Sidebar;