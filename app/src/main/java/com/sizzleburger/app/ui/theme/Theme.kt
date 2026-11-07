package com.sizzleburger.app.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = FlamePrimary,
    onPrimary = FlameOnPrimary,
    primaryContainer = FlameOnPrimaryContainer,
    onPrimaryContainer = FlamePrimaryContainer,
    secondary = CheddarSecondary,
    onSecondary = CheddarOnSecondary,
    secondaryContainer = CheddarOnSecondaryContainer,
    onSecondaryContainer = CheddarSecondaryContainer,
    background = BunBackgroundDark,
    surface = BunSurfaceDark
)

private val LightColorScheme = lightColorScheme(
    primary = FlamePrimary,
    onPrimary = FlameOnPrimary,
    primaryContainer = FlamePrimaryContainer,
    onPrimaryContainer = FlameOnPrimaryContainer,
    secondary = CheddarSecondary,
    onSecondary = CheddarOnSecondary,
    secondaryContainer = CheddarSecondaryContainer,
    onSecondaryContainer = CheddarOnSecondaryContainer,
    background = BunBackgroundLight,
    surface = BunSurfaceLight
)

@Composable
fun SizzleBurgerTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
