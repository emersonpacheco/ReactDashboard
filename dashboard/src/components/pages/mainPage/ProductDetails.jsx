import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useData from "../../data/data";

const ProductDetails = ({ addToCart }) => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { products } = useData();
    const product = products?.find((p) => p.product_id === parseInt(productId));

    // Local state to store the loaded image URL
    const [imageSrc, setImageSrc] = useState(null);

    // Dynamic image import function
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

    // useEffect hook to load the image when the product is available
    useEffect(() => {
        if (product) {
            importImage(product.name).then((src) => {
                setImageSrc(src);
            });
        }
    }, [product]);

    if (!product) {
        return <div className="p-5 mx-auto">Product not found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-5">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 h-150 overflow-hidden flex items-center justify-center border dark:border-gray-900 border-gray-600">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={product.name}
                            className="w-full h-full object-scale-down"
                        />
                    ) : (
                        <span className="text-gray-400">{product.name}</span>
                    )}
                </div>
                <div className="w-full md:w-1/2 mt-10">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        {product.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-3">
                        {product.description || "No description available."}
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
                        Price: ${product.price || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Stock: {product.stock || 0}
                    </p>
                    <button
                        onClick={() => addToCart(product)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
