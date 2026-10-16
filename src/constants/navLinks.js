import { ROUTES } from './routes';

export const MAIN_NAV_LINKS = [
  { name: 'Home', href: ROUTES.HOME },
  { name: 'All Products', href: ROUTES.PRODUCTS },
  { name: 'Top Deals', href: ROUTES.DEALS },
  { name: 'Best Sellers', href: ROUTES.BESTSELLERS },
];

export const FOOTER_SECTIONS = [
  {
    title: 'Departments',
    links: [
      { name: 'Electronics', href: '/department/electronics' },
      { name: 'Fashion & Apparel', href: '/department/fashion-apparel' },
      { name: 'Home & Living', href: '/department/home-living' },
      { name: 'Beauty & Wellness', href: '/department/beauty-wellness' },
      { name: 'Groceries & Essentials', href: '/department/groceries-essentials' },
      { name: 'Sports & Automotive', href: '/department/sports-automotive' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { name: 'Track Order', href: ROUTES.PROFILE },
      { name: 'Shipping Rates & Policies', href: '/#faq' },
      { name: 'Refunds & Returns', href: '/#faq' },
      { name: 'Help & FAQs', href: '/#faq' },
      { name: 'Contact Support' },
    ],
  },
  {
    title: 'About & Company',
    links: [
      { name: 'About NexCart' },
      { name: 'Careers' },
      { name: 'Sustainability Commitment' },
      { name: 'Affiliate Program' },
      { name: 'Privacy & Terms' },
    ],
  },
];
