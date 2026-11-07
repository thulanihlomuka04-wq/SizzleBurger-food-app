package com.sizzleburger.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import com.sizzleburger.app.data.model.*
import kotlinx.coroutines.flow.*

data class AuthUiState(
    val currentUser: User? = null,
    val selectedRole: UserRole = UserRole.CUSTOMER,
    val emailInput: String = "",
    val passwordInput: String = "",
    val errorMessage: String? = null,
    val liveOrders: List<Order> = emptyList()
) {
    val isLoggedIn: Boolean get() = currentUser != null
    val isSeller: Boolean get() = currentUser?.role == UserRole.SELLER
}

class AuthViewModel : ViewModel() {

    private val _authState = MutableStateFlow(AuthUiState(liveOrders = createInitialOrders()))
    val authState: StateFlow<AuthUiState> = _authState.asStateFlow()

    fun onRoleSelected(role: UserRole) = _authState.update { it.copy(selectedRole = role, errorMessage = null) }
    fun onEmailChanged(email: String) = _authState.update { it.copy(emailInput = email, errorMessage = null) }
    fun onPasswordChanged(password: String) = _authState.update { it.copy(passwordInput = password, errorMessage = null) }

    fun login(onSuccess: (UserRole) -> Unit) {
        val state = _authState.value
        if (state.emailInput.isBlank() || state.passwordInput.isBlank()) {
            _authState.update { it.copy(errorMessage = "Please enter both email and password") }
            return
        }

        val user = if (state.selectedRole == UserRole.SELLER) {
            User(email = state.emailInput.trim(), name = "Chef Sipho (Kitchen Admin)", role = UserRole.SELLER, storeName = "SizzleBurger Cape Town Station #1")
        } else {
            User(email = state.emailInput.trim(), name = "Thulani (Customer)", role = UserRole.CUSTOMER)
        }

        _authState.update { it.copy(currentUser = user, errorMessage = null) }
        onSuccess(user.role)
    }

    fun autofillDemo(role: UserRole) {
        if (role == UserRole.SELLER) {
            _authState.update { it.copy(selectedRole = UserRole.SELLER, emailInput = "manager@sizzleburger.co.za", passwordInput = "grillmaster2026", errorMessage = null) }
        } else {
            _authState.update { it.copy(selectedRole = UserRole.CUSTOMER, emailInput = "thulani@gmail.com", passwordInput = "burgerlover123", errorMessage = null) }
        }
    }

    fun logout() = _authState.update { it.copy(currentUser = null, emailInput = "", passwordInput = "") }

    fun submitNewOrder(order: Order) {
        _authState.update { it.copy(liveOrders = listOf(order) + it.liveOrders) }
    }

    fun updateOrderStatus(orderId: String, newStatus: OrderStatus) {
        _authState.update { state ->
            val updated = state.liveOrders.map { order ->
                if (order.orderId == orderId) {
                    order.copy(
                        status = newStatus,
                        estimatedTime = when (newStatus) {
                            OrderStatus.PENDING -> "25 - 35 mins"
                            OrderStatus.PREPARING -> "10 - 15 mins"
                            OrderStatus.READY -> "Ready for Pickup / Out for Delivery"
                            OrderStatus.COMPLETED -> "Delivered"
                        }
                    )
                } else order
            }
            state.copy(liveOrders = updated)
        }
    }

    private fun createInitialOrders(): List<Order> {
        return listOf(
            Order(
                orderId = "#ORD-2041",
                customerName = "Sipho Ndlovu",
                customerPhone = "+27 82 555 1204",
                cartItems = emptyList(),
                orderType = OrderType.DELIVERY,
                deliveryAddress = "18 Bree Street, Cape Town",
                subtotal = 260.00,
                deliveryFee = 25.00,
                taxAmount = 39.00,
                totalAmount = 324.00,
                status = OrderStatus.PENDING,
                estimatedTime = "25 - 30 mins"
            )
        )
    }
}
