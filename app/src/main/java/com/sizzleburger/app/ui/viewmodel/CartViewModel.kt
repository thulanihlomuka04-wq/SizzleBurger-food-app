package com.sizzleburger.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sizzleburger.app.data.model.*
import com.sizzleburger.app.data.repository.FakeMenuRepository
import com.sizzleburger.app.data.repository.MenuRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.UUID

data class CartUiState(
    val menuItems: List<FoodItem> = emptyList(),
    val filteredMenuItems: List<FoodItem> = emptyList(),
    val selectedCategory: FoodCategory = FoodCategory.ALL,
    val searchQuery: String = "",
    val cartItems: List<CartItem> = emptyList(),
    val customizingItem: FoodItem? = null,
    val orderType: OrderType = OrderType.PICKUP,
    val deliveryAddress: String = "",
    val isPlacingOrder: Boolean = false,
    val latestOrder: Order? = null
) {
    val subtotal: Double get() = cartItems.sumOf { it.calculatedPrice }
    val deliveryFee: Double get() = if (orderType == OrderType.DELIVERY && cartItems.isNotEmpty()) 25.00 else 0.00
    val taxAmount: Double get() = subtotal * 0.15 // 15% South African VAT
    val totalAmount: Double get() = subtotal + deliveryFee + taxAmount
    val totalItemCount: Int get() = cartItems.sumOf { it.quantity }
}

class CartViewModel(
    private val repository: MenuRepository = FakeMenuRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow(CartUiState())
    val uiState: StateFlow<CartUiState> = _uiState.asStateFlow()

    init {
        loadMenu()
    }

    private fun loadMenu() {
        viewModelScope.launch {
            repository.getMenuItems().collect { items ->
                _uiState.update { state ->
                    state.copy(
                        menuItems = items,
                        filteredMenuItems = applyFilters(items, state.selectedCategory, state.searchQuery)
                    )
                }
            }
        }
    }

    fun onCategorySelected(category: FoodCategory) {
        _uiState.update { state ->
            state.copy(
                selectedCategory = category,
                filteredMenuItems = applyFilters(state.menuItems, category, state.searchQuery)
            )
        }
    }

    fun onSearchQueryChanged(query: String) {
        _uiState.update { state ->
            state.copy(
                searchQuery = query,
                filteredMenuItems = applyFilters(state.menuItems, state.selectedCategory, query)
            )
        }
    }

    fun openCustomization(foodItem: FoodItem) {
        _uiState.update { it.copy(customizingItem = foodItem) }
    }

    fun closeCustomization() {
        _uiState.update { it.copy(customizingItem = null) }
    }

    fun addToCart(
        foodItem: FoodItem,
        selectedSize: CustomizationOption,
        selectedAddOns: List<CustomizationOption>,
        quantity: Int,
        specialInstructions: String
    ) {
        val newItem = CartItem(
            cartItemId = UUID.randomUUID().toString(),
            foodItem = foodItem,
            selectedSize = selectedSize,
            selectedAddOns = selectedAddOns,
            quantity = quantity,
            specialInstructions = specialInstructions.trim()
        )

        _uiState.update { state ->
            state.copy(
                cartItems = state.cartItems + newItem,
                customizingItem = null
            )
        }
    }

    fun updateCartQuantity(cartItemId: String, delta: Int) {
        _uiState.update { state ->
            val updated = state.cartItems.mapNotNull { item ->
                if (item.cartItemId == cartItemId) {
                    val newQty = item.quantity + delta
                    if (newQty > 0) item.copy(quantity = newQty) else null
                } else item
            }
            state.copy(cartItems = updated)
        }
    }

    fun removeCartItem(cartItemId: String) {
        _uiState.update { state ->
            state.copy(cartItems = state.cartItems.filterNot { it.cartItemId == cartItemId })
        }
    }

    fun setOrderType(orderType: OrderType) {
        _uiState.update { it.copy(orderType = orderType) }
    }

    fun setDeliveryAddress(address: String) {
        _uiState.update { it.copy(deliveryAddress = address) }
    }

    fun placeOrder(customerName: String, onSuccess: (Order) -> Unit) {
        val currentState = _uiState.value
        if (currentState.cartItems.isEmpty()) return

        val order = Order(
            orderId = "#ORD-" + (1000..9999).random(),
            customerName = customerName,
            cartItems = currentState.cartItems,
            orderType = currentState.orderType,
            deliveryAddress = if (currentState.orderType == OrderType.DELIVERY) currentState.deliveryAddress else null,
            subtotal = currentState.subtotal,
            deliveryFee = currentState.deliveryFee,
            taxAmount = currentState.taxAmount,
            totalAmount = currentState.totalAmount,
            status = OrderStatus.PENDING,
            estimatedTime = if (currentState.orderType == OrderType.DELIVERY) "30 - 45 mins" else "15 - 25 mins"
        )

        _uiState.update { state ->
            state.copy(
                cartItems = emptyList(),
                latestOrder = order
            )
        }
        onSuccess(order)
    }

    fun resetOrder() {
        _uiState.update { it.copy(latestOrder = null) }
    }

    private fun applyFilters(
        items: List<FoodItem>,
        category: FoodCategory,
        query: String
    ): List<FoodItem> {
        return items.filter { item ->
            val matchesCategory = category == FoodCategory.ALL || item.category == category
            val matchesQuery = query.isBlank() ||
                    item.name.contains(query, ignoreCase = true) ||
                    item.description.contains(query, ignoreCase = true)
            matchesCategory && matchesQuery
        }
    }
}
