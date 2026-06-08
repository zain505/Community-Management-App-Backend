import {
  createStoreBodySchema,
  createStoreRatingBodySchema,
  listStoresQuerySchema,
  updateStoreBodySchema,
} from '../../src/modules/store/store.schemas';

const storeImageUrl = 'http://localhost:3000/uploads/store-images/store.png';

describe('store schemas', () => {
  it('accepts a valid store payload', () => {
    const payload = createStoreBodySchema.parse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: storeImageUrl,
      delivery: 'Free Delivery',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '0300402505',
      categoryId: 2,
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
    expect(payload.image).toBe(storeImageUrl);
    expect(payload.openingTime).toBe('09:00');
    expect(payload.closingTime).toBe('22:00');
    expect(payload.phoneNumber).toBe('0300402505');
    expect(payload.categoryId).toBe(2);
    expect(payload.products?.[0]?.id).toBe('desi-1');
  });

  it('accepts legacy contact input and normalizes it into phoneNumber', () => {
    const payload = createStoreBodySchema.parse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: storeImageUrl,
      delivery: 'Free Delivery',
      minOrderRs: '500',
      openingTime: '08:00',
      closingTime: '23:00',
      contact: '+92 (300) 402-5050',
      categoryId: 4,
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
      image: storeImageUrl,
    });

    expect(payload.phoneNumber).toBe('+923004025050');
    expect(payload.openingTime).toBe('10:15');
    expect(payload.image).toBe(storeImageUrl);
  });

  it('rejects invalid phone numbers', () => {
    const result = createStoreBodySchema.safeParse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: storeImageUrl,
      delivery: 'Free Delivery',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: 'abc123',
      categoryId: 3,
    });

    expect(result.success).toBe(false);
  });

  it('rejects badges in store creation payloads', () => {
    const result = createStoreBodySchema.safeParse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: storeImageUrl,
      badges: ['Best Seller'],
      delivery: 'Free Delivery',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '0300402505',
      categoryId: 3,
    });

    expect(result.success).toBe(false);
  });

  it('rejects badges in store update payloads', () => {
    const result = updateStoreBodySchema.safeParse({
      badges: ['Best Seller'],
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid store times', () => {
    const result = createStoreBodySchema.safeParse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: storeImageUrl,
      delivery: 'Free Delivery',
      minOrderRs: '500',
      openingTime: '9:00 AM',
      closingTime: '22:00',
      phoneNumber: '0300402505',
      categoryId: 3,
    });

    expect(result.success).toBe(false);
  });

  it('accepts store image URLs', () => {
    const result = createStoreBodySchema.safeParse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: 'https://example.com/store.png',
      delivery: 'Free Delivery',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '0300402505',
      categoryId: 5,
    });

    expect(result.success).toBe(true);
  });

  it('requires categoryId when creating a store', () => {
    const result = createStoreBodySchema.safeParse({
      name: 'Desi Eatery',
      location: 'AWT Main Market',
      image: storeImageUrl,
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
      badges: ['Best Seller', 'Daily Deals'],
      description: 'Fresh naan and quick delivery.',
    });

    expect(payload.rating).toBe(4.5);
    expect(payload.badges).toEqual(['Best Seller', 'Daily Deals']);
    expect(payload.description).toBe('Fresh naan and quick delivery.');
  });

  it('rejects store ratings outside the 1 to 5 range', () => {
    const result = createStoreRatingBodySchema.safeParse({
      rating: 6,
    });

    expect(result.success).toBe(false);
  });

  it('rejects rating descriptions longer than 100 characters', () => {
    const result = createStoreRatingBodySchema.safeParse({
      rating: 4.5,
      description: 'a'.repeat(101),
    });

    expect(result.success).toBe(false);
  });

  it('defaults store list page to 1', () => {
    const query = listStoresQuerySchema.parse({});
    expect(query.page).toBe(1);
  });

  it('treats an empty store list search string as no search filter', () => {
    const query = listStoresQuerySchema.parse({
      search: '',
    });

    expect(query.search).toBeUndefined();
  });

  it('trims store list search strings', () => {
    const query = listStoresQuerySchema.parse({
      search: '  fresh mart  ',
    });

    expect(query.search).toBe('fresh mart');
  });

  it('rejects non-positive store list page', () => {
    const result = listStoresQuerySchema.safeParse({
      page: 0,
    });
    expect(result.success).toBe(false);
  });
});
