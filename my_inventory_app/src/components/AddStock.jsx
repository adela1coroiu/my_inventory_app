import '../styles/AddStock.css';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';
import { supabase } from '../supabase/supabaseClient';
import { useState } from 'react';

function AddStock() {

    const user = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: '',
        price: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('stocks')
            .insert([{
                name: formData.name,
                description: formData.description,
                quantity: parseInt(formData.quantity),
                price: parseFloat(formData.price),
                date_added: formData.date,
                user_id: user.id
            }
        ]);

        if(error) {
            alert(error.message);
        }
        else {
            alert("Stock added successfully!");
            setFormData({
                name: '',
                description: '',
                quantity: '',
                price: '',
                date: new Date().toISOString().split('T')[0]
            })
        }
        setLoading(false);
    }

    return (
        <div className='dashboard-layout'>
            <Sidebar />
            <div className='form-container'>
                <h2 className='page-title'>Add new stock</h2>                    
                <form className='add-stock-card' onSubmit={handleSubmit}>
                    <div className='form-row'>
                        <div className="form-group">
                            <label>Product name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                                placeholder="e.g. Mousepad" 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Date added</label>
                        <input 
                            type="date" 
                            name="date" 
                            value={formData.date} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea  
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange}  
                            placeholder='Brief description about the product...'
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Quantity</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                value={formData.quantity} 
                                onChange={handleChange} 
                                required 
                                placeholder="0" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Selling price ($)</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                name="price" 
                                value={formData.price} 
                                onChange={handleChange} 
                                required 
                                placeholder="0.00" 
                            />
                        </div>
                    </div>

                    <button type="submit" className="button button-secondary" disabled={loading}>
                        {loading ? 'Saving...' : 'Add to inventory'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddStock;