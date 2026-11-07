package com.sizzleburger.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.DeliveryDining
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.sizzleburger.app.data.model.CartItem
import com.sizzleburger.app.data.model.OrderType
import com.sizzleburger.app.ui.viewmodel.CartUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartScreen(
    uiState: CartUiState,
    onNavigateBack: () -> Unit,
    onQuantityChange: (cartItemId: String, delta: Int) -> Unit,
    onRemoveItem: (cartItemId: String) -> Unit,
    onOrderTypeChange: (OrderType) -> Unit,
    onDeliveryAddressChange: (String) -> Unit,
    onPlaceOrder: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Your Shopping Basket", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        bottomBar = {
            if (uiState.cartItems.isNotEmpty()) {
                Surface(shadowElevation = 8.dp) {
                    Box(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
                        Button(
                            onClick = onPlaceOrder,
                            enabled = uiState.orderType == OrderType.PICKUP || uiState.deliveryAddress.isNotBlank(),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier.fillMaxWidth().height(52.dp)
                        ) {
                            Text("Place Order • R%.2f".format(uiState.totalAmount), fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        },
        modifier = modifier
    ) { paddingValues ->
        if (uiState.cartItems.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize().padding(paddingValues), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Your basket is empty", style = MaterialTheme.typography.titleLarge)
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(onClick = onNavigateBack) { Text("Explore Menu") }
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(paddingValues),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(uiState.cartItems, key = { it.cartItemId }) { item ->
                    CartItemCard(
                        item = item,
                        onIncrease = { onQuantityChange(item.cartItemId, 1) },
                        onDecrease = { onQuantityChange(item.cartItemId, -1) },
                        onRemove = { onRemoveItem(item.cartItemId) }
                    )
                }

                item {
                    Card(shape = RoundedCornerShape(16.dp)) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Fulfillment Type", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                FilterChip(
                                    selected = uiState.orderType == OrderType.PICKUP,
                                    onClick = { onOrderTypeChange(OrderType.PICKUP) },
                                    label = { Text("Pickup (Free)") },
                                    leadingIcon = { Icon(Icons.Default.Storefront, null) },
                                    modifier = Modifier.weight(1f)
                                )
                                FilterChip(
                                    selected = uiState.orderType == OrderType.DELIVERY,
                                    onClick = { onOrderTypeChange(OrderType.DELIVERY) },
                                    label = { Text("Delivery (+R25)") },
                                    leadingIcon = { Icon(Icons.Default.DeliveryDining, null) },
                                    modifier = Modifier.weight(1f)
                                )
                            }
                            if (uiState.orderType == OrderType.DELIVERY) {
                                Spacer(modifier = Modifier.height(12.dp))
                                OutlinedTextField(
                                    value = uiState.deliveryAddress,
                                    onValueChange = onDeliveryAddressChange,
                                    label = { Text("Delivery Address") },
                                    placeholder = { Text("Street, Apt / Unit, City") },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp)
                                )
                            }
                        }
                    }
                }

                item {
                    Card(shape = RoundedCornerShape(16.dp)) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Cost Summary", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                            Spacer(modifier = Modifier.height(8.dp))
                            BreakdownRow("Subtotal", uiState.subtotal)
                            BreakdownRow(
                                if (uiState.orderType == OrderType.DELIVERY) "Delivery Fee" else "Pickup",
                                uiState.deliveryFee,
                                isFree = uiState.orderType == OrderType.PICKUP
                            )
                            BreakdownRow("Tax (15% VAT)", uiState.taxAmount)
                            HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Final Total", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold))
                                Text("R%.2f".format(uiState.totalAmount), style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CartItemCard(item: CartItem, onIncrease: () -> Unit, onDecrease: () -> Unit, onRemove: () -> Unit) {
    Card(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth()) {
        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            AsyncImage(
                model = item.foodItem.imageUrl,
                contentDescription = item.foodItem.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier.size(72.dp).clip(RoundedCornerShape(12.dp))
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(item.foodItem.name, fontWeight = FontWeight.Bold)
                Text("Size: ${item.selectedSize.name}", style = MaterialTheme.typography.bodySmall)
                if (item.selectedAddOns.isNotEmpty()) {
                    Text("Add-ons: " + item.selectedAddOns.joinToString { it.name }, style = MaterialTheme.typography.bodySmall)
                }
                Text("R%.2f".format(item.calculatedPrice), fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            }
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(20.dp))) {
                IconButton(onClick = { if (item.quantity > 1) onDecrease() else onRemove() }, modifier = Modifier.size(32.dp)) {
                    Icon(if (item.quantity > 1) Icons.Default.Remove else Icons.Default.Delete, contentDescription = null, modifier = Modifier.size(16.dp))
                }
                Text("${item.quantity}", fontWeight = FontWeight.Bold)
                IconButton(onClick = onIncrease, modifier = Modifier.size(32.dp)) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}

@Composable
fun BreakdownRow(label: String, amount: Double, isFree: Boolean = false) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(if (isFree) "FREE" else "R%.2f".format(amount), fontWeight = FontWeight.SemiBold)
    }
}
