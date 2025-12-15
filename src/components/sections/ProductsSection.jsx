import React, {useState} from 'react';
import {Baby, Check, ShoppingCart, Sparkles, Timer, Users, Zap} from 'lucide-react';
import Button from '../common/Button.jsx';
import {useCart} from '../../hooks/useCart';
import {useNavigate} from 'react-router-dom';

const ProductsSection = ({product}) => {
    const {addItem} = useCart();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addItem(product, quantity);
        navigate('/cart');
    };

    const getIcon = () => {
        if (product.name.includes('Kid')) return Baby;
        if (product.name.includes('Adult')) return Zap;
        if (product.name.includes('Family')) return Users;
        if (product.name.includes('All Day')) return Timer;
        return Sparkles;
    };

    const Icon = getIcon();

    return (
        <div className={`
      rounded-2xl border-2 p-8 shadow-lg h-full flex flex-col relative bg-white transition-all duration-300
      ${product.isPopular
            ? 'border-red-600 shadow-xl hover:shadow-2xl scale-105'
            : 'border-gray-200 hover:border-red-400 hover:shadow-xl'
        }
    `}>
            {product.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div
                        className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <Sparkles className="h-4 w-4"/>
                        BEST VALUE
                    </div>
                </div>
            )}

            <div className="mb-6 text-center">
                <div className={`inline-flex p-4 rounded-xl mb-4 ${product.isPopular ? 'bg-red-600' : 'bg-red-100'}`}>
                    <Icon className={`h-8 w-8 ${product.isPopular ? 'text-white' : 'text-red-600'}`}/>
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-2">{product.name}</h3>
                {product.description && (
                    <p className="text-gray-600 font-semibold">{product.description}</p>
                )}
            </div>

            <div className="mb-8 text-center">
                <span className="text-5xl font-bold text-navy-900">{product.price}</span>
            </div>

            <ul className="mb-8 space-y-4 flex-grow">
                {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <Check size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0"/>
                        <span className="text-gray-700">{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2 text-center">
                    Number of People
                </label>
                <div className="flex items-center justify-center gap-3 mb-4">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center font-bold"
                    >
                        -
                    </button>
                    <span className="w-16 text-center text-2xl font-bold text-navy-900">
            {quantity}
          </span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center font-bold"
                    >
                        +
                    </button>
                </div>
            </div>

            <Button
                variant={product.isPopular ? 'primary' : 'secondary'}
                fullWidth
                onClick={handleAddToCart}
                className="flex items-center justify-center space-x-2 py-4 text-lg font-bold"
            >
                <ShoppingCart className="h-5 w-5"/>
                <span>Add to Cart</span>
            </Button>
        </div>
    );
};

export default ProductsSection;
