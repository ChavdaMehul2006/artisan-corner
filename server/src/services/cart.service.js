const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice images stock isActive vendor store',
      populate: {
        path: 'store',
        select: 'name slug logo'
      }
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], subtotal: 0 });
    } else {
      // Re-validate existing items against current DB status and prices
      let modified = false;
      const validItems = [];

      for (const item of cart.items) {
        if (!item.product || !item.product.isActive) {
          modified = true;
          continue; // Remove deleted or deactivated products
        }

        // Adjust price to current DB price if changed
        if (item.price !== item.product.price) {
          item.price = item.product.price;
          modified = true;
        }

        // Cap quantity if exceeding current stock
        if (item.quantity > item.product.stock) {
          if (item.product.stock <= 0) {
            modified = true;
            continue; // Remove out-of-stock items
          } else {
            item.quantity = item.product.stock;
            modified = true;
          }
        }

        validItems.push(item);
      }

      if (modified) {
        cart.items = validItems;
        cart.calculateSubtotal();
        await cart.save();
      }
    }

    return cart;
  }

  async addToCart(userId, productId, quantity = 1) {
    const qty = Math.max(1, parseInt(quantity, 10));
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      throw new ApiError(404, 'Product is unavailable or does not exist.');
    }

    if (product.stock < qty) {
      throw new ApiError(400, `Only ${product.stock} units available in stock.`);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], subtotal: 0 });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].quantity + qty;
      if (newQty > product.stock) {
        throw new ApiError(400, `Cannot add more. You have ${cart.items[existingItemIndex].quantity} in cart and stock limit is ${product.stock}.`);
      }
      cart.items[existingItemIndex].quantity = newQty;
      cart.items[existingItemIndex].price = product.price;
    } else {
      cart.items.push({
        product: product._id,
        vendor: product.vendor,
        quantity: qty,
        price: product.price
      });
    }

    cart.calculateSubtotal();
    await cart.save();

    return await this.getCart(userId);
  }

  async updateItemQuantity(userId, productId, quantity) {
    const qty = parseInt(quantity, 10);
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    if (qty <= 0) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId.toString());
    } else {
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        cart.items = cart.items.filter((item) => item.product.toString() !== productId.toString());
      } else {
        if (qty > product.stock) {
          throw new ApiError(400, `Only ${product.stock} units available in stock.`);
        }
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId.toString());
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = qty;
          cart.items[itemIndex].price = product.price;
        }
      }
    }

    cart.calculateSubtotal();
    await cart.save();

    return await this.getCart(userId);
  }

  async removeItem(userId, productId) {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId.toString());
    cart.calculateSubtotal();
    await cart.save();

    return await this.getCart(userId);
  }

  async clearCart(userId) {
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      cart.subtotal = 0;
      await cart.save();
    }
    return { success: true };
  }

  async syncCart(userId, clientItems = []) {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], subtotal: 0 });
    }

    for (const clientItem of clientItems) {
      if (!clientItem.productId) continue;
      const product = await Product.findById(clientItem.productId);
      if (product && product.isActive && product.stock > 0) {
        const qty = Math.min(clientItem.quantity || 1, product.stock);
        const existingIdx = cart.items.findIndex((i) => i.product.toString() === product._id.toString());
        if (existingIdx > -1) {
          cart.items[existingIdx].quantity = Math.min(
            cart.items[existingIdx].quantity + qty,
            product.stock
          );
          cart.items[existingIdx].price = product.price;
        } else {
          cart.items.push({
            product: product._id,
            vendor: product.vendor,
            quantity: qty,
            price: product.price
          });
        }
      }
    }

    cart.calculateSubtotal();
    await cart.save();

    return await this.getCart(userId);
  }
}

module.exports = new CartService();
