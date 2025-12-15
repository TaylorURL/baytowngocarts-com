import React from 'react';
import {Baby, Check, Clock, Download, Gift, Phone, Shield, Sparkles, TrendingUp, Users, Zap} from 'lucide-react';
import ProductsSection from '../components/sections/ProductsSection.jsx';
import {BOUNCE_PRICING} from '../lib/constants.js';
import {STRIPE_PRODUCTS} from '../lib/stripe-config.js';
import {Link} from 'react-router-dom';
import Button from '../components/common/Button.jsx';

const PricingPage = () => {
    return (
        <div className="w-full -mt-20">
            <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[70vh] flex items-center">
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
                        <div
                            className="inline-block mb-6 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold tracking-wider">
                            PRICING & PACKAGES
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                            Choose Your <span className="text-red-500">Adventure</span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Affordable racing thrills and family fun for everyone. From single races to all-day
                            excitement!
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <div
                                className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50">
                                <Check className="h-5 w-5 text-red-500"/>
                                <span className="text-white font-semibold">No Hidden Fees</span>
                            </div>
                            <div
                                className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50">
                                <Check className="h-5 w-5 text-red-500"/>
                                <span className="text-white font-semibold">Family Friendly</span>
                            </div>
                            <div
                                className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50">
                                <Check className="h-5 w-5 text-red-500"/>
                                <span className="text-white font-semibold">Best Value</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-white"
                     style={{clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)'}}/>
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
                        <div
                            className="inline-block mb-4 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold tracking-wider">
                            GO-KART RACING
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
                            Racing Packages
                        </h2>
                        <p className="text-xl text-gray-600">
                            High-speed thrills for all ages. Choose the perfect package for your racing adventure!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {STRIPE_PRODUCTS.map((product, index) => (
                            <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                <ProductsSection product={product}/>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 max-w-4xl mx-auto" data-aos="fade-up">
                        <div
                            className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 border-2 border-red-200">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-600 p-3 rounded-xl">
                                        <Zap className="h-6 w-6 text-white"/>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-2xl font-bold text-navy-900 mb-2">Questions About
                                            Packages?</h3>
                                        <p className="text-gray-700">Need help choosing the right package? Give us a
                                            call or click "Buy Now" above!</p>
                                    </div>
                                </div>
                                <a
                                    href="tel:(346) 932-1266"
                                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 whitespace-nowrap"
                                >
                                    (346) 932-1266
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
                        <div
                            className="inline-block mb-4 px-3 py-1 bg-navy-900 text-white rounded-full text-xs font-bold tracking-wider">
                            BOUNCE HOUSE
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
                            Bounce House Fun
                        </h2>
                        <p className="text-xl text-gray-600">
                            Safe jumping fun for kids of all ages. Climate-controlled indoor excitement!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {BOUNCE_PRICING.map((plan, index) => (
                            <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className={`
                  rounded-2xl border-2 p-8 shadow-lg h-full flex flex-col relative bg-white hover-lift
                  ${plan.isPopular
                                    ? 'border-red-600 shadow-xl'
                                    : 'border-gray-200 hover:border-red-300 transition-all duration-300'
                                }
                `}>
                                    {plan.isPopular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <div
                                                className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                                                <Sparkles className="h-4 w-4"/>
                                                MOST POPULAR
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-6 text-center">
                                        <div className="inline-flex bg-red-100 p-4 rounded-xl mb-4">
                                            <Baby className="h-8 w-8 text-red-600"/>
                                        </div>
                                        <h3 className="text-2xl font-bold text-navy-900 mb-2">{plan.title}</h3>
                                        {plan.description && (
                                            <p className="text-gray-600 font-semibold">{plan.description}</p>
                                        )}
                                    </div>

                                    <div className="mb-8 text-center">
                                        <span className="text-5xl font-bold text-navy-900">{plan.price}</span>
                                        <span className="text-gray-600 ml-2">per person</span>
                                    </div>

                                    <ul className="mb-8 space-y-4 flex-grow">
                                        {plan.items.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start">
                                                <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0"/>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 ${
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

                    <div className="mt-16 max-w-4xl mx-auto" data-aos="fade-up">
                        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <div
                                        className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Shield className="h-8 w-8 text-red-600"/>
                                    </div>
                                    <h4 className="font-bold text-navy-900 mb-2">Safe & Clean</h4>
                                    <p className="text-gray-600 text-sm">Supervised and sanitized daily</p>
                                </div>
                                <div>
                                    <div
                                        className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Zap className="h-8 w-8 text-red-600"/>
                                    </div>
                                    <h4 className="font-bold text-navy-900 mb-2">Climate Controlled</h4>
                                    <p className="text-gray-600 text-sm">Comfortable indoor environment</p>
                                </div>
                                <div>
                                    <div
                                        className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Users className="h-8 w-8 text-red-600"/>
                                    </div>
                                    <h4 className="font-bold text-navy-900 mb-2">All Ages Welcome</h4>
                                    <p className="text-gray-600 text-sm">Fun for the whole family</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-navy-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-cover bg-center"
                         style={{backgroundImage: 'url(/images/15.JPEG)'}}/>
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16" data-aos="fade-up">
                            <div
                                className="inline-block mb-4 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold tracking-wider">
                                IMPORTANT INFO
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                                Before You Visit
                            </h2>
                            <p className="text-xl text-gray-300">
                                Everything you need to know for an amazing experience
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            <div
                                className="bg-navy-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 border border-red-600 border-opacity-30"
                                data-aos="fade-right">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-red-600 p-3 rounded-xl">
                                        <Users className="h-6 w-6"/>
                                    </div>
                                    <h3 className="text-2xl font-bold">Age & Size Guidelines</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-red-500 mt-1 flex-shrink-0"/>
                                        <div>
                                            <span className="font-semibold text-red-400">Kid Karts:</span>
                                            <span className="text-gray-300"> Ages 8-13, minimum 48" tall</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-red-500 mt-1 flex-shrink-0"/>
                                        <div>
                                            <span className="font-semibold text-red-400">Adult Karts:</span>
                                            <span className="text-gray-300"> Ages 14+, minimum 58" tall</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-red-500 mt-1 flex-shrink-0"/>
                                        <div>
                                            <span className="font-semibold text-red-400">Safety First:</span>
                                            <span className="text-gray-300"> All drivers follow safety guidelines</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div
                                className="bg-navy-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 border border-red-600 border-opacity-30"
                                data-aos="fade-left">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-red-600 p-3 rounded-xl">
                                        <Clock className="h-6 w-6"/>
                                    </div>
                                    <h3 className="text-2xl font-bold">Racing Policies</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-red-500 mt-1 flex-shrink-0"/>
                                        <div>
                                            <span className="text-gray-300">3-Race Combo must be used same day</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-red-500 mt-1 flex-shrink-0"/>
                                        <div>
                                            <span
                                                className="text-gray-300">Safety equipment provided at no charge</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-red-500 mt-1 flex-shrink-0"/>
                                        <div>
                                            <span
                                                className="text-gray-300">Signed waiver required for all participants</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-red-500 mt-1 flex-shrink-0"/>
                                        <div>
                                            <span
                                                className="text-gray-300">No refunds or credits after leaving premises</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-8 text-center"
                                 data-aos="fade-up">
                                <Gift className="h-12 w-12 mx-auto mb-4"/>
                                <h3 className="text-2xl font-bold mb-3">Group Discounts Available</h3>
                                <p className="text-red-100 mb-6">
                                    Planning a party or group event? Contact us for special pricing on party packages
                                    and group bookings!
                                </p>
                                <Link to="/contact">
                                    <Button size="lg" variant="outline"
                                            className="bg-white text-red-600 hover:bg-gray-100 border-0">
                                        Get Group Pricing
                                    </Button>
                                </Link>
                            </div>

                            <div
                                className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-2xl p-8 text-center border-2 border-red-600"
                                data-aos="fade-up" data-aos-delay="100">
                                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-red-500"/>
                                <h3 className="text-2xl font-bold mb-3">Race Swap Option</h3>
                                <p className="text-gray-300 mb-6">
                                    No kids in your group? Swap 3 kid races for 2 adult races at no extra charge in any
                                    Family Deal!
                                </p>
                                <a
                                    href="tel:(346) 932-1266"
                                    className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
                                >
                                    Call to Book
                                </a>
                            </div>
                        </div>

                        <div
                            className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20"
                            data-aos="fade-up">
                            <div className="flex items-center gap-3 mb-6 justify-center">
                                <div className="bg-red-600 p-3 rounded-xl">
                                    <Download className="h-6 w-6"/>
                                </div>
                                <h3 className="text-2xl font-bold">Download Waivers</h3>
                            </div>
                            <p className="text-gray-300 mb-6 text-center max-w-2xl mx-auto">
                                All participants must complete a waiver before racing. Download and complete before your
                                visit for faster check-in!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/images/Speedway146_Waiver_Address_Footer_Fixed.pdf"
                                    download
                                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl transition-all hover:scale-105 text-center font-bold flex items-center justify-center gap-2"
                                >
                                    <Download className="h-5 w-5"/>
                                    Go-Kart Waiver
                                </a>
                                <a
                                    href="/images/Bounce House Participant Waiver and Release PDF.pdf"
                                    download
                                    className="bg-navy-800 hover:bg-navy-700 text-white px-8 py-4 rounded-xl transition-all hover:scale-105 text-center font-bold flex items-center justify-center gap-2"
                                >
                                    <Download className="h-5 w-5"/>
                                    Bounce House Waiver
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Start Racing?
                        </h2>
                        <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                            Call us today to book your racing package and create unforgettable memories!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:(346) 932-1266"
                                className="inline-flex items-center justify-center bg-white text-red-600 hover:bg-gray-100 px-10 py-5 rounded-xl font-bold text-xl transition-all hover:scale-105"
                            >
                                <Phone className="h-6 w-6 mr-3"/>
                                (346) 932-1266
                            </a>
                            <Link to="/contact">
                                <Button size="lg" variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-red-600 text-xl px-10 py-5">
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
