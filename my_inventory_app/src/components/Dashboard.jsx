import '../styles/Dashboard.css'
import '../styles/Auth.css'
import { useNavigate } from 'react-router';

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className='dashboard-container'>
            <div className='dashboard-card'>
                <div className='dashboard-header'>
                    <h2 className='dashboard-title'>Interested in our offer? Send us a message!</h2>
                </div>
                <form className='auth-form'>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder="test@gmail.com"
                            id="email"
                            className='auth-input'
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Your message</label>
                        <textarea
                            placeholder="Your message here :)"
                            id="message"
                            className='auth-input dashboard-message'
                        />
                    </div>

                    <button type="submit" className="button dashboard-submit">
                        Send it
                    </button>
                </form>

                <div className='auth-footer'>
                    <p>Decided to create an account? <span onClick={() => navigate('/signup')} className='auth-link'>Click here</span></p>
                    <button onClick={() => navigate('/')} className='back-link'>← Back home</button>
                </div>
            </div>
                
        </div>
    )
}

export default Dashboard;