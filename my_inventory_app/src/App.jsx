import './App.css'
import { useNavigate } from 'react-router'
import logo from './assets/logo.png'

function App() {

  const navigate = useNavigate();

  return (
    <div className='landing-container'>
      <main className='main-panel'>
        {/* top section with logo and title */}
        <div className='brand-group'>
          <img src={logo}></img>
          <h1 className='brand-title'>InventSync</h1>
          <p className='brand-description'>
            Real-time inventory management for modern businesses
          </p>
        </div>

        {/* bottom section with navigation buttons */}
        <div className='footer-group'>
          <div className='action-stack'>
            <button onClick={() => navigate('/login')} className='button button-primary'>
              Login
            </button>

            <button onClick={() => navigate('/signup')} className='button button-secondary'>
              Create account
            </button>
          </div>

          <div className='navigation-divider'>
            <span>OR</span>
          </div>

          <button onClick={() => navigate('/contact-page')} className='guest-link'>
            Explore as visitor
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
