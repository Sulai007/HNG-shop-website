import { NigerianDeliveryState, Product } from '../types';

export const NIGERIAN_STATES: NigerianDeliveryState[] = [
  { code: 'LA_MAIN', name: 'Lagos (Mainland)', delivery_fee: 3500, estimated_days: '1–2 business days' },
  { code: 'LA_ISL', name: 'Lagos (Island / Lekki / Ikoyi / VI)', delivery_fee: 3500, estimated_days: 'Same day or next day' },
  { code: 'ABJ', name: 'Abuja (Federal Capital Territory)', delivery_fee: 5500, estimated_days: '2–3 business days' },
  { code: 'RIV', name: 'Rivers (Port Harcourt)', delivery_fee: 6000, estimated_days: '2–4 business days' },
  { code: 'OYO', name: 'Oyo (Ibadan)', delivery_fee: 4500, estimated_days: '2–3 business days' },
  { code: 'OGN', name: 'Ogun (Abeokuta / Ota)', delivery_fee: 4000, estimated_days: '2–3 business days' },
  { code: 'ENU', name: 'Enugu', delivery_fee: 6000, estimated_days: '3–5 business days' },
  { code: 'ANA', name: 'Anambra (Awka / Onitsha)', delivery_fee: 6000, estimated_days: '3–5 business days' },
  { code: 'DEL', name: 'Delta (Warri / Asaba)', delivery_fee: 6000, estimated_days: '3–5 business days' },
  { code: 'EDO', name: 'Edo (Benin City)', delivery_fee: 5500, estimated_days: '3–5 business days' },
  { code: 'KAN', name: 'Kano', delivery_fee: 7000, estimated_days: '3–5 business days' },
  { code: 'KAD', name: 'Kaduna', delivery_fee: 7000, estimated_days: '3–5 business days' },
  { code: 'OTH', name: 'Other Nigerian States (Nationwide Express)', delivery_fee: 7500, estimated_days: '4–6 business days' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_zobo_oud',
    name: 'Zobo & Royal Oud Artisanal Candle',
    slug: 'zobo-royal-oud-candle',
    description: 'A tribute to the vibrant soul of Lagos. Hand-poured in small batches using 100% natural coconut-soy wax, blending tart wild Nigerian hibiscus calyces (Zobo) with deep smoky Assam oud, crushed clove buds, and dark amber.',
    price: 24500,
    category: 'candles',
    burn_time: '60+ hours',
    scent_profile: {
      top: ['Wild Hibiscus Calyces', 'Spiced Pomegranate', 'Blood Orange'],
      heart: ['Dark Assam Oud', 'Crushed Clove Buds', 'Damask Rose'],
      base: ['Smoked Birch', 'Golden Amber', 'Patchouli Leaf']
    },
    image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 18,
    active: true,
    featured: true,
    variants: [
      {
        id: 'var_zo_standard',
        product_id: 'prod_zobo_oud',
        name: 'Vessel Size',
        value: 'Standard 240g (Single Cotton Wick)',
        price_adjustment: 0,
        stock_quantity: 12
      },
      {
        id: 'var_zo_grand',
        product_id: 'prod_zobo_oud',
        name: 'Vessel Size',
        value: 'Grand 450g (Double Wooden Wick)',
        price_adjustment: 9500,
        stock_quantity: 6
      }
    ]
  },
  {
    id: 'prod_calabar_cedar',
    name: 'Calabar Cedar & Spiced Frankincense Mist',
    slug: 'calabar-cedar-spiced-frankincense-mist',
    description: 'An atmospheric room and linen elixir formulated with botanical alcohol and organic essential oils. Inspired by morning rain across the Cross River rainforests, cedar bark, and sacred incense resins.',
    price: 18500,
    category: 'room_mists',
    volume: '150ml with fine mist atomizer',
    scent_profile: {
      top: ['Cardamom Pods', 'Rainwater Accord', 'Bergamot Zest'],
      heart: ['Calabar Cedarwood', 'Frankincense Resin', 'Nutmeg'],
      base: ['Haitian Vetiver', 'Warm Tobacco Leaf', 'Myrrh']
    },
    image_url: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 24,
    active: true,
    featured: true,
    variants: [
      {
        id: 'var_cc_frosted',
        product_id: 'prod_calabar_cedar',
        name: 'Bottle Finish',
        value: 'Frosted Glass with Matte Brass Sprayer',
        price_adjustment: 0,
        stock_quantity: 16
      },
      {
        id: 'var_cc_amber',
        product_id: 'prod_calabar_cedar',
        name: 'Bottle Finish',
        value: 'Apothecary Amber with Gunmetal Sprayer',
        price_adjustment: 1500,
        stock_quantity: 8
      }
    ]
  },
  {
    id: 'prod_vanilla_amber_diffuser',
    name: 'Nigerian Wild Vanilla & Raw Amber Reed Diffuser',
    slug: 'nigerian-wild-vanilla-raw-amber-diffuser',
    description: 'Continuous, flame-free sanctuary scenting. Our bespoke solvent-free diffusion blend features Madagascan & Nigerian cured vanilla pods steeped in warm Baltic amber and velvety benzoin gum. Includes 8 porous black reeds.',
    price: 32000,
    category: 'diffusers',
    volume: '200ml (Diffuses for 4–5 months)',
    scent_profile: {
      top: ['Cured Vanilla Orchid', 'Golden Honeycomb', 'Almond Blossom'],
      heart: ['Warm Baltic Amber', 'Benzoin Resin', 'Smoked Cinnamon'],
      base: ['Sandalwood Cream', 'Tonka Bean', 'White Musk']
    },
    image_url: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 14,
    active: true,
    featured: true,
    variants: [
      {
        id: 'var_va_amber',
        product_id: 'prod_vanilla_amber_diffuser',
        name: 'Glass Vessel',
        value: 'Smoked Charcoal Flacon (8 Black Reeds)',
        price_adjustment: 0,
        stock_quantity: 9
      },
      {
        id: 'var_va_clear',
        product_id: 'prod_vanilla_amber_diffuser',
        name: 'Glass Vessel',
        value: 'Architectural Fluted Glass (8 Natural Reeds)',
        price_adjustment: 3500,
        stock_quantity: 5
      }
    ]
  },
  {
    id: 'prod_benin_bronze_candle',
    name: 'Benin Bronze Earth & Olibanum Candle',
    slug: 'benin-bronze-earth-olibanum-candle',
    description: 'Housed in a raw terracotta vessel thrown by ceramic artisans in Edo State. Scented with sun-baked laterite earth, ancient olibanum, charred fig wood, and earthy roasted cocoa husk.',
    price: 28500,
    category: 'candles',
    burn_time: '75+ hours',
    scent_profile: {
      top: ['Sun-Baked Earth', 'Green Fig Leaf', 'Bitter Orange'],
      heart: ['Ancient Olibanum', 'Roasted Cocoa Husk', 'Orris Root'],
      base: ['Cedar Heartwood', 'Charred Oak', 'Raw Leather Accord']
    },
    image_url: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 10,
    active: true,
    featured: true,
    variants: [
      {
        id: 'var_bb_terracotta',
        product_id: 'prod_benin_bronze_candle',
        name: 'Vessel Style',
        value: 'Hand-Thrown Red Terracotta (320g)',
        price_adjustment: 0,
        stock_quantity: 6
      },
      {
        id: 'var_bb_basalt',
        product_id: 'prod_benin_bronze_candle',
        name: 'Vessel Style',
        value: 'Matte Basalt Black Clay (320g)',
        price_adjustment: 2000,
        stock_quantity: 4
      }
    ]
  },
  {
    id: 'prod_shea_ginger_mist',
    name: 'Lekki Solitude: Shea Blossom & Ginger Linen Mist',
    slug: 'lekki-solitude-shea-blossom-ginger-mist',
    description: 'Formulated to mist over fine Egyptian cotton sheets and loungewear. Delicately combines creamy Nigerian cold-pressed shea blossom, freshly bruised ginger root, and coastal morning dew.',
    price: 19500,
    category: 'room_mists',
    volume: '150ml fine spray',
    scent_profile: {
      top: ['Fresh Nigerian Ginger', 'Pink Peppercorn', 'Dewy Bamboo'],
      heart: ['Shea Blossom', 'White Lily of the Valley', 'Green Tea'],
      base: ['Cashmere Wood', 'Clean White Musk', 'Shea Butter Cream']
    },
    image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 20,
    active: true,
    featured: false,
    variants: [
      {
        id: 'var_sg_standard',
        product_id: 'prod_shea_ginger_mist',
        name: 'Size',
        value: '150ml Travel & Linen Spray',
        price_adjustment: 0,
        stock_quantity: 20
      }
    ]
  },
  {
    id: 'prod_ikoyi_twilight_diffuser',
    name: 'Ikoyi Twilight: Night Jasmine & Cypress Diffuser',
    slug: 'ikoyi-twilight-jasmine-cypress-diffuser',
    description: 'Evoking the warm, fragrant evening breeze drifting through the lush tree canopies of Old Ikoyi. Star jasmine blooming at dusk, green Italian cypress, and subtle wet stone.',
    price: 34000,
    category: 'diffusers',
    volume: '200ml (Diffuses for 4–5 months)',
    scent_profile: {
      top: ['Night-Blooming Jasmine', 'Wild Bergamot', 'Green Leaf'],
      heart: ['Italian Cypress', 'Tuberose Petals', 'Orange Blossom'],
      base: ['Blonde Woods', 'Clean Patchouli', 'Crisp Amber']
    },
    image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 11,
    active: true,
    featured: false,
    variants: [
      {
        id: 'var_it_standard',
        product_id: 'prod_ikoyi_twilight_diffuser',
        name: 'Vessel',
        value: 'Smoked Amber Apothecary Jar (200ml)',
        price_adjustment: 0,
        stock_quantity: 11
      }
    ]
  },
  {
    id: 'prod_raw_vessel_trio',
    name: 'ÈDÁ Artisanal Studio Ceramic Vessels (Set of 3)',
    slug: 'eda-artisanal-studio-ceramic-vessels-trio',
    description: 'Handcrafted stoneware vessels designed to hold your candle refills or serve as sculptural interior pieces. Wheel-thrown by master Nigerian ceramists using local clay deposits.',
    price: 42000,
    category: 'ceramic_vessels',
    volume: 'Set of 3 assorted heights (8cm, 11cm, 14cm)',
    scent_profile: {
      top: ['Mineral Stoneware', 'Unglazed Clay', 'Organic Tactility'],
      heart: ['Hand-Carved Ridges', 'Earth Pigments', 'Stoneware'],
      base: ['Natural Matte Finish', 'Heat Resistant', 'Dishwasher Safe']
    },
    image_url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 8,
    active: true,
    featured: false,
    variants: [
      {
        id: 'var_rv_sandstone',
        product_id: 'prod_raw_vessel_trio',
        name: 'Glaze Finish',
        value: 'Raw Sandstone Matte Glaze',
        price_adjustment: 0,
        stock_quantity: 5
      },
      {
        id: 'var_rv_basalt',
        product_id: 'prod_raw_vessel_trio',
        name: 'Glaze Finish',
        value: 'Volcanic Ash Black Finish',
        price_adjustment: 4000,
        stock_quantity: 3
      }
    ]
  },
  {
    id: 'prod_plateau_lavender_candle',
    name: 'Jos Plateau Wild Lavender & Honey Candle',
    slug: 'jos-plateau-wild-lavender-honey-candle',
    description: 'Harvested from the temperate highland hills of the Jos Plateau. Wild French lavender hybrid infused with raw mountain acacia honey, dried chamomile blossoms, and soft cedar needles.',
    price: 26000,
    category: 'candles',
    burn_time: '65+ hours',
    scent_profile: {
      top: ['Jos Highland Lavender', 'Wild Mountain Honey', 'Clary Sage'],
      heart: ['Dried Chamomile', 'Violet Leaf', 'Eucalyptus'],
      base: ['Acacia Wood', 'Golden Amber', 'Tonka Bean']
    },
    image_url: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=800&q=80',
    stock_quantity: 15,
    active: true,
    featured: false,
    variants: [
      {
        id: 'var_pl_amber',
        product_id: 'prod_plateau_lavender_candle',
        name: 'Vessel',
        value: 'Heavy Weighted Amber Glass Jar (280g)',
        price_adjustment: 0,
        stock_quantity: 10
      },
      {
        id: 'var_pl_white',
        product_id: 'prod_plateau_lavender_candle',
        name: 'Vessel',
        value: 'Matte Chalk White Ceramic Jar (280g)',
        price_adjustment: 2500,
        stock_quantity: 5
      }
    ]
  }
];

export const BRAND_STORY = {
  name: 'ÈDÁ Artisanal Living',
  tagline: 'Handcrafted Nigerian Home Fragrance & Botanical Living',
  origin: 'Formulated & Hand-Poured in Lagos, Nigeria',
  mission: 'We craft slow-luxury scent rituals using indigenous West African botanicals, artisanal ceramic vessels, and sustainable coconut-soy wax.',
  currencySymbol: '₦',
  contactEmail: 'concierge@eda-living.ng',
  contactPhone: '+234 (0) 812 345 6789',
  address: '14B Victoria Arobieke Street, Off Admiralty Way, Lekki Phase 1, Lagos, Nigeria'
};
