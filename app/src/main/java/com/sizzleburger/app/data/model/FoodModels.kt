package com.sizzleburger.app.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.UUID

enum class UserRole(val label: String) {
    CUSTOMER("Customer"),
    SELLER("Seller / Admin")
}

enum class OrderStatus(val label: String) {
    PENDING("Pending"),
    PREPARING("Preparing"),
    READY("Ready for Pickup/Delivery"),
    COMPLETED("Completed")
}

@Parcelize
data class User(
    val id: String = UUID.randomUUID().toString(),
    val email: String,
    val name: String,
    val role: UserRole,
    val storeName: String? = null
) : Parcelable

enum class FoodCategory(val displayName: String) {
    ALL("All"),
    BURGERS("Burgers"),
    DRINKS("Drinks"),
    COMBOS("Combos"),
    SIDES("Sides")
}

enum class OrderType {
    PICKUP,
    DELIVERY
}

@Parcelize
data class CustomizationOption(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val price: Double // Extra cost in South African Rands (ZAR)
) : Parcelable

@Parcelize
data class FoodItem(
    val id: String,
    val name: String,
    val description: String,
    val price: Double, // Base price in ZAR
    val category: FoodCategory,
    val imageUrl: String,
    val availableSizes: List<CustomizationOption> = emptyList(),
    val availableAddOns: List<CustomizationOption> = emptyList(),
    val calories: String? = null,
    val isPopular: Boolean = false
) : Parcelable

@Parcelize
data class CartItem(
    val cartItemId: String = UUID.randomUUID().toString(),
    val foodItem: FoodItem,
    val selectedSize: CustomizationOption,
    val selectedAddOns: List<CustomizationOption> = emptyList(),
    val quantity: Int = 1,
    val specialInstructions: String = ""
) : Parcelable {
    val calculatedPrice: Double
        get() {
            val unitPrice = foodItem.price + selectedSize.price + selectedAddOns.sumOf { it.price }
            return unitPrice * quantity
        }
}

@Parcelize
data class Order(
    val orderId: String,
    val customerName: String,
    val customerPhone: String = "+27 82 555 0199",
    val cartItems: List<CartItem>,
    val orderType: OrderType,
    val deliveryAddress: String? = null,
    val subtotal: Double,
    val deliveryFee: Double,
    val taxAmount: Double, // 15% VAT
    val totalAmount: Double,
    val timestamp: Long = System.currentTimeMillis(),
    val status: OrderStatus = OrderStatus.PENDING,
    val estimatedTime: String = "25 - 35 mins"
) : Parcelable
