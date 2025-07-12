(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/components/NavItem.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "NavItem": (()=>NavItem)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
"use client";
;
;
const NavItem = ({ icon: Icon, label, href, active = false, onClick })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: `w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${active ? "bg-teal-600 text-white" : "text-teal-100 hover:bg-teal-700 hover:text-white"}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClick,
            className: "flex items-center w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: "w-4 h-4 mr-3"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/NavItem.tsx",
                    lineNumber: 23,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm font-medium",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/src/app/components/NavItem.tsx",
                    lineNumber: 24,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/NavItem.tsx",
            lineNumber: 19,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/NavItem.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this);
} // This component can be used in the Sidebar to create navigation items
;
_c = NavItem;
var _c;
__turbopack_context__.k.register(_c, "NavItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/supabase/client.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "createClient": (()=>createClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://gnhbukauvgrinmjprbfg.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaGJ1a2F1dmdyaW5tanByYmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0OTkyMzUsImV4cCI6MjA2NzA3NTIzNX0.uBY6ukBCk6kiZ9dLVWkPAJKQ8kP1LJ2BfVEcU32pkdc"));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/components/Sidebar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "SideBar": (()=>SideBar),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/graduation-cap.js [app-client] (ecmascript) <export default as GraduationCap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleArrowUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-arrow-up.js [app-client] (ecmascript) <export default as CircleArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2d$more$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircleMore$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle-more.js [app-client] (ecmascript) <export default as MessageCircleMore>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/NavItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
// === ICON COMPONENTS ===
const NetworkIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = (props, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        ref: ref,
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        xmlns: "http://www.w3.org/2000/svg",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 7.2C13.58 7.2 14.86 5.92 14.86 4.34C14.86 2.76 13.58 1.48 12 1.48C10.42 1.48 9.14 2.76 9.14 4.34C9.14 5.92 10.42 7.2 12 7.2Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 34,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19.64 19.61C21.22 19.61 22.5 18.33 22.5 16.75C22.5 15.17 21.22 13.89 19.64 13.89C18.06 13.89 16.78 15.17 16.78 16.75C16.78 18.33 18.06 19.61 19.64 19.61Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 38,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4.36 19.61C5.94 19.61 7.22 18.33 7.22 16.75C7.22 15.17 5.94 13.89 4.36 13.89C2.78 13.89 1.5 15.17 1.5 16.75C1.5 18.33 2.78 19.61 4.36 19.61Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 42,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 19.09C7.6 20.66 9.76 21.53 12 21.53C14.24 21.53 16.4 20.66 18 19.09",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 46,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M14.82 4.82C16.51 5.4 17.97 6.5 19 7.95C20.04 9.41 20.59 11.15 20.59 12.93C20.59 13.3 20.56 13.67 20.51 14.03",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 50,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3.49 14C3.43 13.64 3.41 13.27 3.41 12.9C3.41 11.12 3.97 9.39 5.01 7.94C6.04 6.49 7.5 5.4 9.18 4.82",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 54,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Sidebar.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, this));
_c1 = NetworkIcon;
NetworkIcon.displayName = "NetworkIcon";
const ScholarshipDatabaseIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = (props, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        ref: ref,
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        xmlns: "http://www.w3.org/2000/svg",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 12.98L12.6 14.24L13.95 14.44L12.98 15.42L13.21 16.8L12 16.15L10.79 16.8L11.02 15.42L10.05 14.44L11.4 14.24L12 12.98Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.17 10.11C9.35 9.49 10.66 9.15 12 9.11C13.34 9.15 14.65 9.49 15.83 10.11",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18.69 5.33H5.3V20.63H18.69V5.33Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3.39 5.33H20.61",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13.91 23.5V20.63",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17.74 23.5V20.63",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.09 23.5V20.63",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6.26 23.5V20.63",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17.74 5.33H6.26L12 1.5L17.74 5.33Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Sidebar.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this));
_c3 = ScholarshipDatabaseIcon;
ScholarshipDatabaseIcon.displayName = "ScholarshipDatabaseIcon";
const TestPrepIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = (props, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        ref: ref,
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        xmlns: "http://www.w3.org/2000/svg",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M22.5 8.18V20.59C22.5 21.1 22.29 21.58 21.94 21.94C21.58 22.3 21.1 22.5 20.59 22.5C20.09 22.5 19.6 22.29 19.24 21.93C18.89 21.58 18.68 21.09 18.68 20.59V8.18H22.5Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 105,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20.59 22.5H3.41C3.16 22.5 2.91 22.45 2.68 22.36C2.45 22.26 2.23 22.12 2.06 21.94C1.88 21.77 1.74 21.55 1.64 21.32C1.54 21.09 1.5 20.84 1.5 20.59V1.5H18.68V20.59C18.68 21.09 18.89 21.58 19.24 21.93C19.6 22.29 20.09 22.5 20.59 22.5Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 109,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M14.87 5.32H5.32V11.05H14.87V5.32Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 113,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4.36 14.86H15.82",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 114,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4.36 18.68H15.82",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 115,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Sidebar.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, this));
_c5 = TestPrepIcon;
TestPrepIcon.displayName = "TestPrepIcon";
const ResearchHub = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = (props, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        ref: ref,
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        xmlns: "http://www.w3.org/2000/svg",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21.54 1.5H6.27V18.68H21.54V1.5Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 131,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17.73 18.68V22.5H2.46V5.32H6.27",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 132,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.14 6.27H18.68",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 133,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.14 10.09H18.68",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 134,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.14 13.91H14.86",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 135,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Sidebar.tsx",
        lineNumber: 121,
        columnNumber: 3
    }, this));
_c7 = ResearchHub;
ResearchHub.displayName = "ResearchHub";
const CalendarTrackerIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = (props, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        ref: ref,
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        xmlns: "http://www.w3.org/2000/svg",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M22.52 3.37H1.48V8.15H22.52V3.37Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M22.52 8.15H1.48V22.5H22.52V8.15Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5.3 12.93H7.22M9.13 12.93H11.04M12.96 12.93H14.87M16.78 12.93H18.7M16.78 17.72H18.7M5.3 17.72H7.22M9.13 17.72H11.04M12.96 17.72H14.87",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6.26 0.5V5.28M12 0.5V5.28M17.74 0.5V5.28",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Sidebar.tsx",
        lineNumber: 142,
        columnNumber: 5
    }, this));
_c9 = CalendarTrackerIcon;
CalendarTrackerIcon.displayName = "CalendarTrackerIcon";
const LogOutIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = (props, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        ref: ref,
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "white",
        xmlns: "http://www.w3.org/2000/svg",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.61 10.1C11.98 10.1 13.91 8.17 13.91 5.8C13.91 3.43 11.98 1.5 9.61 1.5C7.24 1.5 5.31 3.43 5.31 5.8C5.31 8.17 7.24 10.1 9.61 10.1Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 175,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M1.5 19.64L2.2 16.17C2.54 14.46 3.47 12.91 4.82 11.81C6.17 10.7 7.86 10.09 9.61 10.09C11.27 10.09 12.89 10.64 14.2 11.66",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 179,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16.77 22.5C19.93 22.5 22.5 19.93 22.5 16.77C22.5 13.61 19.93 11.04 16.77 11.04C13.61 11.04 11.04 13.61 11.04 16.77C11.04 19.93 13.61 22.5 16.77 22.5Z",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 183,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13.91 16.77H19.64",
                strokeWidth: "2"
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 187,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Sidebar.tsx",
        lineNumber: 165,
        columnNumber: 3
    }, this));
_c11 = LogOutIcon;
LogOutIcon.displayName = "LogOutIcon";
const SideBar = ()=>{
    _s();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Close sidebar when screen gets larger than md breakpoint
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SideBar.useEffect": ()=>{
            const handleResize = {
                "SideBar.useEffect.handleResize": ()=>{
                    if (window.innerWidth >= 768) {
                        setIsOpen(false);
                    }
                }
            }["SideBar.useEffect.handleResize"];
            window.addEventListener('resize', handleResize);
            return ({
                "SideBar.useEffect": ()=>window.removeEventListener('resize', handleResize)
            })["SideBar.useEffect"];
        }
    }["SideBar.useEffect"], []);
    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error.message);
        } else {
            // Redirect to home page
            window.location.href = '/';
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "md:hidden fixed top-4 left-4 z-[100] p-2 rounded-md bg-teal-700 text-white shadow-lg",
                onClick: ()=>setIsOpen(!isOpen),
                style: {
                    top: "1rem",
                    left: "0.5rem"
                },
                "aria-label": "Toggle menu",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                    size: 24
                }, void 0, false, {
                    fileName: "[project]/src/app/components/Sidebar.tsx",
                    lineNumber: 232,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "md:hidden fixed inset-0 bg-black bg-opacity-50 z-40",
                onClick: ()=>setIsOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 237,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `fixed md:sticky md:top-0 md:translate-x-0 inset-y-0 left-0 z-40 flex flex-col h-screen max-h-screen w-72 md:w-64 text-white transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`,
                style: {
                    backgroundColor: "#20606B"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between h-16 border-b border-teal-600 px-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-xl font-semibold",
                                children: "Your SlateSpace"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                lineNumber: 250,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "md:hidden p-2 rounded-md hover:bg-teal-600 text-white",
                                onClick: ()=>setIsOpen(false),
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Sidebar.tsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex-1 p-4 overflow-y-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
                                        label: "Dashboard",
                                        href: "/dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Sidebar.tsx",
                                        lineNumber: 261,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
                                        label: "Profile",
                                        href: "#"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Sidebar.tsx",
                                        lineNumber: 262,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
                                        label: "Search",
                                        href: "#"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Sidebar.tsx",
                                        lineNumber: 263,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                lineNumber: 260,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-medium text-teal-100 mb-3",
                                        children: "High School"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Sidebar.tsx",
                                        lineNumber: 267,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"],
                                                label: "Roadmap Builder",
                                                href: "/roadmap-builder"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                                lineNumber: 271,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                                icon: NetworkIcon,
                                                label: "Extracurricular Database",
                                                href: "/ec-db"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                                lineNumber: 272,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleArrowUp$3e$__["CircleArrowUp"],
                                                label: "Application Hub",
                                                href: "/application-hub"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                                lineNumber: 277,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                                icon: ScholarshipDatabaseIcon,
                                                label: "Scholarship Database",
                                                href: "/scholarship-db"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                                lineNumber: 278,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                                icon: TestPrepIcon,
                                                label: "Test Prep",
                                                href: "/test-prep"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                                lineNumber: 283,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                                icon: ResearchHub,
                                                label: "Research Hub",
                                                href: "#"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                                lineNumber: 284,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                                icon: CalendarTrackerIcon,
                                                label: "Calendar Tracker",
                                                href: "#"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                                lineNumber: 285,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2d$more$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircleMore$3e$__["MessageCircleMore"],
                                                label: "Community",
                                                href: "#"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                                lineNumber: 290,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/Sidebar.tsx",
                                        lineNumber: 270,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                lineNumber: 266,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Sidebar.tsx",
                        lineNumber: 259,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-t border-teal-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
                                label: "Settings",
                                href: "#"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                lineNumber: 296,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$NavItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavItem"], {
                                onClick: handleLogout,
                                icon: LogOutIcon,
                                label: "Log Out",
                                href: "#"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Sidebar.tsx",
                                lineNumber: 297,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/Sidebar.tsx",
                        lineNumber: 295,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/Sidebar.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
_s(SideBar, "vl0Rt3/A8evyRPW1OQ1AhRk4UhU=");
_c12 = SideBar;
const __TURBOPACK__default__export__ = SideBar;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "NetworkIcon$forwardRef");
__turbopack_context__.k.register(_c1, "NetworkIcon");
__turbopack_context__.k.register(_c2, "ScholarshipDatabaseIcon$forwardRef");
__turbopack_context__.k.register(_c3, "ScholarshipDatabaseIcon");
__turbopack_context__.k.register(_c4, "TestPrepIcon$forwardRef");
__turbopack_context__.k.register(_c5, "TestPrepIcon");
__turbopack_context__.k.register(_c6, "ResearchHub$forwardRef");
__turbopack_context__.k.register(_c7, "ResearchHub");
__turbopack_context__.k.register(_c8, "CalendarTrackerIcon$forwardRef");
__turbopack_context__.k.register(_c9, "CalendarTrackerIcon");
__turbopack_context__.k.register(_c10, "LogOutIcon$forwardRef");
__turbopack_context__.k.register(_c11, "LogOutIcon");
__turbopack_context__.k.register(_c12, "SideBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/components/SidebarWrapper.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SidebarWrapper)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/Sidebar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const sidebarRoutes = [
    "/dashboard",
    "/ec-db",
    "/scholarship-db",
    "/application-hub",
    "/community",
    "/interview-ai",
    "/research-hub",
    "/roadmap-builder",
    "/test-prep"
];
function SidebarWrapper({ loading }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    if (loading) return null; // Don't even evaluate pathname while loading
    const showSidebar = sidebarRoutes.some((route)=>pathname.startsWith(route));
    return showSidebar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/src/app/components/SidebarWrapper.tsx",
        lineNumber: 24,
        columnNumber: 24
    }, this) : null;
}
_s(SidebarWrapper, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = SidebarWrapper;
var _c;
__turbopack_context__.k.register(_c, "SidebarWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/ec-db/components/ui/Card.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Card": (()=>Card),
    "CardContent": (()=>CardContent),
    "CardHeader": (()=>CardHeader),
    "CardTitle": (()=>CardTitle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function Card({ children, className = "", onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md ${className}`,
        onClick: onClick,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/ec-db/components/ui/Card.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this);
}
_c = Card;
function CardHeader({ children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col space-y-1.5 p-6 ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/ec-db/components/ui/Card.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, this);
}
_c1 = CardHeader;
function CardTitle({ children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        className: `text-lg font-semibold leading-none tracking-tight ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/ec-db/components/ui/Card.tsx",
        lineNumber: 36,
        columnNumber: 10
    }, this);
}
_c2 = CardTitle;
function CardContent({ children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `p-6 pt-0 ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/ec-db/components/ui/Card.tsx",
        lineNumber: 45,
        columnNumber: 10
    }, this);
}
_c3 = CardContent;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/ec-db/components/ui/Button.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Button": (()=>Button)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Button({ variant = "default", size = "md", className = "", children, ...props }) {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        default: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-slate-500",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
        ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
    };
    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/ec-db/components/ui/Button.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/ec-db/components/ui/Badge.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Badge": (()=>Badge)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const Badge = ({ children, variant = "default", className = "" })=>{
    const variants = {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ${variants[variant]} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/ec-db/components/ui/Badge.tsx",
        lineNumber: 17,
        columnNumber: 9
    }, this);
};
_c = Badge;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/ec-db/components/layout/Header.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Header": (()=>Header)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Header({ title, subtitle, children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-white border-b border-gray-200 p-6 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-gray-900",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/app/ec-db/components/layout/Header.tsx",
                                lineNumber: 15,
                                columnNumber: 11
                            }, this),
                            subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mt-1",
                                children: subtitle
                            }, void 0, false, {
                                fileName: "[project]/src/app/ec-db/components/layout/Header.tsx",
                                lineNumber: 16,
                                columnNumber: 24
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/ec-db/components/layout/Header.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2 text-sm text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Time"
                            }, void 0, false, {
                                fileName: "[project]/src/app/ec-db/components/layout/Header.tsx",
                                lineNumber: 19,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Date"
                            }, void 0, false, {
                                fileName: "[project]/src/app/ec-db/components/layout/Header.tsx",
                                lineNumber: 20,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/ec-db/components/layout/Header.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/ec-db/components/layout/Header.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/ec-db/components/layout/Header.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/ec-db/components/ui/Input.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Input": (()=>Input)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Input({ className = "", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        className: `flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`,
        style: {
            color: '#000000'
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/src/app/ec-db/components/ui/Input.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Input;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/ec-db/components/ui/Select.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Select": (()=>Select),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Select({ children, className = "", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
        className: `flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/ec-db/components/ui/Select.tsx",
        lineNumber: 10,
        columnNumber: 9
    }, this);
}
_c = Select;
const __TURBOPACK__default__export__ = Select;
var _c;
__turbopack_context__.k.register(_c, "Select");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ScholarshipDbClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/ec-db/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/ec-db/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/ec-db/components/ui/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/ec-db/components/layout/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/ec-db/components/ui/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/ec-db/components/ui/Select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
// Sample scholarship data
const scholarshipData = [
    {
        id: 1,
        name: "Future Leaders Scholarship",
        description: "Award for students demonstrating exceptional leadership potential and academic excellence.",
        amount: "$5,000",
        deadline: "September 15, 2025",
        provider: "Slate",
        eligibility: [
            "High School Senior",
            "3.5+ GPA"
        ],
        category: "Academic",
        type: "Merit-based",
        educationLevel: "Undergraduate",
        fieldOfStudy: "Any",
        renewableStatus: "Non-renewable",
        location: "National",
        applicationDifficulty: "Medium",
        tags: [
            "Leadership",
            "Essay Required"
        ]
    },
    {
        id: 2,
        name: "STEM Excellence Award",
        description: "Supporting students pursuing careers in Science, Technology, Engineering, and Mathematics.",
        amount: "$10,000",
        deadline: "October 31, 2025",
        provider: "Tech Innovation Foundation",
        eligibility: [
            "High School Senior",
            "College Student",
            "3.7+ GPA"
        ],
        category: "STEM",
        type: "Merit-based",
        educationLevel: "Undergraduate",
        fieldOfStudy: "STEM",
        renewableStatus: "Renewable",
        location: "National",
        applicationDifficulty: "High",
        tags: [
            "Research",
            "Interview Required"
        ]
    },
    {
        id: 3,
        name: "Community Service Grant",
        description: "For students who have demonstrated significant commitment to community service.",
        amount: "$2,500",
        deadline: "November 30, 2025",
        provider: "Community Foundation",
        eligibility: [
            "High School Student",
            "100+ volunteer hours"
        ],
        category: "Service",
        type: "Need-based",
        educationLevel: "High School",
        fieldOfStudy: "Any",
        renewableStatus: "Non-renewable",
        location: "Local",
        applicationDifficulty: "Low",
        tags: [
            "Community Service",
            "References Required"
        ]
    }
];
function ScholarshipDbClient() {
    _s();
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [favorites, setFavorites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFilters, setShowFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [curatedScholarships, setCuratedScholarships] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isCurating, setIsCurating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        category: "All",
        type: "All",
        amount: "All",
        educationLevel: "All",
        fieldOfStudy: "All",
        deadline: "All"
    });
    const [allScholarships, setAllScholarships] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    // Fetch user on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScholarshipDbClient.useEffect": ()=>{
            supabase.auth.getUser().then({
                "ScholarshipDbClient.useEffect": ({ data })=>{
                    setUser(data.user);
                    console.log(data.user); // log the new user, not the old state
                }
            }["ScholarshipDbClient.useEffect"]);
        }
    }["ScholarshipDbClient.useEffect"], [
        supabase.auth
    ]);
    // Subscribe to realtime changes in scholarship_db
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScholarshipDbClient.useEffect": ()=>{
            const fetchAllScholarships = {
                "ScholarshipDbClient.useEffect.fetchAllScholarships": async ()=>{
                    try {
                        const { data, error } = await supabase.from("scholarship_db").select("*");
                        if (error) {
                            console.error("Failed to fetch scholarships:", error);
                        } else if (Array.isArray(data)) {
                            setCuratedScholarships([]);
                            setAllScholarships(data);
                        }
                    } catch (err) {
                        console.error("Error fetching scholarships:", err);
                    }
                }
            }["ScholarshipDbClient.useEffect.fetchAllScholarships"];
            fetchAllScholarships();
            const channel = supabase.channel('scholarship_db-changes').on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'scholarship_db'
            }, {
                "ScholarshipDbClient.useEffect.channel": (payload)=>{
                    fetchAllScholarships();
                }
            }["ScholarshipDbClient.useEffect.channel"]).subscribe();
            return ({
                "ScholarshipDbClient.useEffect": ()=>{
                    supabase.removeChannel(channel);
                }
            })["ScholarshipDbClient.useEffect"];
        }
    }["ScholarshipDbClient.useEffect"], [
        supabase
    ]);
    const toggleFavorite = (scholarshipId)=>{
        setFavorites((prevFavorites)=>{
            if (prevFavorites.includes(scholarshipId)) {
                return prevFavorites.filter((id)=>id !== scholarshipId);
            } else {
                return [
                    ...prevFavorites,
                    scholarshipId
                ];
            }
        });
    };
    // Helper function to match amount ranges
    const matchAmountRange = (amount, filterValue)=>{
        const numericAmount = parseInt(amount.replace(/[^0-9]/g, ""));
        switch(filterValue){
            case "Under $1,000":
                return numericAmount < 1000;
            case "$1,000 - $5,000":
                return numericAmount >= 1000 && numericAmount <= 5000;
            case "$5,001 - $10,000":
                return numericAmount > 5000 && numericAmount <= 10000;
            case "Over $10,000":
                return numericAmount > 10000;
            default:
                return true;
        }
    };
    // Helper function to match deadline ranges
    const matchDeadlineRange = (deadline, filterValue)=>{
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const oneMonth = new Date();
        oneMonth.setMonth(oneMonth.getMonth() + 1);
        const threeMonths = new Date();
        threeMonths.setMonth(threeMonths.getMonth() + 3);
        switch(filterValue){
            case "Next Month":
                return deadlineDate <= oneMonth && deadlineDate >= today;
            case "Next 3 Months":
                return deadlineDate <= threeMonths && deadlineDate >= today;
            case "Future":
                return deadlineDate > threeMonths;
            default:
                return true;
        }
    };
    // Helper to reuse filtering logic for both default and curated
    const filteredScholarshipsFn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScholarshipDbClient.useCallback[filteredScholarshipsFn]": (data)=>{
            // Show all if all filters are default and search is empty
            const allFiltersDefault = filters.category === "All" && filters.type === "All" && filters.amount === "All" && filters.educationLevel === "All" && filters.fieldOfStudy === "All" && filters.deadline === "All";
            if (allFiltersDefault && searchTerm.trim() === "") {
                let allData = data;
                if (showFavoritesOnly) {
                    allData = allData.filter({
                        "ScholarshipDbClient.useCallback[filteredScholarshipsFn]": (scholarship)=>favorites.includes(scholarship.id)
                    }["ScholarshipDbClient.useCallback[filteredScholarshipsFn]"]);
                }
                return allData;
            }
            let filteredData = data.filter({
                "ScholarshipDbClient.useCallback[filteredScholarshipsFn].filteredData": (scholarship)=>{
                    const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) || scholarship.description.toLowerCase().includes(searchTerm.toLowerCase()) || scholarship.tags.some({
                        "ScholarshipDbClient.useCallback[filteredScholarshipsFn].filteredData": (tag)=>tag.toLowerCase().includes(searchTerm.toLowerCase())
                    }["ScholarshipDbClient.useCallback[filteredScholarshipsFn].filteredData"]);
                    const matchesCategory = filters.category === "All" || scholarship.category === filters.category;
                    const matchesType = filters.type === "All" || scholarship.type === filters.type;
                    const matchesAmount = filters.amount === "All" || matchAmountRange(scholarship.amount, filters.amount);
                    const matchesEducationLevel = filters.educationLevel === "All" || scholarship.educationLevel === filters.educationLevel;
                    const matchesFieldOfStudy = filters.fieldOfStudy === "All" || scholarship.fieldOfStudy === filters.fieldOfStudy || scholarship.fieldOfStudy === "Any";
                    const matchesDeadline = filters.deadline === "All" || matchDeadlineRange(scholarship.deadline, filters.deadline);
                    return matchesSearch && matchesCategory && matchesType && matchesAmount && matchesEducationLevel && matchesFieldOfStudy && matchesDeadline;
                }
            }["ScholarshipDbClient.useCallback[filteredScholarshipsFn].filteredData"]);
            if (showFavoritesOnly) {
                filteredData = filteredData.filter({
                    "ScholarshipDbClient.useCallback[filteredScholarshipsFn]": (scholarship)=>favorites.includes(scholarship.id)
                }["ScholarshipDbClient.useCallback[filteredScholarshipsFn]"]);
            }
            return filteredData;
        }
    }["ScholarshipDbClient.useCallback[filteredScholarshipsFn]"], [
        searchTerm,
        filters,
        showFavoritesOnly,
        favorites
    ]);
    // Use the helper for both lists
    const filteredScholarships = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ScholarshipDbClient.useMemo[filteredScholarships]": ()=>filteredScholarshipsFn(scholarshipData)
    }["ScholarshipDbClient.useMemo[filteredScholarships]"], [
        filteredScholarshipsFn
    ]);
    const filteredCuratedScholarships = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ScholarshipDbClient.useMemo[filteredCuratedScholarships]": ()=>filteredScholarshipsFn(curatedScholarships)
    }["ScholarshipDbClient.useMemo[filteredCuratedScholarships]"], [
        filteredScholarshipsFn,
        curatedScholarships
    ]);
    // Determine which scholarships to show
    let scholarshipsToShow = [];
    if (curatedScholarships.length > 0) {
        scholarshipsToShow = filteredCuratedScholarships;
    } else {
        scholarshipsToShow = filteredScholarshipsFn(allScholarships);
    }
    // Filter options
    const categories = [
        "All",
        "Academic",
        "Arts",
        "Athletics",
        "STEM",
        "Service",
        "Leadership",
        "Diversity",
        "First Generation"
    ];
    const types = [
        "All",
        "Merit-based",
        "Need-based",
        "Both"
    ];
    const amountRanges = [
        "All",
        "Under $1,000",
        "$1,000 - $5,000",
        "$5,001 - $10,000",
        "Over $10,000"
    ];
    const educationLevels = [
        "All",
        "High School",
        "Undergraduate",
        "Graduate",
        "Doctorate"
    ];
    const fieldsOfStudy = [
        "All",
        "Any",
        "STEM",
        "Humanities",
        "Business",
        "Arts",
        "Education",
        "Health Sciences"
    ];
    const deadlineOptions = [
        "All",
        "Next Month",
        "Next 3 Months",
        "Future"
    ];
    //find the token of the current session of the user
    const curateOpportunities = async ()=>{
        if (!user) {
            alert("Please log in to use this feature.");
            return;
        }
        setIsCurating(true);
        try {
            // Get the current session to retrieve the access token
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData?.session?.access_token;
            if (!accessToken) {
                alert("Could not retrieve session token. Please log in again.");
                setIsCurating(false);
                return;
            }
            const response = await fetch("/api/curate-scholarships", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    userId: user.id
                })
            });
            if (!response.ok) throw new Error("Failed to curate opportunities");
            const results = await response.json();
            // TODO: handle/display curated results
            console.log("Curated opportunities:", results);
            if (Array.isArray(results.result)) {
                setCuratedScholarships(results.result || []);
                alert("Personalization successful! Scholarships have been curated for you.");
            } else {
                console.error("Unexpected response format:", results);
                alert("Error curating opportunities. Please try again later.");
            }
        } catch  {
            alert("Error curating opportunities.");
        } finally{
            setIsCurating(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white min-h-screen w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-[1400px] w-full mx-auto px-4 py-6 flex flex-col space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {
                    title: "Scholarship Database",
                    subtitle: "Find scholarships to fund your education."
                }, void 0, false, {
                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                    lineNumber: 369,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-start mb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-full flex items-center justify-center w-auto transition-all duration-200 shadow-md hover:shadow-lg mb-1 disabled:opacity-60 disabled:cursor-not-allowed",
                            onClick: curateOpportunities,
                            disabled: isCurating,
                            children: isCurating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "animate-spin h-5 w-5 mr-2 text-white",
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                className: "opacity-25",
                                                cx: "12",
                                                cy: "12",
                                                r: "10",
                                                stroke: "currentColor",
                                                strokeWidth: "4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                lineNumber: 384,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                className: "opacity-75",
                                                fill: "currentColor",
                                                d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                lineNumber: 385,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 383,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: "Curating..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 387,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: "Ask Slate to Find"
                            }, void 0, false, {
                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                lineNumber: 390,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                            lineNumber: 376,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 text-sm mt-1",
                            children: "Slate curates opportunity based on your profile."
                        }, void 0, false, {
                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                            lineNumber: 393,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                    lineNumber: 375,
                    columnNumber: 9
                }, this),
                curatedScholarships.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        onClick: ()=>setCuratedScholarships([]),
                        className: "text-sm px-4 py-2 border border-gray-300",
                        children: "Clear Curated Results"
                    }, void 0, false, {
                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                        lineNumber: 401,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                    lineNumber: 400,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col md:flex-row md:items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex-grow",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                placeholder: "Search scholarships...",
                                onChange: (e)=>setSearchTerm(e.target.value),
                                className: "w-full pl-4 pr-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 text-gray-900 text-base font-medium shadow-sm bg-white"
                            }, void 0, false, {
                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                lineNumber: 413,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                            lineNumber: 412,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>setShowFilters(!showFilters),
                                    className: "flex items-center gap-2 px-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                            lineNumber: 428,
                                            columnNumber: 15
                                        }, this),
                                        showFilters ? "Hide Filters" : "Show Filters"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                    lineNumber: 423,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "secondary",
                                    onClick: ()=>setShowFavoritesOnly(!showFavoritesOnly),
                                    className: "px-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                            size: 18,
                                            className: `mr-2 ${showFavoritesOnly ? "fill-red-500 text-red-500" : ""}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                            lineNumber: 437,
                                            columnNumber: 15
                                        }, this),
                                        showFavoritesOnly ? "Show All" : "Show Favorites"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                    lineNumber: 432,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                            lineNumber: 422,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                    lineNumber: 411,
                    columnNumber: 9
                }, this),
                showFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-4 rounded-lg shadow-sm border border-gray-100",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                        children: "Category"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 452,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        onChange: (e)=>setFilters({
                                                ...filters,
                                                category: e.target.value
                                            }),
                                        className: "w-full bg-white text-gray-900 border-gray-300 h-10",
                                        children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: category,
                                                className: "text-gray-900",
                                                children: category
                                            }, category, false, {
                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                lineNumber: 462,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 455,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                lineNumber: 451,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                        children: "Type"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 474,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        onChange: (e)=>setFilters({
                                                ...filters,
                                                type: e.target.value
                                            }),
                                        className: "w-full bg-white text-gray-900 border-gray-300 h-10",
                                        children: types.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: type,
                                                className: "text-gray-900",
                                                children: type
                                            }, type, false, {
                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                lineNumber: 484,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 477,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                lineNumber: 473,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                        children: "Award Amount"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 492,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        onChange: (e)=>setFilters({
                                                ...filters,
                                                amount: e.target.value
                                            }),
                                        className: "w-full bg-white text-gray-900 border-gray-300 h-10",
                                        children: amountRanges.map((amount)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: amount,
                                                className: "text-gray-900",
                                                children: amount
                                            }, amount, false, {
                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                lineNumber: 502,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 495,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                lineNumber: 491,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                        children: "Education Level"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 514,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        onChange: (e)=>setFilters({
                                                ...filters,
                                                educationLevel: e.target.value
                                            }),
                                        className: "w-full bg-white text-gray-900 border-gray-300 h-10",
                                        children: educationLevels.map((level)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: level,
                                                className: "text-gray-900",
                                                children: level
                                            }, level, false, {
                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                lineNumber: 524,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 517,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                lineNumber: 513,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                        children: "Field of Study"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 532,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        onChange: (e)=>setFilters({
                                                ...filters,
                                                fieldOfStudy: e.target.value
                                            }),
                                        className: "w-full bg-white text-gray-900 border-gray-300 h-10",
                                        children: fieldsOfStudy.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: field,
                                                className: "text-gray-900",
                                                children: field
                                            }, field, false, {
                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                lineNumber: 542,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 535,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                lineNumber: 531,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                        children: "Deadline"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 550,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        onChange: (e)=>setFilters({
                                                ...filters,
                                                deadline: e.target.value
                                            }),
                                        className: "w-full bg-white text-gray-900 border-gray-300 h-10",
                                        children: deadlineOptions.map((deadline)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: deadline,
                                                className: "text-gray-900",
                                                children: deadline
                                            }, deadline, false, {
                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                lineNumber: 560,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 553,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                lineNumber: 549,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                        lineNumber: 450,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                    lineNumber: 449,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
                    children: filteredScholarships.length === 0 && showFavoritesOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "col-span-full text-center text-gray-500 my-8",
                        children: "No favorite scholarships match your search."
                    }, void 0, false, {
                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                        lineNumber: 575,
                        columnNumber: 13
                    }, this) : filteredScholarships.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "col-span-full text-center text-gray-500 my-8",
                        children: "No scholarships match your search."
                    }, void 0, false, {
                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                        lineNumber: 579,
                        columnNumber: 13
                    }, this) : scholarshipsToShow.map((scholarship)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "group hover:shadow-xl hover:scale-[1.03] transition-all duration-200 ease-in-out overflow-hidden border-2 border-gray-100 bg-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-full h-24 flex items-center px-4 relative bg-gray-200 text-gray-900`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-2 right-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/Transparent_Logo_White.png",
                                                alt: "SlatePath Logo",
                                                width: 48,
                                                height: 48,
                                                className: "opacity-95"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                lineNumber: 592,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                            lineNumber: 591,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-bold pr-14",
                                            children: scholarship.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                            lineNumber: 600,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                    lineNumber: 588,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    className: "flex flex-row justify-end items-start space-y-0 bg-white pt-2 pb-0 px-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        onClick: ()=>toggleFavorite(scholarship.id),
                                        className: "p-1 h-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                            className: `h-5 w-5 ${favorites.includes(scholarship.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                            lineNumber: 610,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                        lineNumber: 605,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                    lineNumber: 604,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    className: "pt-0 bg-white",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 mb-3",
                                            children: scholarship.tags.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "secondary",
                                                    className: "px-3 py-1 rounded-full bg-gray-100 text-gray-700 border-none",
                                                    children: tag
                                                }, tag, false, {
                                                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                    lineNumber: 622,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                            lineNumber: 620,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600 mb-4 line-clamp-2",
                                            children: scholarship.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                            lineNumber: 631,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center text-sm border-t pt-3 mt-auto",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-1 font-medium",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `h-3 w-3 rounded-full ${scholarship.type === "Merit-based" ? "bg-blue-500" : scholarship.type === "Need-based" ? "bg-green-500" : "bg-purple-500"}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                            lineNumber: 636,
                                                            columnNumber: 23
                                                        }, this),
                                                        scholarship.type
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                    lineNumber: 635,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium",
                                                    children: scholarship.amount
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                    lineNumber: 647,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                            lineNumber: 634,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "max-h-0 overflow-hidden transition-all duration-300 group-hover:max-h-72 group-hover:mt-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-t pt-3 space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-2 gap-2 text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-500",
                                                                        children: "Provider:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                        lineNumber: 657,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium ml-1 text-black",
                                                                        children: scholarship.provider
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                        lineNumber: 658,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                lineNumber: 656,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-500",
                                                                        children: "Education:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                        lineNumber: 663,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium ml-1 text-black",
                                                                        children: scholarship.educationLevel
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                        lineNumber: 664,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                lineNumber: 662,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-500",
                                                                        children: "Deadline:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                        lineNumber: 669,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium ml-1 text-black",
                                                                        children: scholarship.deadline
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                        lineNumber: 670,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                lineNumber: 668,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-500",
                                                                        children: "Renewable:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                        lineNumber: 675,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium ml-1 text-black",
                                                                        children: scholarship.renewableStatus
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                        lineNumber: 676,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                lineNumber: 674,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "col-span-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-500",
                                                                        children: "Eligibility:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                        lineNumber: 681,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium ml-1 text-black",
                                                                        children: scholarship.eligibility.join(", ")
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                        lineNumber: 682,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                                lineNumber: 680,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                        lineNumber: 655,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$ec$2d$db$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        className: "w-full bg-blue-600 hover:bg-blue-700 text-white mt-2",
                                                        children: "Apply Now"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                        lineNumber: 688,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                                lineNumber: 654,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                            lineNumber: 653,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                                    lineNumber: 619,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, scholarship.id, true, {
                            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                            lineNumber: 584,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
                    lineNumber: 573,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
            lineNumber: 368,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx",
        lineNumber: 367,
        columnNumber: 5
    }, this);
}
_s(ScholarshipDbClient, "HOtf21ft8sFX5ojJNGUGTl3IZfQ=");
_c = ScholarshipDbClient;
var _c;
__turbopack_context__.k.register(_c, "ScholarshipDbClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/useRequireAuth.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useRequireAuth": (()=>useRequireAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
function useRequireAuth() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [checking, setChecking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRequireAuth.useEffect": ()=>{
            const checkSession = {
                "useRequireAuth.useEffect.checkSession": async ()=>{
                    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) {
                        router.replace("/login");
                    } else {
                        setChecking(false);
                    }
                }
            }["useRequireAuth.useEffect.checkSession"];
            checkSession();
        }
    }["useRequireAuth.useEffect"], [
        router
    ]);
    return checking;
}
_s(useRequireAuth, "EZyqNjv1DAMSa/f97bPVpf6bCGI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/LoadingScreen.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>LoadingScreen)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function LoadingScreen({ message = "Loading..." }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "animate-spin h-12 w-12 text-teal-600 mb-4",
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4",
                            fill: "none"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingScreen.tsx",
                            lineNumber: 9,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8v8z"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingScreen.tsx",
                            lineNumber: 10,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/LoadingScreen.tsx",
                    lineNumber: 8,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-teal-600 text-xl font-semibold drop-shadow-lg",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/components/LoadingScreen.tsx",
                    lineNumber: 12,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/LoadingScreen.tsx",
            lineNumber: 7,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/LoadingScreen.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = LoadingScreen;
var _c;
__turbopack_context__.k.register(_c, "LoadingScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/scholarship-db/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ScholarshipDBPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$SidebarWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/SidebarWrapper.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$scholarship$2d$db$2f$components$2f$client$2f$ScholarshipDbClient$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/scholarship-db/components/client/ScholarshipDbClient.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRequireAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useRequireAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LoadingScreen.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ScholarshipDBPage() {
    _s();
    const checking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRequireAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRequireAuth"])();
    if (checking) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/scholarship-db/page.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$SidebarWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                loading: false
            }, void 0, false, {
                fileName: "[project]/src/app/scholarship-db/page.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$scholarship$2d$db$2f$components$2f$client$2f$ScholarshipDbClient$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/scholarship-db/page.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/scholarship-db/page.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/scholarship-db/page.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_s(ScholarshipDBPage, "ZNKQ71sOZLIgMKlT1gcNnFLM/PA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useRequireAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRequireAuth"]
    ];
});
_c = ScholarshipDBPage;
var _c;
__turbopack_context__.k.register(_c, "ScholarshipDBPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_39898a3b._.js.map