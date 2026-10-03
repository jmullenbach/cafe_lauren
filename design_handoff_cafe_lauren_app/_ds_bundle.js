/* @ds-bundle: {"format":4,"namespace":"CafeLaurenDesignSystem_9f0e0a","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"ICONS","sourcePath":"components/core/icon-paths.js"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"AvatarStack","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"DayTag","sourcePath":"components/display/DayTag.jsx"},{"name":"Score","sourcePath":"components/display/Score.jsx"},{"name":"Stars","sourcePath":"components/display/Stars.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Sheet","sourcePath":"components/feedback/Sheet.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"ChoiceChips","sourcePath":"components/forms/ChoiceChips.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"GroceryItem","sourcePath":"components/kitchen/GroceryItem.jsx"},{"name":"MealCard","sourcePath":"components/kitchen/MealCard.jsx"},{"name":"PhotoTile","sourcePath":"components/kitchen/PhotoTile.jsx"},{"name":"RecipeStep","sourcePath":"components/kitchen/RecipeStep.jsx"},{"name":"ReviewActions","sourcePath":"components/kitchen/ReviewActions.jsx"},{"name":"SuggestedTag","sourcePath":"components/kitchen/SuggestedTag.jsx"},{"name":"VoteButtons","sourcePath":"components/kitchen/VoteButtons.jsx"},{"name":"SideNav","sourcePath":"components/navigation/SideNav.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Button.jsx":"34ccd7f00416","components/core/Icon.jsx":"cd2546510c49","components/core/IconButton.jsx":"9152b57290f9","components/core/icon-paths.js":"26ff79aa73f7","components/display/Avatar.jsx":"e529d2cad899","components/display/Badge.jsx":"d6bad716e706","components/display/Card.jsx":"3edcf761af19","components/display/DayTag.jsx":"cdf48b9b2296","components/display/Score.jsx":"4651f3470384","components/display/Stars.jsx":"01139c01abbe","components/feedback/Dialog.jsx":"60bf0c52d9e8","components/feedback/Sheet.jsx":"e8fa054c62fd","components/feedback/Toast.jsx":"9cee7b1d254e","components/feedback/Tooltip.jsx":"b09096403785","components/forms/Checkbox.jsx":"d4b57a9b22e2","components/forms/ChoiceChips.jsx":"68d07ff7fa74","components/forms/Input.jsx":"710fa179a694","components/forms/SegmentedControl.jsx":"e2557bb71124","components/forms/Select.jsx":"a7ea11baddf1","components/forms/Switch.jsx":"dfab49076f72","components/kitchen/GroceryItem.jsx":"cd105a15a72a","components/kitchen/MealCard.jsx":"f1944568b55c","components/kitchen/PhotoTile.jsx":"62c3362dd21a","components/kitchen/RecipeStep.jsx":"06699d2770a9","components/kitchen/ReviewActions.jsx":"6aa276af09d8","components/kitchen/SuggestedTag.jsx":"f37f617863ed","components/kitchen/VoteButtons.jsx":"813b17b2d7ac","components/navigation/SideNav.jsx":"24d0044a04a2","components/navigation/TabBar.jsx":"607742a4222c","components/navigation/Tabs.jsx":"21bcce9fbca9","ui_kits/app/AppShell.jsx":"7e002113c7e5","ui_kits/app/CookScreen.jsx":"a2b502ef3673","ui_kits/app/GroceryScreen.jsx":"2f54bd153db7","ui_kits/app/IntakeScreen.jsx":"545b56886eec","ui_kits/app/WeekScreen.jsx":"8160478f4c30","ui_kits/app/data.js":"48db63bc2b06","ui_kits/mobile/ChatSheet.jsx":"631ccf05e28a","ui_kits/mobile/HomeScreens.jsx":"8f6177a637e4","ui_kits/mobile/InboxScreen.jsx":"df1012d9e764","ui_kits/mobile/ListScreens.jsx":"0f97871ca0ab","ui_kits/mobile/MealDetail.jsx":"ee75c864178c","ui_kits/mobile/MealSheets.jsx":"9f87d01b9853","ui_kits/mobile/PlanScreens.jsx":"a5be3ee22669","ui_kits/mobile/RecipesScreen.jsx":"71ce15ef67f1","ui_kits/mobile/Shell.jsx":"4328d754a477","ui_kits/mobile/data.js":"231be7eb3e79","ui_kits/mobile/ios-frame.jsx":"24642b887be3","ui_kits/mobile/store.jsx":"e5684040171d","ui_kits/mobile/tweaks-panel.jsx":"d259e3a86f73"},"inlinedExternals":[],"unexposedExports":[{"name":"iconNames","sourcePath":"components/core/Icon.jsx"}]} */

(() => {

const __ds_ns = (window.CafeLaurenDesignSystem_9f0e0a = window.CafeLaurenDesignSystem_9f0e0a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/icon-paths.js
try { (() => {
// Lucide v0.460.0 (ISC) — copied from lucide-static. Inner SVG markup, 24×24 viewBox.
const ICONS = {
  "apple": "<path d=\"M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z\" /> <path d=\"M10 2c1 .5 2 2 2 5\" />",
  "archive-restore": "<rect width=\"20\" height=\"5\" x=\"2\" y=\"3\" rx=\"1\" /> <path d=\"M4 8v11a2 2 0 0 0 2 2h2\" /> <path d=\"M20 8v11a2 2 0 0 1-2 2h-2\" /> <path d=\"m9 15 3-3 3 3\" /> <path d=\"M12 12v9\" />",
  "arrow-left": "<path d=\"m12 19-7-7 7-7\" /> <path d=\"M19 12H5\" />",
  "arrow-right": "<path d=\"M5 12h14\" /> <path d=\"m12 5 7 7-7 7\" />",
  "baby": "<path d=\"M9 12h.01\" /> <path d=\"M15 12h.01\" /> <path d=\"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5\" /> <path d=\"M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1\" />",
  "beef": "<circle cx=\"12.5\" cy=\"8.5\" r=\"2.5\" /> <path d=\"M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z\" /> <path d=\"m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5\" />",
  "bell": "<path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\" /> <path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\" />",
  "book-open": "<path d=\"M12 7v14\" /> <path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\" />",
  "calendar": "<path d=\"M8 2v4\" /> <path d=\"M16 2v4\" /> <rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /> <path d=\"M3 10h18\" />",
  "calendar-days": "<path d=\"M8 2v4\" /> <path d=\"M16 2v4\" /> <rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /> <path d=\"M3 10h18\" /> <path d=\"M8 14h.01\" /> <path d=\"M12 14h.01\" /> <path d=\"M16 14h.01\" /> <path d=\"M8 18h.01\" /> <path d=\"M12 18h.01\" /> <path d=\"M16 18h.01\" />",
  "camera": "<path d=\"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z\" /> <circle cx=\"12\" cy=\"13\" r=\"3\" />",
  "carrot": "<path d=\"M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46\" /> <path d=\"M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z\" /> <path d=\"M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z\" />",
  "check": "<path d=\"M20 6 9 17l-5-5\" />",
  "chef-hat": "<path d=\"M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z\" /> <path d=\"M6 17h12\" />",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\" />",
  "chevron-left": "<path d=\"m15 18-6-6 6-6\" />",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\" />",
  "chevron-up": "<path d=\"m18 15-6-6-6 6\" />",
  "circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"m9 12 2 2 4-4\" />",
  "clipboard-list": "<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\" /> <path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\" /> <path d=\"M12 11h4\" /> <path d=\"M12 16h4\" /> <path d=\"M8 11h.01\" /> <path d=\"M8 16h.01\" />",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <polyline points=\"12 6 12 12 16 14\" />",
  "cooking-pot": "<path d=\"M2 12h20\" /> <path d=\"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\" /> <path d=\"m4 8 16-4\" /> <path d=\"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8\" />",
  "cup-soda": "<path d=\"m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8\" /> <path d=\"M5 8h14\" /> <path d=\"M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0\" /> <path d=\"m12 8 1-6h2\" />",
  "egg": "<path d=\"M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.96-7.5-10-3.55.04-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z\" />",
  "ellipsis": "<circle cx=\"12\" cy=\"12\" r=\"1\" /> <circle cx=\"19\" cy=\"12\" r=\"1\" /> <circle cx=\"5\" cy=\"12\" r=\"1\" />",
  "filter": "<polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\" />",
  "fish": "<path d=\"M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z\" /> <path d=\"M18 12v.5\" /> <path d=\"M16 17.93a9.77 9.77 0 0 1 0-11.86\" /> <path d=\"M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33\" /> <path d=\"M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4\" /> <path d=\"m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98\" />",
  "flame": "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\" />",
  "heart": "<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\" />",
  "history": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\" /> <path d=\"M3 3v5h5\" /> <path d=\"M12 7v5l4 2\" />",
  "house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
  "ice-cream-cone": "<path d=\"m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11\" /> <path d=\"M17 7A5 5 0 0 0 7 7\" /> <path d=\"M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4\" />",
  "image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" /> <circle cx=\"9\" cy=\"9\" r=\"2\" /> <path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 16v-4\" /> <path d=\"M12 8h.01\" />",
  "layout-grid": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" />",
  "leaf": "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\" /> <path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\" />",
  "list": "<path d=\"M3 12h.01\" /> <path d=\"M3 18h.01\" /> <path d=\"M3 6h.01\" /> <path d=\"M8 12h13\" /> <path d=\"M8 18h13\" /> <path d=\"M8 6h13\" />",
  "list-checks": "<path d=\"m3 17 2 2 4-4\" /> <path d=\"m3 7 2 2 4-4\" /> <path d=\"M13 6h8\" /> <path d=\"M13 12h8\" /> <path d=\"M13 18h8\" />",
  "message-circle": "<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22Z\" />",
  "mic": "<path d=\"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z\" /> <path d=\"M19 10v2a7 7 0 0 1-14 0v-2\" /> <line x1=\"12\" x2=\"12\" y1=\"19\" y2=\"22\" />",
  "milk": "<path d=\"M8 2h8\" /> <path d=\"M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2\" /> <path d=\"M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0\" />",
  "minus": "<path d=\"M5 12h14\" />",
  "notebook-pen": "<path d=\"M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4\" /> <path d=\"M2 6h4\" /> <path d=\"M2 10h4\" /> <path d=\"M2 14h4\" /> <path d=\"M2 18h4\" /> <path d=\"M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z\" />",
  "package": "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\" /> <path d=\"M12 22V12\" /> <path d=\"m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7\" /> <path d=\"m7.5 4.27 9 5.15\" />",
  "pause": "<rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\" /> <rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\" />",
  "pencil": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" /> <path d=\"m15 5 4 4\" />",
  "play": "<polygon points=\"6 3 20 12 6 21 6 3\" />",
  "plus": "<path d=\"M5 12h14\" /> <path d=\"M12 5v14\" />",
  "receipt": "<path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z\" /> <path d=\"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8\" /> <path d=\"M12 17.5v-11\" />",
  "refresh-cw": "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\" /> <path d=\"M21 3v5h-5\" /> <path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\" /> <path d=\"M8 16H3v5\" />",
  "refrigerator": "<path d=\"M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z\" /> <path d=\"M5 10h14\" /> <path d=\"M15 7v6\" />",
  "salad": "<path d=\"M7 21h10\" /> <path d=\"M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z\" /> <path d=\"M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1\" /> <path d=\"m13 12 4-4\" /> <path d=\"M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2\" />",
  "sandwich": "<path d=\"m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777\" /> <path d=\"M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25\" /> <path d=\"M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9\" /> <path d=\"m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2\" /> <rect width=\"20\" height=\"4\" x=\"2\" y=\"11\" rx=\"1\" />",
  "scale": "<path d=\"m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z\" /> <path d=\"m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z\" /> <path d=\"M7 21h10\" /> <path d=\"M12 3v18\" /> <path d=\"M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2\" />",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\" /> <path d=\"m21 21-4.3-4.3\" />",
  "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" /> <path d=\"m21.854 2.147-10.94 10.939\" />",
  "settings": "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\" /> <circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "shopping-basket": "<path d=\"m15 11-1 9\" /> <path d=\"m19 11-4-7\" /> <path d=\"M2 11h20\" /> <path d=\"m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4\" /> <path d=\"M4.5 15.5h15\" /> <path d=\"m5 11 4-7\" /> <path d=\"m9 11 1 9\" />",
  "shopping-cart": "<circle cx=\"8\" cy=\"21\" r=\"1\" /> <circle cx=\"19\" cy=\"21\" r=\"1\" /> <path d=\"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12\" />",
  "snowflake": "<line x1=\"2\" x2=\"22\" y1=\"12\" y2=\"12\" /> <line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"22\" /> <path d=\"m20 16-4-4 4-4\" /> <path d=\"m4 8 4 4-4 4\" /> <path d=\"m16 4-4 4-4-4\" /> <path d=\"m8 20 4-4 4 4\" />",
  "soup": "<path d=\"M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z\" /> <path d=\"M7 21h10\" /> <path d=\"M19.5 12 22 6\" /> <path d=\"M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62\" /> <path d=\"M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62\" /> <path d=\"M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62\" />",
  "sparkles": "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\" /> <path d=\"M20 3v4\" /> <path d=\"M22 5h-4\" /> <path d=\"M4 17v2\" /> <path d=\"M5 18H3\" />",
  "star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />",
  "store": "<path d=\"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7\" /> <path d=\"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8\" /> <path d=\"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4\" /> <path d=\"M2 7h20\" /> <path d=\"M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7\" />",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\" /> <path d=\"M12 2v2\" /> <path d=\"M12 20v2\" /> <path d=\"m4.93 4.93 1.41 1.41\" /> <path d=\"m17.66 17.66 1.41 1.41\" /> <path d=\"M2 12h2\" /> <path d=\"M20 12h2\" /> <path d=\"m6.34 17.66-1.41 1.41\" /> <path d=\"m19.07 4.93-1.41 1.41\" />",
  "tag": "<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\" /> <circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />",
  "thumbs-down": "<path d=\"M17 14V2\" /> <path d=\"M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z\" />",
  "thumbs-up": "<path d=\"M7 10v12\" /> <path d=\"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z\" />",
  "timer": "<line x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\" /> <line x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\" /> <circle cx=\"12\" cy=\"14\" r=\"8\" />",
  "trash-2": "<path d=\"M3 6h18\" /> <path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\" /> <path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\" /> <line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\" /> <line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\" />",
  "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /> <path d=\"M12 9v4\" /> <path d=\"M12 17h.01\" />",
  "truck": "<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\" /> <path d=\"M15 18H9\" /> <path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\" /> <circle cx=\"17\" cy=\"18\" r=\"2\" /> <circle cx=\"7\" cy=\"18\" r=\"2\" />",
  "upload": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /> <polyline points=\"17 8 12 3 7 8\" /> <line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\" />",
  "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /> <circle cx=\"12\" cy=\"7\" r=\"4\" />",
  "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /> <circle cx=\"9\" cy=\"7\" r=\"4\" /> <path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /> <path d=\"M16 3.13a4 4 0 0 1 0 7.75\" />",
  "utensils": "<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\" /> <path d=\"M7 2v20\" /> <path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\" />",
  "utensils-crossed": "<path d=\"m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8\" /> <path d=\"M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7\" /> <path d=\"m2.1 21.8 6.4-6.3\" /> <path d=\"m19 5-7 7\" />",
  "vote": "<path d=\"m9 12 2 2 4-4\" /> <path d=\"M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z\" /> <path d=\"M22 19H2\" />",
  "wheat": "<path d=\"M2 22 16 8\" /> <path d=\"M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\" /> <path d=\"M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\" /> <path d=\"M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\" /> <path d=\"M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z\" /> <path d=\"M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\" /> <path d=\"M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\" /> <path d=\"M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\" />",
  "x": "<path d=\"M18 6 6 18\" /> <path d=\"m6 6 12 12\" />"
};
Object.assign(__ds_scope, { ICONS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/icon-paths.js", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Icon({
  name,
  size = 20,
  stroke = 1.5,
  color,
  style,
  title,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: title ? 'img' : undefined,
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
    style: {
      flex: 'none',
      display: 'block',
      color,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: __ds_scope.ICONS[name] || ''
    }
  }, rest));
}
const iconNames = Object.keys(__ds_scope.ICONS);
Object.assign(__ds_scope, { Icon, iconNames });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const {
  useState
} = React;
const PAL = {
  primary: {
    bg: 'var(--action-primary)',
    hov: 'var(--action-primary-hover)',
    fg: 'var(--action-primary-text)',
    bd: 'transparent'
  },
  accent: {
    bg: 'var(--action-accent)',
    hov: 'var(--action-accent-hover)',
    fg: 'var(--action-accent-text)',
    bd: 'transparent'
  },
  secondary: {
    bg: 'var(--surface-raised)',
    hov: 'var(--linen-100)',
    fg: 'var(--text-strong)',
    bd: 'var(--border-default)'
  },
  ghost: {
    bg: 'transparent',
    hov: 'var(--linen-200)',
    fg: 'var(--text-strong)',
    bd: 'transparent'
  },
  danger: {
    bg: 'var(--tomato-500)',
    hov: 'var(--tomato-700)',
    fg: '#fff',
    bd: 'transparent'
  }
};
const SZ = {
  s: {
    h: 32,
    px: 12,
    fs: 13,
    ic: 16,
    gap: 6
  },
  m: {
    h: 40,
    px: 16,
    fs: 14,
    ic: 18,
    gap: 8
  },
  l: {
    h: 48,
    px: 22,
    fs: 15,
    ic: 20,
    gap: 8
  }
};
function Button({
  variant = 'primary',
  size = 'm',
  icon,
  iconRight,
  fullWidth,
  disabled,
  children,
  onClick,
  type = 'button',
  style
}) {
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  const c = PAL[variant] || PAL.primary;
  const s = SZ[size] || SZ.m;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    className: "cl-focus",
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.h,
      padding: `0 ${s.px}px`,
      width: fullWidth ? '100%' : undefined,
      font: `600 ${s.fs}px/1 var(--font-sans)`,
      letterSpacing: 'var(--ls-button)',
      whiteSpace: 'nowrap',
      borderRadius: 'var(--radius-control)',
      background: h && !disabled ? c.hov : c.bg,
      color: c.fg,
      border: `1px solid ${h && variant === 'secondary' ? 'var(--border-strong)' : c.bd}`,
      opacity: disabled ? 0.45 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transform: p && !disabled ? 'scale(0.98)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast), transform var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.ic
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.ic
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
const {
  useState
} = React;
const PAL = {
  primary: {
    bg: 'var(--action-primary)',
    hov: 'var(--action-primary-hover)',
    fg: 'var(--action-primary-text)',
    bd: 'transparent'
  },
  accent: {
    bg: 'var(--action-accent)',
    hov: 'var(--action-accent-hover)',
    fg: 'var(--action-accent-text)',
    bd: 'transparent'
  },
  secondary: {
    bg: 'var(--surface-raised)',
    hov: 'var(--linen-100)',
    fg: 'var(--text-strong)',
    bd: 'var(--border-default)'
  },
  ghost: {
    bg: 'transparent',
    hov: 'var(--linen-200)',
    fg: 'var(--text-strong)',
    bd: 'transparent'
  },
  danger: {
    bg: 'var(--tomato-500)',
    hov: 'var(--tomato-700)',
    fg: '#fff',
    bd: 'transparent'
  }
};
const SZ = {
  s: [32, 16],
  m: [40, 20],
  l: [48, 22]
};
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'm',
  round,
  active,
  disabled,
  onClick,
  style
}) {
  const [h, setH] = useState(false);
  const c = PAL[variant] || PAL.ghost;
  const [d, ic] = SZ[size] || SZ.m;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    className: "cl-focus",
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: d,
      height: d,
      display: 'inline-grid',
      placeItems: 'center',
      padding: 0,
      borderRadius: round ? 'var(--radius-pill)' : 'var(--radius-control)',
      background: active ? 'var(--sage-100)' : h && !disabled ? c.hov : c.bg,
      color: active ? 'var(--sage-900)' : c.fg,
      border: `1px solid ${c.bd}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: ic
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const C = {
  sage: ['var(--sage-100)', 'var(--sage-900)'],
  terra: ['var(--terra-100)', 'var(--terra-700)'],
  oak: ['var(--oak-200)', 'var(--oak-700)'],
  honey: ['var(--honey-100)', 'var(--honey-700)'],
  slate: ['var(--slate-100)', 'var(--slate-700)']
};
function Avatar({
  name = '',
  color = 'sage',
  size = 32,
  src,
  ring,
  style
}) {
  const [bg, fg] = C[color] || C.sage;
  const ini = name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    title: name,
    style: {
      width: size,
      height: size,
      flex: 'none',
      borderRadius: 999,
      display: 'inline-grid',
      placeItems: 'center',
      overflow: 'hidden',
      background: bg,
      color: fg,
      font: `600 ${Math.round(size * 0.4)}px/1 var(--font-sans)`,
      boxShadow: ring ? '0 0 0 2px var(--surface-card)' : 'none',
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : ini);
}
function AvatarStack({
  people = [],
  size = 28,
  max = 4,
  style
}) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      ...style
    }
  }, shown.map((p, i) => /*#__PURE__*/React.createElement(Avatar, _extends({
    key: p.name + i
  }, p, {
    size: size,
    ring: true,
    style: {
      marginLeft: i ? -size * 0.28 : 0
    }
  }))), extra > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 6,
      font: '600 12px/1 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, "+", extra));
}
Object.assign(__ds_scope, { Avatar, AvatarStack });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
const T = {
  neutral: ['var(--linen-200)', 'var(--char-700)', 'var(--char-700)'],
  sale: ['var(--status-sale-bg)', 'var(--terra-700)', 'var(--status-sale)'],
  success: ['var(--status-success-bg)', 'var(--sage-700)', 'var(--status-success)'],
  warning: ['var(--status-warning-bg)', 'var(--honey-700)', 'var(--honey-500)'],
  danger: ['var(--status-danger-bg)', 'var(--tomato-700)', 'var(--status-danger)'],
  info: ['var(--status-info-bg)', 'var(--slate-700)', 'var(--status-info)'],
  accent: ['var(--sage-100)', 'var(--sage-900)', 'var(--sage-600)']
};
function Badge({
  tone = 'neutral',
  variant = 'soft',
  icon,
  children,
  style
}) {
  const [bg, fg, solid] = T[tone] || T.neutral;
  const s = variant === 'solid';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 22,
      padding: '0 8px',
      borderRadius: 'var(--radius-xs)',
      background: s ? solid : bg,
      color: s ? '#fff' : fg,
      font: '600 12px/1 var(--font-sans)',
      whiteSpace: 'nowrap',
      fontVariantNumeric: 'tabular-nums',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 13,
    stroke: 2
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
const {
  useState
} = React;
const PAD = {
  none: 0,
  s: 12,
  m: 20,
  l: 28
};
function Card({
  children,
  padding = 'm',
  interactive,
  selected,
  elevation = 'flat',
  tone = 'default',
  onClick,
  style
}) {
  const [h, setH] = useState(false);
  const bg = tone === 'sunken' ? 'var(--surface-sunken)' : tone === 'accent' ? 'var(--surface-accent)' : 'var(--surface-card)';
  const sh = elevation === 'raised' || interactive && h ? 'var(--shadow-2)' : tone === 'sunken' ? 'none' : 'var(--shadow-1)';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: bg,
      border: `1px solid ${selected ? 'var(--sage-500)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-card)',
      padding: PAD[padding] ?? padding,
      overflow: 'hidden',
      boxShadow: selected ? `0 0 0 2px var(--sage-100), ${sh}` : sh,
      cursor: interactive ? 'pointer' : undefined,
      transform: interactive && h ? 'translateY(-1px)' : 'none',
      transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out), border-color var(--dur-fast)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/DayTag.jsx
try { (() => {
const D = {
  week: 'This week',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
  spare: 'Spare'
};
function DayTag({
  day = 'mon',
  short,
  label,
  style
}) {
  const text = label || (short && day !== 'week' && day !== 'spare' ? D[day].slice(0, 3) : D[day]);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 22,
      padding: '0 8px',
      borderRadius: 'var(--radius-xs)',
      background: `var(--day-${day})`,
      color: `var(--day-${day}-ink)`,
      font: '700 10.5px/1 var(--font-sans)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }, text);
}
Object.assign(__ds_scope, { DayTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/DayTag.jsx", error: String((e && e.message) || e) }); }

// components/display/Score.jsx
try { (() => {
function Score({
  label,
  value = 0,
  max = 10,
  tone = 'sage',
  compact,
  style
}) {
  const col = tone === 'terra' ? 'var(--terra-500)' : tone === 'honey' ? 'var(--honey-500)' : 'var(--sage-500)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexDirection: compact ? 'row' : 'column',
      alignItems: compact ? 'center' : 'stretch',
      gap: compact ? 8 : 6,
      minWidth: compact ? 0 : 96,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 8
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 11px/1 var(--font-sans)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 14px/1 var(--font-sans)',
      color: 'var(--text-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "/", max))), !compact && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${max}, 1fr)`,
      gap: 2
    }
  }, Array.from({
    length: max
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      height: 4,
      borderRadius: 1,
      background: i < value ? col : 'var(--linen-300)'
    }
  }))));
}
Object.assign(__ds_scope, { Score });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Score.jsx", error: String((e && e.message) || e) }); }

// components/display/Stars.jsx
try { (() => {
function Stars({
  value = 0,
  max = 5,
  size = 16,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 2,
      color: 'var(--rating)',
      ...style
    },
    "aria-label": `${value} of ${max} stars`
  }, Array.from({
    length: max
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    onClick: onChange ? () => onChange(i + 1) : undefined,
    style: {
      cursor: onChange ? 'pointer' : undefined,
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "star",
    size: size,
    stroke: 1.5,
    style: {
      fill: i < value ? 'currentColor' : 'none',
      color: i < value ? 'var(--rating)' : 'var(--linen-400)'
    }
  }))));
}
Object.assign(__ds_scope, { Stars });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Stars.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  onClose,
  title,
  description,
  children,
  actions,
  width = 480,
  inline,
  style
}) {
  if (!open) return null;
  const box = /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      width,
      maxWidth: '100%',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-dialog)',
      boxShadow: 'var(--shadow-3)',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      padding: '24px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '400 24px/1.2 var(--font-serif)',
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 15px/1.5 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, description)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    size: "s",
    onClick: onClose
  })), children && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px 0'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      padding: 24
    }
  }, actions), !actions && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  }));
  if (inline) return box;
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      background: 'var(--scrim)',
      backdropFilter: 'blur(2px)'
    }
  }, box);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Sheet.jsx
try { (() => {
const {
  useEffect,
  useState
} = React;
function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxHeight = '88%',
  style
}) {
  const [shown, setShown] = useState(false);
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(r);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 260);
    return () => clearTimeout(t);
  }, [open]);
  if (!mounted) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 80,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim)',
      opacity: shown ? 1 : 0,
      transition: 'opacity var(--dur-base) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: 'relative',
      maxHeight,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-page)',
      borderRadius: '20px 20px 0 0',
      boxShadow: 'var(--shadow-3)',
      transform: shown ? 'none' : 'translateY(100%)',
      transition: 'transform var(--dur-slow) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '8px 0 4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 5,
      borderRadius: 999,
      background: 'var(--linen-300)'
    }
  })), (title || subtitle) && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 20px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '400 24px/1.2 var(--font-serif)',
      letterSpacing: '-0.01em',
      color: 'var(--text-strong)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 14px/1.45 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflow: 'auto',
      padding: '4px 20px 20px'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: '12px 20px 30px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-page)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Sheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Sheet.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const TONE = {
  neutral: 'var(--linen-300)',
  success: 'var(--sage-300)',
  sale: 'var(--terra-300)',
  warning: 'var(--honey-300)',
  danger: '#E79A8C'
};
function Toast({
  tone = 'neutral',
  icon,
  title,
  message,
  action,
  onAction,
  onClose,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      width: 380,
      maxWidth: '100%',
      padding: '14px 16px',
      background: 'var(--surface-inverse)',
      color: 'var(--text-inverse)',
      borderRadius: 'var(--radius-m)',
      boxShadow: 'var(--shadow-3)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20,
    style: {
      color: TONE[tone],
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, title && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 14px/1.35 var(--font-sans)'
    }
  }, title), message && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 13px/1.45 var(--font-sans)',
      color: 'var(--linen-300)'
    }
  }, message)), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      background: 'none',
      border: 0,
      padding: '2px 0',
      cursor: 'pointer',
      color: TONE[tone] === TONE.neutral ? 'var(--sage-300)' : TONE[tone],
      font: '600 13px/1.3 var(--font-sans)'
    }
  }, action), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Dismiss",
    onClick: onClose,
    style: {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      color: 'var(--char-300)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
const {
  useState
} = React;
function Tooltip({
  label,
  children,
  placement = 'top',
  open,
  style
}) {
  const [h, setH] = useState(false);
  const show = open ?? h;
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 8px)'
  } : {
    bottom: 'calc(100% + 8px)'
  };
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    }
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      ...pos,
      transform: `translateX(-50%) translateY(${show ? 0 : placement === 'bottom' ? -4 : 4}px)`,
      opacity: show ? 1 : 0,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      padding: '6px 10px',
      borderRadius: 'var(--radius-s)',
      background: 'var(--surface-inverse)',
      color: 'var(--text-inverse)',
      font: '500 12px/1.3 var(--font-sans)',
      boxShadow: 'var(--shadow-2)',
      transition: 'opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      zIndex: 50
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  onChange,
  label,
  description,
  size = 'm',
  strike,
  disabled,
  style
}) {
  const d = size === 'l' ? 24 : 20;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: d,
      height: d,
      flex: 'none',
      marginTop: label ? size === 'l' ? 0 : 1 : 0,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 5,
      border: `1.5px solid ${checked ? 'var(--sage-600)' : 'var(--border-strong)'}`,
      background: checked ? 'var(--sage-600)' : 'var(--surface-raised)',
      color: '#fff',
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast)'
    }
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: d - 6,
    stroke: 2.5
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: `400 ${size === 'l' ? 17 : 15}px/1.4 var(--font-sans)`,
      color: strike && checked ? 'var(--text-muted)' : 'var(--text-strong)',
      textDecoration: strike && checked ? 'line-through' : 'none',
      textDecorationColor: 'var(--text-faint)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 13px/1.4 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/ChoiceChips.jsx
try { (() => {
function ChoiceChips({
  options = [],
  value = [],
  onChange,
  multi = true,
  size = 'm',
  style
}) {
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  const sel = Array.isArray(value) ? value : value == null ? [] : [value];
  const toggle = v => {
    if (!onChange) return;
    if (multi) onChange(sel.includes(v) ? sel.filter(x => x !== v) : [...sel, v]);else onChange(sel[0] === v ? null : v);
  };
  const h = size === 's' ? 30 : 36;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      ...style
    }
  }, opts.map(o => {
    const on = sel.includes(o.value);
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      type: "button",
      "aria-pressed": on,
      onClick: () => toggle(o.value),
      className: "cl-focus",
      style: {
        display: 'inline-flex',
        flex: 'none',
        whiteSpace: 'nowrap',
        alignItems: 'center',
        gap: 6,
        height: h,
        padding: '0 14px',
        borderRadius: 999,
        cursor: 'pointer',
        border: `1px solid ${on ? 'var(--char-900)' : 'var(--border-default)'}`,
        background: on ? 'var(--char-900)' : 'var(--surface-raised)',
        color: on ? 'var(--linen-50)' : 'var(--text-strong)',
        font: `500 ${size === 's' ? 13 : 14}px/1 var(--font-sans)`,
        transition: 'background var(--dur-fast), border-color var(--dur-fast), color var(--dur-fast)'
      }
    }, on && multi ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check",
      size: 14,
      stroke: 2.25
    }) : o.icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: o.icon,
      size: 15
    }) : null, o.label);
  }));
}
Object.assign(__ds_scope, { ChoiceChips });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ChoiceChips.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
const {
  useState
} = React;
function Input({
  label,
  hint,
  error,
  icon,
  value,
  defaultValue,
  onChange,
  placeholder,
  multiline,
  rows = 3,
  size = 'm',
  type = 'text',
  style
}) {
  const [f, setF] = useState(false);
  const h = size === 's' ? 32 : size === 'l' ? 48 : 40;
  const bd = error ? 'var(--status-danger)' : f ? 'var(--border-focus)' : 'var(--border-default)';
  const field = {
    flex: 1,
    minWidth: 0,
    border: 0,
    outline: 0,
    background: 'transparent',
    color: 'var(--text-strong)',
    font: `400 ${size === 'l' ? 16 : 15}px/1.4 var(--font-sans)`,
    padding: multiline ? '10px 0' : 0,
    resize: 'vertical'
  };
  const Tag = multiline ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1.2 var(--font-sans)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: multiline ? 'flex-start' : 'center',
      gap: 10,
      minHeight: h,
      padding: '0 12px',
      background: 'var(--surface-raised)',
      border: `1px solid ${bd}`,
      borderRadius: 'var(--radius-control)',
      boxShadow: f ? 'var(--focus-ring)' : 'var(--shadow-inset)',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      paddingTop: multiline ? 11 : 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement(Tag, {
    type: multiline ? undefined : type,
    rows: multiline ? rows : undefined,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: field
  })), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 12px/1.4 var(--font-sans)',
      color: error ? 'var(--status-danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
function SegmentedControl({
  options = [],
  value,
  onChange,
  size = 'm',
  style
}) {
  const h = size === 's' ? 30 : 36;
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'inline-flex',
      gap: 2,
      padding: 3,
      background: 'var(--linen-200)',
      borderRadius: 'var(--radius-pill)',
      ...style
    }
  }, opts.map(o => {
    const on = o.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      type: "button",
      role: "radio",
      "aria-checked": on,
      onClick: () => onChange && onChange(o.value),
      className: "cl-focus",
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: h,
        padding: '0 14px',
        border: 0,
        borderRadius: 'var(--radius-pill)',
        cursor: 'pointer',
        background: on ? 'var(--surface-raised)' : 'transparent',
        boxShadow: on ? 'var(--shadow-1)' : 'none',
        color: on ? 'var(--text-strong)' : 'var(--text-muted)',
        font: `600 ${size === 's' ? 12 : 13}px/1 var(--font-sans)`,
        transition: 'background var(--dur-fast), color var(--dur-fast)'
      }
    }, o.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: o.icon,
      size: 16
    }), o.label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useState
} = React;
function Select({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  size = 'm',
  style
}) {
  const [f, setF] = useState(false);
  const h = size === 's' ? 32 : size === 'l' ? 48 : 40;
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1.2 var(--font-sans)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: h,
      padding: '0 36px 0 12px',
      background: 'var(--surface-raised)',
      color: 'var(--text-strong)',
      font: '400 15px/1 var(--font-sans)',
      border: `1px solid ${f ? 'var(--border-focus)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-control)',
      boxShadow: f ? 'var(--focus-ring)' : 'none',
      outline: 0,
      cursor: 'pointer'
    }
  }, opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    role: "switch",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 22,
      flex: 'none',
      borderRadius: 999,
      padding: 2,
      background: checked ? 'var(--sage-600)' : 'var(--linen-300)',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 18,
      height: 18,
      borderRadius: 999,
      background: '#fff',
      boxShadow: '0 1px 2px rgba(36,34,31,.2)',
      transform: checked ? 'translateX(16px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 15px/1.3 var(--font-sans)',
      color: 'var(--text-strong)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 13px/1.4 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/kitchen/GroceryItem.jsx
try { (() => {
const {
  useState
} = React;
function GroceryItem({
  qty,
  name,
  note,
  checked,
  onChange,
  sale,
  staple,
  from,
  style
}) {
  const [h, setH] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 8px',
      margin: '0 -8px',
      borderBottom: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xs)',
      background: h ? 'var(--linen-100)' : 'transparent',
      transition: 'background var(--dur-fast)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
    checked: checked,
    onChange: onChange,
    strike: true,
    style: {
      flex: 1,
      minWidth: 0
    },
    label: /*#__PURE__*/React.createElement(React.Fragment, null, qty && /*#__PURE__*/React.createElement("strong", {
      style: {
        fontWeight: 650,
        color: checked ? 'inherit' : 'var(--text-strong)'
      }
    }, qty, " "), name),
    description: note
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      flex: 'none'
    }
  }, from && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 12px/1 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, from), staple && /*#__PURE__*/React.createElement(__ds_scope.Badge, null, "Staple"), sale && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "sale",
    icon: "tag"
  }, sale)));
}
Object.assign(__ds_scope, { GroceryItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kitchen/GroceryItem.jsx", error: String((e && e.message) || e) }); }

// components/kitchen/MealCard.jsx
try { (() => {
const {
  useState
} = React;
function Meta({
  icon,
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: '500 13px/1 var(--font-sans)',
      color: 'var(--text-body)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16,
    style: {
      color: 'var(--text-muted)'
    }
  }), children);
}
function MealCard({
  title,
  description,
  day,
  method,
  time,
  healthy,
  delicious,
  cost,
  stars,
  image,
  leftovers,
  onSale,
  cook,
  footer,
  selected,
  compact,
  onClick,
  style
}) {
  const [h, setH] = useState(false);
  return /*#__PURE__*/React.createElement("article", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      border: `1px solid ${selected ? 'var(--sage-500)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
      boxShadow: onClick && h ? 'var(--shadow-2)' : 'var(--shadow-1)',
      transform: onClick && h ? 'translateY(-2px)' : 'none',
      cursor: onClick ? 'pointer' : undefined,
      transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
      ...style
    }
  }, !compact && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      background: 'var(--linen-200)',
      overflow: 'hidden'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transform: h && onClick ? 'scale(1.03)' : 'none',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--linen-400)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "cooking-pot",
    size: 40,
    stroke: 1.25
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12,
      display: 'flex',
      gap: 6
    }
  }, day && /*#__PURE__*/React.createElement(__ds_scope.DayTag, {
    day: day
  }), onSale && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "sale",
    variant: "solid",
    icon: "tag"
  }, "On sale"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: compact ? 16 : 20,
      flex: 1
    }
  }, compact && (day || onSale) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, day && /*#__PURE__*/React.createElement(__ds_scope.DayTag, {
    day: day
  }), onSale && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "sale",
    icon: "tag"
  }, "On sale")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      flex: 1,
      font: `400 ${compact ? 19 : 22}px/1.2 var(--font-serif)`,
      letterSpacing: '-0.01em',
      color: 'var(--text-strong)'
    }
  }, title), stars != null && /*#__PURE__*/React.createElement(__ds_scope.Stars, {
    value: stars,
    size: 14,
    style: {
      marginTop: 5
    }
  })), description && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'italic 400 15px/1.45 var(--font-serif)',
      color: 'var(--text-body)'
    }
  }, description), (method || time || cost || cook) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px 16px'
    }
  }, method && /*#__PURE__*/React.createElement(Meta, {
    icon: "cooking-pot"
  }, method), time && /*#__PURE__*/React.createElement(Meta, {
    icon: "clock"
  }, time), cost && /*#__PURE__*/React.createElement(Meta, {
    icon: "receipt"
  }, cost), cook && /*#__PURE__*/React.createElement(Meta, {
    icon: "chef-hat"
  }, cook)), (healthy != null || delicious != null) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      paddingTop: 4
    }
  }, healthy != null && /*#__PURE__*/React.createElement(__ds_scope.Score, {
    label: "Healthy",
    value: healthy
  }), delicious != null && /*#__PURE__*/React.createElement(__ds_scope.Score, {
    label: "Delicious",
    value: delicious,
    tone: "terra"
  })), leftovers && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start',
      padding: '10px 12px',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-s)',
      font: '400 13px/1.45 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "refresh-cw",
    size: 15,
    style: {
      color: 'var(--sage-600)',
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("span", null, leftovers)), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 12,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { MealCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kitchen/MealCard.jsx", error: String((e && e.message) || e) }); }

// components/kitchen/PhotoTile.jsx
try { (() => {
const {
  useState
} = React;
function PhotoTile({
  src,
  label,
  meta,
  aspect = '3 / 4',
  onRemove,
  onClick,
  empty,
  style
}) {
  const [h, setH] = useState(false);
  if (empty) return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      aspectRatio: aspect,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      borderRadius: 'var(--radius-photo)',
      border: `1.5px dashed ${h ? 'var(--sage-500)' : 'var(--border-strong)'}`,
      background: h ? 'var(--sage-50)' : 'var(--surface-sunken)',
      color: h ? 'var(--sage-700)' : 'var(--text-muted)',
      cursor: 'pointer',
      font: '600 13px/1.3 var(--font-sans)',
      transition: 'all var(--dur-fast)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "camera",
    size: 28,
    stroke: 1.25
  }), label || 'Add photo');
  return /*#__PURE__*/React.createElement("figure", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: 'relative',
      margin: 0,
      aspectRatio: aspect,
      borderRadius: 'var(--radius-photo)',
      overflow: 'hidden',
      background: 'var(--linen-200)',
      cursor: onClick ? 'pointer' : undefined,
      ...style
    }
  }, src && /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: label || '',
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), (label || meta) && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      position: 'absolute',
      inset: 'auto 0 0 0',
      padding: '28px 12px 10px',
      background: 'var(--photo-protect)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1.25 var(--font-sans)'
    }
  }, label), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 12px/1.25 var(--font-sans)',
      opacity: 0.85
    }
  }, meta)), onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Remove photo",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 28,
      height: 28,
      borderRadius: 999,
      border: 0,
      display: 'grid',
      placeItems: 'center',
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--blur-glass)',
      color: 'var(--text-strong)',
      cursor: 'pointer',
      opacity: h ? 1 : 0,
      transition: 'opacity var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { PhotoTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kitchen/PhotoTile.jsx", error: String((e && e.message) || e) }); }

// components/kitchen/RecipeStep.jsx
try { (() => {
function RecipeStep({
  index,
  children,
  done,
  active,
  onToggle,
  timer,
  size = 'm',
  style
}) {
  const big = size === 'l';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onToggle,
    style: {
      display: 'flex',
      gap: big ? 20 : 14,
      alignItems: 'flex-start',
      padding: big ? '20px 24px' : '12px 0',
      borderRadius: big ? 'var(--radius-m)' : 0,
      cursor: onToggle ? 'pointer' : undefined,
      background: big && active ? 'var(--surface-card)' : 'transparent',
      boxShadow: big && active ? 'var(--shadow-2)' : 'none',
      border: big ? `1px solid ${active ? 'var(--border-subtle)' : 'transparent'}` : 0,
      transition: 'background var(--dur-base), box-shadow var(--dur-base)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: big ? 36 : 26,
      height: big ? 36 : 26,
      flex: 'none',
      borderRadius: 999,
      display: 'grid',
      placeItems: 'center',
      background: done ? 'var(--sage-600)' : active ? 'var(--char-900)' : 'transparent',
      border: done || active ? 0 : '1.5px solid var(--border-strong)',
      color: done || active ? '#fff' : 'var(--text-muted)',
      font: `600 ${big ? 15 : 12}px/1 var(--font-sans)`,
      transition: 'background var(--dur-fast)'
    }
  }, done ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: big ? 18 : 14,
    stroke: 2.5
  }) : index), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: big ? 4 : 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: `400 ${big ? 22 : 15}px/1.5 var(--font-sans)`,
      color: done ? 'var(--text-muted)' : 'var(--text-strong)'
    }
  }, children), timer && /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'flex-start',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: big ? 32 : 26,
      padding: '0 10px',
      borderRadius: 999,
      background: 'var(--honey-100)',
      color: 'var(--honey-700)',
      font: `600 ${big ? 14 : 12}px/1 var(--font-sans)`
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "timer",
    size: big ? 16 : 14
  }), timer)));
}
Object.assign(__ds_scope, { RecipeStep });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kitchen/RecipeStep.jsx", error: String((e && e.message) || e) }); }

// components/kitchen/ReviewActions.jsx
try { (() => {
function ReviewActions({
  onReject,
  onSwap,
  onEdit,
  onApprove,
  rejectLabel = 'Not this',
  swapLabel = 'Swap',
  editLabel = 'Edit',
  approveLabel = 'Keep',
  size = 'm',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      ...style
    }
  }, onReject && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: size,
    icon: "x",
    onClick: onReject,
    style: {
      flex: 1,
      color: 'var(--terra-700)'
    }
  }, rejectLabel), onSwap && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: size,
    icon: "refresh-cw",
    onClick: onSwap,
    style: {
      flex: 1
    }
  }, swapLabel), onEdit && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: size,
    icon: "pencil",
    onClick: onEdit,
    style: {
      flex: 1
    }
  }, editLabel), onApprove && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "accent",
    size: size,
    icon: "check",
    onClick: onApprove,
    style: {
      flex: 1.2
    }
  }, approveLabel));
}
Object.assign(__ds_scope, { ReviewActions });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kitchen/ReviewActions.jsx", error: String((e && e.message) || e) }); }

// components/kitchen/SuggestedTag.jsx
try { (() => {
const S = {
  suggested: {
    icon: 'sparkles',
    bg: 'transparent',
    fg: 'var(--sage-700)',
    bd: '1px dashed var(--sage-300)',
    text: 'Suggested'
  },
  edited: {
    icon: 'pencil',
    bg: 'var(--oak-200)',
    fg: 'var(--oak-700)',
    bd: '1px solid transparent',
    text: 'Edited'
  },
  kept: {
    icon: 'check',
    bg: 'var(--sage-100)',
    fg: 'var(--sage-900)',
    bd: '1px solid transparent',
    text: 'Kept'
  },
  approved: {
    icon: 'circle-check',
    bg: 'var(--sage-600)',
    fg: '#fff',
    bd: '1px solid transparent',
    text: 'Approved'
  },
  rejected: {
    icon: 'x',
    bg: 'var(--terra-50)',
    fg: 'var(--terra-700)',
    bd: '1px solid transparent',
    text: 'Not this week'
  },
  thinking: {
    icon: 'sparkles',
    bg: 'var(--sage-50)',
    fg: 'var(--sage-700)',
    bd: '1px solid transparent',
    text: 'Finding options…'
  },
  draft: {
    icon: 'notebook-pen',
    bg: 'var(--honey-100)',
    fg: 'var(--honey-700)',
    bd: '1px solid transparent',
    text: 'Draft — check it'
  }
};
function SuggestedTag({
  status = 'suggested',
  by,
  label,
  style
}) {
  const s = S[status] || S.suggested;
  const text = label || (by && status !== 'suggested' && status !== 'thinking' ? `${s.text} by ${by}` : status === 'suggested' && by ? `Suggested by ${by}` : s.text);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 22,
      padding: '0 8px',
      borderRadius: 'var(--radius-xs)',
      background: s.bg,
      color: s.fg,
      border: s.bd,
      font: '600 11.5px/1 var(--font-sans)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    size: 12,
    stroke: 2
  }), text);
}
Object.assign(__ds_scope, { SuggestedTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kitchen/SuggestedTag.jsx", error: String((e && e.message) || e) }); }

// components/kitchen/VoteButtons.jsx
try { (() => {
function V({
  on,
  icon,
  label,
  count,
  tone,
  onClick
}) {
  const c = tone === 'up' ? ['var(--sage-100)', 'var(--sage-900)', 'var(--sage-500)'] : ['var(--terra-50)', 'var(--terra-700)', 'var(--terra-300)'];
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-pressed": on,
    "aria-label": label,
    onClick: onClick,
    className: "cl-focus",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 32,
      padding: '0 12px',
      borderRadius: 999,
      cursor: 'pointer',
      border: `1px solid ${on ? c[2] : 'var(--border-default)'}`,
      background: on ? c[0] : 'var(--surface-raised)',
      color: on ? c[1] : 'var(--text-body)',
      font: '600 13px/1 var(--font-sans)',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16,
    style: {
      fill: on ? 'currentColor' : 'none',
      fillOpacity: 0.15
    }
  }), count != null && count);
}
function VoteButtons({
  value = null,
  onChange,
  up = 0,
  down = 0,
  voters = [],
  style
}) {
  const set = v => onChange && onChange(value === v ? null : v);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      ...style
    }
  }, /*#__PURE__*/React.createElement(V, {
    on: value === 'up',
    icon: "thumbs-up",
    label: "Yes please",
    count: up,
    tone: "up",
    onClick: () => set('up')
  }), /*#__PURE__*/React.createElement(V, {
    on: value === 'down',
    icon: "thumbs-down",
    label: "Not this week",
    count: down,
    tone: "down",
    onClick: () => set('down')
  }), voters.length > 0 && /*#__PURE__*/React.createElement(__ds_scope.AvatarStack, {
    people: voters,
    size: 24,
    style: {
      marginLeft: 'auto'
    }
  }));
}
Object.assign(__ds_scope, { VoteButtons });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kitchen/VoteButtons.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SideNav.jsx
try { (() => {
const {
  useState
} = React;
function Item({
  it,
  on,
  onClick
}) {
  const [h, setH] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    className: "cl-focus",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      height: 40,
      padding: '0 12px',
      border: 0,
      borderRadius: 'var(--radius-s)',
      cursor: 'pointer',
      textAlign: 'left',
      background: on ? 'var(--linen-200)' : h ? 'var(--linen-100)' : 'transparent',
      color: on ? 'var(--text-strong)' : 'var(--text-body)',
      font: `${on ? 600 : 500} 14px/1 var(--font-sans)`,
      transition: 'background var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon,
    size: 20,
    style: {
      color: on ? 'var(--sage-700)' : 'var(--text-muted)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, it.label), it.badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      borderRadius: 999,
      display: 'inline-grid',
      placeItems: 'center',
      background: it.badgeTone === 'sale' ? 'var(--terra-500)' : 'var(--sage-600)',
      color: '#fff',
      font: '600 11px/1 var(--font-sans)'
    }
  }, it.badge));
}
function SideNav({
  items = [],
  value,
  onChange,
  header,
  footer,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      width: 'var(--sidebar-w)',
      padding: '24px 16px',
      background: 'var(--surface-sunken)',
      borderRight: '1px solid var(--border-subtle)',
      height: '100%',
      ...style
    }
  }, header, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, items.map(it => it.section ? /*#__PURE__*/React.createElement("div", {
    key: it.section,
    style: {
      padding: '16px 12px 6px',
      font: '600 11px/1 var(--font-sans)',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, it.section) : /*#__PURE__*/React.createElement(Item, {
    key: it.id,
    it: it,
    on: it.id === value,
    onClick: () => onChange && onChange(it.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto'
    }
  }, footer));
}
Object.assign(__ds_scope, { SideNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SideNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
function TabBar({
  items = [],
  value,
  onChange,
  safeArea = true,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'stretch',
      padding: `6px 8px ${safeArea ? 26 : 6}px`,
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--blur-glass)',
      WebkitBackdropFilter: 'var(--blur-glass)',
      borderTop: '1px solid var(--border-subtle)',
      ...style
    }
  }, items.map(it => {
    const on = it.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      type: "button",
      onClick: () => onChange && onChange(it.id),
      "aria-current": on ? 'page' : undefined,
      style: {
        flex: 1,
        minWidth: 0,
        minHeight: 48,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        background: 'none',
        border: 0,
        cursor: 'pointer',
        color: on ? 'var(--text-strong)' : 'var(--text-muted)',
        font: `${on ? 600 : 500} 11px/1 var(--font-sans)`,
        transition: 'color var(--dur-fast)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 24,
      stroke: on ? 1.75 : 1.5,
      style: {
        color: on ? 'var(--sage-700)' : 'currentColor'
      }
    }), it.badge ? /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -4,
        right: -9,
        minWidth: 17,
        height: 17,
        padding: '0 5px',
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        background: 'var(--terra-500)',
        color: '#fff',
        font: '700 10px/1 var(--font-sans)',
        boxShadow: '0 0 0 2px var(--linen-50)'
      }
    }, it.badge) : null), it.label);
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 28,
      borderBottom: '1px solid var(--border-default)',
      ...style
    }
  }, tabs.map(t => {
    const on = t.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      role: "tab",
      "aria-selected": on,
      type: "button",
      onClick: () => onChange && onChange(t.id),
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 0 12px',
        background: 'none',
        border: 0,
        cursor: 'pointer',
        font: '600 14px/1.2 var(--font-sans)',
        color: on ? 'var(--text-strong)' : 'var(--text-muted)',
        transition: 'color var(--dur-fast)'
      }
    }, t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 20,
        height: 18,
        padding: '0 6px',
        borderRadius: 999,
        display: 'inline-grid',
        placeItems: 'center',
        background: on ? 'var(--char-900)' : 'var(--linen-200)',
        color: on ? 'var(--linen-50)' : 'var(--text-body)',
        font: '600 11px/1 var(--font-sans)'
      }
    }, t.count), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -1,
        height: 2,
        background: on ? 'var(--char-900)' : 'transparent',
        transition: 'background var(--dur-fast)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
(() => {
  const {
    SideNav,
    Avatar,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  function Wordmark() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '4px 12px 8px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 26px/1 var(--font-serif)',
        letterSpacing: '-0.01em',
        color: 'var(--text-strong)'
      }
    }, "Caf\xE9 Lauren"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 12px/1 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, window.CL_DATA.week));
  }
  function DeliveryNote({
    ordered
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: 12,
        borderRadius: 'var(--radius-m)',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "truck",
      size: 18,
      style: {
        color: ordered ? 'var(--sage-600)' : 'var(--text-muted)',
        marginTop: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px/1.2 var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, ordered ? 'Delivery booked' : 'Delivery not booked'), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 12px/1.3 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, ordered ? 'Saturday, 9–11am · Instacart' : 'Usually Saturday morning'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 4px'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Lauren",
      color: "sage",
      size: 30
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px/1 var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, "Lauren"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 12px/1 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, "Household of 5"))));
  }
  function AppShell({
    screen,
    onNav,
    listCount,
    requestCount,
    ordered,
    children
  }) {
    const items = [{
      section: 'Gather'
    }, {
      id: 'intake',
      label: 'Requests & pantry',
      icon: 'message-circle',
      badge: requestCount || null
    }, {
      section: 'Plan'
    }, {
      id: 'week',
      label: 'This week',
      icon: 'calendar-days'
    }, {
      id: 'list',
      label: 'Grocery list',
      icon: 'shopping-basket',
      badge: listCount || null
    }, {
      section: 'Cook'
    }, {
      id: 'cook',
      label: 'Tonight',
      icon: 'chef-hat'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: '100vh',
        minHeight: 640
      }
    }, /*#__PURE__*/React.createElement(SideNav, {
      items: items,
      value: screen,
      onChange: onNav,
      header: /*#__PURE__*/React.createElement(Wordmark, null),
      footer: /*#__PURE__*/React.createElement(DeliveryNote, {
        ordered: ordered
      }),
      style: {
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("main", {
      style: {
        flex: 1,
        minWidth: 0,
        overflow: 'auto'
      }
    }, children));
  }
  function PageHeader({
    overline,
    title,
    sub,
    actions
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 24,
        flexWrap: 'wrap',
        marginBottom: 32
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 280,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, overline && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)'
      }
    }, overline), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: '300 44px/1.05 var(--font-serif)',
        letterSpacing: 'var(--ls-display)',
        color: 'var(--text-strong)'
      }
    }, title), sub && /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 15px/1.5 var(--font-sans)',
        color: 'var(--text-body)',
        maxWidth: 640
      }
    }, sub)), actions && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, actions));
  }
  function SectionTitle({
    children,
    aside
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 12,
        margin: '0 0 16px'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: '400 24px/1.2 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, children), aside && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 13px/1 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, aside));
  }
  Object.assign(window, {
    AppShell,
    PageHeader,
    SectionTitle
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/CookScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    Checkbox,
    RecipeStep,
    Button,
    Dialog,
    Stars,
    Input,
    Avatar,
    DayTag,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  function CookScreen({
    data,
    onFeedback
  }) {
    const r = data.recipe;
    const steps = r.groups.flatMap((g, gi) => g.steps.map(([html, timer], si) => ({
      html,
      timer,
      group: g.name,
      first: si === 0
    })));
    const [cur, setCur] = React.useState(0);
    const [have, setHave] = React.useState({});
    const [fb, setFb] = React.useState(false);
    const [stars, setStars] = React.useState(4);
    const wrapRef = React.useRef(null);
    const [wide, setWide] = React.useState(false);
    React.useLayoutEffect(() => {
      const el = wrapRef.current;
      if (!el) return;
      const m = () => setWide(el.getBoundingClientRect().width >= 860);
      m();
      window.addEventListener('resize', m);
      const ro = new ResizeObserver(m);
      ro.observe(el);
      return () => {
        window.removeEventListener('resize', m);
        ro.disconnect();
      };
    }, []);
    const done = cur >= steps.length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 'var(--page-pad)',
        maxWidth: 1240
      }
    }, /*#__PURE__*/React.createElement("header", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 32,
        maxWidth: 760
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(DayTag, {
      day: "wed"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 13px/1 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, "Tonight \xB7 Sheet pan")), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: '300 44px/1.05 var(--font-serif)',
        letterSpacing: 'var(--ls-display)',
        color: 'var(--text-strong)'
      }
    }, r.title), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-description)',
        color: 'var(--text-body)'
      }
    }, r.description), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 28,
        marginTop: 4
      }
    }, r.meta.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)'
      }
    }, k), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 16px/1 var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, v))))), /*#__PURE__*/React.createElement("div", {
      ref: wrapRef,
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 40,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("aside", {
      style: {
        flex: '1 1 280px',
        position: wide ? 'sticky' : 'static',
        top: 40,
        padding: 24,
        borderRadius: 'var(--radius-card)',
        background: 'var(--surface-sunken)'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: '400 22px/1.2 var(--font-serif)',
        color: 'var(--text-strong)',
        marginBottom: 16
      }
    }, "Ingredients"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, r.ingredients.map(x => /*#__PURE__*/React.createElement(Checkbox, {
      key: x,
      strike: true,
      checked: !!have[x],
      onChange: v => setHave({
        ...have,
        [x]: v
      }),
      label: x
    })))), /*#__PURE__*/React.createElement("section", {
      style: {
        flex: '999 1 520px',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, steps.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, s.first && /*#__PURE__*/React.createElement("h3", {
      style: {
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--sage-700)',
        margin: i ? '24px 24px 8px' : '0 24px 8px'
      }
    }, s.group), /*#__PURE__*/React.createElement(RecipeStep, {
      size: "l",
      index: i + 1,
      done: i < cur,
      active: i === cur,
      timer: s.timer,
      onToggle: () => setCur(i)
    }, /*#__PURE__*/React.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: s.html
      }
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 28,
        padding: '20px 24px',
        borderTop: '1px solid var(--border-default)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "l",
      icon: "arrow-left",
      disabled: cur === 0,
      onClick: () => setCur(Math.max(0, cur - 1))
    }, "Back"), done ? /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "l",
      icon: "star",
      onClick: () => setFb(true)
    }, "How was dinner?") : /*#__PURE__*/React.createElement(Button, {
      size: "l",
      iconRight: "arrow-right",
      onClick: () => setCur(cur + 1)
    }, cur === steps.length - 1 ? 'Done cooking' : 'Next step')))), /*#__PURE__*/React.createElement(Dialog, {
      open: fb,
      onClose: () => setFb(false),
      title: "How was dinner?",
      description: "Ratings and notes go back into the recipe box, so next week's plan gets better.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: () => setFb(false)
      }, "Later"), /*#__PURE__*/React.createElement(Button, {
        variant: "accent",
        onClick: () => {
          setFb(false);
          onFeedback(stars);
        }
      }, "Save feedback"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Stars, {
      value: stars,
      onChange: setStars,
      size: 28
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 14px/1 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, ['', 'Skip it', 'Meh', 'Fine', 'Make again', 'Family favorite'][stars])), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, Object.values(data.people).map(p => /*#__PURE__*/React.createElement(Avatar, _extends({
      key: p.name
    }, p, {
      size: 28
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 13px/1.3 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, "Joe and Leidy will be asked too")), /*#__PURE__*/React.createElement(Input, {
      label: "Notes for next time",
      multiline: true,
      rows: 3,
      placeholder: "Kids loved the potatoes. Chops needed 3 more minutes."
    }))));
  }
  window.CookScreen = CookScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/CookScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/GroceryScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    Card,
    GroceryItem,
    Tabs,
    SegmentedControl,
    Button,
    Select,
    Switch,
    Dialog,
    Badge,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  function GroceryScreen({
    data,
    checked,
    toggle,
    ordered,
    onOrder
  }) {
    const [tab, setTab] = React.useState('buy');
    const [view, setView] = React.useState('aisle');
    const [confirm, setConfirm] = React.useState(false);
    const [subs, setSubs] = React.useState(true);
    const all = data.sections.flatMap(s => s.items.map(it => ({
      ...it,
      section: s.name,
      key: s.name + it.name
    })));
    const filtered = all.filter(it => tab === 'buy' ? !it.staple : tab === 'staples' ? it.staple : checked[it.key]);
    const groups = view === 'aisle' ? data.sections.map(s => ({
      name: s.name,
      icon: s.icon,
      items: filtered.filter(it => it.section === s.name)
    })) : [...new Set(filtered.map(it => it.note || (it.staple ? 'Staples' : 'Requests')))].map(n => ({
      name: n,
      icon: 'utensils',
      items: filtered.filter(it => (it.note || (it.staple ? 'Staples' : 'Requests')) === n)
    }));
    const left = all.filter(it => !checked[it.key]).length;
    const sale = all.filter(it => it.sale).length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 'var(--page-pad)',
        maxWidth: 1240
      }
    }, /*#__PURE__*/React.createElement(PageHeader, {
      overline: data.week,
      title: "Grocery list",
      sub: "Sorted the way Cermak is laid out. Every recipe ingredient and staple is accounted for."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 32,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '999 1 520px',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      style: {
        flex: '1 1 300px'
      },
      value: tab,
      onChange: setTab,
      tabs: [{
        id: 'buy',
        label: 'To buy',
        count: all.filter(i => !i.staple).length
      }, {
        id: 'staples',
        label: 'Staples',
        count: all.filter(i => i.staple).length
      }, {
        id: 'got',
        label: 'Got it',
        count: Object.values(checked).filter(Boolean).length
      }]
    }), /*#__PURE__*/React.createElement(SegmentedControl, {
      size: "s",
      value: view,
      onChange: setView,
      options: [{
        value: 'aisle',
        label: 'By aisle'
      }, {
        value: 'meal',
        label: 'By meal'
      }],
      style: {
        marginBottom: 8
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, groups.filter(g => g.items.length).map(g => /*#__PURE__*/React.createElement(Card, {
      key: g.name,
      padding: "l"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: g.icon,
      size: 20,
      style: {
        color: 'var(--sage-600)'
      }
    }), /*#__PURE__*/React.createElement("h3", {
      style: {
        flex: 1,
        font: 'var(--type-h3)',
        color: 'var(--text-strong)'
      }
    }, g.name), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 12px/1 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, g.items.length, " items")), g.items.map(it => /*#__PURE__*/React.createElement(GroceryItem, _extends({
      key: it.key
    }, it, {
      checked: !!checked[it.key],
      onChange: () => toggle(it.key),
      style: {
        borderBottom: 0,
        borderTop: '1px solid var(--border-subtle)'
      }
    }))))), !groups.some(g => g.items.length) && /*#__PURE__*/React.createElement(Card, {
      tone: "sunken",
      padding: "l"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)'
      }
    }, "Nothing checked off yet.")))), /*#__PURE__*/React.createElement("aside", {
      style: {
        flex: '1 1 300px',
        maxWidth: '100%',
        position: 'sticky',
        top: 40,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "l",
      elevation: "raised"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)'
      }
    }, "Order"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 32px/1.1 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, left, " items"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 13px/1.4 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, sale, " on sale this week \xB7 about $148")), /*#__PURE__*/React.createElement(Select, {
      label: "Delivery window",
      defaultValue: "sat9",
      options: [{
        value: 'sat9',
        label: 'Saturday, 9–11am'
      }, {
        value: 'sat1',
        label: 'Saturday, 1–3pm'
      }, {
        value: 'sun9',
        label: 'Sunday, 9–11am'
      }]
    }), /*#__PURE__*/React.createElement(Switch, {
      checked: subs,
      onChange: setSubs,
      label: "Allow substitutions",
      description: "Shopper texts Lauren first"
    }), ordered ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      icon: "circle-check",
      style: {
        height: 40,
        justifyContent: 'center',
        fontSize: 13
      }
    }, "Sent to Instacart") : /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "l",
      icon: "shopping-cart",
      fullWidth: true,
      onClick: () => setConfirm(true)
    }, "Send to Instacart"))), /*#__PURE__*/React.createElement(Card, {
      tone: "sunken",
      padding: "m"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        font: '400 13px/1.45 var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chef-hat",
      size: 18,
      style: {
        color: 'var(--terra-500)',
        marginTop: 1
      }
    }), /*#__PURE__*/React.createElement("span", null, "Leidy's meals for Thursday and Sunday are still pending. Her ingredients will be added here."))))), /*#__PURE__*/React.createElement(Dialog, {
      open: confirm,
      onClose: () => setConfirm(false),
      title: "Send the list to Instacart?",
      description: `${left} items from Cermak Produce, delivered Saturday 9–11am. Unchecked items from last week are already sorted in.`,
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: () => setConfirm(false)
      }, "Not yet"), /*#__PURE__*/React.createElement(Button, {
        variant: "accent",
        icon: "shopping-cart",
        onClick: () => {
          setConfirm(false);
          onOrder();
        }
      }, "Place order"))
    }));
  }
  window.GroceryScreen = GroceryScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/GroceryScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/IntakeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    Card,
    Input,
    Button,
    Avatar,
    Badge,
    PhotoTile,
    SegmentedControl,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  function IntakeScreen({
    data,
    requests,
    addRequest
  }) {
    const [text, setText] = React.useState('');
    const [type, setType] = React.useState('meal');
    const [photos, setPhotos] = React.useState(data.pantry);
    const submit = e => {
      e.preventDefault();
      if (!text.trim()) return;
      addRequest({
        who: 'lauren',
        type,
        text: text.trim(),
        when: 'Now'
      });
      setText('');
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 'var(--page-pad)',
        maxWidth: 1240
      }
    }, /*#__PURE__*/React.createElement(PageHeader, {
      overline: data.week,
      title: "Requests & pantry",
      sub: "Meal ideas and things we've run out of, plus photos of what's on hand. All of it feeds Sunday's plan."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
        gap: 32,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(SectionTitle, {
      aside: `${requests.length} this week`
    }, "Requests"), /*#__PURE__*/React.createElement(Card, {
      padding: "l"
    }, /*#__PURE__*/React.createElement("form", {
      onSubmit: submit,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(SegmentedControl, {
      size: "s",
      value: type,
      onChange: setType,
      options: [{
        value: 'meal',
        label: 'Meal idea',
        icon: 'sparkles'
      }, {
        value: 'out',
        label: "We're out of",
        icon: 'package'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      style: {
        flex: '1 1 200px',
        minWidth: 0
      },
      value: text,
      onChange: e => setText(e.target.value),
      placeholder: type === 'meal' ? 'Something with salmon?' : 'Cornstarch, the big yogurt…'
    }), /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      icon: "send"
    }, "Add"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20
      }
    }, requests.map((r, i) => {
      const p = data.people[r.who];
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          gap: 12,
          padding: '14px 0',
          borderTop: '1px solid var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement(Avatar, _extends({}, p, {
        size: 32
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          font: '400 15px/1.45 var(--font-sans)',
          color: 'var(--text-strong)'
        }
      }, r.text), /*#__PURE__*/React.createElement("span", {
        style: {
          font: '500 12px/1 var(--font-sans)',
          color: 'var(--text-muted)'
        }
      }, p.name, " \xB7 ", r.when)), /*#__PURE__*/React.createElement(Badge, {
        tone: r.type === 'meal' ? 'accent' : 'warning',
        icon: r.type === 'meal' ? 'sparkles' : 'package'
      }, r.type === 'meal' ? 'Meal idea' : 'Ran out'));
    })))), /*#__PURE__*/React.createElement("section", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 32
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
      aside: "Newest: March 1"
    }, "Pantry photos"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 10
      }
    }, photos.map((p, i) => /*#__PURE__*/React.createElement(PhotoTile, _extends({
      key: p.src
    }, p, {
      onRemove: () => setPhotos(photos.filter((_, j) => j !== i))
    }))), /*#__PURE__*/React.createElement(PhotoTile, {
      empty: true,
      label: "Add photo",
      onClick: () => setPhotos([...photos, data.pantry[photos.length % 3]])
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        marginTop: 14,
        padding: '12px 14px',
        borderRadius: 'var(--radius-s)',
        background: 'var(--status-warning-bg)',
        color: 'var(--honey-700)',
        font: '400 13px/1.45 var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "triangle-alert",
      size: 16,
      style: {
        marginTop: 2
      }
    }), /*#__PURE__*/React.createElement("span", null, "These photos are from March. Add fresh ones of the fridge, freezer and pantry so we don't buy what you already have."))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, null, "On hand"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6
      }
    }, data.onHand.map(x => /*#__PURE__*/React.createElement(Badge, {
      key: x,
      tone: "success",
      icon: "check"
    }, x)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
      aside: "Cermak \xB7 Aug 13\u201326"
    }, "On sale"), /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, data.deals.map(([n, p], i) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderTop: i ? '1px solid var(--border-subtle)' : 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 14px/1.3 var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, n), /*#__PURE__*/React.createElement(Badge, {
      tone: "sale",
      icon: "tag"
    }, p))))))));
  }
  window.IntakeScreen = IntakeScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/IntakeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/WeekScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    MealCard,
    VoteButtons,
    DayTag,
    Button,
    Badge,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  function ScheduleStrip({
    schedule
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        overflowX: 'auto',
        marginBottom: 40,
        borderRadius: 'var(--radius-card)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(130px, 1fr))',
        minWidth: 910,
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-card)',
        background: 'var(--surface-card)',
        boxShadow: 'var(--shadow-1)',
        overflow: 'hidden'
      }
    }, schedule.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s.day,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 16,
        borderLeft: i ? '1px solid var(--border-subtle)' : 0,
        background: s.kind === 'cook' ? 'transparent' : 'var(--surface-sunken)'
      }
    }, /*#__PURE__*/React.createElement(DayTag, {
      day: s.day,
      short: true
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: s.kind === 'cook' ? '400 15px/1.3 var(--font-serif)' : 'italic 400 14px/1.35 var(--font-serif)',
        color: s.kind === 'cook' ? 'var(--text-strong)' : 'var(--text-muted)'
      }
    }, s.title), /*#__PURE__*/React.createElement("span", {
      style: {
        marginTop: 'auto',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        font: '500 12px/1 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.kind === 'cook' ? 'cooking-pot' : s.kind === 'leidy' ? 'chef-hat' : 'refresh-cw',
      size: 14
    }), s.kind === 'cook' ? s.method : s.kind === 'leidy' ? 'Leidy cooks' : 'Leftovers')))));
  }
  function WeekScreen({
    data,
    votes,
    setVote,
    approved,
    onApprove,
    onCook
  }) {
    const P = data.people;
    const pending = data.meals.filter(m => Object.keys(votes[m.id]).length < 3).length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 'var(--page-pad)',
        maxWidth: 1240
      }
    }, /*#__PURE__*/React.createElement(PageHeader, {
      overline: data.week,
      title: "This week's menu",
      sub: data.dealsLine,
      actions: approved ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Badge, {
        tone: "success",
        icon: "check",
        style: {
          height: 40,
          padding: '0 14px',
          fontSize: 13
        }
      }, "Menu approved"), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        icon: "shopping-basket",
        onClick: () => onApprove('list')
      }, "See the list")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        icon: "refresh-cw"
      }, "Suggest another"), /*#__PURE__*/React.createElement(Button, {
        variant: "accent",
        icon: "check",
        onClick: () => onApprove()
      }, "Approve menu"))
    }), /*#__PURE__*/React.createElement(ScheduleStrip, {
      schedule: data.schedule
    }), /*#__PURE__*/React.createElement(SectionTitle, {
      aside: pending ? `Waiting on ${pending} vote${pending > 1 ? 's' : ''}` : 'Everyone has voted'
    }, "Cooking fresh"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 'var(--gutter)'
      }
    }, data.meals.map(m => {
      const v = votes[m.id];
      const vals = Object.values(v);
      return /*#__PURE__*/React.createElement(MealCard, _extends({
        key: m.id
      }, m, {
        onClick: m.id === 'chops' ? onCook : undefined,
        footer: /*#__PURE__*/React.createElement("div", {
          onClick: e => e.stopPropagation()
        }, /*#__PURE__*/React.createElement(VoteButtons, {
          value: v.lauren || null,
          onChange: x => setVote(m.id, x),
          up: vals.filter(x => x === 'up').length,
          down: vals.filter(x => x === 'down').length,
          voters: Object.keys(v).map(k => P[k])
        }))
      }));
    })));
  }
  window.WeekScreen = WeekScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/WeekScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
window.CL_DATA = {
  week: 'Week of August 24',
  people: {
    lauren: {
      name: 'Lauren',
      color: 'sage'
    },
    joe: {
      name: 'Joe',
      color: 'slate'
    },
    leidy: {
      name: 'Leidy',
      color: 'terra'
    }
  },
  dealsLine: 'Built around Cermak deals (Aug 13–26): al pastor pork $3.49/lb, pork chops $2.29/lb, XL shrimp $9.99/lb, lemons and limes, Yukon golds 99¢, corn 3/$1.',
  schedule: [{
    day: 'mon',
    title: 'Taco Tuesday (al pastor pork)',
    kind: 'cook',
    method: 'Skillet'
  }, {
    day: 'tue',
    title: 'Taco leftovers → taco-salad bowls',
    kind: 'leftover'
  }, {
    day: 'wed',
    title: 'Sheet Pan Pork Chops with Roasted Veggies',
    kind: 'cook',
    method: 'Sheet pan'
  }, {
    day: 'thu',
    title: 'Leidy #1',
    kind: 'leidy'
  }, {
    day: 'fri',
    title: 'Basil Shrimp with Feta and Orzo',
    kind: 'cook',
    method: 'Skillet'
  }, {
    day: 'sat',
    title: 'Sheet Pan Citrus Chicken Thighs and Roasted Tomatoes',
    kind: 'cook',
    method: 'Sheet pan'
  }, {
    day: 'sun',
    title: 'Leidy #2 or chicken leftovers',
    kind: 'leftover'
  }],
  meals: [{
    id: 'tacos',
    day: 'mon',
    title: 'Taco Tuesday',
    description: 'Al pastor pork tacos with queso fresco, lettuce, tomato, salsa — with black beans and sweet corn sides.',
    method: 'Skillet',
    time: '30 min',
    healthy: 7,
    delicious: 9,
    cost: '~$22',
    stars: 5,
    onSale: true,
    leftovers: 'Tue: taco-salad bowls over lettuce with beans, corn, crushed tortilla chips',
    votes: {
      lauren: 'up',
      joe: 'up'
    }
  }, {
    id: 'chops',
    day: 'wed',
    title: 'Sheet Pan Pork Chops with Roasted Veggies',
    description: 'Center-cut pork chops roasted with potatoes, green beans and onion, seasoned with smoked paprika and thyme.',
    method: 'Sheet pan',
    time: '40 min',
    healthy: 8,
    delicious: 8,
    cost: '~$18',
    onSale: true,
    leftovers: 'Slice chops over a green salad, or chop into fried rice',
    votes: {
      joe: 'up'
    }
  }, {
    id: 'shrimp',
    day: 'fri',
    title: 'Basil Shrimp with Feta and Orzo',
    description: 'Warm orzo tossed with tomatoes, green onion, basil, lemon, feta and sautéed shrimp.',
    method: 'Skillet',
    time: '30 min',
    healthy: 8,
    delicious: 9,
    cost: '~$26',
    stars: 5,
    onSale: true,
    leftovers: 'Sat lunch: serve cold as an orzo salad',
    votes: {
      lauren: 'up',
      joe: 'up',
      leidy: 'up'
    }
  }, {
    id: 'chicken',
    day: 'sat',
    title: 'Sheet Pan Citrus Chicken Thighs and Roasted Tomatoes',
    description: 'Boneless thighs roasted with orange and lemon, garlic, Roma tomatoes and green beans.',
    method: 'Sheet pan',
    time: '45 min',
    healthy: 8,
    delicious: 8,
    cost: '~$20',
    leftovers: 'Sun: shred into wraps with deli cheese. Mon: over rice with the pan juices',
    votes: {
      lauren: 'up',
      joe: 'down'
    }
  }],
  requests: [{
    who: 'joe',
    type: 'meal',
    text: 'Can we do the basil shrimp again? The kids actually ate it.',
    when: 'Mon'
  }, {
    who: 'leidy',
    type: 'out',
    text: 'Out of cornstarch and the big yogurt',
    when: 'Tue'
  }, {
    who: 'lauren',
    type: 'meal',
    text: 'Something with salmon — it was on sale last time',
    when: 'Wed'
  }, {
    who: 'joe',
    type: 'out',
    text: 'Soda water',
    when: 'Thu'
  }],
  pantry: [{
    src: '../../assets/photos/pantry-1.jpg',
    label: 'Pantry shelf',
    meta: 'Mar 1 · 9 items'
  }, {
    src: '../../assets/photos/pantry-2.jpg',
    label: 'Pantry, lower',
    meta: 'Mar 1 · 6 items'
  }, {
    src: '../../assets/photos/pantry-3.jpg',
    label: 'Freezer',
    meta: 'Mar 1 · 8 items'
  }],
  onHand: ['Olive oil', 'Salt & pepper', 'Garlic powder', 'Smoked paprika', 'Dried thyme', 'Rice'],
  deals: [['Marinated pork taco meat', '$3.49/lb'], ['Center cut pork chops', '$2.29/lb'], ['XL shrimp 16/20', '$9.99/lb'], ['Sweet corn', '3/$1'], ['Yukon gold potatoes', '$0.99/lb'], ['Queso fresco 10 oz', '$1.99']],
  sections: [{
    name: 'Produce',
    icon: 'carrot',
    items: [{
      qty: '2 lbs',
      name: 'green beans',
      note: 'Pork chops + citrus chicken'
    }, {
      qty: '1.5 lbs',
      name: 'Yukon gold potatoes',
      note: 'Pork chops',
      sale: '$0.99/lb'
    }, {
      qty: '1',
      name: 'large white onion',
      note: 'Pork chops'
    }, {
      qty: '2 bunches',
      name: 'green onions',
      note: 'Basil shrimp'
    }, {
      qty: '1.5 lbs',
      name: 'ripe tomatoes',
      note: 'Basil shrimp'
    }, {
      qty: '1 bunch',
      name: 'fresh basil',
      note: 'Basil shrimp'
    }, {
      qty: '10',
      name: 'limes',
      note: 'Tacos',
      sale: '10/$1'
    }, {
      qty: '6 ears',
      name: 'sweet corn',
      note: 'Taco night side',
      sale: '3/$1'
    }, {
      name: 'Bananas',
      staple: true
    }]
  }, {
    name: 'Frozen',
    icon: 'snowflake',
    items: [{
      name: 'Frozen fruit',
      staple: true
    }, {
      name: 'Frozen spinach',
      staple: true
    }]
  }, {
    name: 'Meat / Deli / Bakery',
    icon: 'beef',
    items: [{
      qty: '2 lbs',
      name: 'marinated pork taco meat (al pastor)',
      note: 'Tacos',
      sale: '$3.49/lb'
    }, {
      qty: '5',
      name: 'center-cut pork chops (~2.5 lbs)',
      note: 'Pork chops',
      sale: '$2.29/lb'
    }, {
      qty: '1.5 lbs',
      name: 'XL shrimp 16/20',
      note: 'Basil shrimp',
      sale: '$9.99/lb'
    }, {
      qty: '2 lbs',
      name: 'boneless chicken thighs',
      note: 'Citrus chicken'
    }, {
      name: 'Bread',
      staple: true
    }]
  }, {
    name: 'Dry Goods / Canned / Condiments',
    icon: 'wheat',
    items: [{
      qty: '1 lb',
      name: 'orzo',
      note: 'Basil shrimp'
    }, {
      qty: '1 jar',
      name: 'salsa',
      note: 'Tacos',
      sale: '$2.99'
    }, {
      qty: '1 can',
      name: 'Goya black beans 29 oz',
      note: 'Taco side',
      sale: '2/$5'
    }, {
      name: 'Cornstarch',
      from: 'Leidy'
    }]
  }, {
    name: 'Dairy / Eggs',
    icon: 'milk',
    items: [{
      qty: '1',
      name: 'queso fresco 10 oz',
      note: 'Tacos',
      sale: '$1.99'
    }, {
      qty: '6 oz',
      name: 'feta, crumbled',
      note: 'Basil shrimp'
    }, {
      name: 'Yogurt',
      staple: true,
      from: 'Leidy'
    }, {
      name: 'Eggs',
      staple: true
    }, {
      name: 'Milk',
      staple: true
    }]
  }, {
    name: 'Beverages',
    icon: 'cup-soda',
    items: [{
      name: 'Soda water',
      staple: true,
      from: 'Joe'
    }]
  }],
  recipe: {
    title: 'Sheet Pan Pork Chops with Roasted Veggies',
    description: 'Center-cut pork chops roasted with potatoes, green beans and onion, seasoned with smoked paprika and thyme.',
    meta: [['Prep', '10 min'], ['Cook', '30 min'], ['Serves', '5 + leftovers']],
    ingredients: ['5 center-cut pork chops (~2.5 lbs)', '1.5 lbs Yukon gold potatoes, quartered', '1 lb green beans, trimmed', '1 large white onion, cut in wedges', '3 tbsp olive oil', '2 tsp smoked paprika', '1 tsp dried thyme', '1 tsp garlic powder', 'Salt and pepper'],
    groups: [{
      name: 'Start the Potatoes',
      steps: [['Heat the oven to 425°F. Toss <b>1.5 lbs quartered potatoes</b> and <b>1 onion, in wedges</b> with <b>2 tbsp olive oil</b>, <b>salt and pepper</b>.', null], ['Spread on a large sheet pan and roast until the edges start to brown.', '15 min']]
    }, {
      name: 'Season the Chops',
      steps: [['Mix <b>2 tsp smoked paprika</b>, <b>1 tsp dried thyme</b>, <b>1 tsp garlic powder</b> and a big pinch of salt.', null], ['Pat <b>5 pork chops</b> dry, rub with <b>1 tbsp olive oil</b>, then the spice mix on both sides.', null]]
    }, {
      name: 'Roast Together',
      steps: [['Push the potatoes aside. Add the chops and <b>1 lb green beans</b> to the pan.', null], ['Roast until the chops reach 145°F inside.', '15 min'], ['Rest the chops 5 minutes before slicing. Save 2 chops for tomorrow.', '5 min']]
    }]
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/mobile/ChatSheet.jsx
try { (() => {
(() => {
  const {
    Sheet,
    Button,
    IconButton,
    Input,
    ChoiceChips,
    SuggestedTag,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  function Proposal({
    p,
    onApply,
    onDismiss
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: 12,
        borderRadius: 'var(--radius-m)',
        background: 'var(--surface-card)',
        border: p.state === 'pending' ? '1px dashed var(--sage-300)' : '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 14px/1.3 var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, p.label), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 13px/1.4 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, p.detail), p.state === 'pending' ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "secondary",
      style: {
        flex: 1
      },
      onClick: onDismiss
    }, "Not that"), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "accent",
      icon: "check",
      style: {
        flex: 1
      },
      onClick: onApply
    }, "Apply")) : /*#__PURE__*/React.createElement(SuggestedTag, {
      status: p.state === 'applied' ? 'kept' : 'rejected',
      label: p.state === 'applied' ? 'Applied to the plan' : 'Dismissed',
      style: {
        alignSelf: 'flex-start'
      }
    }));
  }
  function ChatSheet({
    open
  }) {
    const a = useApp();
    const [text, setText] = React.useState('');
    const ref = React.useRef(null);
    React.useEffect(() => {
      const el = ref.current && ref.current.parentElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, [a.chat, open]);
    const send = t => {
      if (!t.trim()) return;
      a.chatSend(t.trim());
      setText('');
    };
    const asked = a.chat.filter(m => m.from === 'me').map(m => m.text);
    return /*#__PURE__*/React.createElement(Sheet, {
      open: open,
      onClose: a.closeSheet,
      maxHeight: "90%",
      title: /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "sparkles",
        size: 20,
        style: {
          color: 'var(--sage-600)'
        }
      }), "Ask Caf\xE9"),
      footer: /*#__PURE__*/React.createElement("form", {
        onSubmit: e => {
          e.preventDefault();
          send(text);
        },
        style: {
          display: 'flex',
          gap: 8,
          width: '100%'
        }
      }, /*#__PURE__*/React.createElement(Input, {
        style: {
          flex: 1,
          minWidth: 0
        },
        value: text,
        onChange: e => setText(e.target.value),
        placeholder: "Swap Friday for something cheaper\u2026"
      }), /*#__PURE__*/React.createElement(IconButton, {
        icon: "send",
        label: "Send",
        variant: "primary",
        onClick: () => send(text)
      }))
    }, /*#__PURE__*/React.createElement("div", {
      ref: ref,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minHeight: 300
      }
    }, a.chat.map((m, i) => m.from === 'me' ? /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        alignSelf: 'flex-end',
        maxWidth: '82%',
        padding: '10px 14px',
        borderRadius: '16px 16px 4px 16px',
        background: 'var(--char-900)',
        color: 'var(--linen-50)',
        font: '400 14px/1.45 var(--font-sans)'
      }
    }, m.text) : /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        alignSelf: 'flex-start',
        maxWidth: '92%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 14px',
        borderRadius: '16px 16px 16px 4px',
        background: 'var(--surface-sunken)',
        color: 'var(--text-strong)',
        font: '400 14px/1.5 var(--font-sans)'
      }
    }, m.typing ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)'
      }
    }, "Thinking\u2026") : m.text), m.proposal && /*#__PURE__*/React.createElement(Proposal, {
      p: m.proposal,
      onApply: () => a.resolveProposal(i, 'apply'),
      onDismiss: () => a.resolveProposal(i, 'dismiss')
    }))), /*#__PURE__*/React.createElement(ChoiceChips, {
      size: "s",
      multi: false,
      value: null,
      onChange: v => v && send(v),
      options: a.D.chatStarters.filter(s => !asked.includes(s)),
      style: {
        marginTop: 4
      }
    })));
  }
  window.ChatSheet = ChatSheet;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/ChatSheet.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/HomeScreens.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    Button,
    Badge,
    DayTag,
    Avatar,
    AvatarStack,
    SuggestedTag,
    Card,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  const DAYNAME = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
  };
  const slotTitle = (a, s) => s.meal ? a.D.meals[s.meal].title : s.text || (s.kind === 'open' ? 'Open night' : '');
  function needs(a) {
    const n = [];
    const pend = a.slots.filter(s => s.kind === 'cook' && s.status === 'suggested');
    if (pend.length) n.push({
      icon: 'sparkles',
      color: 'var(--sage-700)',
      title: `${pend.length} suggested meal${pend.length > 1 ? 's' : ''} to review`,
      sub: pend.map(s => DAYNAME[s.day]).join(', '),
      go: () => a.setTab('plan')
    });
    if (!a.pantryDone) n.push({
      icon: 'refrigerator',
      color: 'var(--honey-700)',
      title: 'Check what Café found in the pantry',
      sub: '2 items it wasn\'t sure about',
      go: () => a.push({
        type: 'pantry'
      })
    });
    const req = a.requests.filter(r => r.status === 'new');
    if (req.length) n.push({
      icon: 'message-circle',
      color: 'var(--slate-500)',
      title: `${req.length} new request${req.length > 1 ? 's' : ''}`,
      sub: req.map(r => a.D.people[r.who].name).filter((v, i, x) => x.indexOf(v) === i).join(', '),
      go: () => a.setTab('inbox')
    });
    if (a.diff.length) n.push({
      icon: 'shopping-basket',
      color: 'var(--terra-500)',
      title: 'Plan changed since approval',
      sub: 'Review the grocery list changes',
      go: () => a.setTab('list')
    });
    if (a.order === 'shopping' && a.sub === 'pending') n.push({
      icon: 'refresh-cw',
      color: 'var(--terra-500)',
      title: 'Shopper needs a decision',
      sub: 'Queso fresco is out',
      go: () => a.push({
        type: 'track'
      })
    });
    return n;
  }
  function NeedsCard({
    items
  }) {
    if (!items.length) return /*#__PURE__*/React.createElement(Card, {
      tone: "accent",
      padding: "m"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        font: '500 14px/1.4 var(--font-sans)',
        color: 'var(--sage-900)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circle-check",
      size: 20
    }), "Nothing needs you right now."));
    return /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 16px'
      }
    }, items.map((n, i) => /*#__PURE__*/React.createElement(ListRow, {
      key: n.title,
      icon: n.icon,
      iconColor: n.color,
      title: n.title,
      sub: n.sub,
      onClick: n.go,
      last: i === items.length - 1
    })));
  }
  function WeekMini({
    a
  }) {
    return /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 16px'
      }
    }, a.slots.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s.day,
      onClick: () => s.meal && a.push({
        type: 'meal',
        day: s.day
      }),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: i < 6 ? '1px solid var(--border-subtle)' : 0,
        cursor: s.meal ? 'pointer' : 'default'
      }
    }, /*#__PURE__*/React.createElement(DayTag, {
      day: s.day,
      short: true,
      style: {
        width: 44,
        justifyContent: 'center'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        font: s.kind === 'cook' ? '400 15px/1.3 var(--font-serif)' : 'italic 400 14px/1.3 var(--font-serif)',
        color: s.kind === 'cook' ? 'var(--text-strong)' : 'var(--text-muted)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, slotTitle(a, s)), s.kind === 'cook' && s.status !== 'approved' && s.status !== 'kept' && /*#__PURE__*/React.createElement(SuggestedTag, {
      status: s.status,
      label: s.status === 'edited' ? 'Edited' : undefined
    }), (s.status === 'approved' || s.status === 'kept') && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16,
      style: {
        color: 'var(--sage-600)'
      }
    }))));
  }
  function Tonight({
    a,
    compact
  }) {
    const s = a.slotOf('wed');
    const m = s.meal && a.D.meals[s.meal];
    if (!m) return /*#__PURE__*/React.createElement(Card, {
      tone: "sunken"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'italic 400 16px/1.4 var(--font-serif)',
        color: 'var(--text-muted)'
      }
    }, slotTitle(a, s) || 'Nothing planned tonight'));
    if (compact) return /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 16px'
      }
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "chef-hat",
      iconColor: "var(--terra-500)",
      title: m.title,
      sub: `Tonight · ${m.method} · ${m.time}`,
      onClick: () => a.push({
        type: 'meal',
        day: 'wed'
      }),
      last: true
    }));
    return /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, /*#__PURE__*/React.createElement(MealPhoto, {
      height: 150,
      radius: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 12,
        left: 12,
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(DayTag, {
      day: "wed",
      label: "Tonight"
    }), m.onSale && /*#__PURE__*/React.createElement(Badge, {
      tone: "sale",
      variant: "solid",
      icon: "tag"
    }, "On sale"))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        font: '400 22px/1.2 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, m.title), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: '500 13px/1 var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 15,
      style: {
        color: 'var(--text-muted)'
      }
    }), "Start by 5:20 for dinner at 6"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      icon: "refresh-cw",
      style: {
        flex: 1
      },
      onClick: () => a.openSheet({
        type: 'swap',
        day: 'wed'
      })
    }, "Swap"), /*#__PURE__*/React.createElement(Button, {
      icon: "chef-hat",
      style: {
        flex: 1.4
      },
      onClick: () => a.push({
        type: 'meal',
        day: 'wed'
      })
    }, "Start cooking"))));
  }
  function HomeA() {
    const a = useApp();
    return /*#__PURE__*/React.createElement(Screen, null, /*#__PURE__*/React.createElement(LargeTitle, {
      overline: "Wednesday, Aug 26",
      title: `Good afternoon, ${a.P.name}`,
      right: /*#__PURE__*/React.createElement(Avatar, _extends({}, a.P, {
        size: 30
      }))
    }), /*#__PURE__*/React.createElement(Tonight, {
      a: a
    }), /*#__PURE__*/React.createElement(SectionHead, {
      title: "Needs you"
    }), /*#__PURE__*/React.createElement(NeedsCard, {
      items: needs(a)
    }), /*#__PURE__*/React.createElement(SectionHead, {
      title: "This week",
      aside: "Edit plan",
      onAside: () => a.setTab('plan')
    }), /*#__PURE__*/React.createElement(WeekMini, {
      a: a
    }), /*#__PURE__*/React.createElement(SectionHead, {
      title: "Delivery"
    }), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 16px'
      }
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "truck",
      iconColor: a.order ? 'var(--sage-700)' : undefined,
      title: a.order ? 'Saturday, 9–11am' : 'Not ordered yet',
      sub: a.order ? `${a.via.label} · ${a.store.name}` : 'Usually Saturday morning',
      onClick: () => a.order ? a.push({
        type: 'track'
      }) : a.setTab('list'),
      last: true
    })));
  }
  const STAGES = [['Gather', 'message-circle'], ['Plan', 'calendar-days'], ['List', 'shopping-basket'], ['Order', 'truck'], ['Cook', 'chef-hat']];
  function HomeB() {
    const a = useApp();
    const done = [a.pantryDone, !!a.approved, !!a.order, a.order === 'delivered', false];
    const cur = done.findIndex(d => !d);
    const pend = a.slots.filter(s => s.kind === 'cook' && s.status === 'suggested').length;
    const stage = [{
      title: 'Check the pantry',
      body: "Café read today's photos. Confirm what's really there so we don't double-buy.",
      cta: 'Review pantry',
      go: () => a.push({
        type: 'pantry'
      })
    }, {
      title: pend ? `${pend} meal${pend > 1 ? 's' : ''} still need a decision` : 'Ready to approve',
      body: pend ? 'Keep them, swap them, or tell Café why not.' : 'Everyone has weighed in. Approve to build the list.',
      cta: pend ? 'Review the plan' : 'Approve week',
      go: () => pend ? a.setTab('plan') : a.approveWeek()
    }, {
      title: 'Send the list to Instacart',
      body: 'Check the product matches, then pick a delivery window.',
      cta: 'Review order',
      go: () => a.push({
        type: 'order'
      })
    }, {
      title: 'Groceries on the way',
      body: 'Saturday, 9–11am. You may get a substitution question.',
      cta: 'Track order',
      go: () => a.push({
        type: 'track'
      })
    }, {
      title: "Tonight's dinner",
      body: 'Sheet Pan Pork Chops, 40 min.',
      cta: 'Start cooking',
      go: () => a.push({
        type: 'meal',
        day: 'wed'
      })
    }][cur];
    const P = a.D.people;
    const feed = [{
      who: P.joe,
      text: 'kept Basil Shrimp for Friday',
      when: '2h'
    }, {
      who: P.leidy,
      text: 'is out of cornstarch and the big yogurt',
      when: 'Tue'
    }, {
      who: P.joe,
      text: 'voted no on Citrus Chicken: “Had chicken twice already”',
      when: 'Tue'
    }];
    return /*#__PURE__*/React.createElement(Screen, null, /*#__PURE__*/React.createElement(LargeTitle, {
      overline: "Caf\xE9 Lauren",
      title: a.D.week,
      right: /*#__PURE__*/React.createElement(AvatarStack, {
        people: Object.values(P),
        size: 26
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 4,
        marginBottom: 16
      }
    }, STAGES.map(([l, ic], i) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: '100%',
        height: 4,
        borderRadius: 2,
        background: done[i] ? 'var(--sage-500)' : i === cur ? 'var(--char-900)' : 'var(--linen-300)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        font: `${i === cur ? 700 : 500} 11px/1 var(--font-sans)`,
        color: i === cur ? 'var(--text-strong)' : done[i] ? 'var(--sage-700)' : 'var(--text-faint)'
      }
    }, done[i] && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 11,
      stroke: 2.5
    }), l)))), /*#__PURE__*/React.createElement(Card, {
      padding: "l",
      elevation: "raised"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--sage-700)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: STAGES[cur][1],
      size: 14
    }), "Step ", cur + 1, " of 5"), /*#__PURE__*/React.createElement("h2", {
      style: {
        font: '400 26px/1.15 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, stage.title), /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 14px/1.5 var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, stage.body), /*#__PURE__*/React.createElement(Button, {
      size: "l",
      fullWidth: true,
      iconRight: "arrow-right",
      onClick: stage.go,
      style: {
        marginTop: 6
      }
    }, stage.cta))), /*#__PURE__*/React.createElement(SectionHead, {
      title: "Tonight"
    }), /*#__PURE__*/React.createElement(Tonight, {
      a: a,
      compact: true
    }), /*#__PURE__*/React.createElement(SectionHead, {
      title: "Around the house",
      aside: "Inbox",
      onAside: () => a.setTab('inbox')
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, feed.map((f, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: 12,
        padding: '12px 0',
        borderBottom: i < feed.length - 1 ? '1px solid var(--border-subtle)' : 0
      }
    }, /*#__PURE__*/React.createElement(Avatar, _extends({}, f.who, {
      size: 30
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: '400 14px/1.45 var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--text-strong)',
        fontWeight: 600
      }
    }, f.who.name), " ", f.text), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 12px/1.6 var(--font-sans)',
        color: 'var(--text-faint)'
      }
    }, f.when)))));
  }
  Object.assign(window, {
    HomeA,
    HomeB,
    slotTitle,
    DAYNAME
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/HomeScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/InboxScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    Button,
    IconButton,
    Badge,
    Avatar,
    Input,
    ChoiceChips,
    SegmentedControl,
    PhotoTile,
    SuggestedTag,
    Card,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  function RequestRow({
    a,
    r,
    last
  }) {
    const p = a.D.people[r.who];
    const isNew = r.status === 'new';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        padding: '14px 0',
        borderBottom: last ? 0 : '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, _extends({}, p, {
      size: 32
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: '600 13px/1 var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, p.name), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 12px/1 var(--font-sans)',
        color: 'var(--text-faint)'
      }
    }, r.when)), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 15px/1.45 var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, r.text), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: r.type === 'meal' ? 'accent' : 'warning',
      icon: r.type === 'meal' ? 'sparkles' : 'package'
    }, r.type === 'meal' ? 'Meal idea' : 'Ran out'), r.reply && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        font: '500 12px/1 var(--font-sans)',
        color: r.status === 'declined' ? 'var(--terra-700)' : 'var(--sage-700)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: r.status === 'declined' ? 'x' : 'check',
      size: 13,
      stroke: 2
    }), r.reply)), isNew && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "secondary",
      icon: "x",
      onClick: () => a.answerRequest(r.id, 'declined', 'Not this week')
    }, "Not this week"), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "accent",
      icon: "check",
      onClick: () => {
        a.answerRequest(r.id, 'planned', r.type === 'meal' ? 'Café will work it in' : 'Added to the list');
        a.toast({
          tone: 'success',
          icon: 'check',
          title: r.type === 'meal' ? 'Café will suggest it' : 'Added to the list',
          message: `${p.name} will see the reply.`
        });
      }
    }, r.type === 'meal' ? 'Add to plan' : 'Add to list'))));
  }
  function InboxScreen() {
    const a = useApp();
    const [seg, setSeg] = React.useState('requests');
    const [type, setType] = React.useState('meal');
    const [text, setText] = React.useState('');
    const fresh = a.requests.filter(r => r.status === 'new');
    const old = a.requests.filter(r => r.status !== 'new');
    const unsure = a.pantry.filter(p => p.state === 'unsure').length;
    return /*#__PURE__*/React.createElement(Screen, null, /*#__PURE__*/React.createElement(LargeTitle, {
      overline: a.D.week,
      title: "Inbox"
    }), /*#__PURE__*/React.createElement(SegmentedControl, {
      value: seg,
      onChange: setSeg,
      options: [{
        value: 'requests',
        label: `Requests${fresh.length ? ' · ' + fresh.length : ''}`
      }, {
        value: 'pantry',
        label: 'Pantry'
      }],
      style: {
        display: 'flex',
        marginBottom: 20
      }
    }), seg === 'requests' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
      padding: "m"
    }, /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
        if (text.trim()) {
          a.addRequest({
            type,
            text: text.trim()
          });
          setText('');
        }
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(ChoiceChips, {
      size: "s",
      multi: false,
      value: type,
      onChange: v => v && setType(v),
      options: [{
        value: 'meal',
        label: 'Meal idea',
        icon: 'sparkles'
      }, {
        value: 'out',
        label: "We're out of",
        icon: 'package'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      style: {
        flex: 1,
        minWidth: 0
      },
      value: text,
      onChange: e => setText(e.target.value),
      placeholder: type === 'meal' ? 'Something with salmon?' : 'Cornstarch, the big yogurt…'
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "send",
      label: "Send",
      variant: "primary",
      type: "submit",
      onClick: () => {
        if (text.trim()) {
          a.addRequest({
            type,
            text: text.trim()
          });
          setText('');
        }
      }
    })))), fresh.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "New"
    }), /*#__PURE__*/React.createElement("div", null, fresh.map((r, i) => /*#__PURE__*/React.createElement(RequestRow, {
      key: r.id,
      a: a,
      r: r,
      last: i === fresh.length - 1
    })))), /*#__PURE__*/React.createElement(SectionHead, {
      title: "Answered"
    }), /*#__PURE__*/React.createElement("div", null, old.map((r, i) => /*#__PURE__*/React.createElement(RequestRow, {
      key: r.id,
      a: a,
      r: r,
      last: i === old.length - 1
    })))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 10
      }
    }, a.D.photos.map(p => /*#__PURE__*/React.createElement(PhotoTile, _extends({
      key: p.src
    }, p, {
      aspect: "1 / 1"
    }))), /*#__PURE__*/React.createElement(PhotoTile, {
      empty: true,
      aspect: "1 / 1",
      label: "Add photo",
      onClick: () => a.toast({
        icon: 'camera',
        title: 'Camera would open here'
      })
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "m",
      tone: a.pantryDone ? 'accent' : 'default',
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, a.pantryDone ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        font: '500 14px/1.4 var(--font-sans)',
        color: 'var(--sage-900)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circle-check",
      size: 18
    }), "Confirmed by ", a.P.name, " today") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SuggestedTag, {
      label: `Café found ${a.pantry.length} items`,
      style: {
        alignSelf: 'flex-start'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 14px/1.45 var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, unsure, " it wasn't sure about. A quick check keeps them off the grocery list.")), /*#__PURE__*/React.createElement(Button, {
      variant: a.pantryDone ? 'secondary' : 'primary',
      icon: "refrigerator",
      onClick: () => a.push({
        type: 'pantry'
      })
    }, a.pantryDone ? 'View inventory' : 'Review what it found')))));
  }
  function PantryRow({
    a,
    p,
    last
  }) {
    const [edit, setEdit] = React.useState(false);
    const [name, setName] = React.useState(p.name.replace('?', ''));
    const [qty, setQty] = React.useState(p.qty);
    const gone = p.state === 'removed';
    if (edit) return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '12px 0',
        borderBottom: last ? 0 : '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Input, {
      size: "s",
      style: {
        flex: 2,
        minWidth: 0
      },
      value: name,
      onChange: e => setName(e.target.value)
    }), /*#__PURE__*/React.createElement(Input, {
      size: "s",
      style: {
        flex: 1,
        minWidth: 0
      },
      value: qty,
      onChange: e => setQty(e.target.value),
      placeholder: "Amount"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "ghost",
      onClick: () => setEdit(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      icon: "check",
      onClick: () => {
        a.setPantryItem(p.id, {
          name,
          qty,
          state: 'confirmed',
          edited: true
        });
        setEdit(false);
      }
    }, "Save")));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 0',
        borderBottom: last ? 0 : '1px solid var(--border-subtle)',
        opacity: gone ? 0.5 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => !gone && setEdit(true),
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        cursor: gone ? 'default' : 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 15px/1.3 var(--font-sans)',
        color: 'var(--text-strong)',
        textDecoration: gone ? 'line-through' : 'none'
      }
    }, p.name, p.qty && /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 400,
        color: 'var(--text-muted)'
      }
    }, " \xB7 ", p.qty)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'center'
      }
    }, p.state === 'unsure' && /*#__PURE__*/React.createElement(Badge, {
      tone: "warning"
    }, "Not sure"), p.state === 'confirmed' && /*#__PURE__*/React.createElement(SuggestedTag, {
      status: p.edited || p.added ? 'edited' : 'kept',
      label: p.added ? 'Added by you' : p.edited ? 'Fixed' : 'Confirmed'
    }), p.note && p.state === 'unsure' && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 12px/1.3 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, p.note))), gone ? /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "ghost",
      onClick: () => a.setPantryItem(p.id, {
        state: 'found'
      })
    }, "Undo") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconButton, {
      icon: "x",
      label: "Not there",
      size: "s",
      variant: "secondary",
      round: true,
      onClick: () => a.setPantryItem(p.id, {
        state: 'removed'
      })
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "check",
      label: "Yes, we have it",
      size: "s",
      variant: p.state === 'confirmed' ? 'accent' : 'secondary',
      round: true,
      onClick: () => a.setPantryItem(p.id, {
        state: 'confirmed'
      })
    })));
  }
  function AddPantryRow({
    a,
    area
  }) {
    const [open, setOpen] = React.useState(false);
    const [n, setN] = React.useState('');
    const [q, setQ] = React.useState('');
    const add = e => {
      e.preventDefault();
      if (!n.trim()) return;
      a.addPantryItem(n.trim(), area, q.trim());
      setN('');
      setQ('');
      setOpen(false);
    };
    if (!open) return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => setOpen(true),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        minHeight: 48,
        padding: '0',
        border: 0,
        borderTop: '1px solid var(--border-subtle)',
        background: 'none',
        cursor: 'pointer',
        color: 'var(--sage-700)',
        font: '600 14px/1 var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 18
    }), "Add to ", area.toLowerCase());
    return /*#__PURE__*/React.createElement("form", {
      onSubmit: add,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '12px 0',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Input, {
      size: "s",
      style: {
        flex: 2,
        minWidth: 0
      },
      value: n,
      onChange: e => setN(e.target.value),
      placeholder: "What is it?"
    }), /*#__PURE__*/React.createElement(Input, {
      size: "s",
      style: {
        flex: 1,
        minWidth: 0
      },
      value: q,
      onChange: e => setQ(e.target.value),
      placeholder: "Amount"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "ghost",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      type: "submit",
      icon: "plus",
      disabled: !n.trim()
    }, "Add")));
  }
  function PantryReview() {
    const a = useApp();
    const [n, setN] = React.useState('');
    const [area, setArea] = React.useState('Pantry');
    const areas = [...new Set(a.pantry.map(p => p.area))];
    const keep = a.pantry.filter(p => p.state !== 'removed').length;
    const unsure = a.pantry.filter(p => p.state === 'unsure').length;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Screen, {
      bottom: 120
    }, /*#__PURE__*/React.createElement(BackHeader, {
      title: "What's on hand",
      onBack: a.pop
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 14px/1.5 var(--font-sans)',
        color: 'var(--text-body)',
        margin: '8px 0 4px'
      }
    }, "Caf\xE9 read ", a.D.photos.length, " photos from today. Tap anything to fix it, or mark what isn't really there."), areas.map(ar => {
      const items = a.pantry.filter(p => p.area === ar);
      return /*#__PURE__*/React.createElement("div", {
        key: ar
      }, /*#__PURE__*/React.createElement(SectionHead, {
        title: ar,
        aside: `${items.length} items`
      }), /*#__PURE__*/React.createElement(Card, {
        padding: "none",
        style: {
          padding: '0 14px'
        }
      }, items.map(p => /*#__PURE__*/React.createElement(PantryRow, {
        key: p.id,
        a: a,
        p: p
      })), /*#__PURE__*/React.createElement(AddPantryRow, {
        a: a,
        area: ar
      })));
    }), /*#__PURE__*/React.createElement(SectionHead, {
      title: "Anything it missed?"
    }), /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
        if (n.trim()) {
          a.addPantryItem(n.trim(), area);
          setN('');
        }
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(ChoiceChips, {
      size: "s",
      multi: false,
      value: area,
      onChange: v => v && setArea(v),
      options: ['Pantry', 'Fridge', 'Freezer', 'Counter']
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Input, {
      style: {
        flex: 1,
        minWidth: 0
      },
      value: n,
      onChange: e => setN(e.target.value),
      placeholder: "Half a bag of rice"
    }), /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      variant: "secondary",
      icon: "plus"
    }, "Add")))), /*#__PURE__*/React.createElement(BottomBar, null, /*#__PURE__*/React.createElement(Button, {
      size: "l",
      variant: "accent",
      fullWidth: true,
      icon: "check",
      onClick: a.confirmPantry
    }, unsure ? `Confirm ${keep} items (${unsure} unsure)` : `Confirm ${keep} items`)));
  }
  Object.assign(window, {
    InboxScreen,
    PantryReview
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/InboxScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/ListScreens.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    Button,
    IconButton,
    Input,
    Badge,
    GroceryItem,
    ChoiceChips,
    SuggestedTag,
    Sheet,
    Card,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  const ALT = {
    c2: 'Center Cut Pork Chops, boneless · 2.4 lb · $6.21',
    c6: 'Fage Total 0% Greek Yogurt · 35 oz · $7.29'
  };
  function EditableItem({
    a,
    it
  }) {
    const [edit, setEdit] = React.useState(false);
    const [qty, setQty] = React.useState(it.qty || '');
    const [name, setName] = React.useState(it.name);
    const [note, setNote] = React.useState(it.note || '');
    if (edit) return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '12px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Input, {
      size: "s",
      style: {
        flex: 1,
        minWidth: 0
      },
      value: qty,
      onChange: e => setQty(e.target.value),
      placeholder: "Amount"
    }), /*#__PURE__*/React.createElement(Input, {
      size: "s",
      style: {
        flex: 2.2,
        minWidth: 0
      },
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "Item"
    })), /*#__PURE__*/React.createElement(Input, {
      size: "s",
      value: note,
      onChange: e => setNote(e.target.value),
      placeholder: "Note, e.g. brand or which meal"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "ghost",
      icon: "trash-2",
      style: {
        color: 'var(--tomato-500)'
      },
      onClick: () => a.removeListItem(it.key, it.name)
    }, "Remove"), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "ghost",
      onClick: () => setEdit(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      icon: "check",
      disabled: !name.trim(),
      onClick: () => {
        a.editListItem(it.key, {
          qty: qty.trim(),
          name: name.trim(),
          note: note.trim()
        });
        setEdit(false);
      }
    }, "Save")));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(GroceryItem, _extends({}, it, {
      checked: !!a.checked[it.key],
      onChange: () => a.toggleCheck(it.key),
      style: {
        flex: 1,
        minWidth: 0
      }
    })), /*#__PURE__*/React.createElement(IconButton, {
      icon: "pencil",
      label: `Edit ${it.name}`,
      size: "s",
      onClick: () => setEdit(true),
      style: {
        color: 'var(--text-muted)'
      }
    }));
  }
  function AddListRow({
    a,
    section
  }) {
    const [open, setOpen] = React.useState(false);
    const [qty, setQty] = React.useState('');
    const [name, setName] = React.useState('');
    const submit = e => {
      e.preventDefault();
      if (!name.trim()) return;
      a.addListItem(name.trim(), qty.trim(), section);
      setName('');
      setQty('');
    };
    if (!open) return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => setOpen(true),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        minHeight: 44,
        padding: 0,
        border: 0,
        background: 'none',
        cursor: 'pointer',
        color: 'var(--sage-700)',
        font: '600 14px/1 var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 18
    }), "Add to ", section.split(' / ')[0].toLowerCase());
    return /*#__PURE__*/React.createElement("form", {
      onSubmit: submit,
      style: {
        display: 'flex',
        gap: 8,
        padding: '10px 0',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      size: "s",
      style: {
        width: 80,
        flex: 'none'
      },
      value: qty,
      onChange: e => setQty(e.target.value),
      placeholder: "Amount"
    }), /*#__PURE__*/React.createElement(Input, {
      size: "s",
      style: {
        flex: 1,
        minWidth: 0
      },
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "Item"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "plus",
      label: "Add",
      variant: "primary",
      size: "s",
      onClick: submit
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "x",
      label: "Done",
      size: "s",
      onClick: () => setOpen(false)
    }));
  }
  function listText(a) {
    const lines = [`Grocery list — ${a.store.name}`, ''];
    a.list.forEach(sec => {
      const items = sec.items.filter(i => !a.checked[i.key]);
      if (!items.length) return;
      lines.push(sec.name);
      items.forEach(i => lines.push('☐ ' + [i.qty, i.name].filter(Boolean).join(' ') + (i.note ? ' — ' + i.note : '')));
      lines.push('');
    });
    return lines.join('\n').trim();
  }
  function copyList(a) {
    const t = listText(a);
    const done = () => a.toast({
      tone: 'success',
      icon: 'clipboard-list',
      title: 'List copied',
      message: 'Paste it into Google Keep, Notes or a text.'
    });
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, () => {
      fallbackCopy(t);
      done();
    });else {
      fallbackCopy(t);
      done();
    }
  }
  function fallbackCopy(t) {
    const ta = document.createElement('textarea');
    ta.value = t;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {}
    ta.remove();
  }
  function QuickAdd({
    a
  }) {
    const [v, setV] = React.useState('');
    const submit = e => {
      e.preventDefault();
      const t = v.trim();
      if (!t) return;
      const m = t.match(/^([\d.\/]+\s*(?:lbs?|oz|cans?|jars?|bags?|bunch(?:es)?|heads?|cups?|dozen)?)\s+(.+)$/i);
      a.addListItem(m ? m[2] : t, m ? m[1] : '', null);
      setV('');
    };
    return /*#__PURE__*/React.createElement("form", {
      onSubmit: submit,
      style: {
        display: 'flex',
        gap: 8,
        margin: '4px 0 0'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      icon: "plus",
      style: {
        flex: 1,
        minWidth: 0
      },
      value: v,
      onChange: e => setV(e.target.value),
      placeholder: "Add anything: \u201C2 lbs apples\u201D"
    }), /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      variant: "secondary",
      disabled: !v.trim()
    }, "Add"));
  }
  function ListScreen({
    left
  }) {
    const a = useApp();
    const total = a.list.flatMap(s => s.items).length;
    return /*#__PURE__*/React.createElement(Screen, null, /*#__PURE__*/React.createElement(LargeTitle, {
      overline: a.store.name,
      title: "Grocery list",
      sub: `${left} of ${total} still to get · sorted by aisle`,
      right: /*#__PURE__*/React.createElement(Button, {
        size: "s",
        variant: "secondary",
        icon: "clipboard-list",
        onClick: () => copyList(a)
      }, "Copy")
    }), !a.approved && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 'var(--radius-s)',
        background: 'var(--honey-100)',
        color: 'var(--honey-700)',
        font: '400 13px/1.45 var(--font-sans)',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 16,
      style: {
        marginTop: 2
      }
    }), /*#__PURE__*/React.createElement("span", null, "Draft list. It follows the plan, and you can order once the week is approved. ", /*#__PURE__*/React.createElement("b", {
      style: {
        cursor: 'pointer',
        textDecoration: 'underline'
      },
      onClick: () => a.setTab('plan')
    }, "Go to plan"))), a.diff.length > 0 && /*#__PURE__*/React.createElement(Card, {
      padding: "m",
      style: {
        marginBottom: 16,
        background: 'var(--terra-50)',
        borderColor: 'var(--terra-100)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 14px/1.3 var(--font-sans)',
        color: 'var(--terra-700)'
      }
    }, "The plan changed after approval"), a.diff.map((d, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        font: '400 13px/1.3 var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        color: d.sign === '+' ? 'var(--sage-700)' : 'var(--terra-700)',
        display: 'inline-block',
        width: 14
      }
    }, d.sign), d.text)), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "secondary",
      icon: "check",
      style: {
        alignSelf: 'flex-start',
        marginTop: 4
      },
      onClick: a.clearDiff
    }, "Looks right"))), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 14px',
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "store",
      iconColor: "var(--sage-700)",
      title: a.store.name,
      sub: `Weekly ad ${a.store.ad} · ${a.via.label}`,
      onClick: () => a.openSheet({
        type: 'store'
      }),
      right: /*#__PURE__*/React.createElement("span", {
        style: {
          font: '600 13px/1 var(--font-sans)',
          color: 'var(--sage-700)'
        }
      }, "Change"),
      last: true
    })), a.orderVia === 'share' ? /*#__PURE__*/React.createElement(Button, {
      size: "l",
      fullWidth: true,
      variant: "accent",
      icon: "send",
      onClick: () => a.openSheet({
        type: 'send'
      }),
      style: {
        marginBottom: 8
      }
    }, "Send the list \xB7 ", left, " items") : a.orderVia === 'self' ? /*#__PURE__*/React.createElement("p", {
      style: {
        display: 'flex',
        gap: 8,
        font: '400 13px/1.45 var(--font-sans)',
        color: 'var(--text-muted)',
        margin: '0 0 8px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shopping-basket",
      size: 16,
      style: {
        marginTop: 1
      }
    }), "Sorted by ", a.store.name, "'s aisles. Check things off as you go.") : a.approved && /*#__PURE__*/React.createElement(Button, {
      size: "l",
      fullWidth: true,
      variant: a.order ? 'secondary' : 'accent',
      icon: a.order ? 'truck' : 'shopping-cart',
      onClick: () => a.push({
        type: a.order ? 'track' : 'order'
      }),
      style: {
        marginBottom: 8
      }
    }, a.order ? a.orderVia === 'pickup' ? 'Track pickup' : 'Track delivery' : `Review ${a.orderVia === 'pickup' ? 'pickup' : a.orderVia === 'amazon' ? 'Amazon' : 'Instacart'} order · ${left} items`), /*#__PURE__*/React.createElement(QuickAdd, {
      a: a
    }), a.list.map(sec => /*#__PURE__*/React.createElement("div", {
      key: sec.name
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        margin: '24px 0 4px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: sec.icon,
      size: 18,
      style: {
        color: 'var(--sage-600)'
      }
    }), /*#__PURE__*/React.createElement("h2", {
      style: {
        flex: 1,
        font: 'var(--type-h3)',
        fontSize: 16,
        color: 'var(--text-strong)'
      }
    }, sec.name), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 12px/1 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, sec.items.length)), sec.items.map(it => /*#__PURE__*/React.createElement(EditableItem, {
      key: it.key + (it.name || ''),
      a: a,
      it: it
    })), /*#__PURE__*/React.createElement(AddListRow, {
      a: a,
      section: sec.name
    }))));
  }
  function OrderReview() {
    const a = useApp();
    const [win, setWin] = React.useState('Sat 9–11am');
    const [subs, setSubs] = React.useState('Ask me first');
    const flagged = a.D.cart.filter(c => !c.sure);
    const open = flagged.filter(c => !a.cart[c.id]).length;
    const sure = a.D.cart.filter(c => c.sure);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Screen, {
      bottom: 120
    }, /*#__PURE__*/React.createElement(BackHeader, {
      title: "Review order",
      onBack: a.pop
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 14px/1.5 var(--font-sans)',
        color: 'var(--text-body)',
        margin: '8px 0 0'
      }
    }, "Caf\xE9 matched each list item to a ", a.store.name, " product on ", a.orderVia === 'amazon' ? 'Amazon' : 'Instacart', ". It flagged the ones it wasn't sure about."), /*#__PURE__*/React.createElement(SectionHead, {
      title: "Check these",
      aside: open ? `${open} to check` : 'All checked'
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, flagged.map(c => {
      const d = a.cart[c.id];
      return /*#__PURE__*/React.createElement(Card, {
        key: c.id,
        padding: "m",
        style: d ? undefined : {
          borderStyle: 'dashed',
          borderColor: 'var(--honey-300)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          font: '500 12px/1 var(--font-sans)',
          color: 'var(--text-muted)'
        }
      }, "For \u201C", c.item, "\u201D"), /*#__PURE__*/React.createElement("span", {
        style: {
          font: '500 15px/1.35 var(--font-sans)',
          color: 'var(--text-strong)'
        }
      }, d === 'changed' ? ALT[c.id] : `${c.product} · ${c.size} · $${c.price.toFixed(2)}`), !d && /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          gap: 6,
          font: '400 13px/1.4 var(--font-sans)',
          color: 'var(--honey-700)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "triangle-alert",
        size: 14,
        style: {
          marginTop: 2
        }
      }), c.note), d ? /*#__PURE__*/React.createElement(SuggestedTag, {
        status: d === 'changed' ? 'edited' : 'kept',
        by: a.P.name,
        style: {
          alignSelf: 'flex-start'
        }
      }) : /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(Button, {
        size: "s",
        variant: "secondary",
        icon: "refresh-cw",
        onClick: () => a.setCartItem(c.id, 'changed')
      }, "Change"), /*#__PURE__*/React.createElement(Button, {
        size: "s",
        variant: "accent",
        icon: "check",
        onClick: () => a.setCartItem(c.id, 'ok')
      }, "Looks right"))));
    })), /*#__PURE__*/React.createElement(SectionHead, {
      title: "Matched",
      aside: `${sure.length + a.D.cartMore} items`
    }), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 14px'
      }
    }, sure.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.id,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        padding: '11px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        font: '400 14px/1.35 var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, c.product, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)'
      }
    }, "\xB7 ", c.size)), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 14px/1 var(--font-sans)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, "$", c.price.toFixed(2)))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 0',
        font: '500 13px/1 var(--font-sans)',
        color: 'var(--sage-700)'
      }
    }, "+ ", a.D.cartMore, " more")), /*#__PURE__*/React.createElement(SectionHead, {
      title: "Delivery"
    }), /*#__PURE__*/React.createElement(ChoiceChips, {
      size: "s",
      multi: false,
      value: win,
      onChange: v => v && setWin(v),
      options: ['Sat 9–11am', 'Sat 1–3pm', 'Sun 9–11am']
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        font: '600 13px/1 var(--font-sans)',
        color: 'var(--text-strong)',
        margin: '20px 0 10px'
      }
    }, "If something's out"), /*#__PURE__*/React.createElement(ChoiceChips, {
      size: "s",
      multi: false,
      value: subs,
      onChange: v => v && setSubs(v),
      options: ['Ask me first', "Shopper's choice", "Don't replace"]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginTop: 24,
        paddingTop: 16,
        borderTop: '1px solid var(--border-default)'
      }
    }, [['Groceries', '$' + a.D.cartTotal.toFixed(2)], ['Delivery + service', '$7.48'], ['Estimated total', '$' + (a.D.cartTotal + 7.48).toFixed(2)]].map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        font: `${i === 2 ? 600 : 400} ${i === 2 ? 16 : 14}px/1.3 var(--font-sans)`,
        color: i === 2 ? 'var(--text-strong)' : 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("span", {
      style: {
        fontVariantNumeric: 'tabular-nums'
      }
    }, v))))), /*#__PURE__*/React.createElement(BottomBar, null, /*#__PURE__*/React.createElement(Button, {
      size: "l",
      variant: "accent",
      fullWidth: true,
      icon: "shopping-cart",
      disabled: open > 0,
      onClick: a.placeOrder
    }, open ? `Check ${open} flagged item${open > 1 ? 's' : ''} first` : `Place order · ${win}`)));
  }
  const STEPS = [['placed', 'Order placed', 'receipt'], ['shopping', 'Shopper at the store', 'shopping-cart'], ['delivering', 'On the way', 'truck'], ['delivered', 'Delivered', 'house']];
  function Tracking() {
    const a = useApp();
    const idx = STEPS.findIndex(s => s[0] === a.order);
    return /*#__PURE__*/React.createElement(Screen, null, /*#__PURE__*/React.createElement(BackHeader, {
      title: "Delivery",
      onBack: a.pop,
      right: a.order !== 'delivered' && /*#__PURE__*/React.createElement(Button, {
        size: "s",
        variant: "ghost",
        onClick: a.advanceOrder
      }, "Next step (demo)")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '12px 0 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)'
      }
    }, "Saturday, 9\u201311am"), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: '300 34px/1.1 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, STEPS[idx][1])), a.order === 'shopping' && a.sub === 'pending' && /*#__PURE__*/React.createElement(Card, {
      padding: "m",
      elevation: "raised",
      style: {
        marginBottom: 20,
        borderColor: 'var(--terra-100)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: '600 12px/1 var(--font-sans)',
        color: 'var(--terra-700)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "refresh-cw",
      size: 14
    }), "Shopper is asking"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 15px/1.45 var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, /*#__PURE__*/React.createElement("b", null, "Queso fresco 10 oz"), " is out. Replace with ", /*#__PURE__*/React.createElement("b", null, "Cotija 10 oz"), " for $2.49?"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 13px/1.4 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, "For Taco Tuesday. Cotija is saltier and crumbles the same way."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "secondary",
      icon: "x",
      style: {
        flex: 1
      },
      onClick: () => a.decideSub('refunded')
    }, "Refund it"), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "accent",
      icon: "check",
      style: {
        flex: 1
      },
      onClick: () => a.decideSub('approved')
    }, "Use cotija")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, STEPS.map(([k, l, ic], i) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        display: 'flex',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        background: i < idx ? 'var(--sage-600)' : i === idx ? 'var(--char-900)' : 'var(--linen-200)',
        color: i <= idx ? '#fff' : 'var(--text-faint)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: i < idx ? 'check' : ic,
      size: 16,
      stroke: i < idx ? 2.5 : 1.75
    })), i < STEPS.length - 1 && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 2,
        height: 32,
        background: i < idx ? 'var(--sage-300)' : 'var(--linen-300)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: `${i === idx ? 600 : 500} 15px/1.2 var(--font-sans)`,
        color: i <= idx ? 'var(--text-strong)' : 'var(--text-faint)'
      }
    }, l), i === 1 && a.sub !== 'pending' && i <= idx && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 12px/1.3 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, a.sub === 'approved' ? 'Cotija instead of queso fresco' : 'Queso fresco refunded'))))), a.order === 'delivered' && /*#__PURE__*/React.createElement(Card, {
      tone: "accent",
      padding: "m",
      style: {
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 20px/1.2 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, "Putting things away?"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 14px/1.45 var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, "Caf\xE9 can mark everything delivered as on hand, so it won't come back on next week's list."), /*#__PURE__*/React.createElement(Button, {
      icon: "refrigerator",
      onClick: () => a.toast({
        tone: 'success',
        icon: 'refrigerator',
        title: '38 items added to the pantry'
      })
    }, "Update pantry"))));
  }
  function Choice({
    icon,
    title,
    sub,
    on,
    onClick,
    last
  }) {
    return /*#__PURE__*/React.createElement(ListRow, {
      icon: icon,
      iconColor: on ? 'var(--sage-700)' : undefined,
      title: title,
      sub: sub,
      onClick: onClick,
      last: last,
      right: /*#__PURE__*/React.createElement("span", {
        style: {
          width: 22,
          height: 22,
          borderRadius: 999,
          flex: 'none',
          display: 'grid',
          placeItems: 'center',
          border: on ? 0 : '1.5px solid var(--border-strong)',
          background: on ? 'var(--sage-600)' : 'transparent',
          color: '#fff'
        }
      }, on && /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 13,
        stroke: 2.5
      }))
    });
  }
  function StoreSheet({
    open
  }) {
    const a = useApp();
    return /*#__PURE__*/React.createElement(Sheet, {
      open: open,
      onClose: a.closeSheet,
      title: "Store & ordering",
      subtitle: "Caf\xE9 reads this store's weekly ad when it plans, and sorts the list by its aisles.",
      footer: /*#__PURE__*/React.createElement(Button, {
        size: "l",
        fullWidth: true,
        onClick: a.closeSheet
      }, "Done")
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        margin: '4px 0 6px'
      }
    }, "Weekly ads from"), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 14px'
      }
    }, a.D.stores.map((st, i) => /*#__PURE__*/React.createElement(Choice, {
      key: st.id,
      icon: "store",
      title: st.name,
      sub: `Ad ${st.ad} · ${st.deals} deals`,
      on: a.store.id === st.id,
      onClick: () => a.setStore(st.id)
    })), /*#__PURE__*/React.createElement(ListRow, {
      icon: "plus",
      iconColor: "var(--sage-700)",
      title: "Add another store",
      sub: "Paste its weekly ad link",
      onClick: () => a.toast({
        icon: 'store',
        title: 'Store search would open here'
      }),
      last: true
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        margin: '20px 0 6px'
      }
    }, "Get the groceries by"), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 14px'
      }
    }, a.D.orderVia.map((o, i) => /*#__PURE__*/React.createElement(Choice, {
      key: o.id,
      icon: o.icon,
      title: o.label,
      sub: o.sub,
      on: a.orderVia === o.id,
      onClick: () => a.setOrderVia(o.id),
      last: i === a.D.orderVia.length - 1
    }))));
  }
  function SendSheet({
    open
  }) {
    const a = useApp();
    const [who, setWho] = React.useState(['Joe']);
    const others = Object.values(a.D.people).map(p => p.name).filter(n => n !== a.P.name);
    const n = a.list.flatMap(s => s.items).filter(i => !a.checked[i.key]).length;
    return /*#__PURE__*/React.createElement(Sheet, {
      open: open,
      onClose: a.closeSheet,
      title: "Send the list",
      subtitle: `${n} items for ${a.store.name}, sorted by aisle. Whoever shops can check things off from their phone.`,
      footer: /*#__PURE__*/React.createElement(Button, {
        size: "l",
        fullWidth: true,
        variant: "accent",
        icon: "send",
        disabled: !who.length,
        onClick: () => a.shareList('text', who)
      }, "Text it to ", who.join(' and ') || '…')
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        font: '600 13px/1 var(--font-sans)',
        color: 'var(--text-strong)',
        margin: '4px 0 10px'
      }
    }, "Who's shopping?"), /*#__PURE__*/React.createElement(ChoiceChips, {
      value: who,
      onChange: setWho,
      options: others
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        margin: '24px 0 6px'
      }
    }, "Or"), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 14px'
      }
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "notebook-pen",
      title: "Update the Notion page",
      sub: "Grocery List \xB7 To Buy + Staples",
      onClick: () => a.shareList('notion')
    }), /*#__PURE__*/React.createElement(ListRow, {
      icon: "clipboard-list",
      title: "Copy as text",
      sub: "Paste anywhere",
      onClick: () => a.shareList('copy'),
      last: true
    })));
  }
  Object.assign(window, {
    ListScreen,
    OrderReview,
    Tracking,
    StoreSheet,
    SendSheet
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/ListScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/MealDetail.jsx
try { (() => {
(() => {
  const {
    Button,
    IconButton,
    Badge,
    DayTag,
    SuggestedTag,
    ReviewActions,
    Score,
    Stars,
    Input,
    RecipeStep,
    Card,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  const STEPS = {
    chops: [['Heat the oven to 425°F. Toss <b>1.5 lbs quartered potatoes</b> and <b>1 onion, in wedges</b> with <b>2 tbsp olive oil</b>, salt and pepper.', null], ['Spread on a sheet pan and roast until the edges brown.', '15 min'], ['Rub <b>5 pork chops</b> with <b>1 tbsp olive oil</b>, <b>2 tsp smoked paprika</b> and <b>1 tsp dried thyme</b>.', null], ['Push potatoes aside; add chops and <b>1 lb green beans</b>. Roast to 145°F.', '15 min'], ['Rest 5 minutes. Save 2 chops for tomorrow.', '5 min']]
  };
  const TAG = {
    have: ['success', 'On hand'],
    list: ['neutral', 'On list'],
    sale: ['sale', 'On sale']
  };
  function MealDetail({
    day,
    mealId,
    edit: startEdit,
    draft
  }) {
    const a = useApp();
    const s = day ? a.slotOf(day) : null;
    const id = mealId || s && s.meal;
    const m = draft || a.D.meals[id] || {
      title: 'Open night',
      description: 'This meal was taken off the plan.',
      ingredients: []
    };
    const [ings, setIngs] = React.useState(m.ingredients);
    const [editing, setEditing] = React.useState(!!startEdit);
    const [newIng, setNewIng] = React.useState('');
    const [serves, setServes] = React.useState(5);
    const [cooking, setCooking] = React.useState(-1);
    const [rated, setRated] = React.useState(0);
    const steps = draft && draft.steps || STEPS[id];
    const status = draft ? 'draft' : s ? s.status : null;
    const dirty = ings !== m.ingredients || serves !== 5;
    const save = () => {
      setEditing(false);
      if (s) {
        a.toast({
          tone: 'success',
          icon: 'check',
          title: 'Saved',
          message: 'Marked as edited. The grocery list follows.'
        });
      }
    };
    const done = steps && cooking >= steps.length;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Screen, {
      bottom: 120
    }, /*#__PURE__*/React.createElement(BackHeader, {
      title: m.title,
      onBack: a.pop,
      right: day && /*#__PURE__*/React.createElement(IconButton, {
        icon: "ellipsis",
        label: "Change",
        onClick: () => a.openSheet({
          type: 'edit',
          day
        })
      })
    }), /*#__PURE__*/React.createElement(MealPhoto, {
      height: 200,
      radius: "var(--radius-m)"
    }, s && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 12,
        left: 12,
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(DayTag, {
      day: s.day
    }), m.onSale && /*#__PURE__*/React.createElement(Badge, {
      tone: "sale",
      variant: "solid",
      icon: "tag"
    }, "On sale"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginTop: 16
      }
    }, status && /*#__PURE__*/React.createElement(SuggestedTag, {
      status: status,
      by: status === 'suggested' || status === 'draft' ? undefined : s.by,
      style: {
        alignSelf: 'flex-start'
      }
    }), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: '300 30px/1.1 var(--font-serif)',
        letterSpacing: 'var(--ls-display)',
        color: 'var(--text-strong)'
      }
    }, m.title), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-description)',
        fontSize: 16,
        color: 'var(--text-body)'
      }
    }, m.description), /*#__PURE__*/React.createElement(MealMeta, {
      m: m
    }), draft && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 'var(--radius-s)',
        background: 'var(--honey-100)',
        color: 'var(--honey-700)',
        font: '400 13px/1.45 var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "notebook-pen",
      size: 16,
      style: {
        marginTop: 2
      }
    }), /*#__PURE__*/React.createElement("span", null, "Caf\xE9 wrote this from your description. Check the amounts and steps before cooking it. Nothing is saved until you do.")), m.healthy && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Score, {
      label: "Healthy",
      value: m.healthy
    }), /*#__PURE__*/React.createElement(Score, {
      label: "Delicious",
      value: m.delicious,
      tone: "terra"
    })), m.why && (status === 'suggested' || status === 'edited' || draft) && /*#__PURE__*/React.createElement(Why, {
      items: m.why,
      basis: s && s.basis
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        margin: '28px 0 12px'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: '400 22px/1.2 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, "Ingredients"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, editing && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconButton, {
      icon: "minus",
      label: "Fewer",
      size: "s",
      variant: "secondary",
      onClick: () => setServes(Math.max(1, serves - 1))
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px/1 var(--font-sans)',
        minWidth: 58,
        textAlign: 'center'
      }
    }, "Serves ", serves), /*#__PURE__*/React.createElement(IconButton, {
      icon: "plus",
      label: "More",
      size: "s",
      variant: "secondary",
      onClick: () => setServes(serves + 1)
    })), !editing && /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "ghost",
      icon: "pencil",
      onClick: () => setEditing(true)
    }, "Edit"))), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 14px'
      }
    }, ings.map(([q, n, t], i) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 0',
        borderBottom: i < ings.length - 1 || editing ? '1px solid var(--border-subtle)' : 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        font: '400 15px/1.35 var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        fontWeight: 650
      }
    }, q), " ", n), t && /*#__PURE__*/React.createElement(Badge, {
      tone: TAG[t][0]
    }, TAG[t][1]), editing && /*#__PURE__*/React.createElement(IconButton, {
      icon: "x",
      label: `Remove ${n}`,
      size: "s",
      onClick: () => setIngs(ings.filter((_, j) => j !== i))
    }))), editing && /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
        if (newIng.trim()) {
          setIngs([...ings, ['', newIng.trim(), 'list']]);
          setNewIng('');
        }
      },
      style: {
        display: 'flex',
        gap: 8,
        padding: '12px 0'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      size: "s",
      style: {
        flex: 1,
        minWidth: 0
      },
      value: newIng,
      onChange: e => setNewIng(e.target.value),
      placeholder: "Add an ingredient"
    }), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      type: "submit",
      variant: "secondary",
      icon: "plus"
    }, "Add"))), steps && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Steps",
      aside: cooking >= 0 && !done ? `Step ${cooking + 1} of ${steps.length}` : null
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, steps.map(([h, t], i) => /*#__PURE__*/React.createElement(RecipeStep, {
      key: i,
      index: i + 1,
      done: cooking > i,
      active: cooking === i,
      timer: t,
      onToggle: cooking >= 0 ? () => setCooking(i) : undefined
    }, /*#__PURE__*/React.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: h
      }
    }))))), done && /*#__PURE__*/React.createElement(Card, {
      tone: "accent",
      padding: "m",
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 20px/1.2 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, "How was it?"), /*#__PURE__*/React.createElement(Stars, {
      value: rated,
      onChange: v => {
        setRated(v);
        a.toast({
          tone: 'success',
          icon: 'star',
          title: `Saved — ${v} stars`,
          message: 'Joe and Leidy can add theirs.'
        });
      },
      size: 28
    }))), m.leftovers && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Leftovers"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        font: '400 14px/1.45 var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "refresh-cw",
      size: 16,
      style: {
        color: 'var(--sage-600)',
        marginTop: 2
      }
    }), m.leftovers))), /*#__PURE__*/React.createElement(BottomBar, null, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      style: {
        flex: 1
      },
      onClick: () => {
        setIngs(m.ingredients);
        setServes(5);
        setEditing(false);
      }
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      style: {
        flex: 1.4
      },
      icon: "check",
      disabled: !dirty,
      onClick: save
    }, "Save changes")) : draft ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      style: {
        flex: 1
      },
      icon: "x",
      onClick: a.pop
    }, "Discard"), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      style: {
        flex: 1.4
      },
      icon: "book-open",
      onClick: () => {
        a.addRecipe({
          id: 'new' + Date.now(),
          title: m.title,
          stars: 0,
          method: m.method,
          time: m.time,
          last: 'Never',
          tags: ['New']
        });
        a.pop();
      }
    }, "Save to recipe box")) : s && s.status === 'suggested' ? /*#__PURE__*/React.createElement(ReviewActions, {
      style: {
        flex: 1
      },
      onReject: () => a.openSheet({
        type: 'reject',
        day
      }),
      onSwap: () => a.openSheet({
        type: 'swap',
        day
      }),
      onApprove: () => a.keep(day)
    }) : steps && cooking >= 0 && !done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      icon: "arrow-left",
      style: {
        flex: 1
      },
      disabled: cooking === 0,
      onClick: () => setCooking(cooking - 1)
    }, "Back"), /*#__PURE__*/React.createElement(Button, {
      style: {
        flex: 1.4
      },
      iconRight: "arrow-right",
      onClick: () => setCooking(cooking + 1)
    }, cooking === steps.length - 1 ? 'Done cooking' : 'Next step')) : !day && id ? /*#__PURE__*/React.createElement(React.Fragment, null, a.slots.some(x => x.meal === id) ? /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      icon: "calendar-days",
      style: {
        flex: 1
      },
      disabled: true
    }, "On this week") : a.queue.some(q => q.meal === id) ? /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      icon: "check",
      style: {
        flex: 1
      },
      onClick: () => {
        a.queueRemove(id);
        a.toast({
          icon: 'x',
          title: 'Removed from Up next'
        });
      }
    }, "In Up next") : /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      icon: "plus",
      style: {
        flex: 1
      },
      onClick: () => a.queueAdd(id)
    }, "Add to Up next"), /*#__PURE__*/React.createElement(Button, {
      icon: "calendar-days",
      style: {
        flex: 1
      },
      onClick: () => a.openSheet({
        type: 'schedule',
        meal: id
      })
    }, "Put on a night")) : /*#__PURE__*/React.createElement(Button, {
      size: "l",
      fullWidth: true,
      icon: "chef-hat",
      disabled: !steps || done,
      onClick: () => setCooking(0)
    }, done ? 'Enjoy dinner' : steps ? 'Start cooking' : 'Full steps in the recipe box')));
  }
  window.MealDetail = MealDetail;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/MealDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/MealSheets.jsx
try { (() => {
(() => {
  const {
    Sheet,
    Button,
    ChoiceChips,
    Input,
    Switch,
    Badge,
    Icon,
    Card
  } = window.CafeLaurenDesignSystem_9f0e0a;
  const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const RB = {
    soup: 'soup',
    meatballs: 'meatballs',
    shrimp: 'shrimp',
    tacos: 'tacos'
  };
  function OptionCard({
    m,
    onUse,
    basis
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 14,
        borderRadius: 'var(--radius-m)',
        background: 'var(--surface-card)',
        border: '1px dashed var(--sage-300)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: '400 18px/1.2 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, m.title), m.onSale && /*#__PURE__*/React.createElement(Badge, {
      tone: "sale",
      icon: "tag"
    }, "Sale")), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 12.5px/1 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, m.method, " \xB7 ", m.time, " \xB7 ", m.cost), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 6,
        font: '400 13px/1.4 var(--font-sans)',
        color: 'var(--sage-900)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 13,
      style: {
        color: 'var(--sage-600)',
        marginTop: 3
      }
    }), basis ? `${basis}: ` : '', m.why[0]), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "secondary",
      icon: "check",
      onClick: onUse,
      style: {
        alignSelf: 'flex-start'
      }
    }, "Use this"));
  }
  function SwapSheet({
    open,
    day
  }) {
    const a = useApp();
    const [prefs, setPrefs] = React.useState([]);
    const [note, setNote] = React.useState('');
    const [phase, setPhase] = React.useState('ready');
    React.useEffect(() => {
      if (open) {
        setPrefs([]);
        setNote('');
        setPhase('ready');
      }
    }, [open, day]);
    if (!day) return /*#__PURE__*/React.createElement(Sheet, {
      open: false
    });
    const s = a.slotOf(day);
    const cur = s.meal && a.D.meals[s.meal];
    const used = a.slots.map(x => x.meal);
    let opts = a.D.alternatives.filter(id => !used.includes(id));
    if (prefs.includes('Quicker') || prefs.includes('Use what we have')) opts = [...opts].sort((x, y) => parseInt(a.D.meals[x].time) - parseInt(a.D.meals[y].time));
    if (prefs.includes('Cheaper')) opts = [...opts].sort((x, y) => parseInt(a.D.meals[x].cost.slice(2)) - parseInt(a.D.meals[y].cost.slice(2)));
    if (prefs.includes('Weekly specials')) opts = [...opts].sort((x, y) => (a.D.meals[y].onSale ? 1 : 0) - (a.D.meals[x].onSale ? 1 : 0));
    const basis = [...prefs, note].filter(Boolean).join(' · ');
    const refine = () => {
      setPhase('thinking');
      setTimeout(() => setPhase('ready'), 900);
    };
    return /*#__PURE__*/React.createElement(Sheet, {
      open: open,
      onClose: a.closeSheet,
      title: `Swap ${DAYNAME[day]}`,
      subtitle: cur ? `Instead of ${cur.title}` : 'Pick something for this night'
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(ChoiceChips, {
      size: "s",
      value: prefs,
      onChange: p => {
        setPrefs(p);
        refine();
      },
      options: a.D.swapPrefs
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      style: {
        flex: 1,
        minWidth: 0
      },
      value: note,
      onChange: e => setNote(e.target.value),
      placeholder: "Or say it: \u201Cuse the freezer meatballs\u201D"
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      icon: "sparkles",
      onClick: refine,
      disabled: !note
    }, "Ask")), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginTop: 4
      }
    }, "Caf\xE9's options"), phase === 'thinking' ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16,
        borderRadius: 'var(--radius-m)',
        background: 'var(--sage-50)',
        font: '500 14px/1.4 var(--font-sans)',
        color: 'var(--sage-700)',
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 16
    }), "Looking at deals and the pantry\u2026") : opts.slice(0, 3).map(id => /*#__PURE__*/React.createElement(OptionCard, {
      key: id,
      m: a.D.meals[id],
      basis: basis,
      onUse: () => a.swap(day, id, basis)
    })), a.queue.filter(q => !used.includes(q.meal)).length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginTop: 8
      }
    }, "Up next"), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 14px'
      }
    }, a.queue.filter(q => !used.includes(q.meal)).map((q, i, arr) => /*#__PURE__*/React.createElement(ListRow, {
      key: q.meal,
      icon: "list",
      iconColor: "var(--sage-700)",
      title: a.D.meals[q.meal].title,
      sub: `Queued by ${q.by}`,
      onClick: () => a.swap(day, q.meal, 'From Up next'),
      last: i === arr.length - 1
    })))), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginTop: 8
      }
    }, "From the recipe box"), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 14px'
      }
    }, a.recipes.filter(r => RB[r.id] && !used.includes(RB[r.id])).slice(0, 3).map((r, i, arr) => /*#__PURE__*/React.createElement(ListRow, {
      key: r.id,
      title: r.title,
      sub: `${r.method} · ${r.time} · last made ${r.last}`,
      onClick: () => a.swap(day, RB[r.id], 'Picked from the recipe box'),
      last: i === arr.length - 1
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginTop: 8
      }
    }, "Or make it"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, [['refresh-cw', 'Leftovers night'], ['chef-hat', 'Leidy cooks'], ['utensils', 'Eating out']].map(([ic, t]) => /*#__PURE__*/React.createElement(Button, {
      key: t,
      size: "s",
      variant: "secondary",
      icon: ic,
      onClick: () => {
        a.setText(day, t);
        a.closeSheet();
        a.toast({
          icon: ic,
          title: `${DAYNAME[day]}: ${t}`
        });
      }
    }, t)))));
  }
  function ScheduleSheet({
    open,
    meal
  }) {
    const a = useApp();
    if (!meal) return /*#__PURE__*/React.createElement(Sheet, {
      open: false
    });
    const m = a.D.meals[meal];
    return /*#__PURE__*/React.createElement(Sheet, {
      open: open,
      onClose: a.closeSheet,
      title: "Put on a night",
      subtitle: m.title + ' replaces what\'s planned. Votes reset for that night.'
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 14px'
      }
    }, a.slots.map((s, i) => /*#__PURE__*/React.createElement(ListRow, {
      key: s.day,
      title: DAYNAME[s.day],
      sub: slotTitle(a, s),
      onClick: () => a.swap(s.day, meal, 'Picked from the recipe box'),
      last: i === 6
    }))));
  }
  function RejectSheet({
    open,
    day
  }) {
    const a = useApp();
    const [why, setWhy] = React.useState([]);
    const [note, setNote] = React.useState('');
    const [remember, setRemember] = React.useState(true);
    React.useEffect(() => {
      if (open) {
        setWhy([]);
        setNote('');
      }
    }, [open, day]);
    if (!day) return /*#__PURE__*/React.createElement(Sheet, {
      open: false
    });
    const s = a.slotOf(day);
    const m = s.meal && a.D.meals[s.meal];
    return /*#__PURE__*/React.createElement(Sheet, {
      open: open,
      onClose: a.closeSheet,
      title: m ? `Not ${m.title.split(' with ')[0]}?` : 'Not this?',
      subtitle: "Tell Caf\xE9 why. It's fine to skip this, but a reason makes the next idea better.",
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        style: {
          flex: 1
        },
        onClick: () => a.reject(day, why, note, 'open')
      }, "Leave night open"), /*#__PURE__*/React.createElement(Button, {
        icon: "sparkles",
        style: {
          flex: 1.2
        },
        onClick: () => a.reject(day, why, note, 'another')
      }, "Suggest another"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(ChoiceChips, {
      value: why,
      onChange: setWhy,
      options: a.D.rejectReasons
    }), /*#__PURE__*/React.createElement(Input, {
      multiline: true,
      rows: 2,
      value: note,
      onChange: e => setNote(e.target.value),
      placeholder: "Anything else? \u201CWe had pork twice already\u201D"
    }), /*#__PURE__*/React.createElement(Switch, {
      checked: remember,
      onChange: setRemember,
      label: "Remember this",
      description: "Caf\xE9 will weigh it in future weeks. You can see and clear these in settings."
    })));
  }
  function EditMealSheet({
    open,
    day
  }) {
    const a = useApp();
    if (!day) return /*#__PURE__*/React.createElement(Sheet, {
      open: false
    });
    const s = a.slotOf(day);
    const title = slotTitle(a, s);
    const cook = s.cook || (s.kind === 'leidy' ? 'Leidy' : 'Lauren');
    return /*#__PURE__*/React.createElement(Sheet, {
      open: open,
      onClose: a.closeSheet,
      title: `Change ${DAYNAME[day]}`,
      subtitle: title
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        font: '600 13px/1 var(--font-sans)',
        color: 'var(--text-strong)',
        marginBottom: 10
      }
    }, "Move to another day"), /*#__PURE__*/React.createElement(ChoiceChips, {
      size: "s",
      multi: false,
      value: day,
      onChange: to => to && to !== day && a.moveSlot(day, to),
      options: DAYS.map(d => ({
        value: d,
        label: DAYNAME[d].slice(0, 3)
      }))
    })), s.kind === 'cook' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        font: '600 13px/1 var(--font-sans)',
        color: 'var(--text-strong)',
        marginBottom: 10
      }
    }, "Who's cooking"), /*#__PURE__*/React.createElement(ChoiceChips, {
      size: "s",
      multi: false,
      value: cook,
      onChange: w => w && a.setCook(day, w),
      options: ['Lauren', 'Joe', 'Leidy']
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 14px'
      }
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "refresh-cw",
      title: "Swap for a different meal",
      onClick: () => a.openSheet({
        type: 'swap',
        day
      })
    }), s.meal && /*#__PURE__*/React.createElement(ListRow, {
      icon: "pencil",
      title: "Edit ingredients or servings",
      onClick: () => {
        a.closeSheet();
        a.push({
          type: 'meal',
          day,
          edit: true
        });
      }
    }), /*#__PURE__*/React.createElement(ListRow, {
      icon: "refresh-cw",
      title: "Make it a leftovers night",
      onClick: () => {
        a.setText(day, 'Leftovers night');
        a.closeSheet();
      }
    }), s.meal && /*#__PURE__*/React.createElement(ListRow, {
      icon: "x",
      iconColor: "var(--terra-500)",
      title: "Take it off the plan",
      sub: "Tell Caf\xE9 why",
      onClick: () => a.openSheet({
        type: 'reject',
        day
      }),
      last: true
    }))));
  }
  Object.assign(window, {
    SwapSheet,
    RejectSheet,
    EditMealSheet,
    ScheduleSheet
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/MealSheets.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/PlanScreens.jsx
try { (() => {
(() => {
  const {
    Button,
    IconButton,
    Badge,
    DayTag,
    SuggestedTag,
    ReviewActions,
    VoteButtons,
    Score,
    Card,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  function Meta({
    m
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px 14px'
      }
    }, [['cooking-pot', m.method], ['clock', m.time], ['receipt', m.cost]].map(([i, t]) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        font: '500 12.5px/1 var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: i,
      size: 14,
      style: {
        color: 'var(--text-muted)'
      }
    }), t)));
  }
  function Votes({
    a,
    s
  }) {
    const v = s.votes || {};
    const vals = Object.values(v);
    return /*#__PURE__*/React.createElement(VoteButtons, {
      value: v[a.user] || null,
      onChange: x => a.vote(s.day, x),
      up: vals.filter(x => x === 'up').length,
      down: vals.filter(x => x === 'down').length,
      voters: Object.keys(v).map(k => a.D.people[k])
    });
  }
  function Thinking({
    basis
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '6px 0'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        font: '500 14px/1.4 var(--font-sans)',
        color: 'var(--sage-700)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 16
    }), "Finding something else\u2026"), basis && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 13px/1.4 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, "Working from: \u201C", basis, "\u201D"), [80, 60].map(w => /*#__PURE__*/React.createElement("span", {
      key: w,
      style: {
        height: 10,
        width: w + '%',
        borderRadius: 3,
        background: 'var(--linen-200)'
      }
    })));
  }
  function SlotCard({
    a,
    s
  }) {
    const m = s.meal && a.D.meals[s.meal];
    if (s.kind !== 'cook') return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 'var(--radius-card)',
        background: s.kind === 'open' ? 'transparent' : 'var(--surface-sunken)',
        border: s.kind === 'open' ? '1.5px dashed var(--border-strong)' : '1px solid transparent'
      }
    }, /*#__PURE__*/React.createElement(DayTag, {
      day: s.day,
      short: true,
      style: {
        width: 44,
        justifyContent: 'center'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'italic 400 15px/1.3 var(--font-serif)',
        color: s.kind === 'open' ? 'var(--text-strong)' : 'var(--text-body)'
      }
    }, slotTitle(a, s)), s.kind === 'open' && s.basis && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 12px/1.3 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, "Not this week: ", s.basis), s.kind === 'leidy' && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 12px/1.3 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, "Waiting on what she's making")), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: s.kind === 'open' ? 'primary' : 'ghost',
      onClick: () => a.openSheet({
        type: s.kind === 'open' ? 'swap' : 'edit',
        day: s.day
      })
    }, s.kind === 'open' ? 'Pick a meal' : 'Change'));
    const review = s.status === 'suggested';
    return /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      selected: review,
      style: review ? {
        borderStyle: 'dashed',
        borderColor: 'var(--sage-300)',
        boxShadow: 'none'
      } : undefined
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(DayTag, {
      day: s.day
    }), /*#__PURE__*/React.createElement(SuggestedTag, {
      status: s.status,
      by: s.status === 'suggested' ? undefined : s.by
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), !review && s.status !== 'thinking' && /*#__PURE__*/React.createElement(IconButton, {
      icon: "ellipsis",
      label: "Change",
      size: "s",
      onClick: () => a.openSheet({
        type: 'edit',
        day: s.day
      })
    })), s.status === 'thinking' ? /*#__PURE__*/React.createElement(Thinking, {
      basis: s.basis
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      onClick: () => a.push({
        type: 'meal',
        day: s.day
      }),
      style: {
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        font: '400 20px/1.2 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, m.title), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'italic 400 14px/1.4 var(--font-serif)',
        color: 'var(--text-body)',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, m.description)), /*#__PURE__*/React.createElement(Meta, {
      m: m
    }), review && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'flex-start',
        font: '400 13px/1.4 var(--font-sans)',
        color: 'var(--sage-900)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 14,
      style: {
        color: 'var(--sage-600)',
        marginTop: 2
      }
    }), /*#__PURE__*/React.createElement("span", null, s.basis ? `For “${s.basis}”: ` : '', m.why.slice(0, 2).join(' · '))), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: 10,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, review ? /*#__PURE__*/React.createElement(ReviewActions, {
      size: "s",
      onReject: () => a.openSheet({
        type: 'reject',
        day: s.day
      }),
      onSwap: () => a.openSheet({
        type: 'swap',
        day: s.day
      }),
      onApprove: () => a.keep(s.day)
    }) : /*#__PURE__*/React.createElement(Votes, {
      a: a,
      s: s
    })))));
  }
  function ApproveBar({
    a
  }) {
    const pend = a.slots.filter(s => s.kind === 'cook' && s.status === 'suggested').length;
    if (a.approved) return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 'var(--radius-m)',
        background: 'var(--sage-50)',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circle-check",
      size: 20,
      style: {
        color: 'var(--sage-600)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: '400 13px/1.4 var(--font-sans)',
        color: 'var(--sage-900)'
      }
    }, /*#__PURE__*/React.createElement("b", null, "Approved by ", a.approved, "."), " Swaps are still welcome; the list updates with them."));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'sticky',
        bottom: -8,
        zIndex: 4,
        margin: '20px -20px 0',
        padding: '12px 20px 14px',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--blur-glass)',
        WebkitBackdropFilter: 'var(--blur-glass)',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "l",
      variant: "accent",
      fullWidth: true,
      icon: "circle-check",
      onClick: a.approveWeek
    }, pend ? `Keep the other ${pend} and approve` : 'Approve the week'));
  }
  function PlanA() {
    const a = useApp();
    const cook = a.slots.filter(s => s.kind === 'cook');
    const pend = cook.filter(s => s.status === 'suggested').length;
    return /*#__PURE__*/React.createElement(Screen, null, /*#__PURE__*/React.createElement(LargeTitle, {
      overline: a.D.week,
      title: "The plan",
      sub: pend ? `Café suggested meals around this week's ${a.store.name} deals. ${pend} still need someone to keep, swap, or turn down.` : 'Every meal has been looked at by someone in the house.',
      right: /*#__PURE__*/React.createElement(IconButton, {
        icon: "sparkles",
        label: "Ask Caf\xE9",
        onClick: () => a.openSheet({
          type: 'chat'
        })
      })
    }), a.approved && /*#__PURE__*/React.createElement(ApproveBar, {
      a: a
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, a.slots.map(s => /*#__PURE__*/React.createElement(SlotCard, {
      key: s.day,
      a: a,
      s: s
    }))), /*#__PURE__*/React.createElement(UpNext, {
      a: a
    }), !a.approved && /*#__PURE__*/React.createElement(ApproveBar, {
      a: a
    }));
  }
  function UpNext({
    a
  }) {
    if (!a.queue.length) return null;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Up next",
      aside: "Recipe box",
      onAside: () => a.setTab('recipes')
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 13px/1.45 var(--font-sans)',
        color: 'var(--text-muted)',
        margin: '-4px 0 10px'
      }
    }, "Meals the house wants soon. Caf\xE9 plans from these first; tap one to put it on a night."), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        padding: '0 14px'
      }
    }, a.queue.map((q, i) => /*#__PURE__*/React.createElement(ListRow, {
      key: q.meal,
      icon: "list",
      iconColor: "var(--sage-700)",
      title: a.D.meals[q.meal].title,
      sub: `Added by ${q.by}`,
      onClick: () => a.openSheet({
        type: 'schedule',
        meal: q.meal
      }),
      last: i === a.queue.length - 1,
      right: /*#__PURE__*/React.createElement(IconButton, {
        icon: "x",
        label: "Remove",
        size: "s",
        onClick: e => {
          e.stopPropagation();
          a.queueRemove(q.meal);
        }
      })
    }))));
  }
  function PlanB() {
    const a = useApp();
    const [overview, setOverview] = React.useState(false);
    const queue = a.slots.filter(s => s.kind === 'cook' && (s.status === 'suggested' || s.status === 'thinking'));
    const total = a.slots.filter(s => s.kind === 'cook').length;
    const s = queue[0];
    if (!s || overview) return /*#__PURE__*/React.createElement(Screen, null, /*#__PURE__*/React.createElement(LargeTitle, {
      overline: a.D.week,
      title: queue.length ? 'The whole week' : 'All reviewed',
      sub: queue.length ? `${queue.length} left to review.` : 'Every suggestion has been kept, swapped or turned down. Change anything below, then approve.',
      right: queue.length ? /*#__PURE__*/React.createElement(Button, {
        size: "s",
        variant: "secondary",
        onClick: () => setOverview(false)
      }, "Back to review") : null
    }), a.approved && /*#__PURE__*/React.createElement(ApproveBar, {
      a: a
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, a.slots.map(x => /*#__PURE__*/React.createElement(SlotCard, {
      key: x.day,
      a: a,
      s: x
    }))), /*#__PURE__*/React.createElement(UpNext, {
      a: a
    }), !a.approved && /*#__PURE__*/React.createElement(ApproveBar, {
      a: a
    }));
    const m = s.meal && a.D.meals[s.meal];
    const done = total - queue.length;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Screen, {
      bottom: 190
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '8px 0 16px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'grid',
        gridTemplateColumns: `repeat(${total}, 1fr)`,
        gap: 4
      }
    }, Array.from({
      length: total
    }, (_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        height: 4,
        borderRadius: 2,
        background: i < done ? 'var(--sage-500)' : i === done ? 'var(--char-900)' : 'var(--linen-300)'
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 12px/1 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, done + 1, " of ", total), /*#__PURE__*/React.createElement(Button, {
      size: "s",
      variant: "ghost",
      onClick: () => setOverview(true)
    }, "Whole week"), /*#__PURE__*/React.createElement(IconButton, {
      icon: "sparkles",
      label: "Ask Caf\xE9",
      size: "s",
      onClick: () => a.openSheet({
        type: 'chat'
      })
    })), s.status === 'thinking' ? /*#__PURE__*/React.createElement(Card, {
      padding: "l"
    }, /*#__PURE__*/React.createElement(Thinking, {
      basis: s.basis
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MealPhoto, {
      height: 190
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 12,
        left: 12,
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(DayTag, {
      day: s.day
    }), m.onSale && /*#__PURE__*/React.createElement(Badge, {
      tone: "sale",
      variant: "solid",
      icon: "tag"
    }, "On sale"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement(SuggestedTag, {
      style: {
        alignSelf: 'flex-start'
      }
    }), /*#__PURE__*/React.createElement("h1", {
      onClick: () => a.push({
        type: 'meal',
        day: s.day
      }),
      style: {
        font: '300 30px/1.1 var(--font-serif)',
        letterSpacing: 'var(--ls-display)',
        color: 'var(--text-strong)',
        cursor: 'pointer'
      }
    }, m.title), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-description)',
        fontSize: 16,
        color: 'var(--text-body)'
      }
    }, m.description), /*#__PURE__*/React.createElement(Meta, {
      m: m
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Score, {
      label: "Healthy",
      value: m.healthy
    }), /*#__PURE__*/React.createElement(Score, {
      label: "Delicious",
      value: m.delicious,
      tone: "terra"
    })), /*#__PURE__*/React.createElement(Why, {
      items: m.why,
      basis: s.basis
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        font: '600 12px/1 var(--font-sans)',
        color: 'var(--text-muted)',
        marginBottom: 8
      }
    }, "The house so far"), /*#__PURE__*/React.createElement(Votes, {
      a: a,
      s: s
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 84,
        zIndex: 20,
        padding: '12px 20px',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--blur-glass)',
        WebkitBackdropFilter: 'var(--blur-glass)',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(ReviewActions, {
      size: "l",
      onReject: () => a.openSheet({
        type: 'reject',
        day: s.day
      }),
      onSwap: () => a.openSheet({
        type: 'swap',
        day: s.day
      }),
      onApprove: () => a.keep(s.day)
    })));
  }
  Object.assign(window, {
    PlanA,
    PlanB,
    SlotCard,
    MealMeta: Meta
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/PlanScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/RecipesScreen.jsx
try { (() => {
(() => {
  const {
    Button,
    Input,
    ChoiceChips,
    Stars,
    Sheet,
    PhotoTile,
    Card,
    Icon
  } = window.CafeLaurenDesignSystem_9f0e0a;
  const MEAL_IDS = ['tacos', 'soup', 'shrimp', 'meatballs'];
  const DRAFT = {
    title: 'Slow Cooker Chicken Tortilla Soup',
    description: 'The family tortilla soup, adapted for a morning start so it’s ready at dinner.',
    method: 'Slow cooker',
    time: '6 hr (15 min hands-on)',
    cost: '~$15',
    healthy: 8,
    delicious: 8,
    why: ['Based on your Instant Pot Tortilla Soup (5 stars)', 'Same ingredients, longer low cook', 'Amounts sized for 5 + 2 days of leftovers'],
    ingredients: [['2.5 lbs', 'chicken thighs', 'list'], ['1', 'onion, diced', 'list'], ['1 can', 'black beans', 'sale'], ['1 can', 'fire-roasted tomatoes', 'list'], ['1 can', 'corn', 'list'], ['4 cups', 'chicken broth', 'list'], ['1 tbsp', 'chili powder', 'have'], ['2', 'limes', 'sale']],
    steps: [['Add <b>2.5 lbs chicken thighs</b>, <b>1 diced onion</b>, <b>1 can black beans</b>, <b>1 can tomatoes</b>, <b>1 can corn</b> and <b>4 cups broth</b> to the slow cooker.', null], ['Season with <b>1 tbsp chili powder</b>, <b>1 tsp cumin</b>, salt and pepper.', null], ['Cook on Low.', '6 hr'], ['Shred the chicken with two forks, stir in <b>juice of 2 limes</b>.', null]],
    leftovers: 'Day 2: over rice for a tortilla soup bowl'
  };
  function RecipesScreen() {
    const a = useApp();
    const [q, setQ] = React.useState('');
    const [f, setF] = React.useState('All');
    const list = a.recipes.filter(r => (f === 'All' || (f === '5 stars' ? r.stars === 5 : r.tags.includes(f))) && r.title.toLowerCase().includes(q.toLowerCase()));
    return /*#__PURE__*/React.createElement(Screen, null, /*#__PURE__*/React.createElement(LargeTitle, {
      overline: `${a.recipes.length} family recipes`,
      title: "Recipe box",
      right: /*#__PURE__*/React.createElement(Button, {
        size: "s",
        icon: "plus",
        onClick: () => a.openSheet({
          type: 'add'
        })
      }, "Add")
    }), /*#__PURE__*/React.createElement(Input, {
      icon: "search",
      value: q,
      onChange: e => setQ(e.target.value),
      placeholder: "Search recipes"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '14px -20px 8px',
        padding: '0 20px',
        overflowX: 'auto'
      }
    }, /*#__PURE__*/React.createElement(ChoiceChips, {
      size: "s",
      multi: false,
      value: f,
      onChange: v => setF(v || 'All'),
      options: ['All', '5 stars', 'Quick', 'Instant Pot', "Leidy's"],
      style: {
        flexWrap: 'nowrap'
      }
    })), /*#__PURE__*/React.createElement("div", null, list.map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: r.id,
      onClick: () => MEAL_IDS.includes(r.id) ? a.push({
        type: 'meal',
        mealId: r.id
      }) : a.toast({
        icon: 'book-open',
        title: r.title,
        message: 'Full recipe opens here'
      }),
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: i < list.length - 1 ? '1px solid var(--border-subtle)' : 0,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(MealPhoto, {
      height: 64,
      style: {
        width: 64,
        flex: 'none'
      },
      radius: "var(--radius-s)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 17px/1.25 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, r.title), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 12.5px/1.2 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, r.method, " \xB7 ", r.time, " \xB7 last made ", r.last), r.stars > 0 ? /*#__PURE__*/React.createElement(Stars, {
      value: r.stars,
      size: 13
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 11.5px/1 var(--font-sans)',
        color: 'var(--honey-700)'
      }
    }, "Not rated yet")), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      style: {
        color: 'var(--text-faint)'
      }
    }))), !list.length && /*#__PURE__*/React.createElement("p", {
      style: {
        padding: '24px 0',
        font: '400 14px/1.5 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, "No recipes match. Try \u201CAdd\u201D to bring one in.")));
  }
  function AddRecipeSheet({
    open
  }) {
    const a = useApp();
    const [mode, setMode] = React.useState('describe');
    const [val, setVal] = React.useState('');
    const [busy, setBusy] = React.useState(false);
    React.useEffect(() => {
      if (open) {
        setVal('');
        setBusy(false);
      }
    }, [open]);
    const go = () => {
      setBusy(true);
      setTimeout(() => {
        a.closeSheet();
        a.push({
          type: 'meal',
          draft: {
            ...DRAFT,
            title: mode === 'describe' ? DRAFT.title : 'Lemon Herb Chicken and Orzo',
            description: mode === 'describe' ? DRAFT.description : 'Imported recipe — rescaled to serve 5.'
          }
        });
      }, 1200);
    };
    const label = {
      link: 'Read the page',
      photo: 'Read the photo',
      text: 'Tidy it up',
      describe: 'Write a draft'
    }[mode];
    return /*#__PURE__*/React.createElement(Sheet, {
      open: open,
      onClose: a.closeSheet,
      title: "Add a recipe",
      subtitle: "Caf\xE9 turns it into the family format. You check it before it's saved.",
      footer: /*#__PURE__*/React.createElement(Button, {
        size: "l",
        fullWidth: true,
        icon: "sparkles",
        disabled: busy || mode !== 'photo' && !val.trim(),
        onClick: go
      }, busy ? 'Working on it…' : label)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(ChoiceChips, {
      size: "s",
      multi: false,
      value: mode,
      onChange: v => v && setMode(v),
      options: [{
        value: 'describe',
        label: 'Describe it',
        icon: 'sparkles'
      }, {
        value: 'link',
        label: 'Link',
        icon: 'arrow-right'
      }, {
        value: 'photo',
        label: 'Photo',
        icon: 'camera'
      }, {
        value: 'text',
        label: 'Paste text',
        icon: 'clipboard-list'
      }]
    }), mode === 'link' && /*#__PURE__*/React.createElement(Input, {
      icon: "search",
      value: val,
      onChange: e => setVal(e.target.value),
      placeholder: "https://"
    }), mode === 'photo' && /*#__PURE__*/React.createElement(PhotoTile, {
      empty: true,
      aspect: "16 / 9",
      label: "Snap a cookbook page or recipe card"
    }), mode === 'text' && /*#__PURE__*/React.createElement(Input, {
      multiline: true,
      rows: 6,
      value: val,
      onChange: e => setVal(e.target.value),
      placeholder: "Paste the recipe here"
    }), mode === 'describe' && /*#__PURE__*/React.createElement(Input, {
      multiline: true,
      rows: 4,
      value: val,
      onChange: e => setVal(e.target.value),
      placeholder: "Our tortilla soup, but in the slow cooker so it's ready when we get home"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 8,
        font: '400 12.5px/1.45 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 14,
      style: {
        marginTop: 2
      }
    }), "Every amount is bolded in the step where it's used, sized for 5.")));
  }
  Object.assign(window, {
    RecipesScreen,
    AddRecipeSheet
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/RecipesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/Shell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    Icon,
    IconButton,
    Avatar,
    TabBar,
    Toast
  } = window.CafeLaurenDesignSystem_9f0e0a;
  function Screen({
    children,
    bottom = 110,
    style
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "clm-scroll",
      style: {
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none',
        padding: `58px 20px ${bottom}px`,
        ...style
      },
      "data-comment-anchor": "6a082210ae-div-5-10"
    }, children);
  }
  function LargeTitle({
    overline,
    title,
    right,
    sub
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        margin: '8px 0 20px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 28
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)'
      }
    }, overline), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4
      }
    }, right)), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: '300 36px/1.05 var(--font-serif)',
        letterSpacing: 'var(--ls-display)',
        color: 'var(--text-strong)'
      }
    }, title), sub && /*#__PURE__*/React.createElement("p", {
      style: {
        font: '400 14px/1.45 var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, sub));
  }
  function BackHeader({
    title,
    onBack,
    right
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'sticky',
        top: -58,
        zIndex: 5,
        margin: '-58px -20px 12px',
        padding: '54px 12px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--blur-glass)',
        WebkitBackdropFilter: 'var(--blur-glass)',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "chevron-left",
      label: "Back",
      onClick: onBack
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        font: '600 15px/1.2 var(--font-sans)',
        color: 'var(--text-strong)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, title), right);
  }
  function SectionHead({
    title,
    aside,
    onAside
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 12,
        margin: '28px 0 12px'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: '400 22px/1.2 var(--font-serif)',
        color: 'var(--text-strong)'
      }
    }, title), aside && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onAside,
      style: {
        background: 'none',
        border: 0,
        padding: 0,
        cursor: onAside ? 'pointer' : 'default',
        font: '600 13px/1 var(--font-sans)',
        color: onAside ? 'var(--sage-700)' : 'var(--text-muted)'
      }
    }, aside));
  }
  function MealPhoto({
    height = 160,
    radius = 'var(--radius-m)',
    children,
    style
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height,
        borderRadius: radius,
        background: 'var(--linen-200)',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--linen-400)',
        ...style
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "cooking-pot",
      size: Math.min(44, height / 3),
      stroke: 1.25
    }), children);
  }
  function Why({
    items,
    basis
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '12px 14px',
        borderRadius: 'var(--radius-s)',
        background: 'var(--sage-50)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: '600 12px/1 var(--font-sans)',
        color: 'var(--sage-700)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 13,
      stroke: 2
    }), "Why Caf\xE9 suggested this"), basis && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 13px/1.4 var(--font-sans)',
        color: 'var(--sage-900)'
      }
    }, "You said: \u201C", basis, "\u201D"), items.map(w => /*#__PURE__*/React.createElement("span", {
      key: w,
      style: {
        font: '400 13px/1.4 var(--font-sans)',
        color: 'var(--text-body)'
      }
    }, "\xB7 ", w)));
  }
  function ListRow({
    icon,
    iconColor,
    title,
    sub,
    right,
    onClick,
    last
  }) {
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClick,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 56,
        padding: '10px 0',
        borderBottom: last ? 0 : '1px solid var(--border-subtle)',
        cursor: onClick ? 'pointer' : undefined
      }
    }, icon && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 36,
        flex: 'none',
        borderRadius: 'var(--radius-s)',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--linen-100)',
        color: iconColor || 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 15px/1.3 var(--font-sans)',
        color: 'var(--text-strong)'
      }
    }, title), sub && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 13px/1.35 var(--font-sans)',
        color: 'var(--text-muted)'
      }
    }, sub)), right, onClick && !right && /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      style: {
        color: 'var(--text-faint)'
      }
    }));
  }
  function BottomBar({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        display: 'flex',
        gap: 8,
        padding: '12px 20px 30px',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--blur-glass)',
        WebkitBackdropFilter: 'var(--blur-glass)',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, children);
  }
  function AskFab({
    onClick
  }) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClick,
      style: {
        position: 'absolute',
        right: 16,
        bottom: 100,
        zIndex: 25,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 48,
        padding: '0 18px 0 14px',
        borderRadius: 999,
        border: 0,
        cursor: 'pointer',
        background: 'var(--char-900)',
        color: 'var(--linen-50)',
        boxShadow: 'var(--shadow-3)',
        font: '600 14px/1 var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 18,
      style: {
        color: 'var(--sage-300)'
      }
    }), "Ask Caf\xE9");
  }
  function PhoneApp({
    homeVariant,
    planVariant
  }) {
    const a = useApp();
    const top = a.stack[a.stack.length - 1];
    const newReq = a.requests.filter(r => r.status === 'new').length + (a.pantryDone ? 0 : 1);
    const pending = a.slots.filter(s => s.kind === 'cook' && (s.status === 'suggested' || s.status === 'thinking')).length;
    const listLeft = a.list.flatMap(s => s.items).filter(i => !a.checked[i.key]).length;
    const tabs = [{
      id: 'home',
      label: 'Home',
      icon: 'house'
    }, {
      id: 'plan',
      label: 'Plan',
      icon: 'calendar-days',
      badge: pending || null
    }, {
      id: 'list',
      label: 'List',
      icon: 'shopping-basket',
      badge: a.diff.length ? '!' : null
    }, {
      id: 'recipes',
      label: 'Recipes',
      icon: 'book-open'
    }, {
      id: 'inbox',
      label: 'Inbox',
      icon: 'message-circle',
      badge: newReq || null
    }];
    let body;
    if (top) body = top.type === 'meal' ? /*#__PURE__*/React.createElement(MealDetail, top) : top.type === 'pantry' ? /*#__PURE__*/React.createElement(PantryReview, null) : top.type === 'order' ? /*#__PURE__*/React.createElement(OrderReview, null) : /*#__PURE__*/React.createElement(Tracking, null);else body = a.tab === 'home' ? homeVariant === 'B' ? /*#__PURE__*/React.createElement(HomeB, null) : /*#__PURE__*/React.createElement(HomeA, null) : a.tab === 'plan' ? planVariant === 'B' ? /*#__PURE__*/React.createElement(PlanB, null) : /*#__PURE__*/React.createElement(PlanA, null) : a.tab === 'list' ? /*#__PURE__*/React.createElement(ListScreen, {
      left: listLeft
    }) : a.tab === 'recipes' ? /*#__PURE__*/React.createElement(RecipesScreen, null) : /*#__PURE__*/React.createElement(InboxScreen, null);
    const s = a.sheet;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%',
        background: 'var(--surface-page)',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)'
      }
    }, body, !top && a.tab !== 'plan' && /*#__PURE__*/React.createElement(AskFab, {
      onClick: () => a.openSheet({
        type: 'chat'
      })
    }), !top && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30
      }
    }, /*#__PURE__*/React.createElement(TabBar, {
      items: tabs,
      value: a.tab,
      onChange: a.setTab
    })), /*#__PURE__*/React.createElement(SwapSheet, {
      open: s && s.type === 'swap',
      day: s && s.day
    }), /*#__PURE__*/React.createElement(RejectSheet, {
      open: s && s.type === 'reject',
      day: s && s.day
    }), /*#__PURE__*/React.createElement(EditMealSheet, {
      open: s && s.type === 'edit',
      day: s && s.day
    }), /*#__PURE__*/React.createElement(AddRecipeSheet, {
      open: s && s.type === 'add'
    }), /*#__PURE__*/React.createElement(ScheduleSheet, {
      open: s && s.type === 'schedule',
      meal: s && s.meal
    }), /*#__PURE__*/React.createElement(ChatSheet, {
      open: s && s.type === 'chat'
    }), /*#__PURE__*/React.createElement(StoreSheet, {
      open: s && s.type === 'store'
    }), /*#__PURE__*/React.createElement(SendSheet, {
      open: s && s.type === 'send'
    }), a.toastState && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 12,
        right: 12,
        top: 56,
        zIndex: 120,
        display: 'flex',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Toast, _extends({}, a.toastState, {
      style: {
        width: '100%'
      }
    }))));
  }
  Object.assign(window, {
    Screen,
    LargeTitle,
    BackHeader,
    SectionHead,
    MealPhoto,
    Why,
    ListRow,
    BottomBar,
    AskFab,
    PhoneApp
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/data.js
try { (() => {
window.CLM = {
  week: 'Week of August 24',
  people: {
    lauren: {
      name: 'Lauren',
      color: 'sage'
    },
    joe: {
      name: 'Joe',
      color: 'slate'
    },
    leidy: {
      name: 'Leidy',
      color: 'terra'
    }
  },
  meals: {
    tacos: {
      title: 'Taco Tuesday',
      description: 'Al pastor pork tacos with queso fresco, lettuce, tomato, salsa — with black beans and sweet corn sides.',
      method: 'Skillet',
      time: '30 min',
      healthy: 7,
      delicious: 9,
      cost: '~$22',
      stars: 5,
      onSale: true,
      why: ['5-star family favorite', 'Al pastor pork on sale, $3.49/lb', 'Leftovers cover Tuesday'],
      leftovers: 'Tue: taco-salad bowls with beans, corn, crushed chips',
      ingredients: [['2 lbs', 'marinated pork taco meat', 'sale'], ['12', 'small tortillas', 'list'], ['1 head', 'lettuce', 'list'], ['1', 'queso fresco 10 oz', 'sale'], ['1 jar', 'salsa', 'sale'], ['1 can', 'black beans', 'list'], ['6 ears', 'sweet corn', 'sale']]
    },
    chops: {
      title: 'Sheet Pan Pork Chops with Roasted Veggies',
      description: 'Center-cut pork chops roasted with potatoes, green beans and onion, seasoned with smoked paprika and thyme.',
      method: 'Sheet pan',
      time: '40 min',
      healthy: 8,
      delicious: 8,
      cost: '~$18',
      onSale: true,
      why: ['Pork chops on sale, $2.29/lb', 'One pan, 10 min hands-on', 'Yukon golds 99¢/lb'],
      leftovers: 'Slice over a green salad, or chop into fried rice',
      ingredients: [['5', 'center-cut pork chops', 'sale'], ['1.5 lbs', 'Yukon gold potatoes', 'sale'], ['1 lb', 'green beans', 'list'], ['1', 'white onion', 'list'], ['2 tsp', 'smoked paprika', 'have'], ['1 tsp', 'dried thyme', 'have'], ['3 tbsp', 'olive oil', 'have']]
    },
    shrimp: {
      title: 'Basil Shrimp with Feta and Orzo',
      description: 'Warm orzo tossed with tomatoes, green onion, basil, lemon, feta and sautéed shrimp.',
      method: 'Skillet',
      time: '30 min',
      healthy: 8,
      delicious: 9,
      cost: '~$26',
      stars: 5,
      onSale: true,
      why: ['Joe asked for it Monday', 'XL shrimp on sale, $9.99/lb', '5-star favorite'],
      leftovers: 'Sat lunch: serve cold as an orzo salad',
      ingredients: [['1.5 lbs', 'XL shrimp 16/20', 'sale'], ['1 lb', 'orzo', 'list'], ['1.5 lbs', 'ripe tomatoes', 'list'], ['1 bunch', 'fresh basil', 'list'], ['6 oz', 'feta', 'list'], ['2', 'lemons', 'sale']]
    },
    chicken: {
      title: 'Sheet Pan Citrus Chicken Thighs',
      description: 'Boneless thighs roasted with orange and lemon, garlic, Roma tomatoes and green beans.',
      method: 'Sheet pan',
      time: '45 min',
      healthy: 8,
      delicious: 8,
      cost: '~$20',
      why: ['Lemons 99¢/lb', 'Makes 2 days of leftovers', 'Favorite protein: thighs'],
      leftovers: 'Sun: shred into wraps with deli cheese',
      ingredients: [['2 lbs', 'boneless chicken thighs', 'list'], ['2', 'navel oranges', 'list'], ['1 lb', 'Roma tomatoes', 'list'], ['1 lb', 'green beans', 'list'], ['1 head', 'garlic', 'list']]
    },
    salmon: {
      title: 'Sheet Pan Salmon with Lemon Potatoes',
      description: 'Salmon fillets roasted over crispy lemon potatoes and green beans.',
      method: 'Sheet pan',
      time: '35 min',
      healthy: 9,
      delicious: 8,
      cost: '~$30',
      onSale: true,
      why: ['You asked for salmon on Wednesday', 'Atlantic salmon on sale, $8.99/lb', 'Same pan and sides as the pork chops'],
      leftovers: 'Flake into rice bowls with cucumber',
      ingredients: [['2.5 lbs', 'Atlantic salmon fillet', 'sale'], ['1.5 lbs', 'Yukon gold potatoes', 'sale'], ['1 lb', 'green beans', 'list'], ['2', 'lemons', 'sale']]
    },
    meatballs: {
      title: 'Instant Pot Meatballs and Marinara',
      description: 'Frozen Italian meatballs simmered in marinara over spaghetti, with a big salad.',
      method: 'Instant Pot',
      time: '25 min',
      healthy: 6,
      delicious: 8,
      cost: '~$12',
      why: ['Uses the meatballs in the freezer', 'Ragu 2/$5 this week', 'Lowest effort option'],
      leftovers: 'Meatball subs with deli cheese',
      ingredients: [['1 tray', 'Italian meatballs', 'have'], ['1 jar', 'marinara', 'sale'], ['1 lb', 'spaghetti', 'have'], ['1 bag', 'salad greens', 'list']]
    },
    soup: {
      title: 'Instant Pot Chicken Tortilla Soup',
      description: 'Rich, spiced chicken soup with black beans, corn, and all the Tex-Mex toppings.',
      method: 'Instant Pot',
      time: '35 min',
      healthy: 8,
      delicious: 9,
      cost: '~$14',
      stars: 5,
      why: ['5-star favorite, last made in March', 'Black beans 2/$5', 'Two days of leftovers'],
      leftovers: 'Pour over rice for a tortilla soup bowl',
      ingredients: [['2.5 lbs', 'chicken thighs', 'list'], ['1 can', 'black beans', 'sale'], ['1 can', 'fire-roasted tomatoes', 'list'], ['4 cups', 'chicken broth', 'list'], ['2', 'avocados', 'list']]
    },
    tofu: {
      title: 'Bok Choy and Tofu Stir Fry',
      description: 'Crispy tofu, baby bok choy and garlic in a quick ginger-soy sauce over rice.',
      method: 'Skillet',
      time: '25 min',
      healthy: 9,
      delicious: 7,
      cost: '~$11',
      onSale: true,
      why: ['Vegetarian, as asked', 'Baby bok choy on sale, $1.49', 'Uses rice on hand'],
      leftovers: 'Fried rice with an egg',
      ingredients: [['2 blocks', 'extra-firm tofu', 'list'], ['4', 'baby bok choy', 'sale'], ['3 cloves', 'garlic', 'list'], ['2 cups', 'rice', 'have']]
    },
    stirfry: {
      title: 'Pork and Bok Choy Stir Fry',
      description: 'Ground pork, baby bok choy and garlic in a quick ginger-soy sauce over rice.',
      method: 'Skillet',
      time: '20 min',
      healthy: 8,
      delicious: 7,
      cost: '~$13',
      onSale: true,
      why: ['Quickest option, 20 min', 'Ground pork $2.99/lb, bok choy $1.49', 'Uses rice on hand'],
      leftovers: 'Fried rice with an egg',
      ingredients: [['2 lbs', 'ground pork', 'sale'], ['4', 'baby bok choy', 'sale'], ['3 cloves', 'garlic', 'list'], ['2 cups', 'rice', 'have']]
    }
  },
  slots: [{
    day: 'mon',
    meal: 'tacos',
    kind: 'cook',
    status: 'kept',
    by: 'Lauren',
    votes: {
      lauren: 'up',
      joe: 'up'
    }
  }, {
    day: 'tue',
    kind: 'leftover',
    text: 'Taco leftovers → taco-salad bowls'
  }, {
    day: 'wed',
    meal: 'chops',
    kind: 'cook',
    status: 'suggested',
    votes: {
      joe: 'up'
    }
  }, {
    day: 'thu',
    kind: 'leidy',
    text: 'Leidy cooks',
    cook: 'Leidy'
  }, {
    day: 'fri',
    meal: 'shrimp',
    kind: 'cook',
    status: 'kept',
    by: 'Joe',
    votes: {
      lauren: 'up',
      joe: 'up',
      leidy: 'up'
    }
  }, {
    day: 'sat',
    meal: 'chicken',
    kind: 'cook',
    status: 'suggested',
    votes: {
      lauren: 'up',
      joe: 'down'
    }
  }, {
    day: 'sun',
    kind: 'leftover',
    text: 'Chicken leftovers → wraps'
  }],
  alternatives: ['salmon', 'stirfry', 'meatballs', 'soup'],
  rejectReasons: ['Too much work', 'Had it recently', "Kids won't eat it", 'Too pricey', 'Not in the mood', 'Missing equipment'],
  swapPrefs: ['Weekly specials', 'Quicker', 'Lighter', 'Kid-friendly', 'Use what we have', 'Cheaper', 'Different protein'],
  requests: [{
    id: 1,
    who: 'joe',
    type: 'meal',
    text: 'Can we do the basil shrimp again? The kids actually ate it.',
    when: 'Mon',
    status: 'planned',
    reply: 'Planned for Friday'
  }, {
    id: 2,
    who: 'leidy',
    type: 'out',
    text: 'Out of cornstarch and the big yogurt',
    when: 'Tue',
    status: 'planned',
    reply: 'Added to the list'
  }, {
    id: 3,
    who: 'lauren',
    type: 'meal',
    text: 'Something with salmon — it was on sale last time',
    when: 'Wed',
    status: 'new'
  }, {
    id: 4,
    who: 'joe',
    type: 'out',
    text: 'Soda water',
    when: 'Thu',
    status: 'new'
  }, {
    id: 5,
    who: 'leidy',
    type: 'meal',
    text: 'I can make arroz con pollo Thursday',
    when: 'Thu',
    status: 'new'
  }],
  photos: [{
    src: '../../assets/photos/pantry-1.jpg',
    label: 'Pantry shelf',
    meta: 'Today · 9 items'
  }, {
    src: '../../assets/photos/pantry-2.jpg',
    label: 'Pantry, lower',
    meta: 'Today · 6 items'
  }, {
    src: '../../assets/photos/pantry-3.jpg',
    label: 'Freezer',
    meta: 'Today · 8 items'
  }],
  pantry: [{
    id: 'p1',
    area: 'Freezer',
    name: 'Chicken breasts',
    qty: '~2 lbs',
    sure: true
  }, {
    id: 'p2',
    area: 'Freezer',
    name: 'Cooked shrimp, 26–30 count',
    qty: '1 lb bag',
    sure: true
  }, {
    id: 'p3',
    area: 'Freezer',
    name: 'Italian style meatballs',
    qty: '1 tray',
    sure: true
  }, {
    id: 'p4',
    area: 'Freezer',
    name: 'Peas & carrots',
    qty: '1 bag',
    sure: true
  }, {
    id: 'p5',
    area: 'Freezer',
    name: 'Ground taco meat?',
    qty: '1 package',
    sure: false,
    note: 'Purple and yellow package, right side'
  }, {
    id: 'p6',
    area: 'Pantry',
    name: 'Rice-A-Roni, chicken',
    qty: '1–2 boxes',
    sure: false
  }, {
    id: 'p7',
    area: 'Pantry',
    name: "Zatarain's yellow rice",
    qty: '1 box',
    sure: true
  }, {
    id: 'p8',
    area: 'Pantry',
    name: 'Albacore tuna',
    qty: '1 can',
    sure: true
  }, {
    id: 'p9',
    area: 'Pantry',
    name: 'Barilla spaghetti',
    qty: '1 box',
    sure: true
  }, {
    id: 'p10',
    area: 'Pantry',
    name: 'Cream of chicken soup',
    qty: '1 can',
    sure: true
  }],
  recipes: [{
    id: 'tacos',
    title: 'Taco Tuesday',
    stars: 5,
    method: 'Skillet',
    time: '30 min',
    last: 'Aug 24',
    tags: ['5 stars', 'Quick']
  }, {
    id: 'chili',
    title: "Lauren's Chili",
    stars: 5,
    method: 'Le Creuset',
    time: '60 min',
    last: 'Feb 23',
    tags: ['5 stars']
  }, {
    id: 'soup',
    title: 'Instant Pot Chicken Tortilla Soup',
    stars: 5,
    method: 'Instant Pot',
    time: '35 min',
    last: 'Mar 9',
    tags: ['5 stars', 'Instant Pot']
  }, {
    id: 'shrimp',
    title: 'Basil Shrimp with Feta and Orzo',
    stars: 5,
    method: 'Skillet',
    time: '30 min',
    last: 'Aug 28',
    tags: ['5 stars', 'Quick']
  }, {
    id: 'couscous',
    title: 'Mediterranean Couscous Salad with Grilled Chicken',
    stars: 4,
    method: 'Skillet',
    time: '25 min',
    last: 'Mar 9',
    tags: ['Quick']
  }, {
    id: 'lecreuset',
    title: 'Le Creuset Chicken',
    stars: 4,
    method: 'Le Creuset',
    time: '45 min',
    last: 'Jan 30',
    tags: []
  }, {
    id: 'arroz',
    title: 'Arroz con Pollo',
    stars: 4,
    method: 'Le Creuset',
    time: '55 min',
    last: 'Mar 1',
    tags: ["Leidy's"]
  }, {
    id: 'meatballs',
    title: 'Instant Pot Meatballs and Marinara',
    stars: 3,
    method: 'Instant Pot',
    time: '25 min',
    last: 'Feb 2',
    tags: ['Instant Pot', 'Quick']
  }],
  cart: [{
    id: 'c1',
    item: '2 lbs pork taco meat',
    product: 'Cermak Marinated Al Pastor Pork',
    size: '2 lb',
    price: 6.98,
    sure: true
  }, {
    id: 'c2',
    item: '5 pork chops',
    product: 'Center Cut Pork Chops, bone-in',
    size: '2.5 lb',
    price: 5.73,
    sure: false,
    note: 'You usually buy boneless'
  }, {
    id: 'c3',
    item: '1.5 lbs XL shrimp',
    product: 'XL Cooked Shrimp 16/20',
    size: '1.5 lb',
    price: 14.99,
    sure: true
  }, {
    id: 'c4',
    item: '1 queso fresco',
    product: 'El Mexicano Queso Fresco',
    size: '10 oz',
    price: 1.99,
    sure: true
  }, {
    id: 'c5',
    item: '1 lb orzo',
    product: 'Barilla Orzo',
    size: '16 oz',
    price: 2.49,
    sure: true
  }, {
    id: 'c6',
    item: 'Yogurt',
    product: 'Chobani Plain Greek Yogurt',
    size: '32 oz',
    price: 6.49,
    sure: false,
    note: 'Leidy asked for "the big yogurt"'
  }],
  stores: [{
    id: 'cermak',
    name: 'Cermak Produce',
    ad: 'Aug 13–26',
    deals: 38
  }, {
    id: 'aldi',
    name: 'Aldi',
    ad: 'Aug 20–26',
    deals: 22
  }, {
    id: 'amazon',
    name: 'Amazon Fresh',
    ad: 'This week',
    deals: 31
  }],
  orderVia: [{
    id: 'delivery',
    label: 'Instacart delivery',
    sub: 'Cermak or Aldi · usually Saturday morning',
    icon: 'truck'
  }, {
    id: 'pickup',
    label: 'Instacart pickup',
    sub: 'Ready at the store',
    icon: 'store'
  }, {
    id: 'amazon',
    label: 'Amazon delivery',
    sub: 'Amazon Fresh / Whole Foods',
    icon: 'package'
  }, {
    id: 'share',
    label: 'Send the list to someone',
    sub: 'Text, email or the Notion page',
    icon: 'send'
  }, {
    id: 'self',
    label: "We'll shop it ourselves",
    sub: 'Check off by aisle in the store',
    icon: 'shopping-basket'
  }],
  cartMore: 32,
  cartTotal: 148.2,
  chatStarters: ['Make Thursday vegetarian', 'We have leftover rice', 'Something cheaper than shrimp', 'What can Leidy make?']
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/data.js", error: String((e && e.message) || e) }); }

// ui_kits/mobile/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return (
    /*#__PURE__*/
    // data-om-starter: inert presence marker — Claude Design's starter-usage
    // probe reads it; it renders nothing. Keep it on this root element.
    React.createElement("div", {
      "data-om-starter": "ios-frame",
      style: {
        width,
        height,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        background: dark ? '#000' : '#F2F2F7',
        boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
        fontFamily: '-apple-system, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 11,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 126,
        height: 37,
        borderRadius: 24,
        background: '#000',
        zIndex: 50
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }
    }, /*#__PURE__*/React.createElement(IOSStatusBar, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
      title: title,
      dark: dark
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto'
      }
    }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        height: 34,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 8,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 139,
        height: 5,
        borderRadius: 100,
        background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
      }
    })))
  );
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/store.jsx
try { (() => {
(() => {
  const D = window.CLM;
  const SHORT = {
    tofu: 'Tofu stir fry',
    tacos: 'Tacos',
    chops: 'Pork chops',
    shrimp: 'Basil shrimp',
    chicken: 'Citrus chicken',
    salmon: 'Salmon',
    meatballs: 'Meatballs',
    soup: 'Tortilla soup',
    stirfry: 'Stir fry'
  };
  const SECTIONS = [{
    name: 'Produce',
    icon: 'carrot',
    kw: ['tofu', 'green beans', 'lettuce', 'corn', 'potato', 'onion', 'tomato', 'basil', 'lemon', 'orange', 'garlic', 'bok choy', 'avocado', 'salad', 'banana', 'lime']
  }, {
    name: 'Frozen',
    icon: 'snowflake',
    kw: ['frozen']
  }, {
    name: 'Meat / Deli / Bakery',
    icon: 'beef',
    kw: ['pork', 'chicken', 'shrimp', 'salmon', 'meatball', 'bread', 'tortillas']
  }, {
    name: 'Dry Goods / Canned',
    icon: 'wheat',
    kw: ['beans', 'salsa', 'orzo', 'spaghetti', 'marinara', 'broth', 'rice', 'cornstarch', 'tomatoes']
  }, {
    name: 'Dairy / Eggs',
    icon: 'milk',
    kw: ['queso', 'feta', 'yogurt', 'cheese', 'milk', 'egg']
  }, {
    name: 'Beverages',
    icon: 'cup-soda',
    kw: ['soda']
  }];
  const sectionOf = n => {
    const s = n.toLowerCase();
    if (s.includes('fire-roasted')) return 'Dry Goods / Canned';
    return (SECTIONS.find(x => x.kw.some(k => s.includes(k))) || SECTIONS[3]).name;
  };
  const STAPLES = [{
    name: 'Bananas'
  }, {
    name: 'Eggs'
  }, {
    name: 'Milk'
  }, {
    name: 'Bread'
  }, {
    name: 'Frozen fruit'
  }, {
    name: 'Soda water',
    from: 'Joe'
  }, {
    name: 'Yogurt',
    from: 'Leidy'
  }, {
    name: 'Cornstarch',
    from: 'Leidy'
  }];
  function addQty(a, b) {
    const p = q => {
      const m = String(q).match(/^([\d.]+)\s*(.*)$/);
      return m ? [parseFloat(m[1]), m[2]] : null;
    };
    const x = p(a),
      y = p(b);
    if (x && y && x[1].replace(/s$/, '') === y[1].replace(/s$/, '')) {
      const n = Math.round((x[0] + y[0]) * 100) / 100;
      const u = x[1].replace(/s$/, '');
      return n + (u ? ' ' + u + (n > 1 && /^(lb|can|jar|bag|cup|ear|head|bunch|block|tray|clove)$/.test(u) ? u === 'bunch' ? 'es' : 's' : '') : '');
    }
    return a + ' + ' + b;
  }
  function buildList(slots, edits = {}, adds = []) {
    const map = {};
    slots.forEach(s => {
      if (s.kind !== 'cook' || !s.meal) return;
      const m = D.meals[s.meal];
      m.ingredients.forEach(([qty, name, tag]) => {
        if (tag === 'have') return;
        const k = name.toLowerCase();
        if (map[k]) {
          map[k].qty = addQty(map[k].qty, qty);
          map[k].note += ' + ' + SHORT[s.meal];
        } else map[k] = {
          key: k,
          qty,
          name,
          note: SHORT[s.meal],
          sale: tag === 'sale' ? 'On sale' : null,
          section: sectionOf(name)
        };
      });
    });
    STAPLES.forEach(st => {
      const k = st.name.toLowerCase();
      if (!map[k]) map[k] = {
        key: k,
        name: st.name,
        staple: true,
        from: st.from,
        section: sectionOf(st.name)
      };
    });
    adds.forEach(it => {
      map[it.key] = {
        ...it,
        added: true
      };
    });
    Object.entries(edits).forEach(([k, e]) => {
      if (!map[k]) return;
      if (e.removed) delete map[k];else map[k] = {
        ...map[k],
        ...e,
        edited: true
      };
    });
    return SECTIONS.map(sec => ({
      ...sec,
      items: Object.values(map).filter(i => i.section === sec.name)
    })).filter(s => s.items.length);
  }
  const Ctx = React.createContext(null);
  const CHAT = {
    'Make Thursday vegetarian': {
      text: "Thursday is Leidy's night. If she's open to it, here's a vegetarian option that uses what's on sale. It replaces nothing until you apply it.",
      proposal: {
        day: 'thu',
        meal: 'tofu',
        label: 'Thursday → Bok Choy and Tofu Stir Fry',
        detail: 'Vegetarian. Tofu, bok choy, garlic over rice. 25 min, ~$11.'
      }
    },
    'We have leftover rice': {
      text: 'Good to know. I can turn Sunday into fried rice with the leftover chicken instead of wraps, so we skip the deli cheese.',
      proposal: {
        day: 'sun',
        text: 'Chicken fried rice (leftovers)',
        label: 'Sunday → Chicken fried rice',
        detail: 'Uses leftover rice + Saturday chicken. Removes deli cheese from the list.'
      }
    },
    'Something cheaper than shrimp': {
      text: 'Shrimp is the priciest meal this week (~$26). Two cheaper ideas that keep the same Friday feel:',
      proposal: {
        day: 'fri',
        meal: 'stirfry',
        label: 'Friday → Pork and Bok Choy Stir Fry',
        detail: '~$13, 20 min. Saves about $13.'
      }
    },
    'What can Leidy make?': {
      text: "Leidy offered arroz con pollo for Thursday in the inbox. It's in the recipe box (4 stars). Want me to put it on Thursday and add her ingredients to the list?",
      proposal: {
        day: 'thu',
        text: 'Arroz con Pollo (Leidy)',
        label: 'Thursday → Arroz con Pollo',
        detail: 'Adds chicken thighs, rice, peppers, peas to the list.'
      }
    }
  };
  function AppProvider({
    user,
    children
  }) {
    const P = D.people[user];
    const [tab, setTabRaw] = React.useState(() => localStorage.getItem('clm-tab') || 'home');
    const [stack, setStack] = React.useState([]);
    const [sheet, setSheet] = React.useState(null);
    const [slots, setSlots] = React.useState(D.slots);
    const [approved, setApproved] = React.useState(null);
    const [diff, setDiff] = React.useState([]);
    const [requests, setRequests] = React.useState(D.requests);
    const [pantry, setPantry] = React.useState(D.pantry.map(p => ({
      ...p,
      state: p.sure ? 'found' : 'unsure'
    })));
    const [pantryDone, setPantryDone] = React.useState(false);
    const [recipes, setRecipes] = React.useState(D.recipes);
    const [storeId, setStoreId] = React.useState('cermak');
    const [orderVia, setOrderVia] = React.useState('delivery');
    const [listEdits, setListEdits] = React.useState({});
    const [listAdds, setListAdds] = React.useState([]);
    const [queue, setQueue] = React.useState([{
      meal: 'soup',
      by: 'Joe'
    }]);
    const [checked, setChecked] = React.useState({});
    const [cart, setCart] = React.useState({});
    const [order, setOrder] = React.useState(null);
    const [sub, setSub] = React.useState('pending');
    const [toast, setToastRaw] = React.useState(null);
    const [chat, setChat] = React.useState([{
      from: 'cafe',
      text: "Hi " + P.name + ". I can swap meals, work around what's in the fridge, or plan around a busy night. Nothing changes until you say so."
    }]);
    const tRef = React.useRef();
    const toastMsg = t => {
      setToastRaw(t);
      clearTimeout(tRef.current);
      tRef.current = setTimeout(() => setToastRaw(null), 3000);
    };
    const setTab = t => {
      setTabRaw(t);
      setStack([]);
      localStorage.setItem('clm-tab', t);
    };
    const slotOf = day => slots.find(s => s.day === day);
    const patch = (day, p) => setSlots(ss => ss.map(s => s.day === day ? {
      ...s,
      ...(typeof p === 'function' ? p(s) : p)
    } : s));
    const used = () => slots.map(s => s.meal).filter(Boolean);
    const logDiff = (removed, added) => {
      if (!approved) return;
      setDiff(d => [...d, removed && {
        sign: '−',
        text: SHORT[removed] + ' ingredients'
      }, added && {
        sign: '+',
        text: SHORT[added] + ' ingredients'
      }].filter(Boolean));
    };
    const api = {
      D,
      user,
      P,
      tab,
      setTab,
      stack,
      sheet,
      slots,
      approved,
      diff,
      requests,
      pantry,
      pantryDone,
      recipes,
      checked,
      cart,
      order,
      sub,
      queue,
      orderVia,
      store: D.stores.find(x => x.id === storeId),
      via: D.orderVia.find(x => x.id === orderVia),
      toastState: toast,
      chat,
      SHORT,
      list: buildList(slots, listEdits, listAdds),
      SECTION_NAMES: SECTIONS.map(s => s.name),
      editListItem: (key, p) => setListEdits(e => ({
        ...e,
        [key]: {
          ...e[key],
          ...p
        }
      })),
      removeListItem: (key, name) => {
        setListEdits(e => ({
          ...e,
          [key]: {
            removed: true
          }
        }));
        setListAdds(xs => xs.filter(x => x.key !== key));
        toastMsg({
          icon: 'trash-2',
          title: `Removed ${name}`
        });
      },
      addListItem: (name, qty, section) => {
        const key = 'add-' + Date.now();
        setListAdds(xs => [...xs, {
          key,
          name,
          qty,
          section: section || sectionOf(name),
          from: P.name
        }]);
        toastMsg({
          tone: 'success',
          icon: 'plus',
          title: `Added ${name}`,
          message: section || sectionOf(name)
        });
      },
      push: v => setStack(s => [...s, v]),
      pop: () => setStack(s => s.slice(0, -1)),
      openSheet: s => setSheet(s),
      closeSheet: () => setSheet(null),
      toast: toastMsg,
      slotOf,
      keep: day => {
        patch(day, s => ({
          status: 'kept',
          by: P.name,
          votes: {
            ...s.votes,
            [user]: 'up'
          }
        }));
        toastMsg({
          tone: 'success',
          icon: 'check',
          title: 'Kept',
          message: 'Others can still vote or swap it.'
        });
      },
      vote: (day, v) => patch(day, s => {
        const votes = {
          ...s.votes
        };
        if (v) votes[user] = v;else delete votes[user];
        return {
          votes
        };
      }),
      swap: (day, meal, basis) => {
        setQueue(q => q.filter(x => x.meal !== meal));
        const old = slotOf(day).meal;
        patch(day, {
          meal,
          kind: 'cook',
          status: 'edited',
          by: P.name,
          basis,
          votes: {
            [user]: 'up'
          },
          text: undefined
        });
        logDiff(old, meal);
        setSheet(null);
        toastMsg({
          icon: 'refresh-cw',
          title: 'Swapped',
          message: 'Votes reset so everyone can weigh in.'
        });
      },
      setText: (day, text) => {
        const old = slotOf(day).meal;
        patch(day, {
          meal: undefined,
          kind: 'custom',
          text,
          status: 'edited',
          by: P.name,
          votes: {}
        });
        logDiff(old, null);
      },
      reject: (day, reasons, note, mode) => {
        const old = slotOf(day).meal;
        setSheet(null);
        const basis = [...reasons, note].filter(Boolean).join(' · ');
        if (mode === 'open') {
          patch(day, {
            meal: undefined,
            kind: 'open',
            status: 'rejected',
            by: P.name,
            basis,
            votes: {}
          });
          logDiff(old, null);
          toastMsg({
            icon: 'x',
            title: 'Night left open',
            message: 'Café will remember: ' + (basis || 'no reason given')
          });
          return;
        }
        patch(day, {
          status: 'thinking',
          basis
        });
        setTimeout(() => {
          const next = D.alternatives.find(a => !used().includes(a) && a !== old) || 'meatballs';
          patch(day, {
            meal: next,
            kind: 'cook',
            status: 'suggested',
            by: undefined,
            votes: {},
            basis
          });
          logDiff(old, next);
        }, 1400);
      },
      approveWeek: () => {
        setApproved(P.name);
        setSlots(ss => ss.map(s => s.kind === 'cook' && s.status !== 'rejected' ? {
          ...s,
          status: 'approved',
          by: s.by || P.name
        } : s));
        toastMsg({
          tone: 'success',
          icon: 'circle-check',
          title: 'Week approved',
          message: 'The grocery list is ready. You can still swap anything.'
        });
      },
      moveSlot: (from, to) => {
        setSlots(ss => {
          const A = ss.find(s => s.day === from),
            B = ss.find(s => s.day === to);
          return ss.map(s => s.day === from ? {
            ...B,
            day: from
          } : s.day === to ? {
            ...A,
            day: to,
            status: A.kind === 'cook' ? 'edited' : A.status,
            by: P.name
          } : s);
        });
        setSheet(null);
        toastMsg({
          icon: 'calendar-days',
          title: 'Moved',
          message: 'Swapped with ' + to.toUpperCase()
        });
      },
      setCook: (day, who) => patch(day, {
        cook: who
      }),
      clearDiff: () => {
        setDiff([]);
        toastMsg({
          tone: 'success',
          icon: 'check',
          title: 'List updated'
        });
      },
      addRequest: r => {
        setRequests(rs => [{
          id: Date.now(),
          who: user,
          when: 'Now',
          status: 'new',
          ...r
        }, ...rs]);
        toastMsg({
          icon: 'send',
          title: 'Sent to the household',
          message: 'Café will consider it in this week\'s plan.'
        });
      },
      answerRequest: (id, status, reply) => setRequests(rs => rs.map(r => r.id === id ? {
        ...r,
        status,
        reply
      } : r)),
      setPantryItem: (id, p) => setPantry(ps => ps.map(x => x.id === id ? {
        ...x,
        ...p
      } : x)),
      addPantryItem: (name, area, qty = '') => setPantry(ps => [...ps, {
        id: 'n' + Date.now(),
        area,
        name,
        qty,
        state: 'confirmed',
        added: true
      }]),
      confirmPantry: () => {
        setPantry(ps => ps.map(p => p.state === 'found' ? {
          ...p,
          state: 'confirmed'
        } : p));
        setPantryDone(true);
        setStack([]);
        toastMsg({
          tone: 'success',
          icon: 'refrigerator',
          title: 'Pantry confirmed',
          message: "We won't buy what you already have."
        });
      },
      setStore: id => {
        if (id === storeId) return;
        const st = D.stores.find(x => x.id === id);
        setStoreId(id);
        toastMsg({
          icon: 'store',
          title: `Reading ${st.name}'s weekly ad…`
        });
        setTimeout(() => toastMsg({
          tone: 'success',
          icon: 'tag',
          title: `${st.deals} deals found`,
          message: 'Café will flag any plan changes for you to review.'
        }), 1400);
      },
      setOrderVia: id => {
        setOrderVia(id);
        if (id === 'amazon' && storeId !== 'amazon') {
          setStoreId('amazon');
          toastMsg({
            icon: 'store',
            title: 'Switched ads to Amazon Fresh',
            message: 'So the deals match where you order.'
          });
        } else if ((id === 'delivery' || id === 'pickup') && storeId === 'amazon') {
          setStoreId('cermak');
          toastMsg({
            icon: 'store',
            title: 'Switched ads to Cermak Produce',
            message: 'Amazon Fresh isn\'t on Instacart.'
          });
        }
      },
      shareList: (how, who) => {
        setSheet(null);
        toastMsg({
          tone: 'success',
          icon: 'send',
          title: how === 'notion' ? 'Notion page updated' : how === 'copy' ? 'List copied' : `List sent to ${who.join(' and ') || 'you'}`,
          message: how === 'notion' ? 'Grocery List · To Buy + Staples' : 'Checked items stay in sync here.'
        });
      },
      queueAdd: meal => {
        setQueue(q => q.some(x => x.meal === meal) ? q : [...q, {
          meal,
          by: P.name
        }]);
        toastMsg({
          tone: 'success',
          icon: 'list',
          title: 'Added to Up next',
          message: 'Café will work it into an upcoming week.'
        });
      },
      queueRemove: meal => setQueue(q => q.filter(x => x.meal !== meal)),
      addRecipe: r => {
        setRecipes(rs => [r, ...rs]);
        toastMsg({
          tone: 'success',
          icon: 'book-open',
          title: 'Saved to the recipe box'
        });
      },
      toggleCheck: k => setChecked(c => ({
        ...c,
        [k]: !c[k]
      })),
      setCartItem: (id, v) => setCart(c => ({
        ...c,
        [id]: v
      })),
      placeOrder: () => {
        setOrder('placed');
        setStack([{
          type: 'track'
        }]);
        toastMsg({
          tone: 'success',
          icon: 'truck',
          title: 'Order placed',
          message: 'Saturday, 9–11am'
        });
      },
      advanceOrder: () => setOrder(o => ({
        placed: 'shopping',
        shopping: 'delivering',
        delivering: 'delivered'
      })[o] || o),
      decideSub: v => {
        setSub(v);
        toastMsg({
          tone: v === 'approved' ? 'success' : 'neutral',
          icon: v === 'approved' ? 'check' : 'x',
          title: v === 'approved' ? 'Cotija approved' : "Refunded — we'll skip it"
        });
      },
      chatSend: text => {
        setChat(c => [...c, {
          from: 'me',
          text
        }, {
          from: 'cafe',
          typing: true
        }]);
        const r = CHAT[text] || {
          text: "Here's one way to do that. Take a look before I change anything.",
          proposal: {
            day: 'wed',
            meal: 'meatballs',
            label: 'Wednesday → Instant Pot Meatballs',
            detail: 'Uses freezer meatballs. 25 min, ~$12.'
          }
        };
        setTimeout(() => setChat(c => [...c.filter(m => !m.typing), {
          from: 'cafe',
          text: r.text,
          proposal: {
            ...r.proposal,
            state: 'pending'
          }
        }]), 1100);
      },
      resolveProposal: (i, how) => setChat(c => c.map((m, j) => {
        if (j !== i) return m;
        if (how === 'apply') {
          const p = m.proposal;
          if (p.meal) {
            const old = slots.find(s => s.day === p.day).meal;
            patch(p.day, {
              meal: p.meal,
              kind: 'cook',
              status: 'edited',
              by: P.name + ' via Café',
              votes: {
                [user]: 'up'
              }
            });
            logDiff(old, p.meal);
          } else api.setText(p.day, p.text);
          toastMsg({
            tone: 'success',
            icon: 'check',
            title: 'Plan updated',
            message: p.label
          });
        }
        return {
          ...m,
          proposal: {
            ...m.proposal,
            state: how === 'apply' ? 'applied' : 'dismissed'
          }
        };
      }))
    };
    return /*#__PURE__*/React.createElement(Ctx.Provider, {
      value: api
    }, children);
  }
  const useApp = () => React.useContext(Ctx);
  Object.assign(window, {
    AppProvider,
    useApp
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/store.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  // data-om-starter: inert presence marker — Claude Design's starter-usage
  // probe reads it. The closed panel renders nothing, so the marker rides
  // the <html> element as an attribute instead of a rendered node — zero
  // elements added, so page CSS (even structural selectors like
  // :nth-child) can never observe it. It records that the page WIRES a
  // tweaks panel, whether or not the panel is open. Keep this effect.
  React.useEffect(() => {
    document.documentElement.setAttribute('data-om-starter', 'tweaks-panel');
    return () => document.documentElement.removeAttribute('data-om-starter');
  }, []);
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ICONS = __ds_scope.ICONS;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.AvatarStack = __ds_scope.AvatarStack;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.DayTag = __ds_scope.DayTag;

__ds_ns.Score = __ds_scope.Score;

__ds_ns.Stars = __ds_scope.Stars;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Sheet = __ds_scope.Sheet;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.ChoiceChips = __ds_scope.ChoiceChips;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.GroceryItem = __ds_scope.GroceryItem;

__ds_ns.MealCard = __ds_scope.MealCard;

__ds_ns.PhotoTile = __ds_scope.PhotoTile;

__ds_ns.RecipeStep = __ds_scope.RecipeStep;

__ds_ns.ReviewActions = __ds_scope.ReviewActions;

__ds_ns.SuggestedTag = __ds_scope.SuggestedTag;

__ds_ns.VoteButtons = __ds_scope.VoteButtons;

__ds_ns.SideNav = __ds_scope.SideNav;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
