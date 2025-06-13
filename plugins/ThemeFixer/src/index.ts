import { findByProps, findByStoreName } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { getDiscordTheme } from "$/types";

// Look up modules
const ThemeStore = findByStoreName("ThemeStore");
const canUse = findByProps("canUseClientThemes");
const ThemeUtils = findByProps("updateBackgroundGradientPreset");
const AppearanceSettings = findByProps("setShouldSyncAppearanceSettings");

// Storage for patch cleanup
let patches: (() => void)[] = [];

// Export theme-aware color resolver
export const resolveCustomSemantic = (dark: string, light: string): string =>
  getDiscordTheme() === "light" ? light : dark;

export const onLoad = () => {
  // Patch: prevent syncing appearance settings
  const unpatch = instead(
    "setShouldSyncAppearanceSettings",
    AppearanceSettings,
    () => false
  );
  patches.push(unpatch);

  // Immediately apply dark theme logic
  AppearanceSettings.setShouldSyncAppearanceSettings(false);
  AppearanceSettings.setTheme?.("dark");

  // Optional: restore gradient if custom theme set
  if (storage.theme && storage.isEnabled) {
    ThemeUtils.updateBackgroundGradientPreset(storage.theme);
  }
};

export const onUnload = () => {
  patches.forEach((unpatch) => unpatch());
  patches = [];
};
