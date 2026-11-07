package com.sizzleburger.app.data.repository

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
