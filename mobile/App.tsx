import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from './src/services/supabase';

// Nigerian product seed data shared with web app
const MOBILE_PRODUCTS = [
  {
    id: 'prod_zobo_oud',
    name: 'Zobo & Royal Oud Candle',
    category: 'Candles',
    price: 24500,
    stock: 18,
    description: 'Wild Nigerian hibiscus calyces, smoky Assam oud, and crushed clove buds. 60+ hrs burn time.',
    notes: 'Hibiscus, Assam Oud, Golden Amber',
    variants: [
      { id: 'v1', name: 'Standard 240g', priceDiff: 0 },
      { id: 'v2', name: 'Grand 450g (Double Wick)', priceDiff: 9500 },
    ],
  },
  {
    id: 'prod_calabar_cedar',
    name: 'Calabar Cedar & Frankincense Mist',
    category: 'Room Mists',
    price: 18500,
    stock: 24,
    description: 'Inspired by rainforests across Cross River. Organic essential oils with fine mist brass sprayer.',
    notes: 'Cardamom, Cedarwood, Sacred Resins',
    variants: [
      { id: 'v3', name: 'Frosted Glass Bottle (150ml)', priceDiff: 0 },
      { id: 'v4', name: 'Apothecary Amber (150ml)', priceDiff: 1500 },
    ],
  },
  {
    id: 'prod_vanilla_amber_diffuser',
    name: 'Wild Vanilla & Raw Amber Diffuser',
    category: 'Diffusers',
    price: 32000,
    stock: 14,
    description: 'Continuous flame-free sanctuary scenting. 200ml flacon with 8 porous natural reeds.',
    notes: 'Cured Vanilla Orchid, Baltic Amber',
    variants: [
      { id: 'v5', name: 'Smoked Charcoal Flacon', priceDiff: 0 },
      { id: 'v6', name: 'Fluted Crystal Glass', priceDiff: 3500 },
    ],
  },
  {
    id: 'prod_benin_bronze_candle',
    name: 'Benin Bronze Earth & Olibanum',
    category: 'Candles',
    price: 28500,
    stock: 10,
    description: 'Hand-thrown terracotta vessel crafted in Edo State. Laterite earth, roasted cocoa husk, and olibanum.',
    notes: 'Sun-Baked Earth, Cocoa, Olibanum',
    variants: [
      { id: 'v7', name: 'Red Terracotta Clay', priceDiff: 0 },
      { id: 'v8', name: 'Volcanic Ash Black Clay', priceDiff: 2000 },
    ],
  },
];

const NIGERIAN_DELIVERY_RATES = [
  { name: 'Lagos (Mainland / Island)', fee: 3500 },
  { name: 'Abuja (FCT)', fee: 5500 },
  { name: 'Rivers (Port Harcourt)', fee: 6000 },
  { name: 'Oyo (Ibadan)', fee: 4500 },
  { name: 'Nationwide Express (Other States)', fee: 7500 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'cart' | 'account'>('home');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedState, setSelectedState] = useState(NIGERIAN_DELIVERY_RATES[0]);
  const [currentUser, setCurrentUser] = useState<any | null>({
    id: 'usr_mobile_patron',
    name: 'Adebayo Alabi',
    email: 'adebayo.alabi@example.ng',
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutName, setCheckoutName] = useState('Adebayo Alabi');
  const [checkoutEmail, setCheckoutEmail] = useState('adebayo.alabi@example.ng');
  const [checkoutPhone, setCheckoutPhone] = useState('+234 803 123 4567');
  const [checkoutAddress, setCheckoutAddress] = useState('14B Victoria Arobieke St, Lekki Phase 1');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  // Cart calculations
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartDeliveryFee = cartItems.length > 0 ? selectedState.fee : 0;
  const cartTotal = cartSubtotal + cartDeliveryFee;
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: any, variant: any = null, quantity = 1) => {
    const unitPrice = product.price + (variant ? variant.priceDiff : 0);
    const key = `${product.id}_${variant ? variant.id : 'std'}`;
    const existing = cartItems.find((i) => i.key === key);

    if (existing) {
      setCartItems(
        cartItems.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          key,
          productId: product.id,
          name: product.name,
          category: product.category,
          variant: variant ? variant.name : null,
          unitPrice,
          quantity,
        },
      ]);
    }
    Alert.alert('Sanctuary Bag', `${product.name} added to your mobile bag.`);
    setSelectedProduct(null);
  };

  const updateQuantity = (key: string, delta: number) => {
    setCartItems(
      cartItems
        .map((item) => {
          if (item.key === key) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleCompleteOrder = () => {
    if (!checkoutName || !checkoutAddress) {
      Alert.alert('Incomplete Details', 'Please provide delivery recipient name and address.');
      return;
    }

    setIsProcessingOrder(true);
    setTimeout(() => {
      const orderRef = `EDA-MOB-${Date.now().toString().slice(-4)}`;
      const newOrder = {
        id: `ord_${Date.now()}`,
        orderNumber: orderRef,
        date: new Date().toLocaleDateString('en-GB'),
        total: cartTotal,
        subtotal: cartSubtotal,
        deliveryFee: cartDeliveryFee,
        state: selectedState.name,
        address: checkoutAddress,
        items: [...cartItems],
        status: 'processing',
        paymentStatus: 'paid (Mock Gateway)',
      };

      setOrders([newOrder, ...orders]);
      setConfirmedOrder(newOrder);
      setCartItems([]);
      setIsProcessingOrder(false);
      setIsCheckingOut(false);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />

      {/* Top Mobile Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>ÈDÁ</Text>
        <Text style={styles.brandSubtitle}>LAGOS · ARTISANAL LIVING</Text>
      </View>

      {/* Screen Views */}
      <View style={styles.content}>
        {activeTab === 'home' && (
          <ScrollView contentContainerStyle={styles.scrollPadding}>
            <View style={styles.heroBox}>
              <Text style={styles.heroPretitle}>WEST AFRICAN BOTANICALS</Text>
              <Text style={styles.heroTitle}>Sanctuary scents poured by hand in Nigeria.</Text>
              <Text style={styles.heroDesc}>
                Handcrafted using 100% natural coconut-soy wax, Zobo hibiscus, wild vanilla, and raw terracotta.
              </Text>
              <TouchableOpacity
                style={styles.heroBtn}
                onPress={() => setActiveTab('products')}
              >
                <Text style={styles.heroBtnText}>SHOP SANCTUARY PIECES</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>Featured Botanical Pieces</Text>
            {MOBILE_PRODUCTS.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productCard}
                onPress={() => setSelectedProduct(item)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardCategory}>{item.category}</Text>
                  <Text style={styles.cardPrice}>₦{item.price.toLocaleString()}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.cardNotes}>Notes: {item.notes}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {activeTab === 'products' && (
          <ScrollView contentContainerStyle={styles.scrollPadding}>
            <Text style={styles.sectionHeader}>All Sanctuary Pieces ({MOBILE_PRODUCTS.length})</Text>
            {MOBILE_PRODUCTS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productCard}
                onPress={() => setSelectedProduct(item)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardCategory}>{item.category}</Text>
                  <Text style={styles.cardPrice}>₦{item.price.toLocaleString()}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardStock}>{item.stock} in atelier</Text>
                  <Text style={styles.viewLink}>View Details →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {activeTab === 'cart' && (
          <ScrollView contentContainerStyle={styles.scrollPadding}>
            <Text style={styles.sectionHeader}>Sanctuary Bag ({cartCount})</Text>
            {cartItems.length === 0 ? (
              <View style={styles.emptyCartBox}>
                <Text style={styles.emptyCartText}>Your bag is currently empty.</Text>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setActiveTab('products')}
                >
                  <Text style={styles.actionBtnText}>EXPLORE PIECES</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {cartItems.map((item) => (
                  <View key={item.key} style={styles.cartRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cartItemTitle}>{item.name}</Text>
                      {item.variant && <Text style={styles.cartItemVariant}>{item.variant}</Text>}
                      <Text style={styles.cartItemPrice}>₦{item.unitPrice.toLocaleString()}</Text>
                    </View>
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.key, -1)}
                        style={styles.stepBtn}
                      >
                        <Text style={styles.stepText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.key, 1)}
                        style={styles.stepBtn}
                      >
                        <Text style={styles.stepText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {/* Delivery Selector */}
                <View style={styles.deliveryBox}>
                  <Text style={styles.deliveryLabel}>Delivery Region:</Text>
                  {NIGERIAN_DELIVERY_RATES.map((rate, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.rateOption,
                        selectedState.name === rate.name && styles.rateOptionSelected,
                      ]}
                      onPress={() => setSelectedState(rate)}
                    >
                      <Text style={styles.rateName}>{rate.name}</Text>
                      <Text style={styles.rateFee}>₦{rate.fee.toLocaleString()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Totals */}
                <View style={styles.totalsBox}>
                  <View style={styles.totRow}>
                    <Text style={styles.totLabel}>Subtotal</Text>
                    <Text style={styles.totVal}>₦{cartSubtotal.toLocaleString()}</Text>
                  </View>
                  <View style={styles.totRow}>
                    <Text style={styles.totLabel}>Delivery Fee</Text>
                    <Text style={styles.totVal}>₦{cartDeliveryFee.toLocaleString()}</Text>
                  </View>
                  <View style={[styles.totRow, { borderTopWidth: 1, paddingTop: 8, marginTop: 4 }]}>
                    <Text style={[styles.totLabel, { fontWeight: 'bold' }]}>Total</Text>
                    <Text style={[styles.totVal, { fontWeight: 'bold', fontSize: 16 }]}>
                      ₦{cartTotal.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => setIsCheckingOut(true)}
                >
                  <Text style={styles.checkoutBtnText}>PROCEED TO CHECKOUT</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}

        {activeTab === 'account' && (
          <ScrollView contentContainerStyle={styles.scrollPadding}>
            <View style={styles.profileBox}>
              <Text style={styles.profilePre}>PATRON ACCOUNT</Text>
              <Text style={styles.profileName}>{currentUser?.name || 'Adebayo Alabi'}</Text>
              <Text style={styles.profileEmail}>{currentUser?.email}</Text>
              <Text style={styles.profileNotice}>Supabase Auth Session Active</Text>
            </View>

            <Text style={styles.sectionHeader}>Order History ({orders.length})</Text>
            {orders.length === 0 ? (
              <View style={styles.emptyCartBox}>
                <Text style={styles.emptyCartText}>No orders recorded yet.</Text>
              </View>
            ) : (
              orders.map((ord) => (
                <View key={ord.id} style={styles.orderCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.orderRef}>{ord.orderNumber}</Text>
                    <Text style={styles.orderDate}>{ord.date}</Text>
                  </View>
                  <Text style={styles.orderTotal}>Total: ₦{ord.total.toLocaleString()}</Text>
                  <Text style={styles.orderDest}>Destination: {ord.address}, {ord.state}</Text>
                  <Text style={styles.orderStatus}>Status: {ord.status} · {ord.paymentStatus}</Text>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal animationType="slide" transparent visible={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalCategory}>{selectedProduct.category}</Text>
              <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
              <Text style={styles.modalPrice}>₦{selectedProduct.price.toLocaleString()}</Text>
              <Text style={styles.modalDesc}>{selectedProduct.description}</Text>
              <Text style={styles.modalNotes}>Botanical Notes: {selectedProduct.notes}</Text>

              <TouchableOpacity
                style={styles.modalAddBtn}
                onPress={() => addToCart(selectedProduct, selectedProduct.variants[0])}
              >
                <Text style={styles.modalAddBtnText}>ADD TO SANCTUARY BAG</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedProduct(null)}
              >
                <Text style={styles.modalCloseBtnText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Mobile Checkout Modal */}
      {isCheckingOut && (
        <Modal animationType="slide" visible={true}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF8F5' }}>
            <ScrollView contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.sectionHeader}>Mobile Checkout</Text>
              <Text style={styles.subtext}>Nigerian Delivery & Mock Gateway</Text>

              <Text style={styles.fieldLabel}>Recipient Full Name</Text>
              <TextInput
                style={styles.input}
                value={checkoutName}
                onChangeText={setCheckoutName}
              />

              <Text style={styles.fieldLabel}>Email for Receipt</Text>
              <TextInput
                style={styles.input}
                value={checkoutEmail}
                onChangeText={setCheckoutEmail}
                keyboardType="email-address"
              />

              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={checkoutPhone}
                onChangeText={setCheckoutPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.fieldLabel}>Delivery Address</Text>
              <TextInput
                style={styles.input}
                value={checkoutAddress}
                onChangeText={setCheckoutAddress}
              />

              <View style={styles.totalsBox}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  Total to Pay: ₦{cartTotal.toLocaleString()}
                </Text>
                <Text style={{ fontSize: 11, color: '#695E54', marginTop: 4 }}>
                  Simulated via Test Payment Gateway
                </Text>
              </View>

              {isProcessingOrder ? (
                <ActivityIndicator size="large" color="#2C241E" style={{ marginVertical: 20 }} />
              ) : (
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={handleCompleteOrder}
                >
                  <Text style={styles.checkoutBtnText}>PAY ₦{cartTotal.toLocaleString()}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsCheckingOut(false)}
              >
                <Text style={styles.modalCloseBtnText}>CANCEL</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      {/* Order Confirmed Modal */}
      {confirmedOrder && (
        <Modal animationType="fade" transparent visible={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Order Confirmed!</Text>
              <Text style={styles.modalDesc}>
                Reference: {confirmedOrder.orderNumber}
              </Text>
              <Text style={styles.modalDesc}>
                Total: ₦{confirmedOrder.total.toLocaleString()}
              </Text>
              <Text style={styles.modalDesc}>
                Destination: {confirmedOrder.address}, {confirmedOrder.state}
              </Text>
              <Text style={styles.modalDesc}>
                Confirmation sent via Resend Transactional Email.
              </Text>

              <TouchableOpacity
                style={styles.heroBtn}
                onPress={() => {
                  setConfirmedOrder(null);
                  setActiveTab('account');
                }}
              >
                <Text style={styles.heroBtnText}>VIEW ORDER HISTORY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Bottom Mobile Tab Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[styles.navText, activeTab === 'products' && styles.navTextActive]}>
            Catalogue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('cart')}
        >
          <Text style={[styles.navText, activeTab === 'cart' && styles.navTextActive]}>
            Bag ({cartCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('account')}
        >
          <Text style={[styles.navText, activeTab === 'account' && styles.navTextActive]}>
            Account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  topBar: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FAF8F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E2D8',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#2C241E',
  },
  brandSubtitle: {
    fontSize: 9,
    letterSpacing: 2,
    color: '#7A6F65',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollPadding: {
    padding: 16,
  },
  heroBox: {
    backgroundColor: '#EDE6DC',
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D9D2C7',
  },
  heroPretitle: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#7A6F65',
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C241E',
    marginVertical: 8,
  },
  heroDesc: {
    fontSize: 13,
    color: '#594E45',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroBtn: {
    backgroundColor: '#2C241E',
    paddingVertical: 12,
    alignItems: 'center',
  },
  heroBtnText: {
    color: '#FAF8F5',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C241E',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 12,
    color: '#7A6F65',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E2D8',
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardCategory: {
    fontSize: 10,
    color: '#7A6F65',
    textTransform: 'uppercase',
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C241E',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1B18',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#695E54',
    lineHeight: 16,
  },
  cardNotes: {
    fontSize: 11,
    color: '#7A6F65',
    marginTop: 6,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0EBE3',
  },
  cardStock: {
    fontSize: 11,
    color: '#8C8075',
  },
  viewLink: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2C241E',
  },
  emptyCartBox: {
    padding: 40,
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 14,
    color: '#7A6F65',
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: '#2C241E',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  actionBtnText: {
    color: '#FAF8F5',
    fontSize: 11,
    fontWeight: '600',
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E2D8',
    marginBottom: 8,
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1B18',
  },
  cartItemVariant: {
    fontSize: 11,
    color: '#7A6F65',
  },
  cartItemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C241E',
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D2C7',
  },
  stepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepText: {
    fontSize: 16,
    color: '#2C241E',
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
  },
  deliveryBox: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E2D8',
    marginTop: 12,
  },
  deliveryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C241E',
    marginBottom: 8,
  },
  rateOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE3',
  },
  rateOptionSelected: {
    backgroundColor: '#F5EFE6',
  },
  rateName: {
    fontSize: 12,
    color: '#2C241E',
  },
  rateFee: {
    fontSize: 12,
    fontWeight: '600',
  },
  totalsBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E2D8',
    marginVertical: 14,
  },
  totRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totLabel: {
    fontSize: 12,
    color: '#594E45',
  },
  totVal: {
    fontSize: 13,
    color: '#1E1B18',
  },
  checkoutBtn: {
    backgroundColor: '#2C241E',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  checkoutBtnText: {
    color: '#FAF8F5',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  profileBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E2D8',
    marginBottom: 20,
  },
  profilePre: {
    fontSize: 10,
    color: '#7A6F65',
    letterSpacing: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C241E',
    marginVertical: 4,
  },
  profileEmail: {
    fontSize: 12,
    color: '#594E45',
  },
  profileNotice: {
    fontSize: 11,
    color: '#166534',
    marginTop: 8,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E2D8',
    marginBottom: 10,
  },
  orderRef: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C241E',
  },
  orderDate: {
    fontSize: 11,
    color: '#7A6F65',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 4,
  },
  orderDest: {
    fontSize: 12,
    color: '#594E45',
  },
  orderStatus: {
    fontSize: 11,
    color: '#166534',
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E8E2D8',
    backgroundColor: '#FAF8F5',
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 11,
    color: '#7A6F65',
  },
  navTextActive: {
    color: '#2C241E',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FAF8F5',
    padding: 24,
    borderWidth: 1,
    borderColor: '#E8E2D8',
  },
  modalCategory: {
    fontSize: 10,
    color: '#7A6F65',
    textTransform: 'uppercase',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C241E',
    marginVertical: 6,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C241E',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: '#594E45',
    lineHeight: 18,
    marginBottom: 10,
  },
  modalNotes: {
    fontSize: 11,
    color: '#7A6F65',
    marginBottom: 16,
  },
  modalAddBtn: {
    backgroundColor: '#2C241E',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  modalAddBtnText: {
    color: '#FAF8F5',
    fontSize: 11,
    fontWeight: '600',
  },
  modalCloseBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#7A6F65',
    fontSize: 11,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#7A6F65',
    marginTop: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D2C7',
    padding: 10,
    fontSize: 13,
    color: '#2C241E',
  },
});
