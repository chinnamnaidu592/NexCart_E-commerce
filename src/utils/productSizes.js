const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const FOOTWEAR_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12'];

const APPAREL_CATEGORIES = new Set([
  'clothing',
  'apparel',
  'shirts',
  'mens-shirts',
  'tops',
  't-shirts',
  'tshirts',
  'dresses',
  'womens-dresses',
  'jackets',
  'pants',
  'jeans',
  'trousers',
]);

const FOOTWEAR_CATEGORIES = new Set([
  'shoes',
  'footwear',
  'mens-shoes',
  'womens-shoes',
]);

const normalizeCategory = (category) => String(category || '')
  .trim()
  .toLowerCase()
  .replace(/[\s_&]+/g, '-');

export function getProductSizeOptions(productOrCategory) {
  const product = typeof productOrCategory === 'object' && productOrCategory !== null
    ? productOrCategory
    : null;

  if (product?.requiresSize === false) return [];

  const explicitType = typeof product?.sizeType === 'string'
    ? product.sizeType.toLowerCase()
    : '';
  if (explicitType === 'apparel') return APPAREL_SIZES;
  if (explicitType === 'footwear') return FOOTWEAR_SIZES;

  const category = product?.category ?? productOrCategory?.slug ?? productOrCategory;
  const normalizedCategory = normalizeCategory(category);
  if (APPAREL_CATEGORIES.has(normalizedCategory)) return APPAREL_SIZES;
  if (FOOTWEAR_CATEGORIES.has(normalizedCategory)) return FOOTWEAR_SIZES;
  return [];
}
