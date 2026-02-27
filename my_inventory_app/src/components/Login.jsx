import '../styles/Auth.css'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/supabaseClient';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/authSlice';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);

        const {data, error} = await supabase.auth.signInWithPassword({email, password});

        if(error) {
            alert(error.message);
            setEmail('');
            setPassword('');
            setLoading(false);
        }
        else {
            dispatch(setAuth(data.user));
            navigate('/inventory');
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">Welcome back!</h2>
                    <p className="auth-description">Log in to manage your inventory</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            placeholder="test@gmail.com"
                            className="auth-input"   
                            onChange={(event) => setEmail(event.target.value)}
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder="password"
                            className="auth-input" 
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="button button-primary auth-submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Sign in'}
                    </button>
                </form>

                <div className='auth-footer'>
                    <p>Don't have an account? <span onClick={() => navigate('/signup')} className='auth-link'>Create one</span></p>
                    <button onClick={() => navigate('/')} className='back-link'>← Back home</button>
                </div>
            </div>
        </div>
    )
}

export default Login;