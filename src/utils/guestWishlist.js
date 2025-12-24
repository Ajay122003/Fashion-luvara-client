const KEY = "guest_wishlist";

export const getGuestWishlist = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const isGuestWishlisted = (productId) => {
  return getGuestWishlist().includes(productId);
};

export const toggleGuestWishlist = (productId) => {
  let wishlist = getGuestWishlist();

  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter((id) => id !== productId);
    localStorage.setItem(KEY, JSON.stringify(wishlist));
    return false; // removed
  } else {
    wishlist.push(productId);
    localStorage.setItem(KEY, JSON.stringify(wishlist));
    return true; // added
  }
};

export const clearGuestWishlist = () => {
  localStorage.removeItem(KEY);
};
