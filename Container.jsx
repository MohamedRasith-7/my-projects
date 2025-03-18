import React, { useEffect, useState } from 'react';
import './product.css';

const Container = () => {
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productCount, setProductCount] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showHome, setShowHome] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    const handleMenuToggle = () => setShowMenu(!showMenu);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        setFavorites(storedFavorites);
        setCartItems(storedCart);
    }, []);

    useEffect(() => {
        fetchData();
    }, [input]);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://dummyjson.com/products/search?q=${input}`);
            const result = await response.json();
            setData(result.products);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch product data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetailsClick = (product) => {
        setSelectedProduct(product);
        setProductCount(1);
        setTotalPrice(Math.round(product.price));
        setShowHome(false);
    };

    const handleBackClick = () => {
        setSelectedProduct(null);
        setShowHome(true);
    };

    const incrementCount = () => {
        setProductCount((prevCount) => prevCount + 1);
        setTotalPrice((prevTotal) => prevTotal + selectedProduct.price);
    };

    const decrementCount = () => {
        if (productCount > 1) {
            setProductCount((prevCount) => prevCount - 1);
            setTotalPrice((prevTotal) => prevTotal - selectedProduct.price);
        }
    };

    const toggleFavorite = (product) => {
        if (isFavorite(product.id)) {
            setFavorites(favorites.filter(id => id !== product.id));
        } else {
            setFavorites([...favorites, product.id]);
        }
    };

    const isFavorite = (productId) => favorites.includes(productId);

    const handleFavoriteClick = () => setShowFavorites(!showFavorites);

    const toggleCart = () => setShowCart(!showCart);

    const addToCart = (product) => {
        const existingProduct = cartItems.find(item => item.id === product.id);
        if (existingProduct) {
            setCartItems(
                cartItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.id !== productId));
    };

    const incrementCartItem = (productId) => {
        setCartItems(
            cartItems.map(item =>
                item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decrementCartItem = (productId) => {
        setCartItems(
            cartItems.map(item =>
                item.id === productId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const filteredProducts = showFavorites
        ? data.filter(product => favorites.includes(product.id))
        : data;

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark mb-4">
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="navbar-brand text-white">
                        <h2>Product Store</h2>
                    </div>
                    <button
                        className="navbar-toggler d-lg-none bg-light"
                        type="button"
                        aria-controls="navbarMenu"
                        aria-expanded={showMenu}
                        aria-label="Toggle menu"
                        onClick={handleMenuToggle}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${showMenu ? 'show' : ''}`} id="navbarMenu">
                        <div className={`d-lg-flex ${showMenu ? 'd-block' : 'd-none'}`}>
                            <input
                                type="text"
                                className="form-control me-2"
                                placeholder="Search products"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button className="btn btn-outline-light me-2" onClick={handleFavoriteClick}>
                                {showFavorites ? "All Products" : "Favorites"}{" "}
                                <i className="fa-solid fa-heart text-danger"></i>
                            </button>
                            <button aria-label="Toggle cart visibility" className="btn btn-outline-light position-relative" onClick={toggleCart}>
                                <i className="fa-solid fa-cart-shopping fa-lg"></i>
                                {cartItems.length > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cartItems.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {showHome ? (
                <div className="container my-4">
                    {isLoading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="row">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="product-container col-sm-6 col-md-4 col-lg-3 mb-4">
                                    <div className="card h-100 shadow-sm">
                                        <img
                                            src={product.thumbnail}
                                            className="card-img-top img-fluid"
                                            alt={product.title}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{product.title}</h5>
                                            <p className="card-text text-truncate">{product.description}</p>
                                            <div className="mt-auto">
                                                <p className="text-primary">Price: ₹{product.price}</p>
                                                <button
                                                    className="btn btn-primary btn-sm me-2"
                                                    onClick={() => handleDetailsClick(product)}
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            ) : (
                <div className="container">
                    <button className="btn btn-secondary mb-4" onClick={handleBackClick}>
                        Back to Products
                    </button>
                    <div className="row">
                        <div className="col-md-6">
                            <img
                                src={selectedProduct.thumbnail}
                                className="img-fluid rounded"
                                alt={selectedProduct.title}
                            />
                        </div>
                        <div className="col-md-6">
                            <h1>{selectedProduct.title}</h1>
                            <p>{selectedProduct.description}</p>
                            <h4>Price: ₹{selectedProduct.price}</h4>
                            <div className="d-flex align-items-center my-3">
                                <p>Product Count </p>
                                <button className="btn btn-outline-secondary" onClick={decrementCount}>
                                    <i className="fa-solid fa-minus"></i>
                                </button>
                                <span className="mx-2">{productCount}</span>
                                <button className="btn btn-outline-secondary" onClick={incrementCount}>
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <h4>Total Price: ₹{totalPrice}</h4>
                            <div className="mt-3">
                                <button
                                    className={`btn ${isFavorite(selectedProduct.id) ? 'btn-danger' : 'btn-outline-danger'} me-2`}
                                    onClick={() => toggleFavorite(selectedProduct)}
                                >
                                    {isFavorite(selectedProduct.id) ? "Remove Favorite" : "Add to Favorite"}{" "}
                                    <i className="fa-solid fa-heart"></i>
                                </button>
                                <button
                                    className="btn btn-warning me-2"
                                    onClick={() => addToCart(selectedProduct)}
                                >
                                    Add to Cart <i className="fa-solid fa-cart-plus"></i>
                                </button>
                                <button className="btn btn-success">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCart && (
                <div className="cart-modal">
                    <div className="cart-content">
                        <button className="btn btn-secondary mb-4" onClick={toggleCart}>
                            Close Cart
                        </button>
                        <h4>Shopping Cart</h4>
                        {cartItems.length > 0 ? (
                            <div>
                                <ul className="list-group mb-4">
                                    {cartItems.map((item) => (
                                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="cart-item-info">
                                                <h5>{item.title}</h5>
                                                <p>Price: ₹{item.price}</p>
                                                <div className="d-flex align-items-center">
                                                    <span>Product Count: {item.quantity}</span>
                                                </div>
                                            </div>
                                            <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <h4>Total purchased Price: ₹{getCartTotal()}</h4>
                            </div>
                        ) : (
                            <p>Your cart is empty.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Container;
