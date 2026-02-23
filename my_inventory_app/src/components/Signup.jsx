import { useNavigate } from 'react-router';
import '../styles/Auth.css'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabase/supabaseClient';
import { setAuth } from '../store/authSlice';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignUp = async (event) => {
        event.preventDefault();

        if(password !== confirmPassword) {
            return alert("Passwords do not match!");
        }

        setLoading(true);

        const {data, error} = await supabase.auth.signUp({email, password});

        if(error) {
            alert(error.message);
            setEmail('');
            setPassword('');
            setLoading(false);
        }
        else {
            if(data.user) {
                dispatch(setAuth(data.user));
                alert("Account created successfully!");
                navigate('/home');
            }
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">Create admin account</h2>
                    <p className="auth-description">Join InventSync to manage your warehouse</p>
                </div>

                <form className="auth-form" onSubmit={handleSignUp}>
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

                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input 
                        type="password" 
                        placeholder="repeat your password" 
                        className="auth-input"
                        onChange={(event) => setConfirmPassword(event.target.value)} 
                        required
                        />
                    </div>

                    <button type="submit" className="button button-secondary auth-submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Sign up'}
                    </button>
                </form>

                <div className='auth-footer'>
                    <p>Already have an account? <span onClick={() => navigate('/login')} className='auth-link'>Log in</span></p>
                    <button onClick={() => navigate('/')} className='back-link'>← Back home</button>
                </div>
            </div>
        </div>
    )
}

export default Signup;