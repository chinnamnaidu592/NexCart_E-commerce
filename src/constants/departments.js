/**
 * 6 Primary E-Commerce Departments with their assigned sub-categories,
 * unique signature colors, glowing theme metadata, and routing configuration.
 */

export const DEPARTMENTS = [
  {
    id: 'electronics',
    slug: 'electronics',
    name: 'Electronics',
    shortName: 'Electronics',
    designIdentity: 'Tech-focused, clean, and trustworthy',
    description: 'Precision hardware, high-performance computing, mobile tech, and connected essentials.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    fallbackImage: '/images/hero_scandinavian_craft_1791282659132.jpg',
    themeColor: '#2563EB',
    glowColor: '#3B82F6',
    glowRgb: '59, 130, 246',
    colors: {
      bgSoft: '#FAFAF9',
      bgSurface: '#FFFFFF',
      bgMuted: '#F5F5F4',
      bgHover: '#F5F5F4',
      border: '#E7E5E4',
      borderLight: '#F5F5F4',
      accent: '#2563EB',
      accentDark: '#1D4ED8',
      accentMuted: '#60A5FA',
      cardOverlay: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 55%, rgba(0, 0, 0, 0.05) 100%)',
    },
    iconName: 'Laptop',
    subCategories: [
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Mobile Accessories', slug: 'mobile-accessories' },
      { name: 'Smartphones', slug: 'smartphones' },
      { name: 'Tablets', slug: 'tablets' },
    ],
  },
  {
    id: 'fashion',
    slug: 'fashion-apparel',
    altSlugs: ['fashion', 'fashion-and-apparel'],
    name: 'Fashion & Apparel',
    shortName: 'Fashion',
    designIdentity: 'Trendy, elegant, and stylish',
    description: 'Timeless tailoring, sartorial apparel, luxury timepieces, and artisanal accessories.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    fallbackImage: '/images/category_craft_objects_1791282688777.jpg',
    themeColor: '#DB2777',
    glowColor: '#EC4899',
    glowRgb: '236, 72, 153',
    colors: {
      bgSoft: '#FAFAF9',
      bgSurface: '#FFFFFF',
      bgMuted: '#F5F5F4',
      bgHover: '#F5F5F4',
      border: '#E7E5E4',
      borderLight: '#F5F5F4',
      accent: '#DB2777',
      accentDark: '#BE185D',
      accentMuted: '#F472B6',
      cardOverlay: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 55%, rgba(0, 0, 0, 0.05) 100%)',
    },
    iconName: 'Sparkles',
    subCategories: [
      { name: 'Mens Shirts', slug: 'mens-shirts' },
      { name: 'Mens Shoes', slug: 'mens-shoes' },
      { name: 'Mens Watches', slug: 'mens-watches' },
      { name: 'Sunglasses', slug: 'sunglasses' },
      { name: 'Tops', slug: 'tops' },
      { name: 'Womens Bags', slug: 'womens-bags' },
      { name: 'Womens Dresses', slug: 'womens-dresses' },
      { name: 'Womens Jewellery', slug: 'womens-jewellery' },
      { name: 'Womens Shoes', slug: 'womens-shoes' },
      { name: 'Womens Watches', slug: 'womens-watches' },
    ],
  },
  {
    id: 'home-living',
    slug: 'home-living',
    altSlugs: ['home-and-living', 'home'],
    name: 'Home & Living',
    shortName: 'Home & Living',
    designIdentity: 'Warm, comfortable, and cozy',
    description: 'Artisanal furniture, textured ceramics, ambient accents, and culinary instruments.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
    fallbackImage: '/images/category_craft_objects_1791282688777.jpg',
    themeColor: '#D97706',
    glowColor: '#F59E0B',
    glowRgb: '245, 158, 11',
    colors: {
      bgSoft: '#FAFAF9',
      bgSurface: '#FFFFFF',
      bgMuted: '#F5F5F4',
      bgHover: '#F5F5F4',
      border: '#E7E5E4',
      borderLight: '#F5F5F4',
      accent: '#D97706',
      accentDark: '#B45309',
      accentMuted: '#FBBF24',
      cardOverlay: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 55%, rgba(0, 0, 0, 0.05) 100%)',
    },
    iconName: 'Home',
    subCategories: [
      { name: 'Furniture', slug: 'furniture' },
      { name: 'Home Decoration', slug: 'home-decoration' },
      { name: 'Kitchen Accessories', slug: 'kitchen-accessories' },
    ],
  },
  {
    id: 'beauty-wellness',
    slug: 'beauty-wellness',
    altSlugs: ['beauty-and-wellness', 'beauty'],
    name: 'Beauty & Wellness',
    shortName: 'Beauty & Wellness',
    designIdentity: 'Refreshing, organic, and clean',
    description: 'Botanical formulations, archival fragrances, restorative skincare, and daily rituals.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
    fallbackImage: '/images/category_craft_objects_1791282688777.jpg',
    themeColor: '#059669',
    glowColor: '#10B981',
    glowRgb: '16, 185, 129',
    colors: {
      bgSoft: '#FAFAF9',
      bgSurface: '#FFFFFF',
      bgMuted: '#F5F5F4',
      bgHover: '#F5F5F4',
      border: '#E7E5E4',
      borderLight: '#F5F5F4',
      accent: '#059669',
      accentDark: '#047857',
      accentMuted: '#34D399',
      cardOverlay: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 55%, rgba(0, 0, 0, 0.05) 100%)',
    },
    iconName: 'Heart',
    subCategories: [
      { name: 'Beauty', slug: 'beauty' },
      { name: 'Fragrances', slug: 'fragrances' },
      { name: 'Skin Care', slug: 'skin-care' },
    ],
  },
  {
    id: 'groceries',
    slug: 'groceries-essentials',
    altSlugs: ['groceries', 'groceries-and-daily-essentials'],
    name: 'Groceries & Daily Essentials',
    shortName: 'Groceries',
    designIdentity: 'Fresh, vibrant, and fast-paced',
    description: 'Farm-direct organics, pantry provisions, artisanal harvests, and household essentials.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    fallbackImage: '/images/category_craft_objects_1791282688777.jpg',
    themeColor: '#CA8A04',
    glowColor: '#EAB308',
    glowRgb: '234, 179, 8',
    colors: {
      bgSoft: '#FAFAF9',
      bgSurface: '#FFFFFF',
      bgMuted: '#F5F5F4',
      bgHover: '#F5F5F4',
      border: '#E7E5E4',
      borderLight: '#F5F5F4',
      accent: '#CA8A04',
      accentDark: '#A16207',
      accentMuted: '#FACC15',
      cardOverlay: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 55%, rgba(0, 0, 0, 0.05) 100%)',
    },
    iconName: 'ShoppingBag',
    subCategories: [
      { name: 'Groceries', slug: 'groceries' },
    ],
  },
  {
    id: 'sports-automotive',
    slug: 'sports-automotive',
    altSlugs: ['sports-and-automotive', 'automotive', 'sports'],
    name: 'Sports & Automotive',
    shortName: 'Sports & Auto',
    designIdentity: 'Energetic, active, and bold',
    description: 'Performance gear, outdoor expeditions, motorcraft hardware, and athletic precision.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
    fallbackImage: '/images/category_craft_objects_1791282688777.jpg',
    themeColor: '#0284C7',
    glowColor: '#06B6D4',
    glowRgb: '6, 182, 212',
    colors: {
      bgSoft: '#FAFAF9',
      bgSurface: '#FFFFFF',
      bgMuted: '#F5F5F4',
      bgHover: '#F5F5F4',
      border: '#E7E5E4',
      borderLight: '#F5F5F4',
      accent: '#0284C7',
      accentDark: '#0369A1',
      accentMuted: '#38BDF8',
      cardOverlay: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 55%, rgba(0, 0, 0, 0.05) 100%)',
    },
    iconName: 'Compass',
    subCategories: [
      { name: 'Motorcycle', slug: 'motorcycle' },
      { name: 'Sports Accessories', slug: 'sports-accessories' },
      { name: 'Vehicle', slug: 'vehicle' },
    ],
  },
];

/**
 * Helper to retrieve a department by slug or id or alternate slug
 */
export function getDepartmentBySlug(slug = '') {
  if (!slug) return null;
  let decoded = '';
  try {
    decoded = decodeURIComponent(String(slug)).toLowerCase().trim();
  } catch {
    decoded = String(slug).toLowerCase().trim();
  }
  const normalized = decoded.replace(/[\s_&]+/g, '-');

  return (
    DEPARTMENTS.find(
      (dept) =>
        dept.slug === normalized ||
        dept.id === normalized ||
        dept.slug.replace(/[\s_&]+/g, '-') === normalized ||
        dept.id.replace(/[\s_&]+/g, '-') === normalized ||
        dept.name.toLowerCase() === decoded ||
        dept.shortName.toLowerCase() === decoded ||
        dept.name.toLowerCase().replace(/[\s_&]+/g, '-') === normalized ||
        dept.shortName.toLowerCase().replace(/[\s_&]+/g, '-') === normalized ||
        (dept.altSlugs &&
          dept.altSlugs.some(
            (alt) => alt.toLowerCase().replace(/[\s_&]+/g, '-') === normalized || alt.toLowerCase() === decoded
          ))
    ) || null
  );
}

/**
 * Helper to identify which department a given subcategory belongs to
 */
export function getDepartmentForCategory(categorySlug = '') {
  if (!categorySlug) return null;
  const normalized = categorySlug.toLowerCase().trim().replace(/[\s_]+/g, '-');
  return (
    DEPARTMENTS.find((dept) =>
      dept.subCategories.some(
        (sub) =>
          sub.slug.toLowerCase().trim().replace(/[\s_]+/g, '-') === normalized
      )
    ) || null
  );
}
