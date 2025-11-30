/**
 * Shopify Cart API Service
 * Handles adding items to Shopify cart and managing cart operations
 */

class ShopifyCartService {
    constructor(shopifyStoreUrl) {
        // Remove trailing slash if present
        this.storeUrl = shopifyStoreUrl.replace(/\/$/, '');
        this.cartUrl = `${this.storeUrl}/cart`;
        this.cartApiUrl = `${this.storeUrl}/cart/add.js`;
        this.cartGetUrl = `${this.storeUrl}/cart.js`;
    }

    /**
     * Add items to Shopify cart
     * @param {Array} items - Array of cart items
     * @param {Object} options - Additional options
     * @returns {Promise} Cart response
     */
    async addItems(items, options = {}) {
        try {
            const response = await fetch(this.cartApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Failed to add to cart' }));
                throw new Error(error.description || error.error || 'Failed to add items to cart');
            }

            const data = await response.json();
            console.log('✅ Items added to cart:', data);
            
            return data;
        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            throw error;
        }
    }

    /**
     * Get current cart contents
     * @returns {Promise} Cart data
     */
    async getCart() {
        try {
            const response = await fetch(this.cartGetUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get cart');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Error getting cart:', error);
            throw error;
        }
    }

    /**
     * Update cart items
     * @param {Object} updates - Cart updates
     * @returns {Promise} Updated cart
     */
    async updateCart(updates) {
        try {
            const response = await fetch(`${this.storeUrl}/cart/update.js`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error('Failed to update cart');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Error updating cart:', error);
            throw error;
        }
    }

    /**
     * Add a single item to cart with custom properties
     * @param {number} variantId - Shopify variant ID
     * @param {number} quantity - Quantity (default: 1)
     * @param {Object} properties - Custom properties (e.g., order_id)
     * @returns {Promise} Cart response
     */
    async addItem(variantId, quantity = 1, properties = {}) {
        const item = {
            id: variantId,
            quantity: quantity
        };

        // Add properties if provided
        if (Object.keys(properties).length > 0) {
            item.properties = properties;
        }

        return this.addItems([item]);
    }

    /**
     * Add order to cart with all selected items
     * @param {Object} orderData - Order data including variant IDs and order_id
     * @returns {Promise} Cart response
     */
    async addOrderToCart(orderData) {
        const items = [];

        // Add main product variant
        if (orderData.variantId) {
            items.push({
                id: orderData.variantId,
                quantity: 1,
                properties: {
                    '_order_id': orderData.orderId,
                    '_custom_design': 'true',
                    '_grid_size': orderData.gridSize || '',
                }
            });
        }

        // Add stand if selected
        if (orderData.standSelected && orderData.standVariantId) {
            items.push({
                id: orderData.standVariantId,
                quantity: 1
            });
        }

        // Add mounting dots if selected
        if (orderData.mountingSelected && orderData.mountingVariantId) {
            items.push({
                id: orderData.mountingVariantId,
                quantity: 1
            });
        }

        if (items.length === 0) {
            throw new Error('No items to add to cart');
        }

        return this.addItems(items);
    }

    /**
     * Redirect to Shopify cart page
     */
    redirectToCart() {
        window.location.href = this.cartUrl;
    }

    /**
     * Check if we're in a Shopify context
     * @returns {boolean}
     */
    isShopifyContext() {
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('shopify') === 'true') {
            return true;
        }

        // Check if Shopify store URL is in current domain
        if (this.storeUrl && window.location.hostname.includes('myshopify.com')) {
            return true;
        }

        return false;
    }

    /**
     * Get Shopify store URL from current context or config
     * @returns {string|null}
     */
    static getStoreUrl() {
        // Try to get from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');
        if (shop) {
            return `https://${shop}`;
        }

        // Try to get from window variable (set by Shopify page)
        if (window.SHOPIFY_STORE_URL) {
            return window.SHOPIFY_STORE_URL;
        }

        // Try to get from config
        if (window.ALBUM_BUILDER_CONFIG && window.ALBUM_BUILDER_CONFIG.shopifyStore) {
            return `https://${window.ALBUM_BUILDER_CONFIG.shopifyStore}`;
        }

        return null;
    }
}

// Export for use in modules or global scope
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShopifyCartService;
} else {
    window.ShopifyCartService = ShopifyCartService;
}

