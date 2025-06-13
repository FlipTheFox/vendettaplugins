import { findByProps, findByStoreName } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { getDiscordTheme } from "$/types";

// Look up modules
const ThemeStore = findByStoreName("ThemeStore");
const canUse = findByProps("canUseClientThemes");
const ThemeUtils = findByProps("updateBackgroundGradientPreset");
const AppearanceSettings = findByProps("setShouldSyncAppearanceSettings");

// Apply patches
const patches = [
  instead(
    "setShouldSyncAppearanceSettings",
    AppearanceSettings,
    () => false
  ),
];

// Run side-effects separately
AppearanceSettings.setShouldSyncAppearanceSettings(false);

// Attempt to force dark theme
AppearanceSettings.setTheme?.("dark");

// Apply saved gradient theme if available
if (storage.theme && storage.isEnabled) {
  ThemeUtils.updateBackgroundGradientPreset(storage.theme);
}

// Export theme-aware color resolver
export const resolveCustomSemantic = (dark: string, light: string): string =>
  getDiscordTheme() === "light" ? light : dark;
