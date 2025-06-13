import { findByProps, findByStoreName, getByProps } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { getDiscordTheme } from "$/types";

// Look up modules
const ThemeStore = findByStoreName("ThemeStore");
const canUse = findByProps("canUseClientThemes");
const ThemeUtils = findByProps("updateBackgroundGradientPreset");
const AppearanceSettings = findByProps("setShouldSyncAppearanceSettings");
const FluxDispatcher = window.enmity.modules.common.Dispatcher as any;
const UnsyncedUserSettingsStore = getModule((m) => m?.getName?.() === "UnsyncedUserSettingsStore");
const ThemeManager = getByProps("overrideTheme");
const AMOLEDTheme = getByProps("setAMOLEDThemeEnabled");

const plugin = {
   onStart() {
      const overrideTheme = function () {
         try {
            ThemeManager.overrideTheme(ThemeStore.theme ?? "dark");
            AMOLEDTheme.setAMOLEDThemeEnabled(UnsyncedUserSettingsStore.useAMOLEDTheme === 2);
            FluxDispatcher.unsubscribe("I18N_LOAD_SUCCESS", overrideTheme);
         } catch (e) {
            console.error("An error occurred while trying to override theme:\n" + e?.stack ?? e);
         }
      };

      FluxDispatcher.subscribe("I18N_LOAD_SUCCESS", overrideTheme);
   },

   onStop() { }
};

export default plugin;
