-- Seed data: 3 categories, 10 products

INSERT INTO categories (id, name, slug) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Apparel', 'apparel'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Electronics', 'electronics'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Accessories', 'accessories')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (id, name, slug, description, price, compare_at_price, image_url, category_id, stock, is_active) VALUES
  (
    'b1b2c3d4-0001-4000-8000-000000000001',
    'Classic Cotton T-Shirt',
    'classic-cotton-tshirt',
    'A timeless crew-neck tee made from 100% organic cotton. Pre-shrunk, comfortable fit perfect for everyday wear. Available in multiple sizes.',
    29.99, 39.99,
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    'a1b2c3d4-0001-4000-8000-000000000001', 150, true
  ),
  (
    'b1b2c3d4-0002-4000-8000-000000000002',
    'Slim Fit Denim Jeans',
    'slim-fit-denim-jeans',
    'Modern slim-fit jeans crafted from premium stretch denim. Features a classic five-pocket design with subtle fading for a lived-in look.',
    79.99, NULL,
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    'a1b2c3d4-0001-4000-8000-000000000001', 85, true
  ),
  (
    'b1b2c3d4-0003-4000-8000-000000000003',
    'Wireless Noise-Cancelling Headphones',
    'wireless-noise-cancelling-headphones',
    'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and Hi-Res audio support. Foldable design with carrying case included.',
    199.99, 249.99,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'a1b2c3d4-0002-4000-8000-000000000002', 45, true
  ),
  (
    'b1b2c3d4-0004-4000-8000-000000000004',
    'Mechanical Keyboard RGB',
    'mechanical-keyboard-rgb',
    'Full-size mechanical keyboard with Cherry MX switches, per-key RGB backlighting, and aircraft-grade aluminum frame. USB-C with detachable cable.',
    149.99, NULL,
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800',
    'a1b2c3d4-0002-4000-8000-000000000002', 60, true
  ),
  (
    'b1b2c3d4-0005-4000-8000-000000000005',
    'Leather Bifold Wallet',
    'leather-bifold-wallet',
    'Handcrafted genuine leather wallet with RFID protection. Features 8 card slots, 2 bill compartments, and a coin pocket. Slim profile fits comfortably.',
    49.99, 64.99,
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
    'a1b2c3d4-0003-4000-8000-000000000003', 200, true
  ),
  (
    'b1b2c3d4-0006-4000-8000-000000000006',
    'Stainless Steel Watch',
    'stainless-steel-watch',
    'Elegant analog watch with Japanese quartz movement, sapphire crystal glass, and water resistance to 100m. Brushed stainless steel bracelet.',
    189.99, 229.99,
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
    'a1b2c3d4-0003-4000-8000-000000000003', 30, true
  ),
  (
    'b1b2c3d4-0007-4000-8000-000000000007',
    'Wireless Charging Pad',
    'wireless-charging-pad',
    'Fast wireless charger compatible with all Qi-enabled devices. 15W max output with smart temperature control and LED indicator. Non-slip silicone surface.',
    34.99, NULL,
    'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800',
    'a1b2c3d4-0002-4000-8000-000000000002', 120, true
  ),
  (
    'b1b2c3d4-0008-4000-8000-000000000008',
    'Canvas Tote Bag',
    'canvas-tote-bag',
    'Durable heavyweight canvas tote with reinforced handles and interior pocket. Perfect for groceries, books, or everyday carry. Machine washable.',
    24.99, NULL,
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
    'a1b2c3d4-0003-4000-8000-000000000003', 300, true
  ),
  (
    'b1b2c3d4-0009-4000-8000-000000000009',
    'Wool Blend Hoodie',
    'wool-blend-hoodie',
    'Premium heavyweight hoodie made from a cozy wool-cotton blend. Features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs.',
    89.99, 109.99,
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    'a1b2c3d4-0001-4000-8000-000000000001', 75, true
  ),
  (
    'b1b2c3d4-0010-4000-8000-000000000010',
    'Portable Bluetooth Speaker',
    'portable-bluetooth-speaker',
    'Waterproof portable speaker with 360-degree sound, 12-hour battery life, and built-in microphone. Pairs with up to 2 devices simultaneously.',
    59.99, 79.99,
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
    'a1b2c3d4-0002-4000-8000-000000000002', 90, true
  )
ON CONFLICT DO NOTHING;
