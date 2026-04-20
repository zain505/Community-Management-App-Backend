import {
  hasStoreProductContentChanged,
  matchStoreProducts,
} from '../../src/modules/store/store-product-matcher';

describe('store product matcher', () => {
  it('matches existing products by id first and by normalized name as a fallback', () => {
    const existingProducts = [
      {
        id: 'prod-1',
        name: 'Chicken Karahi',
        price: 'Rs.1200',
        image: 'https://example.com/karahi.jpg',
        tag: 'Popular',
        description: 'Classic karahi with tender chicken pieces.',
      },
      {
        id: 'prod-2',
        name: 'Seekh Kebab',
        price: 'Rs.600',
        image: 'https://example.com/kebab.jpg',
        tag: null,
        description: null,
      },
    ];

    const nextProducts = [
      {
        name: ' chicken karahi ',
        price: 'Rs.1300',
        image: 'https://example.com/karahi-new.jpg',
        tag: 'Popular',
        description: 'Classic karahi with tender chicken pieces.',
      },
      {
        id: 'prod-2',
        name: 'Seekh Kebab',
        price: 'Rs.600',
        image: 'https://example.com/kebab.jpg',
        description: '',
      },
      {
        name: 'Mutton Handi',
        price: 'Rs.1500',
        image: 'https://example.com/handi.jpg',
        tag: 'New',
        description: 'Slow-cooked handi with rich spices.',
      },
    ];

    const result = matchStoreProducts(existingProducts, nextProducts);

    expect(result.matched).toHaveLength(2);
    expect(result.matched[0]?.previous.id).toBe('prod-1');
    expect(result.matched[1]?.previous.id).toBe('prod-2');
    expect(result.created).toEqual([nextProducts[2]]);
    expect(result.deleted).toHaveLength(0);
  });

  it('identifies deleted products that are no longer present in the update payload', () => {
    const existingProducts = [
      {
        id: 'prod-1',
        name: 'Chicken Karahi',
        price: 'Rs.1200',
        image: 'https://example.com/karahi.jpg',
        tag: 'Popular',
        description: 'Classic karahi with tender chicken pieces.',
      },
      {
        id: 'prod-2',
        name: 'Seekh Kebab',
        price: 'Rs.600',
        image: 'https://example.com/kebab.jpg',
        tag: null,
        description: null,
      },
    ];

    const result = matchStoreProducts(existingProducts, [
      {
        id: 'prod-1',
        name: 'Chicken Karahi',
        price: 'Rs.1200',
        image: 'https://example.com/karahi.jpg',
        tag: 'Popular',
        description: 'Classic karahi with tender chicken pieces.',
      },
    ]);

    expect(result.deleted).toEqual([existingProducts[1]]);
  });

  it('treats empty and null product tags as unchanged content', () => {
    const existingProduct = {
      id: 'prod-1',
      name: 'Chicken Karahi',
      price: 'Rs.1200',
      image: 'https://example.com/karahi.jpg',
      tag: null,
      description: null,
    };

    expect(
      hasStoreProductContentChanged(existingProduct, {
        id: 'prod-1',
        name: 'Chicken Karahi',
        price: 'Rs.1200',
        image: 'https://example.com/karahi.jpg',
        description: '',
      }),
    ).toBe(false);
  });
});
