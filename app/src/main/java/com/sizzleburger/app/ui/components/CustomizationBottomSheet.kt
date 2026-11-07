package com.sizzleburger.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.sizzleburger.app.data.model.CustomizationOption
import com.sizzleburger.app.data.model.FoodItem

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomizationBottomSheet(
    foodItem: FoodItem,
    onDismiss: () -> Unit,
    onAddToCart: (FoodItem, CustomizationOption, List<CustomizationOption>, Int, String) -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    var selectedSize by remember(foodItem) {
        mutableStateOf(foodItem.availableSizes.firstOrNull() ?: CustomizationOption(name = "Standard", price = 0.0))
    }
    var selectedAddOns by remember(foodItem) {
        mutableStateOf(setOf<CustomizationOption>())
    }
    var quantity by remember { mutableIntStateOf(1) }
    var specialInstructions by remember { mutableStateOf("") }

    val unitPrice = foodItem.price + selectedSize.price + selectedAddOns.sumOf { it.price }
    val totalPrice = unitPrice * quantity

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Customize Order", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold))
                IconButton(onClick = onDismiss) {
                    Icon(Icons.Default.Close, contentDescription = "Close")
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                AsyncImage(
                    model = foodItem.imageUrl,
                    contentDescription = foodItem.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.size(80.dp).clip(RoundedCornerShape(12.dp))
                )
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(text = foodItem.name, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                    Text(text = "Base: R%.2f".format(foodItem.price), color = MaterialTheme.colorScheme.primary)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Portion Size
            if (foodItem.availableSizes.isNotEmpty()) {
                Text(text = "Select Size / Portion", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                Spacer(modifier = Modifier.height(8.dp))
                foodItem.availableSizes.forEach { sizeOption ->
                    val isSelected = selectedSize.name == sizeOption.name
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { selectedSize = sizeOption }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            RadioButton(selected = isSelected, onClick = { selectedSize = sizeOption })
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(sizeOption.name)
                        }
                        Text(if (sizeOption.price > 0) "+R%.2f".format(sizeOption.price) else "Included")
                    }
                }
                HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))
            }

            // Extra Add-ons
            if (foodItem.availableAddOns.isNotEmpty()) {
                Text(text = "Extra Add-Ons", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                Spacer(modifier = Modifier.height(8.dp))
                foodItem.availableAddOns.forEach { addon ->
                    val isChecked = selectedAddOns.any { it.name == addon.name }
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                selectedAddOns = if (isChecked) selectedAddOns.filterNot { it.name == addon.name }.toSet() else selectedAddOns + addon
                            }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(checked = isChecked, onCheckedChange = { checked ->
                                selectedAddOns = if (checked) selectedAddOns + addon else selectedAddOns.filterNot { it.name == addon.name }.toSet()
                            })
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(addon.name)
                        }
                        Text("+R%.2f".format(addon.price), color = MaterialTheme.colorScheme.primary)
                    }
                }
                HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))
            }

            // Special Instructions
            Text(text = "Special Instructions", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = specialInstructions,
                onValueChange = { specialInstructions = it },
                placeholder = { Text("e.g., Extra napkins, no onions, sauce on the side") },
                maxLines = 3,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Stepper and Add to Cart Button
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(24.dp)).padding(horizontal = 4.dp)
                ) {
                    IconButton(onClick = { if (quantity > 1) quantity-- }, enabled = quantity > 1) {
                        Icon(Icons.Default.Remove, contentDescription = "Decrease")
                    }
                    Text("$quantity", fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp))
                    IconButton(onClick = { quantity++ }) {
                        Icon(Icons.Default.Add, contentDescription = "Increase")
                    }
                }

                Button(
                    onClick = { onAddToCart(foodItem, selectedSize, selectedAddOns.toList(), quantity, specialInstructions) },
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.height(50.dp)
                ) {
                    Text("Add to Cart • R%.2f".format(totalPrice), fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
