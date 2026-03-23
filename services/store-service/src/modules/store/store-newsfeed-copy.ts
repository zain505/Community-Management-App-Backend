import type { NewsFeedSyncEvent } from '@community/contracts';

type StoreNewsFeedCopy = Pick<NewsFeedSyncEvent, 'title' | 'description'>;

function buildCopy(title: string, description: string): StoreNewsFeedCopy {
  return {
    title,
    description,
  };
}

export const storeNewsFeedCopy = {
  storeCreated(storeName: string): StoreNewsFeedCopy {
    return buildCopy(`A new store opened in your neighborhood.`, `Check out ${storeName}.`);
  },

  storeNameUpdated(previousName: string, nextName: string): StoreNewsFeedCopy {
    return buildCopy(`${previousName} is now ${nextName}.`, `${nextName} updated their store name.`);
  },

  storeLocationUpdated(storeName: string): StoreNewsFeedCopy {
    return buildCopy(`${storeName} changed location.`, `See where they are now.`);
  },

  storeRatingUpdated(storeName: string): StoreNewsFeedCopy {
    return buildCopy(`${storeName} got a new rating update.`, `See how the community is rating them now.`);
  },

  storeImageUpdated(storeName: string): StoreNewsFeedCopy {
    return buildCopy(`${storeName} updated their store photo.`, `See their latest look.`);
  },

  storeDeliveryUpdated(storeName: string): StoreNewsFeedCopy {
    return buildCopy(`${storeName} updated their delivery details.`, `Check what's changed before you order.`);
  },

  storeMinOrderUpdated(storeName: string): StoreNewsFeedCopy {
    return buildCopy(`${storeName} updated their minimum order.`, `Take a look before your next order.`);
  },

  storeContactUpdated(storeName: string): StoreNewsFeedCopy {
    return buildCopy(`${storeName} updated their phone number.`, `Check their latest contact details.`);
  },

  storeProfileUpdated(storeName: string): StoreNewsFeedCopy {
    return buildCopy(`${storeName} updated their store profile.`, `Take a look at what's new.`);
  },

  productAdded(storeName: string, productName: string): StoreNewsFeedCopy {
    return buildCopy(`${storeName} added a new product.`, `Check out ${productName}.`);
  },

  productUpdated(storeName: string, productName: string): StoreNewsFeedCopy {
    return buildCopy(`${storeName} updated a product.`, `See what's new with ${productName}.`);
  },

  productDeleted(storeName: string, productName: string): StoreNewsFeedCopy {
    return buildCopy(`${storeName} removed a product.`, `${productName} is no longer available.`);
  },
};
