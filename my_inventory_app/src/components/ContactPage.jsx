import '../styles/ContactPage.css'
import '../styles/Auth.css'
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

function ContactPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (event) => {
        setFormData({...formData, [event.target.id]: event.target.value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('messages')
            .insert([{
                name: formData.name,
                email: formData.email,
                message: formData.message
            }]);
        
        if(error) {
            alert(error.message);
        }
        else {
            alert("Message sent successfully!");
            setFormData({name: '', email: '', message: ''});
        }
        setLoading(false);
    }

    return (
        <div className='dashboard-container'>
            <div className='dashboard-card'>
                <div className='dashboard-header'>
                    <h2 className='dashboard-title'>Interested in our offer? Send us a message!</h2>
                </div>
                <form className='auth-form' onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            placeholder="Anne Frank"
                            id="name"
                            className='auth-input'
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder="test@gmail.com"
                            id="email"
                            className='auth-input'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Your message</label>
                        <textarea
                            placeholder="Your message here :)"
                            id="message"
                            className='auth-input dashboard-message'
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="button dashboard-submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send it'}
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

export default ContactPage;