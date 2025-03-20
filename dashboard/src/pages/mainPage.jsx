import React, { useState, useEffect } from "react";
import useData from '../components/data/data';

const MainPage = () => {
    const {
        loading,
        error,
        orders,
        users,
        orderItems,
        products,
    } = useData();

    // State to store imported images
    const [productImages, setProductImages] = useState({});

    // Function to dynamically import a specific image
    const importImage = async (productName) => {
        try {
            const formattedName = productName.replace(/\s+/g, '');
            // Dynamic import with try/catch
            const module = await import(`../components/ProductPhotos/${formattedName}.png`);
            return module.default; // ES modules return the default export
        } catch (error) {
            console.warn(`Failed to load image for ${productName}`);
            return null;
        }
    };

    // Load images for all products when component mounts
    useEffect(() => {
        const loadImages = async () => {
            if (!products) return;
            
            const imagePromises = products.map(async (product) => {
                const image = await importImage(product.name);
                return [product.name, image];
            });
            
            const loadedImages = await Promise.all(imagePromises);
            const imageMap = Object.fromEntries(loadedImages);
            setProductImages(imageMap);
        };
        
        loadImages();
    }, [products]);

    if (loading) return <div className="p-5 mx-auto">Loading products...</div>;
    if (error) return <div className="p-5 mx-auto">Error loading products: {error.message}</div>;

    return (
        <div className="p-5 ml-15 mr-15 mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Main Page</h1>
        </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
                {products && products.map((product) => (
                    <div key={product.product_id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 w-full overflow-hidden">
                            {productImages[product.name] ? (
                                <img 
                                    src={productImages[product.name]} 
                                    alt={product.name}
                                    className="ml-5 mt-2 w-90 h-55 object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-transparent">
                                    <span className="text-gray-400">{product.name}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">${product.price || 'N/A'}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                In stock: {product.stock || 0} | Category: {product.category || 'Uncategorized'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainPage;