import { useEffect, useState } from 'react';
import '../styles/Inventory.css';
import Sidebar from './Sidebar';
import { supabase } from '../supabase/supabaseClient'
import editIcon from '../assets/edit.png'
import deleteIcon from '../assets/delete.png'
import { useDispatch, useSelector } from 'react-redux';
import { deleteStockLocal, fetchStocks, updateStockLocal } from '../store/stockSlice';

function Inventory() {
    const dispatch = useDispatch();
    const { items: stocks, status } = useSelector((state) => state.stocks); 

    const [orderBy, setOrderBy] = useState(localStorage.getItem('inv-sort-field') || 'name');
    const [ascending, setAscending] = useState(localStorage.getItem('inv-sort-asc') !== 'false');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    //initial fetch only when the status is idle
    useEffect(() => {
        if(status === 'idle') {
            dispatch(fetchStocks());
        }
    }, [status, dispatch]);

    //saving some ui preferences
    useEffect(() => {
        localStorage.setItem('inv-sort-field', orderBy);
        localStorage.setItem('inv-sort-asc', ascending);
    }, [orderBy, ascending]);

    //filtering by month
    const filteredItems = stocks.filter(item => {
        if(!selectedMonth) {
            return true;
        }

        const itemMonth = item.date_added.split('-')[1];
        return itemMonth === selectedMonth;
    });

    //sorting by name/date/quantity/price
    const sortedItems = [...filteredItems].sort((a, b) => {
        let valueA = a[orderBy];
        let valueB = b[orderBy];

        if(orderBy === 'price' || orderBy === 'quantity') {
            return ascending ? valueA - valueB : valueB - valueA;
        }

        return ascending ? String(valueA).localeCompare(String(valueB)) : String(valueB).localeCompare(String(valueA));
    });

    //pagination
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const displayedItems = sortedItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const openEditModal = (item) => {
        setEditingItem({...item});
        setIsModalOpen(true);
    }

    const handleUpdate = async (event) => {
        event.preventDefault();
        const { error } = await supabase
            .from('stocks')
            .update({
                name: editingItem.name,
                description: editingItem.description,
                quantity: editingItem.quantity,
                price: editingItem.price
            })
            .eq('id', editingItem.id);

        if(!error) {
            dispatch(updateStockLocal(editingItem));
            setIsModalOpen(false);
        }
        else {
            alert(error.message);
        }
    }

    const handleDelete = async (id, name) => {
        if(window.confirm(`Are you sure you want to delete ${name}?`)) {
            const { error } = supabase
                .from('stocks')
                .delete()
                .eq('id', id);
            
            if(!error) {
                dispatch(deleteStockLocal(id));
                if(displayedItems.length === 1 && page > 1) {
                    setPage(page - 1);
                }
            }
            else {
                alert(error.message);
            }
        }
    }

    return (
        <div className='inventory-container'>
            <Sidebar />
            <div className='inventory-content'>
                <h2 className='inventory-title'>Your inventory</h2>

                <div className='filters-container'>
                    <label className='filter'>
                        Order by
                        <select onChange={(event) => setOrderBy(event.target.value)} value={orderBy}>
                            <option value="name">name</option>
                            <option value="date">date</option>
                            <option value="quantity">quantity</option>
                            <option value="price">price</option>
                        </select>
                    </label>

                    <label className='filter'>
                        <select onChange={(event) => setAscending(event.target.value === 'true')} value={ascending}>
                            <option value="true">ascendingly</option>
                            <option value="false">descendingly</option>
                        </select>
                    </label>

                    <label className='filter'>
                        Month
                        <select onChange={(e) => { setSelectedMonth(e.target.value); setPage(1); }} value={selectedMonth}>
                            <option value="">All Months</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </label>
                </div>

                <div className='inventory-card'>
                    <table className='inventory-table'>
                        <thead>
                            <tr>
                                <th>Product name</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Date added</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status === 'loading' ? (
                                <tr>
                                    <td colSpan="5">Loading inventory...</td>
                                </tr>
                            ) : (
                                stocks.length > 0 ? (
                                    stocks.map((item) => (
                                        <tr key={item.id}>
                                            <td><strong>{item.name}</strong></td>
                                            <td>{item.description || '-'}</td>
                                            <td>{item.quantity}</td>
                                            <td>{parseFloat(item.price).toFixed(2)}</td>
                                            <td>{item.date_added}</td>
                                            <td className='actions-cell'>
                                                <button onClick={() => openEditModal(item)}>
                                                    <img src={editIcon}></img>
                                                </button>
                                                <button onClick={() => handleDelete(item.id, item.name)}> 
                                                    <img src={deleteIcon}></img>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No items found!</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>

                    <div className='pagination-bar'>
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                        <span>Page {page}</span>
                        <button disabled={page * itemsPerPage >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                    </div>
                </div>
            </div>

            {/* modal for editing a certain product */}
            {isModalOpen && (
                <div className='modal-overlay'>
                    <form onSubmit={handleUpdate}>
                        <h3>Edit product</h3>
                        <label>Product name</label>
                        <input 
                            type='text'
                            value={editingItem.name}
                            onChange={(event) => setEditingItem({...editingItem, name: event.target.value})}
                            required
                        />

                        <label>Quantity</label>
                        <input 
                            type='number'
                            value={editingItem.quantity}
                            onChange={(event) => setEditingItem({...editingItem, quantity: event.target.value})}
                            required
                        />

                        <label>Price</label>
                        <input 
                            type='number'
                            step='0.01'
                            value={editingItem.price}
                            onChange={(event) => setEditingItem({...editingItem, price: event.target.value})}
                            required
                        />

                        <label>Description</label>
                        <textarea 
                            value={editingItem.description}
                            onChange={(event) => setEditingItem({...editingItem, description: event.target.value})}
                        />

                        <div className='modal-actions'>
                            <button type='button' onClick={() => setIsModalOpen(false)} className='button button-secondary'>Cancel</button>
                            <button type='submit' className='button button-primary'>Save changes</button>
                        </div>
                    </form>    
                </div>
            )}
        </div>
    )
}

export default Inventory;