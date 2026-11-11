"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/shebang-command@2.0.0";
exports.ids = ["vendor-chunks/shebang-command@2.0.0"];
exports.modules = {

/***/ "(rsc)/./node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js ***!
  \****************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nconst shebangRegex = __webpack_require__(/*! shebang-regex */ \"(rsc)/./node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js\");\n\nmodule.exports = (string = '') => {\n\tconst match = string.match(shebangRegex);\n\n\tif (!match) {\n\t\treturn null;\n\t}\n\n\tconst [path, argument] = match[0].replace(/#! ?/, '').split(' ');\n\tconst binary = path.split('/').pop();\n\n\tif (binary === 'env') {\n\t\treturn argument;\n\t}\n\n\treturn argument ? `${binary} ${argument}` : binary;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vc2hlYmFuZy1jb21tYW5kQDIuMC4wL25vZGVfbW9kdWxlcy9zaGViYW5nLWNvbW1hbmQvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7QUFDYixxQkFBcUIsbUJBQU8sQ0FBQyx5R0FBZTs7QUFFNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLFFBQVEsRUFBRSxTQUFTO0FBQ3pDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2FycGV0ei13ZWJzaXRlLy4vbm9kZV9tb2R1bGVzLy5wbnBtL3NoZWJhbmctY29tbWFuZEAyLjAuMC9ub2RlX21vZHVsZXMvc2hlYmFuZy1jb21tYW5kL2luZGV4LmpzPzM0NzgiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgc2hlYmFuZ1JlZ2V4ID0gcmVxdWlyZSgnc2hlYmFuZy1yZWdleCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChzdHJpbmcgPSAnJykgPT4ge1xuXHRjb25zdCBtYXRjaCA9IHN0cmluZy5tYXRjaChzaGViYW5nUmVnZXgpO1xuXG5cdGlmICghbWF0Y2gpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGNvbnN0IFtwYXRoLCBhcmd1bWVudF0gPSBtYXRjaFswXS5yZXBsYWNlKC8jISA/LywgJycpLnNwbGl0KCcgJyk7XG5cdGNvbnN0IGJpbmFyeSA9IHBhdGguc3BsaXQoJy8nKS5wb3AoKTtcblxuXHRpZiAoYmluYXJ5ID09PSAnZW52Jykge1xuXHRcdHJldHVybiBhcmd1bWVudDtcblx0fVxuXG5cdHJldHVybiBhcmd1bWVudCA/IGAke2JpbmFyeX0gJHthcmd1bWVudH1gIDogYmluYXJ5O1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js\n");

/***/ })

};
;