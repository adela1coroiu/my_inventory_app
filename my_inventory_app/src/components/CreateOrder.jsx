import Sidebar from "./Sidebar";
import '../styles/CreateOrder.css';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../supabase/supabaseClient';
import { fetchStocks, updateStockLocal } from '../store/stockSlice';

function CreateOrder() {
    const dispatch = useDispatch();

    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    const { items: stocks, status } = useSelector((state) => state.stocks);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQtys, setSelectedQtys] = useState({});
    const [recipient, setRecipient] = useState({
        name: '',
        email: '',
        iban: ''
    });
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if(status === 'idle') {
            dispatch(fetchStocks());
        }
    }, [status, dispatch]);

    const filteredStocks = useMemo(() => {
        return stocks.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [stocks, searchQuery]);

    const handleQtysChange = (id, val, max) => {
        const value = Math.max(1, Math.min(Number(val), max));
        setSelectedQtys(prev => ({...prev, [id]: value}));
    }

    const handleRecipientChange = (event) => {
        const { name, value} = event.target;
        setRecipient(prev => ({...prev, [name]: value}));
    }

    const addToOrder = (product) => {
        console.log(selectedQtys);
        const quantityToAdd = selectedQtys[product.id] || 1;

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if(existingItem) {
                return prevCart.map(item => 
                    item.id === product.id ? {...item, orderQty: Math.min(item.orderQty + quantityToAdd, product.quantity)} : item
                );
            }

            return [...prevCart, {...product, orderQty: quantityToAdd}];
        });
    }

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    }

    const totalCartPrice = cart.reduce((acc, item) => acc + (item.price * item.orderQty), 0);

    const generatePDF = () => {
        const doc = new jsPDF();
        console.log(recipient.name);

        //header
        doc.setFontSize(16);
        doc.text("Order receipt", 105, 15, {align: "center"});

        //recipient details
        doc.setFontSize(12);
        doc.text(`Recipient's full name: ${recipient.name}`, 14, 30);
        doc.text(`Recipient's email address: ${recipient.email}`, 14, 37);
        doc.text(`Recipient's IBAN: ${recipient.iban}`, 14, 44);
        doc.text(`Order date: ${new Date().toLocaleDateString()}`, 14, 51);

        //drawing a separator line
        doc.setLineWidth(0.5);
        doc.line(14, 55, 196, 55);

        doc.setFontSize(12);
        doc.text("Items ordered", 14, 65);

        let currentY = 75;

        cart.forEach((item, index) => {
            const itemTotal = (item.orderQty * item.price).toFixed(2);
            const itemLine = `${index + 1}. ${item.name} - quantity: ${item.orderQty} x $${parseFloat(item.price).toFixed(2)} = $${itemTotal}`;

            doc.text(itemLine, 14, currentY);
            currentY += 10;

            if(currentY > 270) {
                doc.addPage();
                currentY = 20;
            }
        });

        doc.setLineWidth(0.5);
        doc.line(14, currentY, 196, currentY); 
    
        doc.setFontSize(14);
        doc.text(`Total amount: $${totalCartPrice.toFixed(2)}`, 14, currentY + 15);

        doc.save(`Order_${recipient.name || 'Receipt'}.pdf`);
    }

    const updateInventory = async () => {
        try {
            const updatePromises = cart.map(async (item) => {
                const newQuantity = item.quantity - item.orderQty;

                const { error } = await supabase
                    .from('stocks')
                    .update({quantity: newQuantity})
                    .eq('id', item.id);

                if(error) {
                    throw error;
                }

                dispatch(updateStockLocal({...item, quantity: newQuantity}));
            });

            await Promise.all(updatePromises);
            return true;
        } 
        catch(error) {
            console.error("Error updating the inventory: ", error.message);
            alert("Failed to update the inventory! " + error.message);
            return false;
        }
    }

    const handleFinalizeOrder = async (event) => {
        event.preventDefault();
        if(cart.length === 0) {
            return alert("Please add at least one item to the cart in order to finalize the order");
        }

        const success = await updateInventory();
        if(success) {
            generatePDF();
            setCart([]);
            setSelectedQtys({});
            alert("Order finalized! PDF generated and inventory updated.");
            console.log("Finalizing order for:", { recipient, items: cart, total: totalCartPrice});
        }
    }

    return (
        <div className="orders-layout">
            <Sidebar />

            <button className="mobile-cart-toggle" onClick={() => setIsSummaryOpen(true)}>
                <span className="cart-count">{cart.length}</span>
                Cart & details
            </button>

            <div className="orders-container">
                {/* static header */}
                <header className="orders-header">
                    <h2>Fulfill an order</h2>
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search items by name..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                    />
                </header>

                <div className="orders-content">
                    {/* on the left of the page we will have a scollable area for the product cards */}
                    <div className="scrollable-area">
                        <div className="products-grid">
                            {filteredStocks.length > 0 ? (
                                filteredStocks.map(item => (
                                    <div key={item.id} className={`product-card ${item.quantity === 0 ? 'out-of-stock' : ''}`}>
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        <div className="price">${parseFloat(item.price).toFixed(2)}</div>
                                        <p className="stock">Available: {item.quantity}</p>

                                        <div className="card-actions">
                                            {item.quantity > 0 ? (
                                                <>
                                                    <div className="quantity-input">
                                                        <label>Selected quantity</label>
                                                        <input
                                                            type="number"
                                                            value={selectedQtys[item.id] || 1}
                                                            min="1"
                                                            max={item.quantity}
                                                            onChange={(event) => handleQtysChange(item.id, event.target.value, item.quantity)}
                                                        />
                                                    </div>
                                                    <button className="add-button" onClick={() => addToOrder(item)}>Add to order</button>
                                                </>
                                            ) : (
                                                <button disabled className="sold-out">Sold out</button>
                                            )}
                                        </div>    
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">No products found matching {searchQuery}</div>
                            )}
                        </div>
                    </div>

                    {/* to the right we will have the order summary, with recepient details and pdf receipt generator */}
                    <aside className={`order-summary ${isSummaryOpen ? 'open' : ''}`}>
                        <div className="summary-content">
                            <h3>Order details</h3>

                            <div className="cart-items">
                                {cart.length === 0 ? (
                                    <p>No items selected</p>
                                ) : (
                                    <ul>
                                        {cart.map(item => (
                                            <li key={item.id}>
                                                <span>{item.name} ( x {item.orderQty} )</span>
                                                <div className="cart-item">
                                                    <span>${(item.price * item.orderQty).toFixed(2)}</span>
                                                    <button className='remove-product-button' onClick={() => removeFromCart(item.id)}>x</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="total-display">
                                    <strong>Total:</strong>
                                    <span>${totalCartPrice.toFixed(2)}</span> 
                                </div>
                            </div>

                            <form className="recipient-form" onSubmit={handleFinalizeOrder}>
                                <div className="form-group">
                                    <label>Recipient name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="full name"
                                        value={recipient.name}
                                        onChange={handleRecipientChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Recipient email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="user@gmail.com"
                                        value={recipient.email}
                                        onChange={handleRecipientChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Recipient IBAN</label>
                                    <input
                                        type="text"
                                        name="iban"
                                        placeholder="International bank account number"
                                        value={recipient.iban}
                                        onChange={handleRecipientChange}
                                        required
                                    />
                                </div>
                            
                                <button type="submit" className="button button-secondary">Save order</button>
                            
                            </form>
                        </div>
                    </aside>

                    {isSummaryOpen && <div className="modal-backdrop" onClick={() => setIsSummaryOpen(false)}/>}
                </div>
            </div>
        </div>
    )
}

export default CreateOrder;