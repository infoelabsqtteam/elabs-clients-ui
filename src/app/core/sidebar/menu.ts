import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'menu',
        isTitle: true
    },
    {
        id: 2,
        label: 'Dashboard',
        icon: 'ri-dashboard-line',
        badge: {
            variant: 'success',
            text: '03',
        },
        link: '/'
    },
    {
        id: 3,
        label: 'Calendar',
        icon: 'ri-calendar-2-line',
        link: '/calendar'
    },
    {
        id: 4,
        label: 'Chat',
        icon: 'ri-chat-1-line',
        link: '/chat'
    },
    {
        id: 5,
        label: 'Ecommerce',
        icon: 'ri-store-2-line',
        subItems: [
            {
                id: 6,
                label: 'Products',
                link: '/ecommerce/products',
                parentid: 5,
                subItems: [
                    {
                        id: 6,
                        label: 'Products',
                        link: '/ecommerce/products',
                        parentid: 5
                    },
                    {
                        id: 8,
                        label: 'Orders',
                        link: '/ecommerce/orders',
                        parentid: 5
                    },
                    {
                        id: 9,
                        label: 'Customers',
                        link: '/ecommerce/customers',
                        parentid: 5
                    }
                ]
            },
            {
                id: 8,
                label: 'Orders',
                link: '/ecommerce/orders',
                parentid: 5
            },
            {
                id: 9,
                label: 'Customers',
                link: '/ecommerce/customers',
                parentid: 5
            },
            {
                id: 10,
                label: 'Cart',
                link: '/ecommerce/cart',
                parentid: 5
            },
            {
                id: 11,
                label: 'Checkout',
                link: '/ecommerce/checkout',
                parentid: 5
            },
            {
                id: 12,
                label: 'Shops',
                link: '/ecommerce/shops',
                parentid: 5
            },
            {
                id: 13,
                label: 'Add Product',
                link: '/ecommerce/add-product',
                parentid: 5
            },
        ]
    },
    {
        id: 14,
        label: 'Email',
        icon: 'ri-mail-send-line',
        subItems: [
            {
                id: 15,
                label: 'Inbox',
                link: '/email/inbox',
                parentid: 14
            },
            {
                id: 16,
                label: 'Read Email',
                link: '/email/read/1',
                parentid: 14
            }
        ]
    },
    {
        id: 15,
        label: 'Kanban',
        icon: 'ri-artboard-2-line',
        link: '/kanban-board'
    },
    {
        id: 16,
        isLayout: true
    },
    {
        id: 17,
        label: 'Pages',
        isTitle: true
    },
    {
        id: 18,
        label: 'Authentication',
        icon: 'ri-account-circle-line',
        subItems: [
            {
                id: 19,
                label: 'Login',
                link: '/pages/login-1',
                parentid: 18
            },
            {
                id: 20,
                label: 'Register',
                link: '/pages/register-1',
                parentid: 18
            },
            {
                id: 21,
                label: 'Recover Password',
                link: '/pages/recoverpwd-1',
                parentid: 18
            },
            {
                id: 22,
                label: 'Lock Screen',
                link: '/pages/lock-screen-1',
                parentid: 18
            }
        ]
    },
    {
        id: 23,
        label: 'Utility',
        icon: 'ri-profile-line',
        subItems: [
            {
                id: 24,
                label: 'Starter',
                link: '/pages/starter',
                parentid: 23
            },
            {
                id: 25,
                label: 'Maintenance',
                link: '/pages/maintenance',
                parentid: 23
            },
            {
                id: 26,
                label: 'Cooming Soon',
                link: '/pages/coming-soon',
                parentid: 23
            },
            {
                id: 27,
                label: 'Timeline',
                link: '/pages/timeline',
                parentid: 23
            },
            {
                id: 28,
                label: 'FAQs',
                link: '/pages/faqs',
                parentid: 23
            },
            {
                id: 29,
                label: 'Pricing',
                link: '/pages/pricing',
                parentid: 23
            },
            {
                id: 30,
                label: 'Error 404',
                link: '/pages/404',
                parentid: 23
            },
            {
                id: 31,
                label: 'Error 500',
                link: '/pages/500',
                parentid: 23
            },
        ]
    },
    {
        id: 32,
        label: 'Components',
        isTitle: true
    },
    {
        id: 33,
        label: 'UI Elements',
        icon: 'ri-pencil-ruler-2-line',
        subItems: [
            {
                id: 34,
                label: 'Alerts',
                link: '/ui/alerts',
                parentid: 33
            },
            {
                id: 35,
                label: 'Buttons',
                link: '/ui/buttons',
                parentid: 33
            },
            {
                id: 36,
                label: 'Cards',
                link: '/ui/cards',
                parentid: 33
            },
            {
                id: 37,
                label: 'Carousel',
                link: '/ui/carousel',
                parentid: 33
            },
            {
                id: 38,
                label: 'Dropdowns',
                link: '/ui/dropdowns',
                parentid: 33
            },
            {
                id: 39,
                label: 'Grid',
                link: '/ui/grid',
                parentid: 33
            },
            {
                id: 40,
                label: 'Images',
                link: '/ui/images',
                parentid: 33
            },
            {
                id: 41,
                label: 'Modals',
                link: '/ui/modals',
                parentid: 33
            },
            {
                id: 42,
                label: 'Range Slider',
                link: '/ui/rangeslider',
                parentid: 33
            },
            {
                id: 43,
                label: 'Progress Bars',
                link: '/ui/progressbar',
                parentid: 33
            },
            {
                id: 44,
                label: 'Sweet Alert',
                link: '/ui/sweet-alert',
                parentid: 33
            },
            {
                id: 45,
                label: 'Tabs & Accordions',
                link: '/ui/tabs-accordions',
                parentid: 33
            }
        ]
    }
];
