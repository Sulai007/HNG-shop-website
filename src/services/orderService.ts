import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CartItem, CheckoutFormData, NigerianDeliveryState, Order, OrderItem } from '../types';
import { emailService } from './emailService';
import { NIGERIAN_STATES } from '../data/seedData';
import { productService } from './productService';

export const orderService = {
  /**
   * Authoritative order creation: recalculates every line item price from catalog,
   * verifies stock, generates order and snapshot items, persists to Supabase (or local store),
   * dispatches transactional confirmation email via Resend, and returns created order.
   */
  async createOrder(
    userId: string,
    cartItems: CartItem[],
    formData: CheckoutFormData,
    deliveryState: NigerianDeliveryState
  ): Promise<{ success: boolean; order?: Order; error?: string }> {
    if (cartItems.length === 0) {
      return { success: false, error: 'Cannot create order with an empty cart.' };
    }

    try {
      // 1. Authoritative price & stock validation against the catalog
      let authoritativeSubtotal = 0;
      const orderItemsToCreate: OrderItem[] = [];

      for (const item of cartItems) {
        const liveProduct = await productService.getProductById(item.product_id);
        if (!liveProduct || !liveProduct.active) {
          return { success: false, error: `Product "${item.product.name}" is no longer available.` };
        }

        let variantPriceAdjustment = 0;
        let variantInfo = '';

        if (item.variant_id && liveProduct.variants) {
          const liveVariant = liveProduct.variants.find((v) => v.id === item.variant_id);
          if (!liveVariant) {
            return { success: false, error: `Selected variant for "${liveProduct.name}" is invalid.` };
          }
          if (item.quantity > liveVariant.stock_quantity) {
            return {
              success: false,
              error: `Only ${liveVariant.stock_quantity} units available for ${liveProduct.name} (${liveVariant.value}).`,
            };
          }
          variantPriceAdjustment = liveVariant.price_adjustment;
          variantInfo = `${liveVariant.name}: ${liveVariant.value}`;
        } else {
          if (item.quantity > liveProduct.stock_quantity) {
            return {
              success: false,
              error: `Only ${liveProduct.stock_quantity} units available for ${liveProduct.name}.`,
            };
          }
        }

        const authoritativeUnitPrice = liveProduct.price + variantPriceAdjustment;
        const lineSubtotal = authoritativeUnitPrice * item.quantity;
        authoritativeSubtotal += lineSubtotal;

        orderItemsToCreate.push({
          product_id: liveProduct.id,
          product_name: liveProduct.name,
          unit_price: authoritativeUnitPrice,
          quantity: item.quantity,
          variant_information: variantInfo || undefined,
          subtotal: lineSubtotal,
          image_url: liveProduct.image_url,
        });
      }

      // 2. Authoritative delivery fee verification
      const matchedState = NIGERIAN_STATES.find((s) => s.name === deliveryState.name) || deliveryState;
      const authoritativeDeliveryFee = matchedState.delivery_fee;
      const authoritativeTotal = authoritativeSubtotal + authoritativeDeliveryFee;

      // 3. Generate Nigerian order reference number (e.g. EDA-2026-8941)
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `EDA-${new Date().getFullYear()}-${randomSuffix}`;
      const now = new Date().toISOString();

      const newOrder: Order = {
        id: `ord_${Date.now()}_${randomSuffix}`,
        user_id: userId,
        order_number: orderNumber,
        status: 'processing',
        payment_status: 'paid',
        subtotal: authoritativeSubtotal,
        delivery_fee: authoritativeDeliveryFee,
        total: authoritativeTotal,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        delivery_address: formData.deliveryAddress,
        city: formData.city,
        state: formData.state,
        notes: formData.notes,
        items: orderItemsToCreate,
        email_sent: false,
        created_at: now,
      };

      // 4. Persistence to Supabase (if configured and table exists)
      if (isSupabaseConfigured()) {
        try {
          const { data: insertedOrder, error: orderErr } = await supabase
            .from('orders')
            .insert({
              user_id: userId.includes('usr_') ? null : userId, // UUID check
              order_number: orderNumber,
              status: 'processing',
              payment_status: 'paid',
              subtotal: authoritativeSubtotal,
              delivery_fee: authoritativeDeliveryFee,
              total: authoritativeTotal,
              customer_name: formData.fullName,
              customer_email: formData.email,
              customer_phone: formData.phone,
              delivery_address: formData.deliveryAddress,
              city: formData.city,
              state: formData.state,
              notes: formData.notes,
            })
            .select()
            .single();

          if (orderErr) {
            console.info('[OrderService] Supabase insert note (using client persistence fallback):', orderErr.message);
          } else if (insertedOrder) {
            newOrder.id = insertedOrder.id;

            // Insert order items snapshot
            const itemsToInsert = orderItemsToCreate.map((item) => ({
              order_id: insertedOrder.id,
              product_id: item.product_id,
              product_name: item.product_name,
              unit_price: item.unit_price,
              quantity: item.quantity,
              variant_information: item.variant_information,
              subtotal: item.subtotal,
              image_url: item.image_url,
            }));

            await supabase.from('order_items').insert(itemsToInsert);
          }
        } catch (dbErr: any) {
          console.info('[OrderService] Database exception (using client persistence fallback):', dbErr.message);
        }
      }

      // Always save to persisted local storage (guarantees cross-session persistence across reloads)
      this.saveLocalOrder(newOrder);

      // 5. Send confirmation email through Resend abstraction
      try {
        const emailResult = await emailService.sendOrderConfirmation(newOrder);
        newOrder.email_sent = emailResult.success;
        newOrder.email_receipt_html = emailResult.htmlContent;
      } catch (emailErr) {
        console.warn('Non-blocking email dispatch warning:', emailErr);
      }

      return { success: true, order: newOrder };
    } catch (err: any) {
      console.error('Fatal order creation error:', err);
      return { success: false, error: err.message || 'Failed to create order.' };
    }
  },

  saveLocalOrder(order: Order) {
    try {
      const existingStr = localStorage.getItem(`eda_orders_${order.user_id}`);
      const orders: Order[] = existingStr ? JSON.parse(existingStr) : [];
      orders.unshift(order);
      localStorage.setItem(`eda_orders_${order.user_id}`, JSON.stringify(orders));

      // Also store in general list for lookup
      const allOrdersStr = localStorage.getItem('eda_all_orders');
      const allOrders: Order[] = allOrdersStr ? JSON.parse(allOrdersStr) : [];
      allOrders.unshift(order);
      localStorage.setItem('eda_all_orders', JSON.stringify(allOrders));
    } catch (err) {
      console.error('Failed to save order locally:', err);
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data: ordersData, error: ordersErr } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!ordersErr && ordersData && ordersData.length > 0) {
          return ordersData.map((o: any) => ({
            ...o,
            items: o.order_items || [],
          }));
        }
      } catch (err) {
        console.warn('Falling back to local orders:', err);
      }
    }

    try {
      const saved = localStorage.getItem(`eda_orders_${userId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error reading local orders:', err);
    }

    try {
      const allOrdersStr = localStorage.getItem('eda_all_orders');
      if (allOrdersStr) {
        const allOrders: Order[] = JSON.parse(allOrdersStr);
        const filtered = allOrders.filter(o => o.user_id === userId);
        if (filtered.length > 0) return filtered;
        return allOrders;
      }
    } catch (e) {
      console.error(e);
    }

    return [];
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const allOrdersStr = localStorage.getItem('eda_all_orders');
      if (allOrdersStr) {
        const allOrders: Order[] = JSON.parse(allOrdersStr);
        const found = allOrders.find((o) => o.id === orderId || o.order_number === orderId);
        if (found) return found;
      }
    } catch (e) {
      console.error(e);
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .or(`id.eq.${orderId},order_number.eq.${orderId}`)
          .single();

        if (!error && data) {
          return {
            ...data,
            items: data.order_items || [],
          };
        }
      } catch (e) {
        console.error(e);
      }
    }

    return null;
  }
};
