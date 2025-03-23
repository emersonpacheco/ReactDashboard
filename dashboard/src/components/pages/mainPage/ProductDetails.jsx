import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useData from "../../data/data";
import { CartContext } from "../../cart/ShoppingCart";
import ShoppingCart from "../../cart/ShoppingCart";

const ProductDetails = () => {
    const { productId } = useParams();
    const { loading, error, products } = useData();
    const [product, setProduct] = useState(null);
    const [productImage, setProductImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [fetchError, setFetchError] = useState(null);
    const navigate = useNavigate();
    
    // Get access to cart context safely
    const cartContext = React.useContext(CartContext);
    const addToCart = cartContext ? cartContext.addToCart : () => {
        console.error("Cart context is not available");
    };

    useEffect(() => {
        // Only run after loading is complete
        if (loading) return;

        console.log("Fetching product with ID:", productId);
        if (products && products.length > 0) {
            // Check both "id" and "product_id" properties
            const foundProduct = products.find(
                p => p.id === Number(productId) || p.product_id === Number(productId)
            );
            if (foundProduct) {
                setProduct(foundProduct);
            } else {
                setFetchError("Product not found");
                console.error("Product with ID", productId, "not found in products array");
            }
        } else {
            setFetchError("Cannot retrieve product data");
            console.error("Products array is empty or undefined");
        }
    }, [productId, products, loading]);

    const importImage = async (productName) => {
        if (!productName) return null;
        try {
            const formattedName = productName.replace(/\s+/g, "");
            console.log("Attempting to load image for:", formattedName);
            const module = await import(`../../ProductPhotos/${formattedName}.png`);
            return module.default;
        } catch (error) {
            console.warn(`Failed to load image for ${productName}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const loadImage = async () => {
            if (!product) return;
            const image = await importImage(product.name);
            setProductImage(image);
        };

        loadImage();
    }, [product]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
        }
    };

    const handleGoBack = () => {
        navigate(-1); // Go back to previous page
    };

    if (loading) {
        return <div className="p-5 mx-auto">Loading product details...</div>;
    }

    if (error) {
        return (
            <div className="p-5 mx-auto text-center">
                <p className="text-red-500">Error loading product: {error}</p>
                <button 
                    onClick={handleGoBack}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Go Back
                </button>
            </div>
        );
    }
    
    if (fetchError) {
        return (
            <div className="p-5 mx-auto text-center">
                <p className="text-red-500">{fetchError}</p>
                <button 
                    onClick={handleGoBack}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Go Back
                </button>
            </div>
        );
    }
    
    if (!product) {
        return (
            <div className="p-5 mx-auto text-center">
                <p>Product not found. The product may have been removed or the ID is incorrect.</p>
                <button 
                    onClick={handleGoBack}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <div className="h-80 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                            {productImage ? (
                                <img src={productImage} alt={product.name} className="h-full object-contain" />
                            ) : (
                                <span className="text-gray-400">{product.name}</span>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 p-6">
                        <div className="flex justify-between items-start">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{product.name}</h1>
                            <button
                                onClick={handleGoBack}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Back
                            </button>
                        </div>
                        <p className="text-xl text-blue-600 dark:text-blue-400 mt-2">${product.price || "N/A"}</p>
                        
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Description</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                {product.description || "No description available."}
                            </p>
                        </div>
                        
                        <div className="mt-6">
                            <div className="flex items-center">
                                <span className="mr-3 text-gray-700 dark:text-gray-300">Quantity:</span>
                                <div className="flex items-center border rounded-md">
                                    <button 
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))} 
                                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="px-4">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(prev => prev + 1)} 
                                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700"
                                        disabled={quantity >= (product.stock || 999)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Available: {product.stock || 0} in stock
                                </p>
                                {product.category && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Category: {product.category}
                                    </p>
                                )}
                            </div>
                            
                            <button 
                                onClick={handleAddToCart}
                                className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                                disabled={!product.stock || product.stock <= 0}
                            >
                                {!product.stock || product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {cartContext && <ShoppingCart />}
        </div>
    );
};

export default ProductDetails;
