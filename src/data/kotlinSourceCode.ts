export interface KotlinCodeFile {
  id: string;
  filename: string;
  path: string;
  category: 'build' | 'model' | 'viewmodel' | 'ui' | 'navigation' | 'docs';
  description: string;
  code: string;
}

export const KOTLIN_PROJECT_FILES: KotlinCodeFile[] = [
  {
    id: 'build-gradle',
    filename: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    category: 'build',
    description: 'Gradle module script configured for Android 8.0+ (API 26+), Compose BOM, Material3, Navigation, ViewModel & Coil',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.parcelize)
}

android {
    namespace = "com.sizzleburger.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.sizzleburger.app"
        minSdk = 26 // Android 8.0 Oreo
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
        isCoreLibraryDesugaringEnabled = true
    }

    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf(
            "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api",
            "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi"
        )
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // Core Android & Lifecycle
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.5")
    implementation("androidx.activity:activity-compose:1.9.2")

    // Jetpack Compose BOM (Bill of Materials)
    val composeBom = platform("androidx.compose:compose-bom:2024.09.02")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    // Compose UI & Material 3
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    // Jetpack Navigation & ViewModel for Compose
    implementation("androidx.navigation:navigation-compose:2.8.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.5")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.5")

    // Asynchronous Image Loading - Coil for Compose
    implementation("io.coil-kt:coil-compose:2.7.0")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")

    // Java 8+ API Desugaring for Android 8.0 (API 26+)
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.2")

    // Debug Tooling
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}`
  },
  {
    id: 'food-models',
    filename: 'FoodModels.kt',
    path: 'app/src/main/java/com/sizzleburger/app/data/model/FoodModels.kt',
    category: 'model',
    description: 'Kotlin data classes: UserRole, User, OrderStatus, FoodItem, CustomizationOption, CartItem, Order',
    code: `package com.sizzleburger.app.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.UUID

/**
 * User Roles for Role-Based Access Control (RBAC).
 */
enum class UserRole(val label: String) {
    CUSTOMER("Customer"),
    SELLER("Seller / Admin")
}

/**
 * Live Order Life Cycle Statuses.
 */
enum class OrderStatus(val label: String) {
    PENDING("Pending"),
    PREPARING("Preparing"),
    READY("Ready for Pickup/Delivery"),
    COMPLETED("Completed")
}

/**
 * Authenticated user profile entity.
 */
@Parcelize
data class User(
    val id: String = UUID.randomUUID().toString(),
    val email: String,
    val name: String,
    val role: UserRole,
    val storeName: String? = null
) : Parcelable

/**
 * High-level food menu categories.
 */
enum class FoodCategory(val displayName: String) {
    ALL("All"),
    BURGERS("Burgers"),
    DRINKS("Drinks"),
    COMBOS("Combos"),
    SIDES("Sides")
}

/**
 * Order fulfillment type.
 */
enum class OrderType {
    PICKUP,
    DELIVERY
}

/**
 * Customization option for size or extra ingredients.
 */
@Parcelize
data class CustomizationOption(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val price: Double // Extra cost in South African Rands (ZAR)
) : Parcelable

/**
 * Master Food Item catalog entity.
 */
@Parcelize
data class FoodItem(
    val id: String,
    val name: String,
    val description: String,
    val price: Double, // Base price in ZAR (R)
    val category: FoodCategory,
    val imageUrl: String,
    val availableSizes: List<CustomizationOption> = emptyList(),
    val availableAddOns: List<CustomizationOption> = emptyList(),
    val calories: String? = null,
    val isPopular: Boolean = false
) : Parcelable

/**
 * Customized item added into the user's shopping basket.
 */
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

/**
 * Finalized Customer Order shared with the Seller kitchen queue.
 */
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
`
  },
  {
    id: 'auth-viewmodel',
    filename: 'AuthViewModel.kt',
    path: 'app/src/main/java/com/sizzleburger/app/ui/viewmodel/AuthViewModel.kt',
    category: 'viewmodel',
    description: 'Authentication StateHolder managing login, user role, active session, and live shared order queue',
    code: `package com.sizzleburger.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sizzleburger.app.data.model.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class AuthUiState(
    val currentUser: User? = null,
    val selectedRole: UserRole = UserRole.CUSTOMER,
    val emailInput: String = "",
    val passwordInput: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    // Live shared queue of orders visible to both customers and sellers
    val liveOrders: List<Order> = emptyList()
) {
    val isLoggedIn: Boolean get() = currentUser != null
    val isSeller: Boolean get() = currentUser?.role == UserRole.SELLER
}

class AuthViewModel : ViewModel() {

    private val _authState = MutableStateFlow(
        AuthUiState(
            // Seed initial orders in the kitchen queue
            liveOrders = createInitialOrders()
        )
    )
    val authState: StateFlow<AuthUiState> = _authState.asStateFlow()

    fun onRoleSelected(role: UserRole) {
        _authState.update { it.copy(selectedRole = role, errorMessage = null) }
    }

    fun onEmailChanged(email: String) {
        _authState.update { it.copy(emailInput = email, errorMessage = null) }
    }

    fun onPasswordChanged(password: String) {
        _authState.update { it.copy(passwordInput = password, errorMessage = null) }
    }

    fun login(onSuccess: (UserRole) -> Unit) {
        val state = _authState.value
        if (state.emailInput.isBlank() || state.passwordInput.isBlank()) {
            _authState.update { it.copy(errorMessage = "Please enter both email and password") }
            return
        }

        val user = if (state.selectedRole == UserRole.SELLER) {
            User(
                email = state.emailInput.trim(),
                name = "Chef Sipho (Manager)",
                role = UserRole.SELLER,
                storeName = "SizzleBurger Cape Town CBD"
            )
        } else {
            User(
                email = state.emailInput.trim(),
                name = "Happy Customer",
                role = UserRole.CUSTOMER
            )
        }

        _authState.update {
            it.copy(
                currentUser = user,
                errorMessage = null
            )
        }
        onSuccess(user.role)
    }

    fun autofillDemo(role: UserRole) {
        if (role == UserRole.SELLER) {
            _authState.update {
                it.copy(
                    selectedRole = UserRole.SELLER,
                    emailInput = "manager@sizzleburger.co.za",
                    passwordInput = "grillmaster2026",
                    errorMessage = null
                )
            }
        } else {
            _authState.update {
                it.copy(
                    selectedRole = UserRole.CUSTOMER,
                    emailInput = "thulani@gmail.com",
                    passwordInput = "burgerlover123",
                    errorMessage = null
                )
            }
        }
    }

    fun logout() {
        _authState.update {
            it.copy(
                currentUser = null,
                emailInput = "",
                passwordInput = "",
                errorMessage = null
            )
        }
    }

    /**
     * Called when a Customer places an order. Adds directly to the shared live order queue.
     */
    fun submitNewOrder(order: Order) {
        _authState.update { state ->
            state.copy(liveOrders = listOf(order) + state.liveOrders)
        }
    }

    /**
     * Called by Seller to advance the order lifecycle:
     * PENDING -> PREPARING -> READY -> COMPLETED
     */
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
                deliveryAddress = "18 Bree Street, Foreshore, Cape Town",
                subtotal = 260.00,
                deliveryFee = 25.00,
                taxAmount = 39.00,
                totalAmount = 324.00,
                status = OrderStatus.PENDING,
                estimatedTime = "25 - 30 mins"
            ),
            Order(
                orderId = "#ORD-2038",
                customerName = "Amina Patel",
                customerPhone = "+27 73 999 4321",
                cartItems = emptyList(),
                orderType = OrderType.PICKUP,
                deliveryAddress = null,
                subtotal = 148.00,
                deliveryFee = 0.00,
                taxAmount = 22.20,
                totalAmount = 170.20,
                status = OrderStatus.PREPARING,
                estimatedTime = "10 - 15 mins"
            )
        )
    }
}
`
  },
  {
    id: 'login-screen',
    filename: 'LoginScreen.kt',
    path: 'app/src/main/java/com/sizzleburger/app/ui/screens/LoginScreen.kt',
    category: 'ui',
    description: 'Material 3 LoginScreen with email/password, role selector segmented tabs, and demo quick-fill',
    code: `package com.sizzleburger.app.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Store
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sizzleburger.app.data.model.UserRole
import com.sizzleburger.app.ui.viewmodel.AuthUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    authState: AuthUiState,
    onRoleSelected: (UserRole) -> Unit,
    onEmailChanged: (String) -> Unit,
    onPasswordChanged: (String) -> Unit,
    onLoginClicked: () -> Unit,
    onQuickDemoClicked: (UserRole) -> Unit,
    modifier: Modifier = Modifier
) {
    var passwordVisible by remember { mutableStateOf(false) }

    Scaffold(
        modifier = modifier
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Spacer(modifier = Modifier.height(20.dp))

            // Brand Header Icon
            Surface(
                shape = RoundedCornerShape(24.dp),
                color = MaterialTheme.colorScheme.primaryContainer,
                modifier = Modifier.size(80.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = "🍔",
                        fontSize = 38.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "SizzleBurger",
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.primary
                )
            )

            Text(
                text = "Sign in to your account",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(28.dp))

            // 1. Role Selector (Segmented Tab Control)
            Text(
                text = "Select Your Role",
                style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
                modifier = Modifier.align(Alignment.Start)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                        shape = RoundedCornerShape(16.dp)
                    )
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                // Customer Tab
                val isCustomer = authState.selectedRole == UserRole.CUSTOMER
                Button(
                    onClick = { onRoleSelected(UserRole.CUSTOMER) },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isCustomer) MaterialTheme.colorScheme.primary else Color.Transparent,
                        contentColor = if (isCustomer) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                    ),
                    shape = RoundedCornerShape(12.dp),
                    elevation = null,
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "Customer", fontWeight = FontWeight.Bold)
                }

                // Seller / Admin Tab
                val isSeller = authState.selectedRole == UserRole.SELLER
                Button(
                    onClick = { onRoleSelected(UserRole.SELLER) },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isSeller) MaterialTheme.colorScheme.primary else Color.Transparent,
                        contentColor = if (isSeller) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                    ),
                    shape = RoundedCornerShape(12.dp),
                    elevation = null,
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(
                        imageVector = Icons.Default.Store,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "Seller / Kitchen", fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 2. Email Input Field
            OutlinedTextField(
                value = authState.emailInput,
                onValueChange = onEmailChanged,
                label = { Text("Email Address") },
                placeholder = {
                    Text(if (authState.selectedRole == UserRole.SELLER) "seller@sizzleburger.co.za" else "customer@gmail.com")
                },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Email, contentDescription = "Email")
                },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(14.dp))

            // 3. Password Input Field
            OutlinedTextField(
                value = authState.passwordInput,
                onValueChange = onPasswordChanged,
                label = { Text("Password") },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Lock, contentDescription = "Password")
                },
                trailingIcon = {
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(
                            imageVector = if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                            contentDescription = if (passwordVisible) "Hide password" else "Show password"
                        )
                    }
                },
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            )

            // Error Message Display
            if (authState.errorMessage != null) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = authState.errorMessage,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.align(Alignment.Start)
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 4. Primary Sign In Button
            Button(
                onClick = onLoginClicked,
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
            ) {
                Text(
                    text = if (authState.selectedRole == UserRole.SELLER) "Sign In as Seller" else "Sign In as Customer",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 5. Quick Demo Fillers (Instant Switch)
            Text(
                text = "Quick Demo Sign-In",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = { onQuickDemoClicked(UserRole.CUSTOMER) },
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Demo Customer", fontSize = 12.sp)
                }

                OutlinedButton(
                    onClick = { onQuickDemoClicked(UserRole.SELLER) },
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Demo Seller", fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}
`
  },
  {
    id: 'seller-dashboard-screen',
    filename: 'SellerDashboardScreen.kt',
    path: 'app/src/main/java/com/sizzleburger/app/ui/screens/SellerDashboardScreen.kt',
    category: 'ui',
    description: 'Seller / Admin Dashboard screen showing live incoming customer order queue and status progression controls',
    code: `package com.sizzleburger.app.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DeliveryDining
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.OutdoorGrill
import androidx.compose.material.icons.filled.PendingActions
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sizzleburger.app.data.model.Order
import com.sizzleburger.app.data.model.OrderStatus
import com.sizzleburger.app.data.model.OrderType
import com.sizzleburger.app.ui.viewmodel.AuthUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SellerDashboardScreen(
    authState: AuthUiState,
    onUpdateOrderStatus: (orderId: String, newStatus: OrderStatus) -> Unit,
    onLogoutClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedFilter by remember { mutableStateOf<OrderStatus?>(null) }

    val filteredOrders = remember(authState.liveOrders, selectedFilter) {
        if (selectedFilter == null) {
            authState.liveOrders
        } else {
            authState.liveOrders.filter { it.status == selectedFilter }
        }
    }

    val pendingCount = authState.liveOrders.count { it.status == OrderStatus.PENDING }
    val preparingCount = authState.liveOrders.count { it.status == OrderStatus.PREPARING }
    val readyCount = authState.liveOrders.count { it.status == OrderStatus.READY }
    val totalRevenue = authState.liveOrders.sumOf { it.totalAmount }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Kitchen & Seller Hub",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontWeight = FontWeight.ExtraBold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        )
                        Text(
                            text = authState.currentUser?.storeName ?: "SizzleBurger Live Kitchen",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onLogoutClicked) {
                        Icon(
                            imageVector = Icons.Default.ExitToApp,
                            contentDescription = "Logout / Switch Account"
                        )
                    }
                }
            )
        },
        modifier = modifier
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. KPI Metrics Grid
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    MetricCard(
                        title = "Pending",
                        count = "$pendingCount",
                        badgeColor = MaterialTheme.colorScheme.error,
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        title = "In Kitchen",
                        count = "$preparingCount",
                        badgeColor = MaterialTheme.colorScheme.secondary,
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        title = "Ready",
                        count = "$readyCount",
                        badgeColor = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // 2. Revenue Summary Strip
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Queue Total Gross",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "R%.2f".format(totalRevenue),
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontWeight = FontWeight.ExtraBold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            )
                        }
                        Text(
                            text = "\${authState.liveOrders.size} active tickets",
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // 3. Status Filter Chips
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    item {
                        FilterChip(
                            selected = selectedFilter == null,
                            onClick = { selectedFilter = null },
                            label = { Text("All (\${authState.liveOrders.size})") }
                        )
                    }
                    items(OrderStatus.values()) { status ->
                        val count = authState.liveOrders.count { it.status == status }
                        FilterChip(
                            selected = selectedFilter == status,
                            onClick = { selectedFilter = status },
                            label = { Text("\${status.label} (\$count)") }
                        )
                    }
                }
            }

            // 4. Order Tickets Queue
            if (filteredOrders.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No orders currently in this status.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            } else {
                items(filteredOrders, key = { it.orderId }) { order ->
                    SellerOrderCard(
                        order = order,
                        onAdvanceStatus = { nextStatus ->
                            onUpdateOrderStatus(order.orderId, nextStatus)
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun MetricCard(
    title: String,
    count: String,
    badgeColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = count,
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontWeight = FontWeight.ExtraBold,
                    color = badgeColor
                )
            )
            Text(
                text = title,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun SellerOrderCard(
    order: Order,
    onAdvanceStatus: (OrderStatus) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header: ID + Status Badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = order.orderId,
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    )
                    Text(
                        text = order.customerName,
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                    )
                }

                StatusBadge(status = order.status)
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Fulfillment details
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = if (order.orderType == OrderType.DELIVERY) Icons.Default.DeliveryDining else Icons.Default.Storefront,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (order.orderType == OrderType.DELIVERY) "Delivery: \${order.deliveryAddress ?: \\"Street\\"}" else "In-Store Pickup",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp))

            // Item summary breakdown
            order.cartItems.forEach { item ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 2.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "\${item.quantity}x \${item.foodItem.name} (\${item.selectedSize.name})",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Medium)
                        )
                        if (item.selectedAddOns.isNotEmpty()) {
                            Text(
                                text = "+ " + item.selectedAddOns.joinToString(", ") { it.name },
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        if (item.specialInstructions.isNotBlank()) {
                            Text(
                                text = "Note: \\"\${item.specialInstructions}\\"",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.error
                            )
                        }
                    }
                    Text(
                        text = "R%.2f".format(item.calculatedPrice),
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Footer with Total and Status Progression Action
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Total: R%.2f".format(order.totalAmount),
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.ExtraBold)
                )

                when (order.status) {
                    OrderStatus.PENDING -> {
                        Button(
                            onClick = { onAdvanceStatus(OrderStatus.PREPARING) },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Default.OutdoorGrill, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Start Preparing")
                        }
                    }
                    OrderStatus.PREPARING -> {
                        Button(
                            onClick = { onAdvanceStatus(OrderStatus.READY) },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Mark as Ready")
                        }
                    }
                    OrderStatus.READY -> {
                        FilledTonalButton(
                            onClick = { onAdvanceStatus(OrderStatus.COMPLETED) },
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Complete Ticket")
                        }
                    }
                    OrderStatus.COMPLETED -> {
                        Text(
                            text = "Ticket Finalized",
                            style = MaterialTheme.typography.labelMedium.copy(color = MaterialTheme.colorScheme.outline)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun StatusBadge(status: OrderStatus) {
    val (bgColor, textColor) = when (status) {
        OrderStatus.PENDING -> MaterialTheme.colorScheme.errorContainer to MaterialTheme.colorScheme.onErrorContainer
        OrderStatus.PREPARING -> MaterialTheme.colorScheme.secondaryContainer to MaterialTheme.colorScheme.onSecondaryContainer
        OrderStatus.READY -> MaterialTheme.colorScheme.primaryContainer to MaterialTheme.colorScheme.onPrimaryContainer
        OrderStatus.COMPLETED -> MaterialTheme.colorScheme.surfaceVariant to MaterialTheme.colorScheme.onSurfaceVariant
    }

    Surface(
        shape = RoundedCornerShape(8.dp),
        color = bgColor
    ) {
        Text(
            text = status.label,
            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
            color = textColor,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}
`
  },
  {
    id: 'menu-repository',
    filename: 'MenuRepository.kt',
    path: 'app/src/main/java/com/sizzleburger/app/data/repository/MenuRepository.kt',
    category: 'model',
    description: 'Repository providing fast-food seed data (Cheeseburgers, Drinks, Combos, Sides)',
    code: `package com.sizzleburger.app.data.repository

import com.sizzleburger.app.data.model.CustomizationOption
import com.sizzleburger.app.data.model.FoodCategory
import com.sizzleburger.app.data.model.FoodItem
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

interface MenuRepository {
    fun getMenuItems(): Flow<List<FoodItem>>
    suspend fun getFoodItemById(id: String): FoodItem?
}

class FakeMenuRepository : MenuRepository {

    private val seedItems = listOf(
        FoodItem(
            id = "burger_cheeseburger",
            name = "Cheeseburger",
            description = "100% pure flame-grilled beef patty topped with melted aged cheddar, crisp lettuce, ripe tomatoes, pickles, and our signature burger sauce on a toasted sesame brioche bun.",
            price = 65.00,
            category = FoodCategory.BURGERS,
            imageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
            isPopular = true,
            calories = "540 kcal",
            availableSizes = listOf(
                CustomizationOption(name = "Single (120g)", price = 0.0),
                CustomizationOption(name = "Double Patty (240g)", price = 25.0),
                CustomizationOption(name = "Triple Monster (360g)", price = 45.0)
            ),
            availableAddOns = listOf(
                CustomizationOption(name = "Extra Cheese", price = 10.0),
                CustomizationOption(name = "Crispy Bacon", price = 18.0),
                CustomizationOption(name = "Extra Patty", price = 25.0),
                CustomizationOption(name = "Pickled Jalapeños", price = 8.0)
            )
        ),
        FoodItem(
            id = "burger_double_bacon",
            name = "Double Bacon Cheeseburger",
            description = "Two sizzling seasoned beef patties stacked with double melted American cheddar, thick cut smoked glazed bacon, caramelized onions, and smoky BBQ glaze.",
            price = 95.00,
            category = FoodCategory.BURGERS,
            imageUrl = "https://images.unsplash.com/photo-1553979459-d2229ba7433b",
            isPopular = true,
            calories = "820 kcal",
            availableSizes = listOf(
                CustomizationOption(name = "Standard Double", price = 0.0),
                CustomizationOption(name = "Up-sized Meat Lover (+80g)", price = 22.0)
            ),
            availableAddOns = listOf(
                CustomizationOption(name = "Extra Cheese", price = 10.0),
                CustomizationOption(name = "Crispy Bacon", price = 18.0),
                CustomizationOption(name = "Extra Patty", price = 25.0),
                CustomizationOption(name = "Runny Fried Egg", price = 12.0)
            )
        ),
        FoodItem(
            id = "combo_ultimate",
            name = "Ultimate Burger & Drink Combo",
            description = "The heavyweight favorite: Double Cheeseburger paired with a generous basket of seasoned golden fries and a chilled fountain drink of your choice.",
            price = 110.00,
            category = FoodCategory.COMBOS,
            imageUrl = "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5",
            isPopular = true,
            calories = "1150 kcal",
            availableSizes = listOf(
                CustomizationOption(name = "Regular Combo (330ml Drink)", price = 0.0),
                CustomizationOption(name = "Large Combo (500ml + Mega Fries)", price = 18.0)
            ),
            availableAddOns = listOf(
                CustomizationOption(name = "Extra Cheese", price = 10.0),
                CustomizationOption(name = "Crispy Bacon", price = 18.0),
                CustomizationOption(name = "Upgrade to Loaded Cheese Fries", price = 20.0)
            )
        ),
        FoodItem(
            id = "sides_loaded_fries",
            name = "Loaded Cheese Fries",
            description = "Hot skin-on rustic potatoes drenched in warm rich cheddar cheese sauce, topped with crisped savory bacon crumble and freshly sliced scallions.",
            price = 40.00,
            category = FoodCategory.SIDES,
            imageUrl = "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
            calories = "480 kcal",
            availableSizes = listOf(
                CustomizationOption(name = "Medium Bowl", price = 0.0),
                CustomizationOption(name = "Sharing Platter (Large)", price = 20.0)
            ),
            availableAddOns = listOf(
                CustomizationOption(name = "Extra Cheese Sauce", price = 12.0),
                CustomizationOption(name = "Extra Bacon Bits", price = 15.0),
                CustomizationOption(name = "Jalapeño Slices", price = 8.0)
            )
        ),
        FoodItem(
            id = "drink_coke",
            name = "Cold Soda / Coke",
            description = "Crisp, ice-cold Coca-Cola served poured over freshly cracked crystal ice cubes with a fresh lemon wedge.",
            price = 20.00,
            category = FoodCategory.DRINKS,
            imageUrl = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97",
            calories = "140 kcal",
            availableSizes = listOf(
                CustomizationOption(name = "Small (300ml)", price = 0.0),
                CustomizationOption(name = "Medium (450ml)", price = 5.0),
                CustomizationOption(name = "Large (600ml)", price = 10.0)
            ),
            availableAddOns = listOf(
                CustomizationOption(name = "Extra Lemon Wedge", price = 4.0),
                CustomizationOption(name = "Vanilla Syrup Shot", price = 6.0)
            )
        ),
        FoodItem(
            id = "drink_orange_soda",
            name = "Orange Soda",
            description = "Bright citrus sparkling orange soda bursting with bubbly tanginess, chilled with clear ice and orange slices.",
            price = 20.00,
            category = FoodCategory.DRINKS,
            imageUrl = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e",
            calories = "150 kcal",
            availableSizes = listOf(
                CustomizationOption(name = "Small (300ml)", price = 0.0),
                CustomizationOption(name = "Medium (450ml)", price = 5.0),
                CustomizationOption(name = "Large (600ml)", price = 10.0)
            ),
            availableAddOns = listOf(
                CustomizationOption(name = "Fresh Orange Slice", price = 4.0)
            )
        )
    )

    override fun getMenuItems(): Flow<List<FoodItem>> = flow {
        emit(seedItems)
    }

    override suspend fun getFoodItemById(id: String): FoodItem? {
        return seedItems.find { it.id == id }
    }
}
`
  },
  {
    id: 'cart-viewmodel',
    filename: 'CartViewModel.kt',
    path: 'app/src/main/java/com/sizzleburger/app/ui/viewmodel/CartViewModel.kt',
    category: 'viewmodel',
    description: 'MVVM StateHolder using Kotlin Coroutines & StateFlow for reactive cart and checkout management',
    code: `package com.sizzleburger.app.ui.viewmodel

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
`
  },
  {
    id: 'menu-home-screen',
    filename: 'MenuHomeScreen.kt',
    path: 'app/src/main/java/com/sizzleburger/app/ui/screens/MenuHomeScreen.kt',
    category: 'ui',
    description: 'Menu Home Composable with Category Filter Bar, Search Bar, 2-column Grid of FoodItemCards, and Floating Cart Indicator',
    code: `package com.sizzleburger.app.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.sizzleburger.app.data.model.FoodCategory
import com.sizzleburger.app.data.model.FoodItem
import com.sizzleburger.app.ui.viewmodel.AuthUiState
import com.sizzleburger.app.ui.viewmodel.CartUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MenuHomeScreen(
    uiState: CartUiState,
    authState: AuthUiState,
    onCategorySelected: (FoodCategory) -> Unit,
    onSearchQueryChanged: (String) -> Unit,
    onFoodItemClicked: (FoodItem) -> Unit,
    onNavigateToCart: () -> Unit,
    onLogoutClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "SizzleBurger",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontWeight = FontWeight.ExtraBold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        )
                        Text(
                            text = "Welcome, \${authState.currentUser?.name ?: \\"Guest\\"}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onNavigateToCart) {
                        BadgedBox(
                            badge = {
                                if (uiState.totalItemCount > 0) {
                                    Badge(
                                        containerColor = MaterialTheme.colorScheme.error,
                                        contentColor = MaterialTheme.colorScheme.onError
                                    ) {
                                        Text("\${uiState.totalItemCount}")
                                    }
                                }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.ShoppingCart,
                                contentDescription = "Shopping Cart"
                            )
                        }
                    }

                    IconButton(onClick = onLogoutClicked) {
                        Icon(
                            imageVector = Icons.Default.ExitToApp,
                            contentDescription = "Logout / Switch Role"
                        )
                    }
                }
            )
        },
        bottomBar = {
            AnimatedVisibility(
                visible = uiState.totalItemCount > 0,
                enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
                exit = slideOutVertically(targetOffsetY = { it }) + fadeOut()
            ) {
                FloatingCartIndicator(
                    itemCount = uiState.totalItemCount,
                    subtotal = uiState.subtotal,
                    onNavigateToCart = onNavigateToCart,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                )
            }
        },
        modifier = modifier
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Search Bar
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = onSearchQueryChanged,
                placeholder = { Text("Search burgers, combos, sodas...") },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Search, contentDescription = "Search")
                },
                singleLine = true,
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Category Chips Bar
            CategoryChipsBar(
                selectedCategory = uiState.selectedCategory,
                onCategorySelected = onCategorySelected,
                modifier = Modifier.padding(vertical = 4.dp)
            )

            // Food Items Grid
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(uiState.filteredMenuItems, key = { it.id }) { foodItem ->
                    FoodItemCard(
                        foodItem = foodItem,
                        onClick = { onFoodItemClicked(foodItem) }
                    )
                }
            }
        }
    }
}

@Composable
fun CategoryChipsBar(
    selectedCategory: FoodCategory,
    onCategorySelected: (FoodCategory) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = modifier
    ) {
        items(FoodCategory.values()) { category ->
            FilterChip(
                selected = category == selectedCategory,
                onClick = { onCategorySelected(category) },
                label = { Text(category.displayName) },
                shape = RoundedCornerShape(20.dp)
            )
        }
    }
}

@Composable
fun FoodItemCard(
    foodItem: FoodItem,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
            ) {
                AsyncImage(
                    model = foodItem.imageUrl,
                    contentDescription = foodItem.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                if (foodItem.isPopular) {
                    Surface(
                        shape = RoundedCornerShape(bottomEnd = 8.dp),
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier.align(Alignment.TopStart)
                    ) {
                        Text(
                            text = "POPULAR",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                            color = Color.White,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }

            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = foodItem.name,
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = foodItem.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 16.sp,
                    modifier = Modifier.padding(top = 4.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "R%.2f".format(foodItem.price),
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    )
                    FilledIconButton(
                        onClick = onClick,
                        shape = CircleShape,
                        modifier = Modifier.size(36.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Add, contentDescription = "Add")
                    }
                }
            }
        }
    }
}

@Composable
fun FloatingCartIndicator(
    itemCount: Int,
    subtotal: Double,
    onNavigateToCart: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.primary,
        shadowElevation = 8.dp,
        modifier = modifier.clickable(onClick = onNavigateToCart)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .background(MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.2f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "$itemCount",
                        style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = "View Basket",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                    color = MaterialTheme.colorScheme.onPrimary
                )
            }
            Text(
                text = "R%.2f".format(subtotal),
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.ExtraBold),
                color = MaterialTheme.colorScheme.onPrimary
            )
        }
    }
}
`
  },
  {
    id: 'main-activity',
    filename: 'MainActivity.kt',
    path: 'app/src/main/java/com/sizzleburger/app/MainActivity.kt',
    category: 'navigation',
    description: 'MainActivity setup with Role-Based Navigation, LoginScreen, SellerDashboard, and Customer Menu flows',
    code: `package com.sizzleburger.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.sizzleburger.app.data.model.UserRole
import com.sizzleburger.app.ui.components.CustomizationBottomSheet
import com.sizzleburger.app.ui.screens.*
import com.sizzleburger.app.ui.viewmodel.AuthViewModel
import com.sizzleburger.app.ui.viewmodel.CartViewModel

val FlamePrimary = Color(0xFFD32F2F)
val CheddarSecondary = Color(0xFFF57C00)
val BunBackground = Color(0xFFFDFBF7)

val SizzleBurgerColorScheme = lightColorScheme(
    primary = FlamePrimary,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFFFEBEE),
    onPrimaryContainer = Color(0xFFB71C1C),
    secondary = CheddarSecondary,
    secondaryContainer = Color(0xFFFFF3E0),
    background = BunBackground,
    surface = Color.White
)

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
            MaterialTheme(colorScheme = SizzleBurgerColorScheme) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
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
                onQuickDemoClicked = { role ->
                    authViewModel.autofillDemo(role)
                }
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
                        // Automatically broadcast to the live Seller kitchen queue
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
                // Check if seller has updated this order's status in the live queue
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
`
  }
];
