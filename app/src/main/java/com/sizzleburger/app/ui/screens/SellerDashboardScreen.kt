package com.sizzleburger.app.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DeliveryDining
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.OutdoorGrill
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
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
                            text = authState.currentUser?.storeName ?: "SizzleBurger Cape Town Station #1",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onLogoutClicked) {
                        Icon(Icons.Default.ExitToApp, contentDescription = "Sign Out / Switch Role")
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
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    MetricCard(title = "Pending", count = "$pendingCount", color = MaterialTheme.colorScheme.error, modifier = Modifier.weight(1f))
                    MetricCard(title = "In Kitchen", count = "$preparingCount", color = MaterialTheme.colorScheme.secondary, modifier = Modifier.weight(1f))
                    MetricCard(title = "Ready", count = "$readyCount", color = MaterialTheme.colorScheme.primary, modifier = Modifier.weight(1f))
                }
            }

            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Queue Total Gross (ZAR)", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text("R%.2f".format(totalRevenue), style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary))
                        }
                        Text("${authState.liveOrders.size} active tickets", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                    }
                }
            }

            item {
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    item {
                        FilterChip(
                            selected = selectedFilter == null,
                            onClick = { selectedFilter = null },
                            label = { Text("All (${authState.liveOrders.size})") }
                        )
                    }
                    items(OrderStatus.values()) { status ->
                        val count = authState.liveOrders.count { it.status == status }
                        FilterChip(
                            selected = selectedFilter == status,
                            onClick = { selectedFilter = status },
                            label = { Text("${status.label} ($count)") }
                        )
                    }
                }
            }

            if (filteredOrders.isEmpty()) {
                item {
                    Box(modifier = Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                        Text("No orders currently in this status.", color = MaterialTheme.colorScheme.onSurfaceVariant)
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
fun MetricCard(title: String, count: String, color: Color, modifier: Modifier = Modifier) {
    Card(shape = RoundedCornerShape(16.dp), modifier = modifier) {
        Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Text(count, style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.ExtraBold, color = color))
            Text(title, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
fun SellerOrderCard(order: Order, onAdvanceStatus: (OrderStatus) -> Unit, modifier: Modifier = Modifier) {
    Card(shape = RoundedCornerShape(18.dp), modifier = modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Column {
                    Text(order.orderId, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary))
                    Text(order.customerName, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold))
                }
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = when (order.status) {
                        OrderStatus.PENDING -> MaterialTheme.colorScheme.errorContainer
                        OrderStatus.PREPARING -> MaterialTheme.colorScheme.secondaryContainer
                        OrderStatus.READY -> MaterialTheme.colorScheme.primaryContainer
                        OrderStatus.COMPLETED -> MaterialTheme.colorScheme.surfaceVariant
                    }
                ) {
                    Text(
                        text = order.status.label,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(if (order.orderType == OrderType.DELIVERY) Icons.Default.DeliveryDining else Icons.Default.Storefront, contentDescription = null, modifier = Modifier.size(16.dp), tint = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (order.orderType == OrderType.DELIVERY) "Delivery: ${order.deliveryAddress ?: "Address"}" else "Store Pickup",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp))

            order.cartItems.forEach { item ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("${item.quantity}x ${item.foodItem.name} (${item.selectedSize.name})", fontWeight = FontWeight.Medium)
                        if (item.selectedAddOns.isNotEmpty()) {
                            Text("+ " + item.selectedAddOns.joinToString { it.name }, style = MaterialTheme.typography.bodySmall)
                        }
                        if (item.specialInstructions.isNotBlank()) {
                            Text("Note: \"${item.specialInstructions}\"", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.error)
                        }
                    }
                    Text("R%.2f".format(item.calculatedPrice), fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text("Total: R%.2f".format(order.totalAmount), style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.ExtraBold))

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
                            Text("Mark Ready")
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
                        Text("Finalized", style = MaterialTheme.typography.labelMedium.copy(color = MaterialTheme.colorScheme.outline))
                    }
                }
            }
        }
    }
}
