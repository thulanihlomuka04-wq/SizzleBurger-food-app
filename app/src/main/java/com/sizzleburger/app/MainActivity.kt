package com.sizzleburger.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.sizzleburger.app.data.model.UserRole
import com.sizzleburger.app.ui.components.CustomizationBottomSheet
import com.sizzleburger.app.ui.screens.*
import com.sizzleburger.app.ui.theme.SizzleBurgerTheme
import com.sizzleburger.app.ui.viewmodel.AuthViewModel
import com.sizzleburger.app.ui.viewmodel.CartViewModel

object Routes {
    const val LOGIN = "login_screen"
    const val MENU = "menu_screen"
    const val CART = "cart_screen"
    const val CONFIRMATION = "order_confirmation_screen"
    const val SELLER_DASHBOARD = "seller_dashboard_screen"
}

class MainActivity : ComponentActivity() {

    private val authViewModel: AuthViewModel by viewModels()
    private val cartViewModel: CartViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SizzleBurgerTheme {
                Surface(
                    modifier = Modifier.fillMaxSize()
                ) {
                    SizzleBurgerApp(
                        authViewModel = authViewModel,
                        cartViewModel = cartViewModel
                    )
                }
            }
        }
    }
}

@Composable
fun SizzleBurgerApp(
    authViewModel: AuthViewModel,
    cartViewModel: CartViewModel
) {
    val navController = rememberNavController()
    val authState by authViewModel.authState.collectAsStateWithLifecycle()
    val cartUiState by cartViewModel.uiState.collectAsStateWithLifecycle()

    NavHost(
        navController = navController,
        startDestination = Routes.LOGIN
    ) {
        // 1. Role-Based Login Screen
        composable(Routes.LOGIN) {
            LoginScreen(
                authState = authState,
                onRoleSelected = authViewModel::onRoleSelected,
                onEmailChanged = authViewModel::onEmailChanged,
                onPasswordChanged = authViewModel::onPasswordChanged,
                onLoginClicked = {
                    authViewModel.login { role ->
                        if (role == UserRole.SELLER) {
                            navController.navigate(Routes.SELLER_DASHBOARD) {
                                popUpTo(Routes.LOGIN) { inclusive = true }
                            }
                        } else {
                            navController.navigate(Routes.MENU) {
                                popUpTo(Routes.LOGIN) { inclusive = true }
                            }
                        }
                    }
                },
                onQuickDemoClicked = authViewModel::autofillDemo
            )
        }

        // 2. Customer Menu Flow
        composable(Routes.MENU) {
            MenuHomeScreen(
                uiState = cartUiState,
                authState = authState,
                onCategorySelected = cartViewModel::onCategorySelected,
                onSearchQueryChanged = cartViewModel::onSearchQueryChanged,
                onFoodItemClicked = cartViewModel::openCustomization,
                onNavigateToCart = { navController.navigate(Routes.CART) },
                onLogoutClicked = {
                    authViewModel.logout()
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(Routes.MENU) { inclusive = true }
                    }
                }
            )

            cartUiState.customizingItem?.let { item ->
                CustomizationBottomSheet(
                    foodItem = item,
                    onDismiss = cartViewModel::closeCustomization,
                    onAddToCart = { food, size, addOns, qty, note ->
                        cartViewModel.addToCart(food, size, addOns, qty, note)
                    }
                )
            }
        }

        // 3. Customer Cart & Checkout
        composable(Routes.CART) {
            CartScreen(
                uiState = cartUiState,
                onNavigateBack = { navController.popBackStack() },
                onQuantityChange = cartViewModel::updateCartQuantity,
                onRemoveItem = cartViewModel::removeCartItem,
                onOrderTypeChange = cartViewModel::setOrderType,
                onDeliveryAddressChange = cartViewModel::setDeliveryAddress,
                onPlaceOrder = {
                    val customerName = authState.currentUser?.name ?: "Customer"
                    cartViewModel.placeOrder(customerName = customerName) { placedOrder ->
                        authViewModel.submitNewOrder(placedOrder)
                        navController.navigate(Routes.CONFIRMATION) {
                            popUpTo(Routes.MENU)
                        }
                    }
                }
            )
        }

        // 4. Order Confirmation & Live Tracking
        composable(Routes.CONFIRMATION) {
            cartUiState.latestOrder?.let { order ->
                val liveOrder = authState.liveOrders.find { it.orderId == order.orderId } ?: order
                OrderConfirmationScreen(
                    order = liveOrder,
                    onBackToMenu = {
                        cartViewModel.resetOrder()
                        navController.navigate(Routes.MENU) {
                            popUpTo(Routes.MENU) { inclusive = true }
                        }
                    }
                )
            } ?: run {
                navController.navigate(Routes.MENU) {
                    popUpTo(Routes.MENU) { inclusive = true }
                }
            }
        }

        // 5. Seller / Admin Kitchen Dashboard
        composable(Routes.SELLER_DASHBOARD) {
            SellerDashboardScreen(
                authState = authState,
                onUpdateOrderStatus = authViewModel::updateOrderStatus,
                onLogoutClicked = {
                    authViewModel.logout()
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(Routes.SELLER_DASHBOARD) { inclusive = true }
                    }
                }
            )
        }
    }
}
