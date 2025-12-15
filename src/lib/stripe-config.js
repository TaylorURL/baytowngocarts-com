export const STRIPE_PRODUCTS = [
    {
        id: 'test_payment',
        priceId: 'test_payment_price',
        name: 'Test Payment',
        description: 'Live payment testing',
        price: '$1.00',
        mode: 'payment',
        features: [
            'Test live Stripe payments',
            'Verify integration works',
            'Remove after testing'
        ]
    },
    {
        id: 'prod_SuF7rI45RLsQlo',
        priceId: 'price_1RyQdACMNAD5XWq4mCpKzdh1',
        name: 'Adult Race',
        description: '5 minutes of racing',
        price: '$13.99',
        mode: 'payment',
        features: [
            'For teens and adults',
            'High-performance go-karts',
            'Safety equipment included'
        ]
    },
    {
        id: 'prod_SuF7XrzxLfJWw6',
        priceId: 'price_1RyQddCMNAD5XWq4kJANI6Ix',
        name: 'Kid Race',
        description: '5 minutes of racing',
        price: '$13.99',
        mode: 'payment',
        features: [
            'Ideal for ages 6-10',
            'Safe and fun for kids',
            'Same great experience'
        ]
    },
    {
        id: 'prod_SuF8q9mSRcmCcU',
        priceId: 'price_1RyQeHCMNAD5XWq4kSQyNRBm',
        name: '3-Race Combo',
        description: 'Save $6.98',
        price: '$34.99',
        mode: 'payment',
        features: [
            '3 Races (Adult or Kid)',
            'Same-day use only',
            'No refunds or credits'
        ],
        isPopular: false
    },
    {
        id: 'prod_family_deal',
        priceId: 'price_family_deal',
        name: 'Family Deal',
        description: '5 races - mix & match',
        price: '$59.99',
        mode: 'payment',
        features: [
            '5 Total Races',
            'Mix Adult & Kid Races',
            'Perfect for families',
            'Great value savings'
        ],
        isPopular: true
    },
    {
        id: 'prod_SuF9rhy87orqYS',
        priceId: 'price_1RyQemCMNAD5XWq4A8DpcSm9',
        name: '2.5 Hour Racing',
        description: 'Unlimited races for 2.5 hours',
        price: '$44.99',
        mode: 'payment',
        features: [
            'Unlimited races for 2.5 hours',
            'Adult or Kid karts',
            'Best value for racing enthusiasts'
        ]
    }
];
