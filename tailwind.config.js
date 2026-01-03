// tailwind.config.js
const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(accordion|alert|autocomplete|avatar|badge|breadcrumbs|button|card|checkbox|chip|code|date-picker|divider|drawer|dropdown|form|image|input|kbd|link|listbox|modal|navbar|pagination|popover|progress|radio|scroll-shadow|select|skeleton|snippet|spacer|spinner|toggle|table|tabs|toast|user|ripple|calendar|date-input|menu).js",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};
