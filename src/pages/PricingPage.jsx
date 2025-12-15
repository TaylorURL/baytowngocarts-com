import React, {useState} from 'react';
import {Baby, Check, Clock, Download, Gift, HelpCircle, Minus, Phone, Plus, Shield, ShoppingCart, Sparkles, Timer, TrendingUp, Users, Zap} from 'lucide-react';
import {BOUNCE_PRICING} from '../lib/constants.js';
import {STRIPE_PRODUCTS} from '../lib/stripe-config.js';
import {Link, useNavigate} from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import {useCart} from '../hooks/useCart';

const PricingPage = () => {
    const navigate = useNavigate();
    const {addItem} = useCart();
    const [quantities, setQuantities] = useState({});
    const [showCartNotification, setShowCartNotification] = useState(false);

    const getQuantity = (productId) => quantities[productId] || 0;

    const updateQuantity = (productId, delta) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(0, (prev[productId] || 0) + delta)
        }));
    };

    const setQuantityDirect = (productId, value) => {
        const num = parseInt(value) || 0;
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(0, num)
        }));
    };

    const getTotalItems = () => {
        return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    };

    const getTotalPrice = () => {
        return STRIPE_PRODUCTS.reduce((sum, product) => {
            const qty = getQuantity(product.id);
            const price = parseFloat(product.price.replace('$', ''));
            return sum + (qty * price);
        }, 0);
    };

    const handleAddAllToCart = () => {
        STRIPE_PRODUCTS.forEach(product => {
            const qty = getQuantity(product.id);
            if (qty > 0) {
                addItem(product, qty);
            }
        });
        setQuantities({});
        setShowCartNotification(true);
        setTimeout(() => setShowCartNotification(false), 3000);
    };

    const handleGoToCart = () => {
        STRIPE_PRODUCTS.forEach(product => {
            const qty = getQuantity(product.id);
            if (qty > 0) {
                addItem(product, qty);
            }
        });
        navigate('/cart');
    };

    const getIcon = (name) => {
        if (name.includes('Kid')) return Baby;
        if (name.includes('Adult')) return Zap;
        if (name.includes('Family')) return Users;
        if (name.includes('2.5') || name.includes('Hour')) return Timer;
        return Sparkles;
    };

    return (
        <div className="w-full -mt-20">
            <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[50vh] flex items-center">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30"
                        style={{backgroundImage: 'url(/images/17.JPEG)'}}
                    />
                </div>

                <div
                    className="absolute inset-0 z-5 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(45deg, var(--color-black) 25%, transparent 25%), linear-gradient(-45deg, var(--color-black) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-black) 75%), linear-gradient(-45deg, transparent 75%, var(--color-black) 75%)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                />

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
                        <div className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold tracking-wider">
                            PRICING & PACKAGES
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                            Build Your <span className="text-red-500">Package</span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Select multiple items below and add them all to your cart at once!
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50"
                     style={{clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)'}}/>
            </section>

            {showCartNotification && (
                <div className="fixed top-24 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
                    <Check className="h-6 w-6"/>
                    <span className="font-bold">Items added to cart!</span>
                </div>
            )}

            <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-red-600 shadow-2xl p-4 md:p-6 transition-transform duration-300 ${getTotalItems() > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-600 p-3 rounded-xl">
                            <ShoppingCart className="h-6 w-6 text-white"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Your Selection</p>
                            <p className="text-2xl font-bold text-navy-900">
                                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} - ${getTotalPrice().toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={handleAddAllToCart}
                            className="flex-1 md:flex-none bg-navy-900 hover:bg-navy-800 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="h-5 w-5"/>
                            Add to Cart
                        </button>
                        <button
                            onClick={handleGoToCart}
                            className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="h-5 w-5"/>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>

            <section className="py-16 pb-32 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-12" data-aos="fade-up">
                        <div className="inline-block mb-4 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold tracking-wider">
                            GO-KART RACING
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
                            Racing Packages
                        </h2>
                        <p className="text-lg text-gray-600">
                            Select quantities for each package you want, then add everything to your cart
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 max-w-7xl mx-auto">
                        {STRIPE_PRODUCTS.map((product) => {
                            const Icon = getIcon(product.name);
                            const qty = getQuantity(product.id);
                            const isSelected = qty > 0;

                            return (
                                <div
                                    key={product.id}
                                    className={`
                                        rounded-2xl border-2 p-5 shadow-lg bg-white transition-all duration-300 relative flex flex-col
                                        ${product.isPopular ? 'border-red-600 shadow-xl' : ''}
                                        ${isSelected ? 'border-red-500 ring-2 ring-red-500 ring-opacity-50' : 'border-gray-200 hover:border-red-300'}
                                    `}
                                >
                                    {product.isPopular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap">
                                                <Sparkles className="h-3 w-3"/>
                                                BEST VALUE
                                            </div>
                                        </div>
                                    )}

                                    {isSelected && (
                                        <div className="absolute -top-3 -right-3 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold shadow-lg text-sm">
                                            {qty}
                                        </div>
                                    )}

                                    <div className="text-center mb-3">
                                        <div className={`inline-flex p-3 rounded-xl mb-2 ${product.isPopular ? 'bg-red-600' : 'bg-red-100'}`}>
                                            <Icon className={`h-5 w-5 ${product.isPopular ? 'text-white' : 'text-red-600'}`}/>
                                        </div>
                                        <h3 className="text-base font-bold text-navy-900 leading-tight">{product.name}</h3>
                                        {product.description && (
                                            <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                                        )}
                                        <div className="mt-2">
                                            <span className="text-2xl font-bold text-navy-900">{product.price}</span>
                                            <p className="text-xs text-gray-500">per person</p>
                                        </div>
                                    </div>

                                    <ul className="mb-3 space-y-1.5 flex-grow">
                                        {product.features.slice(0, 3).map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-xs">
                                                <Check size={12} className="text-green-600 mr-1.5 mt-0.5 flex-shrink-0"/>
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(product.id, -1)}
                                                disabled={qty === 0}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold transition-colors ${
                                                    qty === 0
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                                }`}
                                            >
                                                <Minus className="h-4 w-4"/>
                                            </button>
                                            <input
                                                type="number"
                                                min="0"
                                                value={qty}
                                                onChange={(e) => setQuantityDirect(product.id, e.target.value)}
                                                className="w-14 text-center text-lg font-bold text-navy-900 border-2 border-gray-200 rounded-lg py-1 focus:border-red-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <button
                                                onClick={() => updateQuantity(product.id, 1)}
                                                className="w-9 h-9 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center font-bold transition-colors"
                                            >
                                                <Plus className="h-4 w-4"/>
                                            </button>
                                        </div>
                                        {isSelected && (
                                            <div className="mt-2 bg-red-50 rounded-lg py-1.5 text-center">
                                                <span className="text-red-600 font-bold text-sm">
                                                    ${(parseFloat(product.price.replace('$', '')) * qty).toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 max-w-6xl mx-auto" data-aos="fade-up">
                        <Link to="/faq" className="block">
                            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-200 hover:border-red-400 transition-all hover:shadow-lg">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-red-600 p-3 rounded-xl">
                                            <HelpCircle className="h-6 w-6 text-white"/>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-navy-900 mb-1">Have Questions?</h3>
                                            <p className="text-gray-700">Check out our FAQ page for answers to common questions</p>
                                        </div>
                                    </div>
                                    <div className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all whitespace-nowrap">
                                        View FAQ
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-12" data-aos="fade-up">
                        <div className="inline-block mb-4 px-3 py-1 bg-navy-900 text-white rounded-full text-xs font-bold tracking-wider">
                            BOUNCE HOUSE
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
                            Bounce House Fun
                        </h2>
                        <p className="text-lg text-gray-600">
                            Safe jumping fun for kids of all ages. Climate-controlled indoor excitement!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {BOUNCE_PRICING.map((plan, idx) => (
                            <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100}>
                                <div className={`
                                    rounded-2xl border-2 p-6 shadow-lg h-full flex flex-col relative bg-white hover-lift
                                    ${plan.isPopular ? 'border-red-600 shadow-xl' : 'border-gray-200 hover:border-red-300 transition-all duration-300'}
                                `}>
                                    {plan.isPopular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                <Sparkles className="h-3 w-3"/>
                                                MOST POPULAR
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-4 text-center">
                                        <div className="inline-flex bg-red-100 p-3 rounded-xl mb-3">
                                            <Baby className="h-6 w-6 text-red-600"/>
                                        </div>
                                        <h3 className="text-xl font-bold text-navy-900 mb-1">{plan.title}</h3>
                                        {plan.description && (
                                            <p className="text-gray-600 text-sm">{plan.description}</p>
                                        )}
                                    </div>

                                    <div className="mb-4 text-center">
                                        <span className="text-4xl font-bold text-navy-900">{plan.price}</span>
                                        <span className="text-gray-600 ml-1 text-sm">per person</span>
                                    </div>

                                    <ul className="mb-4 space-y-2 flex-grow">
                                        {plan.items.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start text-sm">
                                                <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0"/>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className={`w-full py-3 rounded-xl font-bold transition-all hover:scale-105 ${
                                            plan.isPopular
                                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                                                : 'bg-navy-900 hover:bg-navy-800 text-white'
                                        }`}
                                        onClick={() => window.location.href = '/contact'}
                                    >
                                        Reserve Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 max-w-4xl mx-auto" data-aos="fade-up">
                        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Shield className="h-6 w-6 text-red-600"/>
                                    </div>
                                    <h4 className="font-bold text-navy-900 mb-1">Safe & Clean</h4>
                                    <p className="text-gray-600 text-sm">Supervised and sanitized daily</p>
                                </div>
                                <div>
                                    <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Zap className="h-6 w-6 text-red-600"/>
                                    </div>
                                    <h4 className="font-bold text-navy-900 mb-1">Climate Controlled</h4>
                                    <p className="text-gray-600 text-sm">Comfortable indoor environment</p>
                                </div>
                                <div>
                                    <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Users className="h-6 w-6 text-red-600"/>
                                    </div>
                                    <h4 className="font-bold text-navy-900 mb-1">All Ages Welcome</h4>
                                    <p className="text-gray-600 text-sm">Fun for the whole family</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-navy-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-cover bg-center"
                         style={{backgroundImage: 'url(/images/15.JPEG)'}}/>
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12" data-aos="fade-up">
                            <div className="inline-block mb-4 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold tracking-wider">
                                IMPORTANT INFO
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                                Before You Visit
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                            <div className="bg-navy-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-6 border border-red-600 border-opacity-30" data-aos="fade-right">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-red-600 p-2 rounded-xl">
                                        <Users className="h-5 w-5"/>
                                    </div>
                                    <h3 className="text-xl font-bold">Age & Size Guidelines</h3>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"/>
                                        <div>
                                            <span className="font-semibold text-red-400">Kid Karts:</span>
                                            <span className="text-gray-300"> Ages 8-13, minimum 48" tall</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"/>
                                        <div>
                                            <span className="font-semibold text-red-400">Adult Karts:</span>
                                            <span className="text-gray-300"> Ages 14+, minimum 58" tall</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-navy-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-6 border border-red-600 border-opacity-30" data-aos="fade-left">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-red-600 p-2 rounded-xl">
                                        <Clock className="h-5 w-5"/>
                                    </div>
                                    <h3 className="text-xl font-bold">Racing Policies</h3>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"/>
                                        <span className="text-gray-300">3-Race Combo must be used same day</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"/>
                                        <span className="text-gray-300">Signed waiver required for all participants</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-2xl p-6 text-center border-2 border-red-600" data-aos="fade-up">
                                <Gift className="h-10 w-10 mx-auto mb-3 text-red-500"/>
                                <h3 className="text-xl font-bold mb-2 text-white">Group Discounts</h3>
                                <p className="text-gray-300 mb-4 text-sm">
                                    Planning a party or group event? Contact us for special pricing!
                                </p>
                                <div className="flex justify-center">
                                    <Link to="/contact">
                                        <Button size="md" variant="outline" className="bg-red-600 hover:bg-red-700 text-white border-0">
                                            Get Group Pricing
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-2xl p-6 text-center border-2 border-red-600" data-aos="fade-up" data-aos-delay="100">
                                <TrendingUp className="h-10 w-10 mx-auto mb-3 text-red-500"/>
                                <h3 className="text-xl font-bold mb-2 text-white">Race Swap Option</h3>
                                <p className="text-gray-300 mb-4 text-sm">
                                    Swap 3 kid races for 2 adult races in any Family Deal!
                                </p>
                                <a href="tel:(346) 932-1266" className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-all">
                                    Call to Book
                                </a>
                            </div>
                        </div>

                        <div className="bg-navy-800 bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-red-600 border-opacity-30" data-aos="fade-up">
                            <div className="flex items-center gap-3 mb-4 justify-center">
                                <div className="bg-red-600 p-2 rounded-xl">
                                    <Download className="h-5 w-5 text-white"/>
                                </div>
                                <h3 className="text-xl font-bold text-white">Download Waivers</h3>
                            </div>
                            <p className="text-gray-200 mb-4 text-center text-sm max-w-2xl mx-auto">
                                Complete before your visit for faster check-in!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a
                                    href="/images/Speedway146_Waiver_Address_Footer_Fixed.pdf"
                                    download
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all hover:scale-105 text-center font-bold flex items-center justify-center gap-2"
                                >
                                    <Download className="h-4 w-4"/>
                                    Go-Kart Waiver
                                </a>
                                <a
                                    href="/images/Bounce House Participant Waiver and Release PDF.pdf"
                                    download
                                    className="bg-navy-800 hover:bg-navy-700 text-white px-6 py-3 rounded-xl transition-all hover:scale-105 text-center font-bold flex items-center justify-center gap-2"
                                >
                                    <Download className="h-4 w-4"/>
                                    Bounce House Waiver
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                            Ready to Race?
                        </h2>
                        <p className="text-xl text-red-100 mb-6 max-w-2xl mx-auto">
                            Select your packages above or call us to book!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:(346) 932-1266"
                                className="inline-flex items-center justify-center bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                            >
                                <Phone className="h-5 w-5 mr-2"/>
                                (346) 932-1266
                            </a>
                            <Link to="/contact">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-4">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
