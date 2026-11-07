export type Category = 'All' | 'Burgers' | 'Drinks' | 'Combos' | 'Sides';

export type OrderType = 'Pickup' | 'Delivery';

export type UserRole = 'Customer' | 'Seller';

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  storeName?: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number; // in ZAR (Rands)
  category?: 'size' | 'addon';
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number; // in ZAR
  category: Category;
  imageUrl: string;
  availableSizes: CustomizationOption[];
  availableAddOns: CustomizationOption[];
  calories?: string;
  popular?: boolean;
}

export interface CartItem {
  cartItemId: string;
  foodItem: FoodItem;
  selectedSize: CustomizationOption;
  selectedAddOns: CustomizationOption[];
  quantity: number;
  specialInstructions: string;
  calculatedPrice: number; // (base + size + sum(addons)) * quantity
}

export interface Order {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  cartItems: CartItem[];
  orderType: OrderType;
  deliveryAddress?: string;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number; // 15% VAT
  totalAmount: number;
  timestamp: number;
  status: OrderStatus;
  estimatedTime: string;
}

// Seed dummy data matching user specification
export const SEED_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'burger-cheeseburger',
    name: 'Cheeseburger',
    description: '100% pure flame-grilled beef patty topped with melted aged cheddar, crisp lettuce, ripe tomatoes, pickles, and our signature burger sauce on a toasted sesame brioche bun.',
    price: 65.0,
    category: 'Burgers',
    imageUrl: '/src/assets/images/cheeseburger_classic_1794035056062.jpg',
    popular: true,
    calories: '540 kcal',
    availableSizes: [
      { id: 'size-single', name: 'Single (120g)', price: 0, category: 'size' },
      { id: 'size-double', name: 'Double Patty (240g)', price: 25.0, category: 'size' },
      { id: 'size-triple', name: 'Triple Monster (360g)', price: 45.0, category: 'size' },
    ],
    availableAddOns: [
      { id: 'addon-extra-cheese', name: 'Extra Cheddar Cheese', price: 10.0, category: 'addon' },
      { id: 'addon-bacon', name: 'Crispy Smoked Bacon', price: 18.0, category: 'addon' },
      { id: 'addon-extra-patty', name: 'Extra Beef Patty', price: 25.0, category: 'addon' },
      { id: 'addon-jalapeno', name: 'Pickled Jalapeños', price: 8.0, category: 'addon' },
    ],
  },
  {
    id: 'burger-double-bacon',
    name: 'Double Bacon Cheeseburger',
    description: 'Two sizzling seasoned beef patties stacked with double melted American cheddar, thick cut smoked glazed bacon, caramelized onions, and smoky BBQ glaze.',
    price: 95.0,
    category: 'Burgers',
    imageUrl: '/src/assets/images/double_bacon_cheeseburger_1794035057284.jpg',
    popular: true,
    calories: '820 kcal',
    availableSizes: [
      { id: 'size-reg', name: 'Standard Double', price: 0, category: 'size' },
      { id: 'size-upsize', name: 'Up-sized Meat Lover (+80g)', price: 22.0, category: 'size' },
    ],
    availableAddOns: [
      { id: 'addon-extra-cheese', name: 'Extra Cheddar Cheese', price: 10.0, category: 'addon' },
      { id: 'addon-extra-bacon', name: 'Extra Crispy Bacon Strips', price: 18.0, category: 'addon' },
      { id: 'addon-extra-patty', name: 'Third Beef Patty', price: 25.0, category: 'addon' },
      { id: 'addon-fried-egg', name: 'Runny Fried Egg', price: 12.0, category: 'addon' },
    ],
  },
  {
    id: 'combo-ultimate',
    name: 'Ultimate Burger & Drink Combo',
    description: 'The heavyweight favorite: Double Cheeseburger paired with a generous basket of seasoned golden fries and a chilled fountain drink of your choice.',
    price: 110.0,
    category: 'Combos',
    imageUrl: '/src/assets/images/combo_meal_ultimate_1794035057782.jpg',
    popular: true,
    calories: '1150 kcal',
    availableSizes: [
      { id: 'size-regular', name: 'Regular Combo (330ml Drink)', price: 0, category: 'size' },
      { id: 'size-large', name: 'Large Combo (500ml + Mega Fries)', price: 18.0, category: 'size' },
    ],
    availableAddOns: [
      { id: 'addon-extra-cheese', name: 'Extra Melted Cheese', price: 10.0, category: 'addon' },
      { id: 'addon-bacon', name: 'Smoked Bacon Strips', price: 18.0, category: 'addon' },
      { id: 'addon-cheese-fries-upgrade', name: 'Upgrade to Loaded Cheese Fries', price: 20.0, category: 'addon' },
    ],
  },
  {
    id: 'sides-loaded-fries',
    name: 'Loaded Cheese Fries',
    description: 'Hot skin-on rustic potatoes drenched in warm rich cheddar cheese sauce, topped with crisped savory bacon crumble and freshly sliced scallions.',
    price: 40.0,
    category: 'Sides',
    imageUrl: '/src/assets/images/loaded_cheese_fries_1794035058196.jpg',
    calories: '480 kcal',
    availableSizes: [
      { id: 'size-regular', name: 'Medium Bowl', price: 0, category: 'size' },
      { id: 'size-large', name: 'Sharing Platter (Large)', price: 20.0, category: 'size' },
    ],
    availableAddOns: [
      { id: 'addon-extra-cheese-sauce', name: 'Extra Cheese Sauce Cup', price: 12.0, category: 'addon' },
      { id: 'addon-bacon-bits', name: 'Extra Bacon Bits', price: 15.0, category: 'addon' },
      { id: 'addon-jalapeno', name: 'Spicy Jalapeño Slices', price: 8.0, category: 'addon' },
    ],
  },
  {
    id: 'drink-coke',
    name: 'Cold Soda / Coke',
    description: 'Crisp, ice-cold Coca-Cola served poured over freshly cracked crystal ice cubes with a fresh lemon wedge.',
    price: 20.0,
    category: 'Drinks',
    imageUrl: '/src/assets/images/cold_soda_beverage_1794035057179.jpg',
    calories: '140 kcal',
    availableSizes: [
      { id: 'size-small', name: 'Small (300ml)', price: 0, category: 'size' },
      { id: 'size-medium', name: 'Medium (450ml)', price: 5.0, category: 'size' },
      { id: 'size-large', name: 'Large (600ml)', price: 10.0, category: 'size' },
    ],
    availableAddOns: [
      { id: 'addon-extra-lemon', name: 'Extra Lemon & Lime Wedge', price: 4.0, category: 'addon' },
      { id: 'addon-vanilla-shot', name: 'Vanilla Syrup Shot', price: 6.0, category: 'addon' },
    ],
  },
  {
    id: 'drink-orange-soda',
    name: 'Orange Soda',
    description: 'Bright citrus sparkling orange soda bursting with bubbly tanginess, chilled with clear ice and orange slices.',
    price: 20.0,
    category: 'Drinks',
    imageUrl: '/src/assets/images/cold_soda_beverage_1794035057179.jpg',
    calories: '150 kcal',
    availableSizes: [
      { id: 'size-small', name: 'Small (300ml)', price: 0, category: 'size' },
      { id: 'size-medium', name: 'Medium (450ml)', price: 5.0, category: 'size' },
      { id: 'size-large', name: 'Large (600ml)', price: 10.0, category: 'size' },
    ],
    availableAddOns: [
      { id: 'addon-extra-orange', name: 'Fresh Orange Slice', price: 4.0, category: 'addon' },
    ],
  },
];

export const INITIAL_SELLER_ORDERS: Order[] = [
  {
    orderId: '#ORD-2041',
    customerName: 'Sipho Ndlovu',
    customerPhone: '+27 82 555 1204',
    cartItems: [
      {
        cartItemId: 'seed_ord_1',
        foodItem: SEED_FOOD_ITEMS[1], // Double Bacon Cheeseburger
        selectedSize: SEED_FOOD_ITEMS[1].availableSizes[0],
        selectedAddOns: [SEED_FOOD_ITEMS[1].availableAddOns[0]], // Extra Cheese
        quantity: 2,
        specialInstructions: 'Well done patties with extra napkins',
        calculatedPrice: (95.0 + 10.0) * 2,
      },
      {
        cartItemId: 'seed_ord_2',
        foodItem: SEED_FOOD_ITEMS[4], // Coke
        selectedSize: SEED_FOOD_ITEMS[4].availableSizes[1], // Medium
        selectedAddOns: [],
        quantity: 2,
        specialInstructions: 'Extra ice please',
        calculatedPrice: (20.0 + 5.0) * 2,
      },
    ],
    orderType: 'Delivery',
    deliveryAddress: '18 Bree Street, Foreshore, Cape Town',
    subtotal: 260.0,
    deliveryFee: 25.0,
    taxAmount: 39.0,
    totalAmount: 324.0,
    timestamp: Date.now() - 1000 * 60 * 12, // 12 mins ago
    status: 'Pending',
    estimatedTime: '25 - 30 mins',
  },
  {
    orderId: '#ORD-2038',
    customerName: 'Amina Patel',
    customerPhone: '+27 73 999 4321',
    cartItems: [
      {
        cartItemId: 'seed_ord_3',
        foodItem: SEED_FOOD_ITEMS[2], // Ultimate Combo
        selectedSize: SEED_FOOD_ITEMS[2].availableSizes[1], // Large
        selectedAddOns: [SEED_FOOD_ITEMS[2].availableAddOns[2]], // Loaded Fries upgrade
        quantity: 1,
        specialInstructions: 'No ice in drink',
        calculatedPrice: 110.0 + 18.0 + 20.0,
      },
    ],
    orderType: 'Pickup',
    deliveryAddress: undefined,
    subtotal: 148.0,
    deliveryFee: 0.0,
    taxAmount: 22.2,
    totalAmount: 170.2,
    timestamp: Date.now() - 1000 * 60 * 22, // 22 mins ago
    status: 'Preparing',
    estimatedTime: '10 - 15 mins',
  },
  {
    orderId: '#ORD-2030',
    customerName: 'David Van Der Merwe',
    customerPhone: '+27 84 123 7890',
    cartItems: [
      {
        cartItemId: 'seed_ord_4',
        foodItem: SEED_FOOD_ITEMS[3], // Loaded Cheese Fries
        selectedSize: SEED_FOOD_ITEMS[3].availableSizes[0],
        selectedAddOns: [SEED_FOOD_ITEMS[3].availableAddOns[1]], // Extra Bacon Bits
        quantity: 1,
        specialInstructions: 'Extra crispy',
        calculatedPrice: 40.0 + 15.0,
      },
    ],
    orderType: 'Pickup',
    deliveryAddress: undefined,
    subtotal: 55.0,
    deliveryFee: 0.0,
    taxAmount: 8.25,
    totalAmount: 63.25,
    timestamp: Date.now() - 1000 * 60 * 35, // 35 mins ago
    status: 'Ready',
    estimatedTime: 'Ready at Counter',
  },
];

