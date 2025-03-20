import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useData from "../../data/data";

const Products = () => {
    const { loading, error, products } = useData();
    const [productImages, setProductImages] = useState({});

    const importImage = async (productName) => {
        try {
            const formattedName = productName.replace(/\s+/g, "");
            const module = await import(`../../ProductPhotos/${formattedName}.png`);
            return module.default;
        } catch (error) {
            console.warn(`Failed to load image for ${productName}`);
            return null;
        }
    };

    useEffect(() => {
        const loadImages = async () => {
            if (!products) return;
            const imagePromises = products.map(async (product) => {
                const image = await importImage(product.name);
                return [product.name, image];
            });
            const loadedImages = await Promise.all(imagePromises);
            setProductImages(Object.fromEntries(loadedImages));
        };

        loadImages();
    }, [products]);

    if (loading) return <div className="p-5 mx-auto">Loading products...</div>;
    if (error) return <div className="p-5 mx-auto">Error loading products: {error.message}</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
            {products &&
                products.map((product) => (
                    <Link key={product.product_id} to={`/product/${product.product_id}`}>
                        <div className="transition-all duration-300 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden hover:shadow-lg hover:shadow-gray-700 dark:hover:shadow-gray-900 cursor-pointer">
                            <div className="h-48 w-full overflow-hidden">
                                {productImages[product.name] ? (
                                    <img src={productImages[product.name]} alt={product.name} className="mt-2 w-full h-full object-scale-down" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-transparent">
                                        <span className="text-gray-400">{product.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">${product.price || "N/A"}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                    In stock: {product.stock || 0} | Category: {product.category || "Uncategorized"}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
        </div>
    );
};

export default Products;
