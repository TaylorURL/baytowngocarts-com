import React from 'react';
import {Check, Clock, Crown, Flag, PartyPopper, Phone, Plus, Shield, Star, Users, Zap} from 'lucide-react';
import {Link} from 'react-router-dom';
import Button from '../components/common/Button.jsx';

const EventsPage = () => {
    const mainPackageFeatures = [
        'Includes 20 Racing Bracelets',
        '2 hours of organized racing',
        'Racing bracelets can be shared or rotated among guests',
        'Everyone gets multiple chances to race',
        'Staff manages racing for safety & smooth flow',
        'Shared track with public riders',
        '3 hours in a private party room',
        'Party room accommodates up to 45 guests',
        'Outdoor seating available at no extra cost',
        'Tables & chairs fully set up',
        'Wristbands included',
    ];

    const upgrades = [
        {
            title: 'Bounce House + Game Tables',
            price: '+$150',
            description: 'Adds extra fun for kids between races',
            icon: PartyPopper,
            isPopular: true,
        },
        {
            title: 'Race Together Upgrade',
            price: '+$150',
            description: 'Your group races at the same time instead of being split up',
            icon: Users,
        },
        {
            title: 'Private Track Upgrade (2 Hours)',
            price: '+$700',
            description: 'Exclusive use of the track — no public riders during your party',
            icon: Crown,
        },
        {
            title: 'Additional Racing Bracelets',
            price: 'Ask for details',
            description: 'Add more bracelets for larger groups',
            icon: Plus,
        },
    ];

    const benefits = [
        {
            icon: Check,
            text: 'Simple, upfront pricing',
        },
        {
            icon: Users,
            text: 'Flexible racing for different ages',
        },
        {
            icon: Shield,
            text: 'No stress over guest count',
        },
        {
            icon: Zap,
            text: 'Organized, safe, and exciting',
        },
        {
            icon: Star,
            text: 'Friendly staff handles everything',
        },
    ];

    return (
        <div className="w-full -mt-20">
            <section className="relative bg-navy-900 overflow-hidden pt-32 pb-20 min-h-[70vh] flex items-center">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30"
                        style={{backgroundImage: 'url(/images/14.JPEG)'}}
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
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Flag className="h-8 w-8 text-red-500"/>
                            <span className="text-white text-2xl font-bold tracking-wider">ALL-ACCESS FAMILY RACE PARTIES</span>
                            <Flag className="h-8 w-8 text-red-500"/>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                            The Fun, <span className="text-red-500">Stress-Free</span> Way to Celebrate!
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Perfect for birthdays, school groups, teams & family celebrations
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <div
                                className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50">
                                <PartyPopper className="h-5 w-5 text-red-500"/>
                                <span className="text-white font-semibold">Birthday Parties</span>
                            </div>
                            <div
                                className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50">
                                <Users className="h-5 w-5 text-red-500"/>
                                <span className="text-white font-semibold">School Groups</span>
                            </div>
                            <div
                                className="flex items-center gap-2 bg-navy-800 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-600 border-opacity-50">
                                <Star className="h-5 w-5 text-red-500"/>
                                <span className="text-white font-semibold">Family Celebrations</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-white"
                     style={{clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)'}}/>
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12" data-aos="fade-up">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-yellow-400 text-navy-900 rounded-full text-sm font-bold tracking-wider">
                                <Star className="h-5 w-5"/>
                                MOST POPULAR PARTY PACKAGE
                                <Star className="h-5 w-5"/>
                            </div>
                        </div>

                        <div
                            className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl shadow-2xl overflow-hidden border-4 border-red-600"
                            data-aos="fade-up"
                        >
                            <div className="p-8 lg:p-12">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                        All-Access Family Race Party
                                    </h2>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-5xl lg:text-6xl font-bold text-red-500">$699</span>
                                        <span className="text-xl text-gray-400">+ tax</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    {mainPackageFeatures.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5"/>
                                            <span className="text-white text-lg">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-navy-700 bg-opacity-50 rounded-2xl p-6 text-center">
                                    <p className="text-xl text-gray-300">
                                        Easy for parents. Exciting for kids. Fun for everyone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
                        <div className="inline-block mb-4 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold tracking-wider">
                            POPULAR PARTY UPGRADES
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
                            Make Your Party Even Better
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {upgrades.map((upgrade, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-2xl shadow-xl p-8 relative hover-lift ${
                                    upgrade.isPopular ? 'border-2 border-red-600' : 'border-2 border-gray-200'
                                }`}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                {upgrade.isPopular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                                            <Star className="h-4 w-4"/>
                                            MOST POPULAR
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    <div className="bg-red-100 p-4 rounded-xl flex-shrink-0">
                                        <upgrade.icon className="h-8 w-8 text-red-600"/>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-navy-900 mb-2">{upgrade.title}</h3>
                                        <p className="text-gray-600 mb-3">{upgrade.description}</p>
                                        <div className="text-2xl font-bold text-red-600">{upgrade.price}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12" data-aos="fade-up">
                            <div className="inline-block mb-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold tracking-wider">
                                WHY FAMILIES LOVE OUR PARTIES
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
                                The Perfect Party Experience
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" data-aos="fade-up">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-2xl p-6 text-center hover-lift"
                                >
                                    <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <benefit.icon className="h-7 w-7 text-green-600"/>
                                    </div>
                                    <p className="text-navy-900 font-semibold">{benefit.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
                        <Phone className="h-16 w-16 mx-auto mb-6"/>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Book Your Party Today!
                        </h2>
                        <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                            Ready to create an unforgettable celebration? Contact us now to reserve your party date!
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
                                    Contact Form
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                            <div className="bg-navy-800 bg-opacity-70 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                                    <Clock className="h-5 w-5"/>
                                    Quick Info
                                </h4>
                                <ul className="space-y-2 text-white">
                                    <li>Advance booking recommended</li>
                                    <li>Groups of all sizes welcome</li>
                                    <li>Flexible scheduling options</li>
                                </ul>
                            </div>
                            <div className="bg-navy-800 bg-opacity-70 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                                    <PartyPopper className="h-5 w-5"/>
                                    What's Included
                                </h4>
                                <ul className="space-y-2 text-white">
                                    <li>All-inclusive packages</li>
                                    <li>Staff handles everything</li>
                                    <li>Setup and cleanup included</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EventsPage;
