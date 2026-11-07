import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Check,
  Clock,
  Store,
  Bike,
  Flame,
  ChevronRight,
  Sun,
  Moon,
  UserCheck,
  LogOut,
  ChefHat,
  Eye,
  EyeOff,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  Category,
  FoodItem,
  CartItem,
  Order,
  OrderType,
  OrderStatus,
  UserRole,
  User,
  CustomizationOption,
  SEED_FOOD_ITEMS,
  INITIAL_SELLER_ORDERS
} from '../types/androidModels';

export const AndroidEmulator: React.FC = () => {
  // Navigation State: 'login' | 'menu' | 'cart' | 'confirmation' | 'seller_dashboard'
  const [currentScreen, setCurrentScreen] = useState<
    'login' | 'menu' | 'cart' | 'confirmation' | 'seller_dashboard'
  >('login');

  // Dark/Light Material You Mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginRole, setLoginRole] = useState<UserRole>('Customer');
  const [emailInput, setEmailInput] = useState('thulani@gmail.com');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Live Shared Order Queue (shared between Customer & Seller)
  const [ordersQueue, setOrdersQueue] = useState<Order[]>(INITIAL_SELLER_ORDERS);
  const [sellerStatusFilter, setSellerStatusFilter] = useState<OrderStatus | 'All'>('All');

  // Menu Search & Filter
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Customization State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customizingItem, setCustomizingItem] = useState<FoodItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<CustomizationOption | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<CustomizationOption[]>([]);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Checkout State
  const [orderType, setOrderType] = useState<OrderType>('Delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('Unit 14, 82 Kloof Street, Cape Town');
  const [latestOrderId, setLatestOrderId] = useState<string | null>(null);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return SEED_FOOD_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Pricing calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.calculatedPrice, 0);
  }, [cartItems]);

  const deliveryFee = orderType === 'Delivery' && cartItems.length > 0 ? 25.0 : 0.0;
  const taxAmount = subtotal * 0.15; // 15% South African VAT
  const totalAmount = subtotal + deliveryFee + taxAmount;
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Authentication Handlers
  const handleLogin = (roleToUse = loginRole) => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setLoginError(null);
    const user: User = {
      id: 'usr_' + Date.now(),
      email: emailInput.trim(),
      name: roleToUse === 'Seller' ? 'Chef Sipho (Kitchen Admin)' : 'Thulani (Customer)',
      role: roleToUse,
      storeName: roleToUse === 'Seller' ? 'SizzleBurger Cape Town Station #1' : undefined,
    };

    setCurrentUser(user);
    if (roleToUse === 'Seller') {
      setCurrentScreen('seller_dashboard');
    } else {
      setCurrentScreen('menu');
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    setLoginRole(role);
    if (role === 'Seller') {
      setEmailInput('manager@sizzleburger.co.za');
      setPasswordInput('grillmaster2026');
    } else {
      setEmailInput('thulani@gmail.com');
      setPasswordInput('burgerlover123');
    }
    setLoginError(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  // Customization bottom sheet
  const handleOpenCustomization = (item: FoodItem) => {
    setCustomizingItem(item);
    setSelectedSize(item.availableSizes[0] || { id: 'default', name: 'Regular', price: 0 });
    setSelectedAddOns([]);
    setItemQuantity(1);
    setSpecialInstructions('');
  };

  const handleAddToCart = () => {
    if (!customizingItem || !selectedSize) return;

    const unitPrice =
      customizingItem.price +
      selectedSize.price +
      selectedAddOns.reduce((sum, add) => sum + add.price, 0);
    const calculatedPrice = unitPrice * itemQuantity;

    const newCartItem: CartItem = {
      cartItemId: 'cart_' + Date.now() + Math.random().toString(36).substring(2, 7),
      foodItem: customizingItem,
      selectedSize,
      selectedAddOns,
      quantity: itemQuantity,
      specialInstructions,
      calculatedPrice,
    };

    setCartItems((prev) => [...prev, newCartItem]);
    setCustomizingItem(null);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const unitPrice =
              item.foodItem.price +
              item.selectedSize.price +
              item.selectedAddOns.reduce((s, a) => s + a.price, 0);
            return {
              ...item,
              quantity: newQty,
              calculatedPrice: unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Place Order as Customer
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    if (orderType === 'Delivery' && !deliveryAddress.trim()) return;

    const newOrderId = '#ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      orderId: newOrderId,
      customerName: currentUser?.name || 'Customer',
      customerPhone: '+27 82 555 7711',
      cartItems: [...cartItems],
      orderType,
      deliveryAddress: orderType === 'Delivery' ? deliveryAddress : undefined,
      subtotal,
      deliveryFee,
      taxAmount,
      totalAmount,
      timestamp: Date.now(),
      status: 'Pending',
      estimatedTime: orderType === 'Delivery' ? '25 - 35 mins' : '15 - 20 mins',
    };

    // Add to shared live queue so Seller immediately receives it!
    setOrdersQueue((prev) => [newOrder, ...prev]);
    setLatestOrderId(newOrderId);
    setCartItems([]);
    setCurrentScreen('confirmation');
  };

  // Seller updates order status
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrdersQueue((prev) =>
      prev.map((order) => {
        if (order.orderId === orderId) {
          return {
            ...order,
            status: nextStatus,
            estimatedTime:
              nextStatus === 'Pending'
                ? '25 - 35 mins'
                : nextStatus === 'Preparing'
                ? '10 - 15 mins'
                : nextStatus === 'Ready'
                ? 'Ready at Counter / Driver on Way'
                : 'Delivered / Collected',
          };
        }
        return order;
      })
    );
  };

  // Get active order details for customer confirmation screen
  const customerActiveOrder = useMemo(() => {
    if (!latestOrderId) return ordersQueue[0] || null;
    return ordersQueue.find((o) => o.orderId === latestOrderId) || null;
  }, [ordersQueue, latestOrderId]);

  // Seller Dashboard Metrics
  const sellerFilteredOrders = useMemo(() => {
    if (sellerStatusFilter === 'All') return ordersQueue;
    return ordersQueue.filter((o) => o.status === sellerStatusFilter);
  }, [ordersQueue, sellerStatusFilter]);

  const pendingCount = ordersQueue.filter((o) => o.status === 'Pending').length;
  const preparingCount = ordersQueue.filter((o) => o.status === 'Preparing').length;
  const readyCount = ordersQueue.filter((o) => o.status === 'Ready').length;
  const totalGross = ordersQueue.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="flex flex-col items-center justify-center p-2 lg:p-4">
      {/* Device Toolbar / Live Switcher */}
      <div className="flex items-center justify-between w-full max-w-[400px] mb-2 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Pixel 8 Pro</span>
          <span className="text-slate-600">·</span>
          {currentUser ? (
            <span
              className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                currentUser.role === 'Seller'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {currentUser.role}
            </span>
          ) : (
            <span className="text-slate-500">Unauthenticated</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {currentUser && (
            <button
              onClick={() => {
                if (currentUser.role === 'Seller') {
                  setCurrentScreen('seller_dashboard');
                } else {
                  setCurrentScreen('menu');
                }
              }}
              className="px-2 py-0.5 text-[10px] font-medium text-slate-300 hover:text-white bg-slate-800 rounded border border-slate-700"
            >
              Home
            </button>
          )}

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Theme"
            className="p-1 rounded-md hover:bg-slate-800 text-slate-300 transition-colors"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div
        className={`relative w-[375px] sm:w-[390px] h-[780px] rounded-[44px] p-3 shadow-2xl transition-colors duration-300 border-4 border-slate-700/80 ${
          isDarkMode ? 'bg-slate-900 shadow-amber-950/20' : 'bg-slate-800 shadow-slate-950/40'
        }`}
      >
        <div className="absolute inset-0 rounded-[40px] pointer-events-none ring-1 ring-white/10" />

        {/* Device Screen Area */}
        <div
          className={`relative w-full h-full rounded-[34px] overflow-hidden flex flex-col transition-colors duration-200 select-none ${
            isDarkMode ? 'bg-[#181210] text-stone-100' : 'bg-[#FFFDFB] text-stone-900'
          }`}
        >
          {/* Status Bar */}
          <div className="h-7 px-5 pt-1.5 flex items-center justify-between text-[11px] font-medium tracking-tight opacity-90 z-20">
            <span>10:42</span>
            <div className="w-3.5 h-3.5 rounded-full bg-black/80 ring-2 ring-slate-800/40" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-current p-0.5 flex items-center">
                <div className="w-3/4 h-full bg-current rounded-2xs" />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SCREEN 0: ROLE-BASED LOGIN SCREEN                         */}
          {/* ========================================================= */}
          {currentScreen === 'login' && (
            <div className="flex-1 flex flex-col justify-between p-5 overflow-y-auto">
              <div className="flex-1 flex flex-col justify-center">
                {/* Burger Logo */}
                <div className="text-center mb-5">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 mb-2">
                    <Flame className="w-8 h-8" />
                  </div>
                  <h1 className="text-xl font-extrabold tracking-tight text-red-600 dark:text-red-400">
                    SizzleBurger
                  </h1>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Role-Based Food Ordering & Kitchen Portal
                  </p>
                </div>

                {/* Role Selector Tabs (Segmented Button) */}
                <div className="mb-4">
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Select Role
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
                    <button
                      onClick={() => {
                        setLoginRole('Customer');
                        handleQuickDemo('Customer');
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        loginRole === 'Customer'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Customer</span>
                    </button>

                    <button
                      onClick={() => {
                        setLoginRole('Seller');
                        handleQuickDemo('Seller');
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        loginRole === 'Seller'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>Seller / Kitchen</span>
                    </button>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder={loginRole === 'Seller' ? 'seller@sizzleburger.co.za' : 'customer@gmail.com'}
                      className={`w-full px-3 py-2.5 text-xs rounded-xl border transition-colors ${
                        isDarkMode
                          ? 'bg-stone-800/60 border-stone-700 text-white focus:border-red-500'
                          : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-red-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full px-3 py-2.5 pr-8 text-xs rounded-xl border transition-colors ${
                          isDarkMode
                            ? 'bg-stone-800/60 border-stone-700 text-white focus:border-red-500'
                            : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-red-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500 text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Sign In CTA */}
                  <button
                    onClick={() => handleLogin()}
                    className={`w-full py-3 text-white rounded-xl text-xs font-bold shadow-md transition-all mt-2 ${
                      loginRole === 'Seller'
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 shadow-amber-600/20'
                        : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 shadow-red-600/20'
                    }`}
                  >
                    Sign In as {loginRole}
                  </button>
                </div>

                {/* Quick Autofill Helpers */}
                <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 text-center">
                  <span className="text-[10px] text-stone-400 font-semibold block mb-2">
                    Quick Autofill Accounts:
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleQuickDemo('Customer')}
                      className="flex-1 py-1.5 text-[11px] rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
                    >
                      Demo Customer
                    </button>
                    <button
                      onClick={() => handleQuickDemo('Seller')}
                      className="flex-1 py-1.5 text-[11px] rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
                    >
                      Demo Seller
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center text-[10px] text-stone-400 pb-1">
                Material 3 & Jetpack Compose RBAC Flow
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 1: MENU HOME SCREEN (CUSTOMER)                     */}
          {/* ========================================================= */}
          {currentScreen === 'menu' && (
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* App Bar */}
              <div
                className={`px-4 py-2.5 flex items-center justify-between border-b transition-colors ${
                  isDarkMode ? 'bg-[#221B17] border-stone-800' : 'bg-[#FFF9F5] border-amber-100/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-red-500/20">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="font-extrabold text-base tracking-tight leading-none text-red-600 dark:text-red-400">
                      SizzleBurger
                    </h1>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium truncate max-w-[150px]">
                      Hello, {currentUser?.name?.split(' ')[0] || 'Customer'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentScreen('cart')}
                    className="relative p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800"
                    aria-label="View Cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {totalItemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {totalItemCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleLogout}
                    title="Sign Out / Switch Role"
                    className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto pb-24">
                {/* Search Bar */}
                <div className="p-3 pb-2">
                  <div
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border transition-colors ${
                      isDarkMode
                        ? 'bg-stone-800/60 border-stone-700/60 focus-within:border-red-500'
                        : 'bg-stone-100 border-stone-200/80 focus-within:border-red-500'
                    }`}
                  >
                    <Search className="w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search burgers, combos, sodas..."
                      className="w-full bg-transparent text-xs focus:outline-none placeholder:text-stone-400"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-stone-400 text-xs">
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-2 px-3 py-1 overflow-x-auto no-scrollbar">
                  {(['All', 'Burgers', 'Drinks', 'Combos', 'Sides'] as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                          : isDarkMode
                          ? 'bg-stone-800 text-stone-300'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Food Item Grid */}
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleOpenCustomization(item)}
                        className={`rounded-2xl overflow-hidden border cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between ${
                          isDarkMode
                            ? 'bg-[#221B17] border-stone-800/80'
                            : 'bg-white border-stone-200/70 shadow-sm'
                        }`}
                      >
                        <div className="relative h-28 bg-stone-100 dark:bg-stone-800 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {item.popular && (
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-extrabold uppercase rounded shadow-sm">
                              Popular
                            </span>
                          )}
                        </div>

                        <div className="p-2.5 flex flex-col justify-between flex-1">
                          <div>
                            <h3 className="font-bold text-xs line-clamp-1">{item.name}</h3>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2.5 pt-1 border-t border-stone-100 dark:border-stone-800">
                            <span className="font-extrabold text-xs text-red-600 dark:text-red-400">
                              R{item.price.toFixed(2)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCustomization(item);
                              }}
                              className="w-6 h-6 rounded-full bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Cart Indicator */}
              {totalItemCount > 0 && (
                <div className="absolute bottom-4 left-3 right-3 z-30">
                  <button
                    onClick={() => setCurrentScreen('cart')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-2xl shadow-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-white/20 text-xs font-bold flex items-center justify-center">
                        {totalItemCount}
                      </span>
                      <span className="text-xs font-bold">View Basket</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-extrabold">
                      <span>R{subtotal.toFixed(2)}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 2: SHOPPING CART & CHECKOUT                        */}
          {/* ========================================================= */}
          {currentScreen === 'cart' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div
                className={`px-3 py-2.5 flex items-center gap-2 border-b ${
                  isDarkMode ? 'bg-[#221B17] border-stone-800' : 'bg-[#FFF9F5] border-amber-100/80'
                }`}
              >
                <button onClick={() => setCurrentScreen('menu')} className="p-1 rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-extrabold text-sm flex-1">Basket ({totalItemCount})</h1>
                {cartItems.length > 0 && (
                  <button onClick={() => setCartItems([])} className="text-[11px] text-red-500 font-semibold">
                    Clear
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-24">
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className={`p-2.5 rounded-2xl border flex gap-3 ${
                      isDarkMode ? 'bg-[#221B17] border-stone-800' : 'bg-white border-stone-200/70'
                    }`}
                  >
                    <img
                      src={item.foodItem.imageUrl}
                      alt={item.foodItem.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-xs truncate">{item.foodItem.name}</h4>
                        <span className="font-bold text-xs text-red-600">
                          R{item.calculatedPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500">Size: {item.selectedSize.name}</p>
                      {item.selectedAddOns.length > 0 && (
                        <p className="text-[10px] text-stone-500 line-clamp-1">
                          + {item.selectedAddOns.map((a) => a.name).join(', ')}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100 dark:border-stone-800">
                        <span className="text-[10px] text-stone-400">Qty: {item.quantity}</span>
                        <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.cartItemId, -1)}
                            className="p-0.5"
                          >
                            {item.quantity > 1 ? (
                              <Minus className="w-3 h-3" />
                            ) : (
                              <Trash2 className="w-3 h-3 text-red-500" />
                            )}
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.cartItemId, 1)}
                            className="p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Fulfillment */}
                <div
                  className={`p-3 rounded-2xl border ${
                    isDarkMode ? 'bg-[#221B17] border-stone-800' : 'bg-white border-stone-200/70'
                  }`}
                >
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Fulfillment Mode
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setOrderType('Pickup')}
                      className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                        orderType === 'Pickup' ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Pickup (Free)</span>
                    </button>
                    <button
                      onClick={() => setOrderType('Delivery')}
                      className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                        orderType === 'Delivery' ? 'bg-red-500/20 text-red-600 border border-red-500/30' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                      }`}
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>Delivery (+R25)</span>
                    </button>
                  </div>

                  {orderType === 'Delivery' && (
                    <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <label className="text-[10px] font-semibold text-stone-500 block mb-1">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
                          isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Payment Breakdown */}
                <div
                  className={`p-3 rounded-2xl border space-y-1.5 text-xs ${
                    isDarkMode ? 'bg-[#221B17] border-stone-800' : 'bg-white border-stone-200/70'
                  }`}
                >
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal</span>
                    <span>R{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Delivery Fee</span>
                    <span>{orderType === 'Pickup' ? 'FREE' : `R${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>15% VAT</span>
                    <span>R{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between font-extrabold text-sm text-red-600">
                    <span>Total</span>
                    <span>R{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 border-t bg-stone-50 dark:bg-[#221B17]">
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-xs flex items-center justify-between px-4 shadow-md"
                >
                  <span>Place Order & Send to Kitchen</span>
                  <span>R{totalAmount.toFixed(2)}</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 3: ORDER CONFIRMATION & LIVE TRACKING              */}
          {/* ========================================================= */}
          {currentScreen === 'confirmation' && customerActiveOrder && (
            <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
              <div className="text-center pt-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mb-2 animate-bounce">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h2 className="font-extrabold text-base">Order Placed!</h2>
                <p className="text-xs font-bold text-red-600 mt-0.5">
                  Order ID: {customerActiveOrder.orderId}
                </p>

                {/* Live Status Tracker */}
                <div className="mt-3 p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/80 text-left">
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                    <span
                      className={
                        customerActiveOrder.status === 'Pending'
                          ? 'text-red-500'
                          : 'text-stone-400'
                      }
                    >
                      1. Pending
                    </span>
                    <span
                      className={
                        customerActiveOrder.status === 'Preparing'
                          ? 'text-amber-500 font-extrabold'
                          : 'text-stone-400'
                      }
                    >
                      2. Preparing
                    </span>
                    <span
                      className={
                        customerActiveOrder.status === 'Ready'
                          ? 'text-emerald-500 font-extrabold'
                          : 'text-stone-400'
                      }
                    >
                      3. Ready
                    </span>
                    <span
                      className={
                        customerActiveOrder.status === 'Completed'
                          ? 'text-slate-400 font-bold'
                          : 'text-stone-400'
                      }
                    >
                      4. Completed
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        customerActiveOrder.status === 'Pending'
                          ? 'w-1/4 bg-red-500'
                          : customerActiveOrder.status === 'Preparing'
                          ? 'w-2/4 bg-amber-500'
                          : customerActiveOrder.status === 'Ready'
                          ? 'w-3/4 bg-emerald-500'
                          : 'w-full bg-slate-500'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-2">
                    Current Status: <strong className="text-stone-900 dark:text-stone-100">{customerActiveOrder.status}</strong> ({customerActiveOrder.estimatedTime})
                  </p>
                </div>

                {/* Hint to test Seller role */}
                <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left text-[11px] text-amber-700 dark:text-amber-300">
                  <div className="flex items-center gap-1.5 font-bold mb-0.5">
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Kitchen Integration</span>
                  </div>
                  <span>
                    This order is now live in the Seller queue. Switch to Seller mode to update its status!
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => {
                    handleQuickDemo('Seller');
                    handleLogin('Seller');
                  }}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-sm"
                >
                  Switch to Seller Dashboard to Process
                </button>
                <button
                  onClick={() => setCurrentScreen('menu')}
                  className="w-full py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl font-bold text-xs"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 4: SELLER / ADMIN DASHBOARD                        */}
          {/* ========================================================= */}
          {currentScreen === 'seller_dashboard' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top Bar */}
              <div
                className={`px-3.5 py-2.5 flex items-center justify-between border-b ${
                  isDarkMode ? 'bg-[#221B17] border-stone-800' : 'bg-[#FFF9F5] border-amber-200/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="font-extrabold text-xs leading-none">Kitchen Station</h1>
                    <p className="text-[10px] text-amber-600 font-medium">Cape Town CBD Store</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      handleQuickDemo('Customer');
                      handleLogin('Customer');
                    }}
                    title="Switch to Customer view"
                    className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md text-[10px] font-bold hover:bg-red-500/20"
                  >
                    As Customer
                  </button>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Orders List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-6">
                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-stone-100 dark:bg-stone-800/80 rounded-xl text-center">
                    <span className="text-[9px] text-stone-500 font-bold block uppercase">Pending</span>
                    <span className="text-base font-extrabold text-red-500">{pendingCount}</span>
                  </div>
                  <div className="p-2 bg-stone-100 dark:bg-stone-800/80 rounded-xl text-center">
                    <span className="text-[9px] text-stone-500 font-bold block uppercase">Kitchen</span>
                    <span className="text-base font-extrabold text-amber-500">{preparingCount}</span>
                  </div>
                  <div className="p-2 bg-stone-100 dark:bg-stone-800/80 rounded-xl text-center">
                    <span className="text-[9px] text-stone-500 font-bold block uppercase">Ready</span>
                    <span className="text-base font-extrabold text-emerald-500">{readyCount}</span>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {(['All', 'Pending', 'Preparing', 'Ready', 'Completed'] as (OrderStatus | 'All')[]).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setSellerStatusFilter(status)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${
                          sellerStatusFilter === status
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>

                {/* Order Tickets */}
                <div className="space-y-2.5">
                  {sellerFilteredOrders.length === 0 ? (
                    <div className="text-center py-8 text-stone-400 text-xs">
                      No orders in this status.
                    </div>
                  ) : (
                    sellerFilteredOrders.map((order) => (
                      <div
                        key={order.orderId}
                        className={`p-3 rounded-2xl border text-xs space-y-2 ${
                          isDarkMode
                            ? 'bg-[#221B17] border-stone-800'
                            : 'bg-white border-stone-200/80 shadow-2xs'
                        }`}
                      >
                        {/* Ticket Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-red-600 dark:text-red-400">
                                {order.orderId}
                              </span>
                              <span className="text-stone-400">·</span>
                              <span className="font-semibold text-xs">{order.customerName}</span>
                            </div>
                            <span className="text-[10px] text-stone-500">
                              {order.orderType === 'Delivery'
                                ? `Delivery: ${order.deliveryAddress || 'Address'}`
                                : 'Store Pickup'}
                            </span>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                              order.status === 'Pending'
                                ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                                : order.status === 'Preparing'
                                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                                : order.status === 'Ready'
                                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                                : 'bg-stone-500/20 text-stone-400'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Items Breakdown */}
                        <div className="py-1.5 border-y border-stone-100 dark:border-stone-800/80 space-y-1">
                          {order.cartItems.length > 0 ? (
                            order.cartItems.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-[11px]">
                                <div>
                                  <span className="font-semibold">
                                    {item.quantity}x {item.foodItem.name}
                                  </span>{' '}
                                  <span className="text-stone-400">({item.selectedSize.name})</span>
                                  {item.specialInstructions && (
                                    <p className="text-[10px] text-red-500 italic">
                                      Note: "{item.specialInstructions}"
                                    </p>
                                  )}
                                </div>
                                <span className="font-medium text-stone-600 dark:text-stone-300">
                                  R{item.calculatedPrice.toFixed(2)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-[11px] text-stone-400 italic">
                              Pre-configured meal ticket
                            </div>
                          )}
                        </div>

                        {/* Action Status Controls */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-extrabold text-xs">
                            R{order.totalAmount.toFixed(2)}
                          </span>

                          <div className="flex gap-1.5">
                            {order.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderId, 'Preparing')}
                                className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-bold shadow-xs hover:bg-amber-600"
                              >
                                Start Grilling
                              </button>
                            )}

                            {order.status === 'Preparing' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderId, 'Ready')}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold shadow-xs hover:bg-emerald-700"
                              >
                                Mark Ready
                              </button>
                            )}

                            {order.status === 'Ready' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderId, 'Completed')}
                                className="px-2.5 py-1 bg-stone-700 text-stone-200 rounded-lg text-[10px] font-bold hover:bg-stone-600"
                              >
                                Finalize Ticket
                              </button>
                            )}

                            {order.status === 'Completed' && (
                              <span className="text-[10px] text-stone-400 font-semibold">Done</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC MODAL: CUSTOMIZATION BOTTOM SHEET */}
          {customizingItem && selectedSize && (
            <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs">
              <div
                className={`max-h-[85%] flex flex-col rounded-t-[28px] p-4 shadow-2xl overflow-hidden ${
                  isDarkMode ? 'bg-[#201815] text-stone-100' : 'bg-white text-stone-900'
                }`}
              >
                <div className="flex items-center justify-between pb-2">
                  <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto -mr-2" />
                  <button onClick={() => setCustomizingItem(null)} className="p-1 text-stone-400">
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={customizingItem.imageUrl}
                      alt={customizingItem.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h3 className="font-extrabold text-xs">{customizingItem.name}</h3>
                      <p className="text-xs text-red-600 font-bold">
                        Base: R{customizingItem.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Size options */}
                  {customizingItem.availableSizes.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                        Select Size
                      </span>
                      <div className="space-y-1">
                        {customizingItem.availableSizes.map((size) => (
                          <button
                            key={size.id}
                            onClick={() => setSelectedSize(size)}
                            className={`w-full p-2 rounded-xl border flex items-center justify-between text-xs ${
                              selectedSize.id === size.id
                                ? 'border-red-500 bg-red-500/10 font-bold text-red-600'
                                : 'border-stone-200 dark:border-stone-800'
                            }`}
                          >
                            <span>{size.name}</span>
                            <span>{size.price > 0 ? `+R${size.price.toFixed(2)}` : 'Included'}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add-ons */}
                  {customizingItem.availableAddOns.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                        Extra Add-Ons
                      </span>
                      <div className="space-y-1">
                        {customizingItem.availableAddOns.map((addon) => {
                          const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                          return (
                            <button
                              key={addon.id}
                              onClick={() => {
                                setSelectedAddOns((prev) =>
                                  isChecked
                                    ? prev.filter((a) => a.id !== addon.id)
                                    : [...prev, addon]
                                );
                              }}
                              className={`w-full p-2 rounded-xl border flex items-center justify-between text-xs ${
                                isChecked
                                  ? 'border-amber-500 bg-amber-500/10 font-bold text-amber-700'
                                  : 'border-stone-200 dark:border-stone-800'
                              }`}
                            >
                              <span>{addon.name}</span>
                              <span className="text-red-600 font-bold">
                                +R{addon.price.toFixed(2)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Special note */}
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Special Instructions
                    </span>
                    <input
                      type="text"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Extra napkins, no onions..."
                      className={`w-full p-2 text-xs rounded-xl border ${
                        isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl">
                    <button onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}>
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{itemQuantity}</span>
                    <button onClick={() => setItemQuantity((q) => q + 1)}>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-between"
                  >
                    <span>Add to Basket</span>
                    <span>
                      R
                      {(
                        (customizingItem.price +
                          selectedSize.price +
                          selectedAddOns.reduce((s, a) => s + a.price, 0)) *
                        itemQuantity
                      ).toFixed(2)}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Android Navigation Gesture Pill */}
          <div className="h-4 flex items-center justify-center">
            <div className="w-28 h-1 rounded-full bg-stone-400/40" />
          </div>
        </div>
      </div>
    </div>
  );
};
