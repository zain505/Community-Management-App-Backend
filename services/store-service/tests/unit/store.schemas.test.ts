import {
  createStoreBodySchema,
  createStoreRatingBodySchema,
  listStoresQuerySchema,
  updateStoreBodySchema,
} from '../../src/modules/store/store.schemas';

const storeImageBase64 = 'data:image/png;base64,aGVsbG8=';

describe('store schemas', () => {
  it('accepts a valid store payload', () => {
    const payload = createStoreBodySchema.parse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: storeImageBase64,
      badges: ['Best Seller', 'Daily Deals'],
      delivery: 'Free Delivery',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '0300402505',
      products: [
        {
          id: 'desi-1',
          name: 'Fresh Sada Naan',
          price: 'Rs.30',
          image: 'https://snappy.pk/wp-content/uploads/2025/07/Snappy-ka-Sada-Naan.webp',
          tag: 'Popular',
        },
      ],
    });

    expect(payload.name).toBe('Desi Eatery');
    expect(payload.image).toBe(storeImageBase64);
    expect(payload.openingTime).toBe('09:00');
    expect(payload.closingTime).toBe('22:00');
    expect(payload.phoneNumber).toBe('0300402505');
    expect(payload.products?.[0]?.id).toBe('desi-1');
  });

  it('accepts legacy contact input and normalizes it into phoneNumber', () => {
    const payload = createStoreBodySchema.parse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: storeImageBase64,
      badges: ['Best Seller', 'Daily Deals'],
      delivery: 'Free Delivery',
      minOrderRs: '500',
      openingTime: '08:00',
      closingTime: '23:00',
      contact: '+92 (300) 402-5050',
    });

    expect(payload.phoneNumber).toBe('+923004025050');
  });

  it('rejects empty update payload', () => {
    const result = updateStoreBodySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('accepts phoneNumber updates for the /me patch body', () => {
    const payload = updateStoreBodySchema.parse({
      phoneNumber: '+92 300 402 5050',
      openingTime: '10:15',
      image: storeImageBase64,
    });

    expect(payload.phoneNumber).toBe('+923004025050');
    expect(payload.openingTime).toBe('10:15');
    expect(payload.image).toBe(storeImageBase64);
  });

  it('rejects invalid phone numbers', () => {
    const result = createStoreBodySchema.safeParse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: storeImageBase64,
      delivery: 'Free Delivery',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: 'abc123',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid store times', () => {
    const result = createStoreBodySchema.safeParse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: storeImageBase64,
      delivery: 'Free Delivery',
      minOrderRs: '500',
      openingTime: '9:00 AM',
      closingTime: '22:00',
      phoneNumber: '0300402505',
    });

    expect(result.success).toBe(false);
  });

  it('rejects store image URLs because store images must be base64 strings', () => {
    const result = createStoreBodySchema.safeParse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: 'https://example.com/store.png',
      delivery: 'Free Delivery',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '0300402505',
    });

    expect(result.success).toBe(false);
  });

  it('accepts a store rating payload for authenticated rating posts', () => {
    const payload = createStoreRatingBodySchema.parse({
      rating: 4.5,
    });

    expect(payload.rating).toBe(4.5);
  });

  it('rejects store ratings outside the 1 to 5 range', () => {
    const result = createStoreRatingBodySchema.safeParse({
      rating: 6,
    });

    expect(result.success).toBe(false);
  });

  it('defaults store list page to 1', () => {
    const query = listStoresQuerySchema.parse({});
    expect(query.page).toBe(1);
  });

  it('rejects non-positive store list page', () => {
    const result = listStoresQuerySchema.safeParse({
      page: 0,
    });
    expect(result.success).toBe(false);
  });
});
