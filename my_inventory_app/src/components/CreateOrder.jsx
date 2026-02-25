import Sidebar from "./Sidebar";
import '../styles/CreateOrder.css';
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";

function CreateOrder() {
    const { items: stocks } = useSelector((state) => state.stocks);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQtys, setSelectedQtys] = useState({});

    const filteredStocks = useMemo(() => {
        return stocks.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [stocks, searchQuery]);

    const handleQtysChange = (id, val, max) => {
        const value = Math.max(1, Math.min(Number(val), max));
        setSelectedQtys(prev => ({...prev, [id]: value}));
    }

    return (
        <div className="orders-layout">
            <Sidebar />
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
                                                    <button className="add-button">Add to order</button>
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

                    {/* Right: Static Order Summary */}
                    <aside className="order-summary">
                        <div className="summary-content">
                            <h3>Order summary</h3>
                            <p>Items added to your order will appear here.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default CreateOrder;