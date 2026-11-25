// Icons as inline SVG, so the site doesn't load the Font Awesome web font.
// Outlines are the original Font Awesome 4.7 glyphs (SIL OFL 1.1, by Dave
// Gandy, https://fontawesome.com/v4/license/), unchanged, so they look exactly
// like the font icons they replace.
//
// Glyph coordinates: 1792 units per em, baseline at y=0, ascent 1536,
// descent 256, y pointing up. Each icon is drawn 1em tall and adv/1792em wide,
// and sits on the text baseline like a font character (see .icon in all.css).
//
// In HTML, keep writing <i class="fa fa-NAME" aria-hidden="true"></i>; the
// build swaps it for the SVG. To add an icon, add its 4.7 glyph here.

const GLYPHS = {
  "arrow-right": { adv: 1536, d: "M1472 576q0 -54 -37 -91l-651 -651q-39 -37 -91 -37q-51 0 -90 37l-75 75q-38 38 -38 91t38 91l293 293h-704q-52 0 -84.5 37.5t-32.5 90.5v128q0 53 32.5 90.5t84.5 37.5h704l-293 294q-38 36 -38 90t38 90l75 75q38 38 90 38q53 0 91 -38l651 -651q37 -35 37 -90z" },
  "bandcamp": { adv: 1792, d: "M1070 358l306 564h-654l-306 -564h654zM1792 640q0 -182 -71 -348t-191 -286t-286 -191t-348 -71t-348 71t-286 191t-191 286t-71 348t71 348t191 286t286 191t348 71t348 -71t286 -191t191 -286t71 -348z" },
  "envelope": { adv: 1792, d: "M1792 826v-794q0 -66 -47 -113t-113 -47h-1472q-66 0 -113 47t-47 113v794q44 -49 101 -87q362 -246 497 -345q57 -42 92.5 -65.5t94.5 -48t110 -24.5h1h1q51 0 110 24.5t94.5 48t92.5 65.5q170 123 498 345q57 39 100 87zM1792 1120q0 -79 -49 -151t-122 -123 q-376 -261 -468 -325q-10 -7 -42.5 -30.5t-54 -38t-52 -32.5t-57.5 -27t-50 -9h-1h-1q-23 0 -50 9t-57.5 27t-52 32.5t-54 38t-42.5 30.5q-91 64 -262 182.5t-205 142.5q-62 42 -117 115.5t-55 136.5q0 78 41.5 130t118.5 52h1472q65 0 112.5 -47t47.5 -113z" },
  "github": { adv: 1536, d: "M768 1408q209 0 385.5 -103t279.5 -279.5t103 -385.5q0 -251 -146.5 -451.5t-378.5 -277.5q-27 -5 -40 7t-13 30q0 3 0.5 76.5t0.5 134.5q0 97 -52 142q57 6 102.5 18t94 39t81 66.5t53 105t20.5 150.5q0 119 -79 206q37 91 -8 204q-28 9 -81 -11t-92 -44l-38 -24 q-93 26 -192 26t-192 -26q-16 11 -42.5 27t-83.5 38.5t-85 13.5q-45 -113 -8 -204q-79 -87 -79 -206q0 -85 20.5 -150t52.5 -105t80.5 -67t94 -39t102.5 -18q-39 -36 -49 -103q-21 -10 -45 -15t-57 -5t-65.5 21.5t-55.5 62.5q-19 32 -48.5 52t-49.5 24l-20 3q-21 0 -29 -4.5 t-5 -11.5t9 -14t13 -12l7 -5q22 -10 43.5 -38t31.5 -51l10 -23q13 -38 44 -61.5t67 -30t69.5 -7t55.5 3.5l23 4q0 -38 0.5 -88.5t0.5 -54.5q0 -18 -13 -30t-40 -7q-232 77 -378.5 277.5t-146.5 451.5q0 209 103 385.5t279.5 279.5t385.5 103zM291 305q3 7 -7 12 q-10 3 -13 -2q-3 -7 7 -12q9 -6 13 2zM322 271q7 5 -2 16q-10 9 -16 3q-7 -5 2 -16q10 -10 16 -3zM352 226q9 7 0 19q-8 13 -17 6q-9 -5 0 -18t17 -7zM394 184q8 8 -4 19q-12 12 -20 3q-9 -8 4 -19q12 -12 20 -3zM451 159q3 11 -13 16q-15 4 -19 -7t13 -15q15 -6 19 6z M514 154q0 13 -17 11q-16 0 -16 -11q0 -13 17 -11q16 0 16 11zM572 164q-2 11 -18 9q-16 -3 -14 -15t18 -8t14 14z" },
  "instagram": { adv: 1536, d: "M1024 640q0 106 -75 181t-181 75t-181 -75t-75 -181t75 -181t181 -75t181 75t75 181zM1162 640q0 -164 -115 -279t-279 -115t-279 115t-115 279t115 279t279 115t279 -115t115 -279zM1270 1050q0 -38 -27 -65t-65 -27t-65 27t-27 65t27 65t65 27t65 -27t27 -65zM768 1270 q-7 0 -76.5 0.5t-105.5 0t-96.5 -3t-103 -10t-71.5 -18.5q-50 -20 -88 -58t-58 -88q-11 -29 -18.5 -71.5t-10 -103t-3 -96.5t0 -105.5t0.5 -76.5t-0.5 -76.5t0 -105.5t3 -96.5t10 -103t18.5 -71.5q20 -50 58 -88t88 -58q29 -11 71.5 -18.5t103 -10t96.5 -3t105.5 0t76.5 0.5 t76.5 -0.5t105.5 0t96.5 3t103 10t71.5 18.5q50 20 88 58t58 88q11 29 18.5 71.5t10 103t3 96.5t0 105.5t-0.5 76.5t0.5 76.5t0 105.5t-3 96.5t-10 103t-18.5 71.5q-20 50 -58 88t-88 58q-29 11 -71.5 18.5t-103 10t-96.5 3t-105.5 0t-76.5 -0.5zM1536 640q0 -229 -5 -317 q-10 -208 -124 -322t-322 -124q-88 -5 -317 -5t-317 5q-208 10 -322 124t-124 322q-5 88 -5 317t5 317q10 208 124 322t322 124q88 5 317 5t317 -5q208 -10 322 -124t124 -322q5 -88 5 -317z" },
  "vimeo": { adv: 1792, d: "M1709 1018q-10 -236 -332 -651q-333 -431 -562 -431q-142 0 -240 263q-44 160 -132 482q-72 262 -157 262q-18 0 -127 -76l-77 98q24 21 108 96.5t130 115.5q156 138 241 146q95 9 153 -55.5t81 -203.5q44 -287 66 -373q55 -249 120 -249q51 0 154 161q101 161 109 246 q13 139 -109 139q-57 0 -121 -26q120 393 459 382q251 -8 236 -326z" },
};

export function iconSvg(name) {
  const g = GLYPHS[name];
  if (!g) throw new Error(`Unknown icon "${name}" — add it to scripts/icons.mjs`);
  const width = +(g.adv / 1792).toFixed(4);
  return `<svg class="icon icon-${name}" viewBox="0 -1536 ${g.adv} 1792" width="${width}em" height="1em" style="width:${width}em" aria-hidden="true" focusable="false"><path transform="scale(1,-1)" d="${g.d}"/></svg>`;
}

/** Replace every <i class="fa fa-NAME" ...></i> in html with its inline SVG. */
export function inlineIcons(html) {
  return html.replace(/<i class="fa fa-([\w-]+)"[^>]*><\/i>/g, (_, name) => iconSvg(name));
}
