(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/pos/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PosPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$ShiftContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/context/ShiftContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/inventoryService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$cashService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/cashService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scan$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scan$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/scan.mjs [app-client] (ecmascript) <export default as Scan>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.mjs [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/banknote.mjs [app-client] (ecmascript) <export default as Banknote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.mjs [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.mjs [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.mjs [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.mjs [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/coins.mjs [app-client] (ecmascript) <export default as Coins>");
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
function ShiftWarningModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none animate-in fade-in duration-150",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-center space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                        className: "w-6 h-6"
                    }, void 0, false, {
                        fileName: "[project]/src/app/pos/page.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/pos/page.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-base font-extrabold text-slate-800",
                            children: "Turno de Caja Requerido"
                        }, void 0, false, {
                            fileName: "[project]/src/app/pos/page.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-slate-500 leading-relaxed",
                            children: "No es posible agregar artículos ni cobrar sin abrir un turno previamente. Registra tu fondo inicial para comenzar[cite: 1, 2]."
                        }, void 0, false, {
                            fileName: "[project]/src/app/pos/page.tsx",
                            lineNumber: 99,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/pos/page.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 pt-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            className: "flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer",
                            children: "Entendido"
                        }, void 0, false, {
                            fileName: "[project]/src/app/pos/page.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/caja",
                            className: "flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Ir a Caja"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/pos/page.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                    className: "w-3.5 h-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/pos/page.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/pos/page.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/pos/page.tsx",
                    lineNumber: 109,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/pos/page.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/pos/page.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_c = ShiftWarningModal;
const CATEGORIES = [
    "All",
    "Ortodoncia",
    "Endodoncia",
    "Resinas",
    "Instrumentos",
    "Desechables"
];
const CASH_SUGGESTIONS = [
    5,
    10,
    20,
    50,
    100
];
// Funciones de sincronización externa con localStorage para el carrito
function subscribeCart(callback) {
    window.addEventListener("storage", callback);
    window.addEventListener("cart_change", callback);
    return ()=>{
        window.removeEventListener("storage", callback);
        window.removeEventListener("cart_change", callback);
    };
}
function PosPage() {
    _s();
    const { isShiftOpen, cashierName } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$ShiftContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShift"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // Garantiza que la sucursal provenga de la sesión del usuario logueado
    const currentBranch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PosPage.useMemo[currentBranch]": ()=>{
            return user?.branch || "Santa Ana";
        }
    }["PosPage.useMemo[currentBranch]"], [
        user?.branch
    ]);
    const CART_STORAGE_KEY = `pos_cart_${currentBranch}`;
    // Estado de orden
    const [orderNumber, setOrderNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "PosPage.useState": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const saved = localStorage.getItem(`pos_order_num_${currentBranch}`);
                return saved ? parseInt(saved, 10) : 1;
            }
            //TURBOPACK unreachable
            ;
        }
    }["PosPage.useState"]);
    const [hasHydrated, setHasHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showShiftWarning, setShowShiftWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [paymentMethod, setPaymentMethod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("cash");
    const [cashReceived, setCashReceived] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ticketSuccess, setTicketSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const scanInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Evita alertas de ESLint en React 19 / Next.js
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PosPage.useEffect": ()=>{
            queueMicrotask({
                "PosPage.useEffect": ()=>{
                    setHasHydrated(true);
                }
            }["PosPage.useEffect"]);
        }
    }["PosPage.useEffect"], []);
    // Sincroniza el correlativo de orden con Supabase para la sucursal activa
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PosPage.useEffect": ()=>{
            let isMounted = true;
            async function syncOrderNum() {
                if (!isShiftOpen) {
                    if (isMounted) setOrderNumber(1);
                    return;
                }
                try {
                    const nextNum = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$cashService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextOrderNumber"])(currentBranch);
                    if (isMounted) {
                        setOrderNumber(nextNum);
                        if ("TURBOPACK compile-time truthy", 1) {
                            localStorage.setItem(`pos_order_num_${currentBranch}`, nextNum.toString());
                        }
                    }
                } catch (err) {
                    console.error("Error al sincronizar número de orden:", err);
                }
            }
            syncOrderNum();
            return ({
                "PosPage.useEffect": ()=>{
                    isMounted = false;
                }
            })["PosPage.useEffect"];
        }
    }["PosPage.useEffect"], [
        currentBranch,
        isShiftOpen
    ]);
    // Lectura reactiva del carrito desde localStorage
    const rawCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeCart, {
        "PosPage.useSyncExternalStore[rawCart]": ()=>("TURBOPACK compile-time truthy", 1) ? localStorage.getItem(CART_STORAGE_KEY) ?? "[]" : "TURBOPACK unreachable"
    }["PosPage.useSyncExternalStore[rawCart]"], {
        "PosPage.useSyncExternalStore[rawCart]": ()=>"[]"
    }["PosPage.useSyncExternalStore[rawCart]"]);
    const cart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PosPage.useMemo[cart]": ()=>{
            try {
                return JSON.parse(rawCart);
            } catch  {
                return [];
            }
        }
    }["PosPage.useMemo[cart]"], [
        rawCart
    ]);
    // Actualizador persistente del carrito
    const updateCartStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PosPage.useCallback[updateCartStorage]": (newCart)=>{
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
                window.dispatchEvent(new Event("cart_change"));
            }
        }
    }["PosPage.useCallback[updateCartStorage]"], [
        CART_STORAGE_KEY
    ]);
    const loadBranchProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PosPage.useCallback[loadBranchProducts]": async ()=>{
            try {
                setIsLoading(true);
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("products").select(`

          id,

          sku,

          barcode,

          name,

          brand,

          category,

          price,

          image_url,

          branch_inventory (

            stock,

            branches (

              id,

              name

            )

          )

        `).order("name", {
                    ascending: true
                });
                if (error) throw error;
                const rawProducts = data ?? [];
                const formatted = rawProducts.map({
                    "PosPage.useCallback[loadBranchProducts].formatted": (p)=>{
                        const invList = p.branch_inventory ?? [];
                        const branchMatch = invList.find({
                            "PosPage.useCallback[loadBranchProducts].formatted.branchMatch": (b)=>b.branches?.name?.trim().toLowerCase() === currentBranch.trim().toLowerCase()
                        }["PosPage.useCallback[loadBranchProducts].formatted.branchMatch"]);
                        return {
                            id: p.id,
                            sku: p.sku,
                            barcode: p.barcode ?? undefined,
                            name: p.name,
                            brand: p.brand,
                            category: p.category,
                            price: Number(p.price),
                            stock: branchMatch?.stock ?? 0,
                            image: p.image_url ?? undefined
                        };
                    }
                }["PosPage.useCallback[loadBranchProducts].formatted"]);
                setProducts(formatted);
            } catch (err) {
                console.error("Error al cargar productos del catálogo:", err);
            } finally{
                setIsLoading(false);
            }
        }
    }["PosPage.useCallback[loadBranchProducts]"], [
        currentBranch
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PosPage.useEffect": ()=>{
            let isMounted = true;
            const initPOS = {
                "PosPage.useEffect.initPOS": async ()=>{
                    if (isMounted) {
                        await loadBranchProducts();
                    }
                }
            }["PosPage.useEffect.initPOS"];
            initPOS();
            return ({
                "PosPage.useEffect": ()=>{
                    isMounted = false;
                }
            })["PosPage.useEffect"];
        }
    }["PosPage.useEffect"], [
        loadBranchProducts
    ]);
    const filteredProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PosPage.useMemo[filteredProducts]": ()=>{
            const q = searchQuery.trim().toLowerCase();
            return products.filter({
                "PosPage.useMemo[filteredProducts]": (prod)=>{
                    const matchCategory = activeCategory === "All" || prod.category.toLowerCase() === activeCategory.toLowerCase();
                    const matchSearch = !q || prod.name.toLowerCase().includes(q) || prod.brand.toLowerCase().includes(q) || prod.sku.toLowerCase().includes(q) || prod.barcode && prod.barcode.toLowerCase().includes(q);
                    return matchCategory && matchSearch;
                }
            }["PosPage.useMemo[filteredProducts]"]);
        }
    }["PosPage.useMemo[filteredProducts]"], [
        products,
        activeCategory,
        searchQuery
    ]);
    const handleAddToCart = (product)=>{
        if (!isShiftOpen) {
            setShowShiftWarning(true);
            return;
        }
        if (product.stock <= 0) return;
        const existingIndex = cart.findIndex((item)=>item.productId === product.id);
        if (existingIndex > -1) {
            if (cart[existingIndex].quantity >= product.stock) return;
            const updated = [
                ...cart
            ];
            updated[existingIndex] = {
                ...updated[existingIndex],
                quantity: updated[existingIndex].quantity + 1
            };
            updateCartStorage(updated);
        } else {
            updateCartStorage([
                ...cart,
                {
                    id: `cart-${Date.now()}-${product.id}`,
                    productId: product.id,
                    name: product.name,
                    brand: product.brand,
                    sku: product.sku,
                    quantity: 1,
                    price: product.price,
                    stock: product.stock
                }
            ]);
        }
    };
    const handleScannerKeyDown = (e)=>{
        if (e.key === "Enter") {
            e.preventDefault();
            if (!isShiftOpen) {
                setShowShiftWarning(true);
                setSearchQuery("");
                return;
            }
            const code = searchQuery.trim().toLowerCase();
            if (!code) return;
            const matched = products.find((p)=>p.barcode && p.barcode.toLowerCase() === code || p.sku.toLowerCase() === code);
            if (matched) {
                handleAddToCart(matched);
                setSearchQuery("");
            } else {
                console.warn("Código no reconocido:", code);
            }
        }
    };
    const handleUpdateQty = (id, delta)=>{
        const updated = cart.map((item)=>{
            if (item.id === id) {
                const nextQty = item.quantity + delta;
                if (nextQty > item.stock) return item;
                return nextQty > 0 ? {
                    ...item,
                    quantity: nextQty
                } : null;
            }
            return item;
        }).filter(Boolean);
        updateCartStorage(updated);
    };
    const handleRemoveItem = (id)=>{
        updateCartStorage(cart.filter((item)=>item.id !== id));
    };
    const handleClearCart = ()=>{
        if (cart.length === 0) return;
        updateCartStorage([]);
        setCashReceived("");
    };
    const subtotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PosPage.useMemo[subtotal]": ()=>cart.reduce({
                "PosPage.useMemo[subtotal]": (acc, item)=>acc + item.price * item.quantity
            }["PosPage.useMemo[subtotal]"], 0)
    }["PosPage.useMemo[subtotal]"], [
        cart
    ]);
    const iva = Number((subtotal * 0.13).toFixed(2));
    const total = Number((subtotal + iva).toFixed(2));
    const numericCashReceived = parseFloat(cashReceived) || 0;
    const changeDue = numericCashReceived >= total ? Number((numericCashReceived - total).toFixed(2)) : 0;
    const isCashInsufficient = paymentMethod === "cash" && numericCashReceived > 0 && numericCashReceived < total;
    const canCheckout = cart.length > 0 && isShiftOpen && !isProcessing && (paymentMethod !== "cash" || numericCashReceived >= total && numericCashReceived > 0);
    // Manejador de cobro de orden conectado al backend
    const handleCheckout = async ()=>{
        if (!canCheckout) {
            if (!isShiftOpen) setShowShiftWarning(true);
            return;
        }
        try {
            setIsProcessing(true);
            const cartPayload = cart.map((item)=>({
                    id: item.productId,
                    sku: item.sku,
                    name: item.name,
                    brand: item.brand,
                    price: item.price,
                    quantity: item.quantity,
                    stock: item.stock
                }));
            // 1. Guardar la venta en Supabase y descontar stock
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processSaleInDB"])({
                branchName: (user?.branch || currentBranch || "Santa Ana").trim(),
                cashierId: user?.id || null,
                cashierName: cashierName || user?.name || "Cajero",
                paymentMethod,
                items: cart,
                subtotal,
                tax: iva,
                total,
                cashReceived: paymentMethod === "cash" ? Number(cashReceived) : undefined,
                changeReturned: paymentMethod === "cash" ? changeDue : undefined
            });
            // 2. Feedback visual y reinicio de orden (Aumentar el número correlativo)
            setTicketSuccess(result.ticketNumber);
            updateCartStorage([]);
            setCashReceived("");
            setOrderNumber((prev)=>{
                const next = prev + 1;
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.setItem(`pos_order_num_${currentBranch}`, next.toString());
                }
                return next;
            });
            // 3. Refrescar el stock del catálogo
            await loadBranchProducts();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error al procesar la venta";
            alert(msg);
        } finally{
            setIsProcessing(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans select-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/pos/page.tsx",
                lineNumber: 961,
                columnNumber: 7
            }, this),
            !isShiftOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-amber-800 text-xs font-semibold",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                className: "w-4 h-4 text-amber-600 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 973,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Turno cerrado: dirígete a Caja para registrar fondo inicial y cobrar[cite: 1, 2]."
                            }, void 0, false, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 975,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/pos/page.tsx",
                        lineNumber: 971,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/caja",
                        className: "inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Ir a Caja"
                            }, void 0, false, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 987,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                className: "w-3.5 h-3.5"
                            }, void 0, false, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 989,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/pos/page.tsx",
                        lineNumber: 979,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/pos/page.tsx",
                lineNumber: 969,
                columnNumber: 9
            }, this),
            ticketSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold shadow-md animate-in slide-in-from-top-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 1007,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "¡Venta registrada con éxito! Comprobante emitido: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: ticketSuccess
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1011,
                                        columnNumber: 65
                                    }, this),
                                    "[cite: 1, 4]"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 1009,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/pos/page.tsx",
                        lineNumber: 1005,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setTicketSuccess(null),
                        className: "p-1 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/pos/page.tsx",
                            lineNumber: 1027,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/pos/page.tsx",
                        lineNumber: 1017,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/pos/page.tsx",
                lineNumber: 1003,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 p-6 overflow-y-auto space-y-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-slate-200 rounded-xl p-3 bg-white flex items-center gap-3 shadow-2xs focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scan$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scan$3e$__["Scan"], {
                                        className: "w-5 h-5 text-sky-600 shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1045,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: scanInputRef,
                                        type: "text",
                                        autoFocus: true,
                                        value: searchQuery,
                                        onKeyDown: handleScannerKeyDown,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        placeholder: "Escanear código de barras o buscar por SKU / Nombre...",
                                        className: "w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1047,
                                        columnNumber: 13
                                    }, this),
                                    searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setSearchQuery(""),
                                        className: "text-slate-400 hover:text-slate-600 text-xs px-2 cursor-pointer",
                                        children: "Limpiar"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1069,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 1043,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 overflow-x-auto pb-1",
                                children: CATEGORIES.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setActiveCategory(cat),
                                        className: `px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0 ${activeCategory === cat ? "bg-[#0284C7] text-white border-[#0284C7] shadow-xs" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`,
                                        children: cat === "All" ? "Todos" : cat
                                    }, cat, false, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1093,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 1089,
                                columnNumber: 11
                            }, this),
                            isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-24 flex flex-col items-center justify-center text-slate-400 gap-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-7 h-7 animate-spin text-sky-600"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1127,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-medium",
                                        children: [
                                            "Cargando inventario de ",
                                            currentBranch,
                                            "..."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1129,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 1125,
                                columnNumber: 13
                            }, this) : filteredProducts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4",
                                children: filteredProducts.map((item)=>{
                                    const isOutOfStock = item.stock <= 0;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>handleAddToCart(item),
                                        className: `bg-white border rounded-2xl overflow-hidden shadow-xs transition-all flex flex-col group ${isOutOfStock ? "border-slate-200 opacity-60 cursor-not-allowed" : "border-slate-200 hover:border-sky-400 hover:shadow-md cursor-pointer active:scale-[0.98]"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-32 bg-slate-50 relative flex items-center justify-center border-b border-slate-100 overflow-hidden",
                                                children: item.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: item.image,
                                                    alt: item.name,
                                                    fill: true,
                                                    unoptimized: true,
                                                    sizes: "(max-width: 768px) 100vw, 25vw",
                                                    className: "object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/pos/page.tsx",
                                                    lineNumber: 1167,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 border-2 border-slate-300 border-dashed rounded-xl flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                        className: "w-5 h-5 text-slate-400 stroke-[1.5]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1187,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/pos/page.tsx",
                                                    lineNumber: 1185,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1163,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3.5 flex-1 flex flex-col justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start justify-between gap-1 mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs font-bold text-slate-900 leading-snug break-words",
                                                                        children: item.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                                        lineNumber: 1203,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `text-[10px] px-1.5 py-0.5 rounded-md font-extrabold shrink-0 ${isOutOfStock ? "bg-rose-50 text-rose-600" : item.stock <= 5 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`,
                                                                        children: isOutOfStock ? "Agotado" : item.stock
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                                        lineNumber: 1206,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/pos/page.tsx",
                                                                lineNumber: 1201,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[11px] text-slate-500 line-clamp-2 leading-tight",
                                                                children: item.brand
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/pos/page.tsx",
                                                                lineNumber: 1218,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1199,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-extrabold text-slate-900 mt-3",
                                                        children: [
                                                            "$",
                                                            item.price.toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1222,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1197,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1145,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 1135,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-16 text-center text-slate-400 text-xs",
                                children: [
                                    "No se encontraron productos coincidentes en el inventario de ",
                                    currentBranch,
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 1231,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/pos/page.tsx",
                        lineNumber: 1041,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "w-[400px] bg-white border-l border-slate-200 flex flex-col h-full shadow-xs shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-5 py-4 border-b border-slate-100 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-bold text-xs text-slate-800",
                                                children: "Current Order"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1240,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100",
                                                children: [
                                                    "#",
                                                    hasHydrated ? orderNumber : "—"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1241,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1239,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleClearCart,
                                        title: "Vaciar Orden Completa",
                                        className: "text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50 cursor-pointer",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/pos/page.tsx",
                                            lineNumber: 1251,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1245,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 1238,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto px-5 divide-y divide-slate-100",
                                suppressHydrationWarning: true,
                                children: cart.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-2xl",
                                            children: "🛒"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/pos/page.tsx",
                                            lineNumber: 1260,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-slate-600",
                                            children: "No hay productos en la orden"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/pos/page.tsx",
                                            lineNumber: 1261,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-slate-400 max-w-[200px]",
                                            children: "Selecciona un producto del catálogo o escanea su código de barras[cite: 1, 6]."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/pos/page.tsx",
                                            lineNumber: 1262,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/pos/page.tsx",
                                    lineNumber: 1259,
                                    columnNumber: 15
                                }, this) : cart.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-3.5 flex items-center justify-between gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0 pr-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-xs font-bold text-slate-800 leading-snug line-clamp-2 break-words",
                                                        title: item.name,
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1270,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] text-slate-400 font-medium truncate mt-0.5",
                                                        children: [
                                                            item.brand,
                                                            " • ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-mono",
                                                                children: [
                                                                    "SKU: ",
                                                                    item.sku
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/pos/page.tsx",
                                                                lineNumber: 1277,
                                                                columnNumber: 38
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1276,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1269,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-24 shrink-0 flex items-center justify-between border border-slate-200 rounded-lg bg-white shadow-2xs h-7 px-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>handleUpdateQty(item.id, -1),
                                                        className: "p-1 hover:bg-slate-100 text-slate-500 rounded transition-colors cursor-pointer",
                                                        title: "Reducir cantidad",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                            className: "w-3 h-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/pos/page.tsx",
                                                            lineNumber: 1287,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1281,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-slate-800 tabular-nums",
                                                        children: item.quantity
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1289,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>handleUpdateQty(item.id, 1),
                                                        disabled: item.quantity >= item.stock,
                                                        className: "p-1 hover:bg-slate-100 text-slate-500 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed",
                                                        title: "Aumentar cantidad",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            className: "w-3 h-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/pos/page.tsx",
                                                            lineNumber: 1299,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1292,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1280,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-16 shrink-0 text-right",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-extrabold text-slate-800 font-mono tabular-nums block",
                                                    children: [
                                                        "$",
                                                        (item.price * item.quantity).toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/pos/page.tsx",
                                                    lineNumber: 1303,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1302,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleRemoveItem(item.id),
                                                className: "shrink-0 p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer",
                                                title: "Eliminar producto",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/pos/page.tsx",
                                                    lineNumber: 1313,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1307,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1268,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 1254,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-5 py-4 border-t border-slate-100 bg-[#FAFAFA] space-y-2.5 text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-slate-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Subtotal"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1321,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold tabular-nums",
                                                children: [
                                                    "$",
                                                    subtotal.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1322,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1320,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-blue-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "IVA (13%)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1325,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold tabular-nums",
                                                children: [
                                                    "$",
                                                    iva.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1326,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1324,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center text-base font-black text-slate-900 pt-2 border-t border-slate-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Total a Pagar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1329,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg text-slate-900 tabular-nums",
                                                children: [
                                                    "$",
                                                    total.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1330,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1328,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-3 gap-2 pt-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setPaymentMethod("cash"),
                                                className: `py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${paymentMethod === "cash" ? "bg-sky-50 border-sky-500 text-sky-700 shadow-2xs" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__["Banknote"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1344,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Efectivo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1345,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1335,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setPaymentMethod("card");
                                                    setCashReceived("");
                                                },
                                                className: `py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${paymentMethod === "card" ? "bg-sky-50 border-sky-500 text-sky-700 shadow-2xs" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1359,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Tarjeta"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1360,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1347,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setPaymentMethod("transfer");
                                                    setCashReceived("");
                                                },
                                                className: `py-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${paymentMethod === "transfer" ? "bg-sky-50 border-sky-500 text-sky-700 shadow-2xs" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1374,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Transferencia"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1375,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1362,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1334,
                                        columnNumber: 13
                                    }, this),
                                    paymentMethod === "cash" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-2 border-t border-slate-200/80 space-y-2 animate-in fade-in duration-150",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1",
                                                                children: "Dinero Recibido ($)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/pos/page.tsx",
                                                                lineNumber: 1382,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs",
                                                                        children: "$"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                                        lineNumber: 1386,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        step: "0.01",
                                                                        min: "0",
                                                                        value: cashReceived,
                                                                        onChange: (e)=>setCashReceived(e.target.value),
                                                                        placeholder: "0.00",
                                                                        className: `w-full pl-6 pr-2 py-1.5 bg-white border rounded-xl text-xs font-bold font-mono text-slate-900 focus:outline-none transition-colors ${isCashInsufficient ? "border-rose-400 focus:border-rose-500 bg-rose-50/30" : "border-slate-300 focus:border-sky-500"}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                                        lineNumber: 1389,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/pos/page.tsx",
                                                                lineNumber: 1385,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1381,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1",
                                                                children: "Cambio / Vuelto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/pos/page.tsx",
                                                                lineNumber: 1405,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative flex items-center h-[34px] px-3 bg-emerald-50/70 border border-emerald-200 rounded-xl",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"], {
                                                                        className: "w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                                        lineNumber: 1409,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-mono font-extrabold text-sm text-emerald-700 tabular-nums",
                                                                        children: [
                                                                            "$",
                                                                            changeDue.toFixed(2)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                                        lineNumber: 1410,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/pos/page.tsx",
                                                                lineNumber: 1408,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1404,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1380,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5 flex-wrap pt-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setCashReceived(total.toFixed(2)),
                                                        className: "px-2 py-1 bg-white border border-emerald-300 hover:border-sky-400 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs",
                                                        children: [
                                                            "Exacto ($",
                                                            total.toFixed(2),
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/pos/page.tsx",
                                                        lineNumber: 1417,
                                                        columnNumber: 19
                                                    }, this),
                                                    CASH_SUGGESTIONS.filter((val)=>val >= total).map((val)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setCashReceived(val.toFixed(2)),
                                                            className: "px-2.5 py-1 bg-white border border-emerald-300 hover:border-sky-400 hover:bg-sky-50 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs",
                                                            children: [
                                                                "$",
                                                                val
                                                            ]
                                                        }, val, true, {
                                                            fileName: "[project]/src/app/pos/page.tsx",
                                                            lineNumber: 1425,
                                                            columnNumber: 21
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1416,
                                                columnNumber: 17
                                            }, this),
                                            isCashInsufficient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] font-semibold text-rose-600",
                                                children: [
                                                    "Faltan $",
                                                    (total - numericCashReceived).toFixed(2),
                                                    " para completar el pago."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1436,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1379,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        disabled: !canCheckout,
                                        onClick: handleCheckout,
                                        className: `w-full mt-2 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all ${canCheckout ? "bg-[#0284C7] hover:bg-sky-700 text-white cursor-pointer active:scale-[0.99]" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`,
                                        children: [
                                            isProcessing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1453,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1455,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: isProcessing ? "Procesando Venta..." : paymentMethod === "cash" && numericCashReceived >= total && numericCashReceived > 0 ? `Cobrar $${total.toFixed(2)} (Entregar $${changeDue.toFixed(2)})` : "Cobrar & Imprimir Ticket"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/pos/page.tsx",
                                                lineNumber: 1457,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/pos/page.tsx",
                                        lineNumber: 1442,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/pos/page.tsx",
                                lineNumber: 1319,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/pos/page.tsx",
                        lineNumber: 1237,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/pos/page.tsx",
                lineNumber: 1037,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShiftWarningModal, {
                isOpen: showShiftWarning,
                onClose: ()=>setShowShiftWarning(false)
            }, void 0, false, {
                fileName: "[project]/src/app/pos/page.tsx",
                lineNumber: 1468,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/pos/page.tsx",
        lineNumber: 959,
        columnNumber: 5
    }, this);
}
_s(PosPage, "P0m/fmSmUszQ2+0dwJDm2ZLRmKc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$ShiftContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShift"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c1 = PosPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "ShiftWarningModal");
__turbopack_context__.k.register(_c1, "PosPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/services/cashService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "closeCashShiftInDB",
    ()=>closeCashShiftInDB,
    "fetchCurrentShiftExpenses",
    ()=>fetchCurrentShiftExpenses,
    "getAdminShiftAudit",
    ()=>getAdminShiftAudit,
    "getNextOrderNumber",
    ()=>getNextOrderNumber,
    "getPendingDiscrepancyAlert",
    ()=>getPendingDiscrepancyAlert,
    "getShiftSalesBreakdown",
    ()=>getShiftSalesBreakdown,
    "openCashShiftInDB",
    ()=>openCashShiftInDB,
    "recordExpenseInDB",
    ()=>recordExpenseInDB,
    "resolveShiftAuditInDB",
    ()=>resolveShiftAuditInDB
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function openCashShiftInDB(payload) {
    const { branchName, cashierId, initialCash } = payload;
    // 1. Obtener la sucursal activa
    const { data: branch, error: branchErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").ilike("name", branchName).single();
    if (branchErr || !branch) {
        throw new Error(`No se encontró la sucursal: ${branchName}`);
    }
    // 2. Verificar si ya existe un turno abierto en la sucursal
    const { data: existingShift } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").select("id").eq("branch_id", branch.id).eq("status", "open").maybeSingle();
    if (existingShift) {
        throw new Error("Ya existe un turno abierto en esta sucursal.");
    }
    // 3. Insertar el nuevo turno
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").insert([
        {
            branch_id: branch.id,
            cashier_id: cashierId || null,
            initial_cash: Number(initialCash),
            status: "open",
            opened_at: new Date().toISOString()
        }
    ]).select().single();
    if (error) {
        throw new Error(`Error al abrir turno: ${error.message}`);
    }
    return data;
}
async function recordExpenseInDB(payload) {
    const { branchName, amount, category, concept } = payload;
    // 1. Obtener la sucursal
    const { data: branch, error: branchErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").ilike("name", branchName).single();
    if (branchErr || !branch) {
        throw new Error(`No se encontró la sucursal: ${branchName}`);
    }
    // 2. Obtener el turno abierto
    const { data: activeShift, error: shiftErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").select("id").eq("branch_id", branch.id).eq("status", "open").order("opened_at", {
        ascending: false
    }).limit(1).maybeSingle();
    if (shiftErr || !activeShift) {
        throw new Error("No hay un turno abierto para registrar gastos.");
    }
    // 3. Insertar el movimiento de egreso
    const fullDescription = `${category} - ${concept}`;
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_movements").insert([
        {
            shift_id: activeShift.id,
            amount: Number(amount),
            type: "egress",
            description: fullDescription,
            created_at: new Date().toISOString()
        }
    ]).select().single();
    if (error) {
        throw new Error(`Error al registrar el gasto: ${error.message}`);
    }
    return data;
}
async function fetchCurrentShiftExpenses(branchName) {
    // 1. Obtener la sucursal
    const { data: branch } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").ilike("name", branchName).single();
    if (!branch) return [];
    // 2. Obtener el turno abierto
    const { data: activeShift } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").select("id").eq("branch_id", branch.id).eq("status", "open").order("opened_at", {
        ascending: false
    }).limit(1).maybeSingle();
    if (!activeShift) return [];
    // 3. Obtener los egresos de 'cash_movements'
    const { data: movements, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_movements").select("id, amount, description, created_at").eq("shift_id", activeShift.id).order("created_at", {
        ascending: false
    });
    if (error || !movements) return [];
    // 4. Mapear a la estructura que consume el estado de la UI
    return movements.map((m)=>{
        const parts = (m.description || "").split(" - ");
        return {
            id: m.id,
            amount: Number(m.amount),
            category: parts[0] || "Gasto Operativo",
            concept: parts.slice(1).join(" - ") || m.description,
            time: new Date(m.created_at).toLocaleTimeString("es-SV", {
                hour: "2-digit",
                minute: "2-digit"
            })
        };
    });
}
async function getShiftSalesBreakdown(branchName) {
    const initial = {
        cash: 0,
        card: 0,
        transfer: 0,
        total: 0
    };
    // 1. Localizar sucursal
    const { data: branch } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").ilike("name", branchName).single();
    if (!branch) return initial;
    // 2. Localizar turno abierto
    const { data: activeShift } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").select("id").eq("branch_id", branch.id).eq("status", "open").order("opened_at", {
        ascending: false
    }).limit(1).maybeSingle();
    if (!activeShift) return initial;
    // 3. Obtener ventas del turno
    const { data: sales } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sales").select("payment_method, total").eq("shift_id", activeShift.id);
    if (!sales || sales.length === 0) return initial;
    // 4. Sumar por cada método de pago
    return sales.reduce((acc, sale)=>{
        const amount = Number(sale.total) || 0;
        if (sale.payment_method === "cash") acc.cash += amount;
        else if (sale.payment_method === "card") acc.card += amount;
        else if (sale.payment_method === "transfer") acc.transfer += amount;
        acc.total += amount;
        return acc;
    }, initial);
}
async function closeCashShiftInDB(payload) {
    const { branchName, countedCash, expectedCash, totalSales, totalExpenses, difference, notes } = payload;
    // 1. Obtener la sucursal activa
    const { data: branch, error: branchErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").ilike("name", branchName).single();
    if (branchErr || !branch) {
        throw new Error(`No se encontró la sucursal: ${branchName}`);
    }
    // 2. Buscar el turno abierto actual
    const { data: activeShift, error: shiftErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").select("id, initial_cash").eq("branch_id", branch.id).eq("status", "open").order("opened_at", {
        ascending: false
    }).limit(1).maybeSingle();
    if (shiftErr || !activeShift) {
        throw new Error("No existe ningún turno activo para cerrar en esta sucursal.");
    }
    // 3. CÁLCULO SEGURO DE DIFERENCIA:
    // Si en el payload difference llegó en 0 o undefined, se calcula explícitamente:
    const finalCounted = Number(countedCash) || 0;
    const finalExpected = Number(expectedCash) || 0;
    const calculatedDiff = Number((finalCounted - finalExpected).toFixed(2));
    const finalDifference = isNaN(calculatedDiff) ? Number((difference || 0).toFixed(2)) : calculatedDiff;
    const isExact = Math.abs(finalDifference) === 0;
    const autoAuditStatus = isExact ? "reviewed" : "pending_review";
    const autoResolution = isExact ? "CUADRE_EXACTO" : null;
    const autoAuditNotes = isExact ? "Arqueo conforme: cuadre de caja exacto al 100%." : null;
    // 4. Asentar el cierre con la diferencia real en Supabase
    const { error: updateErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").update({
        status: "closed",
        closed_at: new Date().toISOString(),
        counted_cash: Number(finalCounted.toFixed(2)),
        expected_cash: Number(finalExpected.toFixed(2)),
        total_sales: Number((totalSales || 0).toFixed(2)),
        total_expenses: Number((totalExpenses || 0).toFixed(2)),
        difference: finalDifference,
        cashier_notes: notes?.trim() || null,
        audit_status: autoAuditStatus,
        audit_resolution: autoResolution,
        audit_notes: autoAuditNotes
    }).eq("id", activeShift.id);
    if (updateErr) {
        throw new Error(`Error al registrar el Corte Z: ${updateErr.message}`);
    }
    return {
        shiftId: activeShift.id,
        difference: finalDifference
    };
}
async function getNextOrderNumber(branchName) {
    // 1. Obtener sucursal
    const { data: branch } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").ilike("name", branchName).single();
    if (!branch) return 1;
    // 2. Obtener turno abierto
    const { data: activeShift } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").select("id").eq("branch_id", branch.id).eq("status", "open").order("opened_at", {
        ascending: false
    }).limit(1).maybeSingle();
    if (!activeShift) return 1;
    // 3. Contar ventas realizadas en este turno
    const { count, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sales").select("*", {
        count: "exact",
        head: true
    }).eq("shift_id", activeShift.id);
    if (error || count === null) return 1;
    return count + 1;
}
async function getPendingDiscrepancyAlert() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").select(`
      id,
      difference,
      closed_at,
      branches (
        name
      )
    `).eq("status", "closed").eq("audit_status", "pending_review").neq("difference", 0).order("closed_at", {
        ascending: false
    }).limit(1).maybeSingle();
    if (error || !data) return null;
    // Extraer el nombre de la sucursal de la relación
    const branchData = Array.isArray(data.branches) ? data.branches[0] : data.branches;
    return {
        shiftId: data.id,
        branchName: branchData?.name || "Sucursal",
        difference: Number(data.difference),
        closedAt: data.closed_at
    };
}
async function getAdminShiftAudit(branchName, dateStr) {
    const defaultData = {
        shiftId: null,
        status: "none",
        auditStatus: "pending_review",
        auditResolution: "MERMA_ACEPTADA",
        auditNotes: "",
        initialFund: 0,
        cashSales: 0,
        cardSales: 0,
        transferSales: 0,
        totalSales: 0,
        expenses: 0,
        reportedCountedCash: 0,
        operatorNotes: "",
        operatorName: "Sin operador"
    };
    try {
        // 1. Localizar ID de la sucursal
        const { data: branch, error: branchErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").ilike("name", branchName).single();
        if (branchErr || !branch) return defaultData;
        // 2. Rango de 24 horas del día seleccionado (hora salvadoreña UTC-6)
        const startOfDay = `${dateStr}T00:00:00-06:00`;
        const endOfDay = `${dateStr}T23:59:59.999-06:00`;
        // 3. Buscar turno registrado en esa jornada
        const { data: shift, error: shiftErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").select("*").eq("branch_id", branch.id).gte("opened_at", startOfDay).lte("opened_at", endOfDay).order("opened_at", {
            ascending: false
        }).limit(1).maybeSingle();
        if (shiftErr || !shift) return defaultData;
        // 4. Consultar ventas y egresos vinculados al turno
        const [salesRes, expensesRes] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sales").select("payment_method, total").eq("shift_id", shift.id),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_movements").select("amount").eq("shift_id", shift.id).eq("type", "egress")
        ]);
        let cash = 0;
        let card = 0;
        let transfer = 0;
        let totalSales = 0;
        if (salesRes.data && salesRes.data.length > 0) {
            salesRes.data.forEach((s)=>{
                const val = Number(s.total) || 0;
                if (s.payment_method === "cash") cash += val;
                else if (s.payment_method === "card") card += val;
                else if (s.payment_method === "transfer") transfer += val;
                totalSales += val;
            });
        } else {
            totalSales = Number(shift.total_sales) || 0;
        }
        const calculatedExpenses = (expensesRes.data || []).reduce((acc, curr)=>acc + (Number(curr.amount) || 0), Number(shift.total_expenses) || 0);
        return {
            shiftId: shift.id,
            status: shift.status || "closed",
            auditStatus: shift.audit_status || "pending_review",
            auditResolution: shift.audit_resolution || "MERMA_ACEPTADA",
            auditNotes: shift.audit_notes || "",
            initialFund: Number(shift.initial_cash) || 0,
            cashSales: cash,
            cardSales: card,
            transferSales: transfer,
            totalSales,
            expenses: calculatedExpenses,
            reportedCountedCash: Number(shift.counted_cash) || 0,
            operatorNotes: shift.notes || shift.cashier_notes || "",
            operatorName: shift.cashier_name || "Maria G."
        };
    } catch (error) {
        console.error("Error en getAdminShiftAudit:", error);
        return defaultData;
    }
}
async function resolveShiftAuditInDB(payload) {
    const { shiftId, resolutionType, notes } = payload;
    if (!shiftId) {
        throw new Error("No se especificó el identificador del turno para auditar.");
    }
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").update({
        audit_status: "reviewed",
        audit_resolution: resolutionType,
        audit_notes: notes.trim()
    }).eq("id", shiftId).select().single();
    if (error) {
        throw new Error(`Error al asentar la resolución contable: ${error.message}`);
    }
    return data;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/services/inventoryService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adjustProductStockInDB",
    ()=>adjustProductStockInDB,
    "createProductInDB",
    ()=>createProductInDB,
    "deleteProductFromDB",
    ()=>deleteProductFromDB,
    "fetchBranchesPerformance",
    ()=>fetchBranchesPerformance,
    "fetchDashboardSalesMetrics",
    ()=>fetchDashboardSalesMetrics,
    "fetchDashboardStockAlerts",
    ()=>fetchDashboardStockAlerts,
    "fetchProductKardex",
    ()=>fetchProductKardex,
    "fetchTicketsByBranchAndDate",
    ()=>fetchTicketsByBranchAndDate,
    "processSaleInDB",
    ()=>processSaleInDB,
    "searchDashboardInventory",
    ()=>searchDashboardInventory,
    "transferProductStockInDB",
    ()=>transferProductStockInDB,
    "updateProductInDB",
    ()=>updateProductInDB
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function createProductInDB(payload) {
    const cleanSku = payload.sku.trim().toUpperCase();
    const cleanBarcode = payload.barcode?.trim() || null;
    const cleanBrand = payload.brand?.trim() ? payload.brand.trim() : "Genérico";
    const { data: newProduct, error: productError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("products").insert([
        {
            sku: cleanSku,
            barcode: cleanBarcode,
            name: payload.name.trim(),
            brand: cleanBrand,
            category: payload.category,
            description: payload.description.trim(),
            cost: Number(payload.cost),
            price: Number(payload.price),
            image_url: payload.image || null
        }
    ]).select().single();
    if (productError) {
        if (productError.code === "23505") {
            throw new Error("Ya existe un producto registrado con ese SKU o Código de Barras.");
        }
        throw productError;
    }
    const { data: branches, error: branchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id, name");
    if (branchError) throw branchError;
    const inventoryRows = (branches || []).map((b)=>{
        let stock = 0;
        if (b.name === "Santa Ana") stock = payload.initialStock?.santaAna ?? 0;
        if (b.name === "Ahuachapán") stock = payload.initialStock?.ahuachapan ?? 0;
        if (b.name === "Sonsonate") stock = payload.initialStock?.sonsonate ?? 0;
        return {
            branch_id: b.id,
            product_id: newProduct.id,
            stock,
            min_stock: 5
        };
    });
    const { error: invError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").insert(inventoryRows);
    if (invError) throw invError;
    return newProduct;
}
async function adjustProductStockInDB(payload) {
    const { productId, branchName, type, quantity, reason, userId } = payload;
    const delta = type === "add" ? quantity : -quantity;
    const { data: branch, error: branchErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").eq("name", branchName).single();
    if (branchErr || !branch) {
        throw new Error(`No se encontró la sucursal: ${branchName}`);
    }
    const { data: currentInv, error: invErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").select("id, stock").eq("product_id", productId).eq("branch_id", branch.id).single();
    if (invErr || !currentInv) {
        throw new Error("No existe registro de inventario para este producto en esta sucursal.");
    }
    const currentStock = currentInv.stock ?? 0;
    const newStock = currentStock + delta;
    if (newStock < 0) {
        throw new Error(`Stock insuficiente. Solo hay ${currentStock} unidades disponibles.`);
    }
    const { error: updateErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").update({
        stock: newStock
    }).eq("id", currentInv.id);
    if (updateErr) throw updateErr;
    const movementType = type === "add" ? "INGRESO" : "AJUSTE";
    const { error: movErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("stock_movements").insert([
        {
            product_id: productId,
            branch_id: branch.id,
            user_id: userId || null,
            movement_type: movementType,
            quantity: delta,
            stock_after: newStock,
            reference: reason
        }
    ]);
    if (movErr) {
        console.error("Error al registrar movimiento en Kardex:", movErr.message);
    }
    return {
        newStock
    };
}
async function updateProductInDB(payload) {
    const cleanSku = payload.sku.trim().toUpperCase();
    const cleanBarcode = payload.barcode?.trim() || null;
    const cleanBrand = payload.brand?.trim() ? payload.brand.trim() : "Genérico";
    const { error: productErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("products").update({
        sku: cleanSku,
        barcode: cleanBarcode,
        name: payload.name.trim(),
        brand: cleanBrand,
        category: payload.category,
        description: payload.description.trim(),
        cost: Number(payload.cost),
        price: Number(payload.price),
        image_url: payload.image || null
    }).eq("id", payload.id);
    if (productErr) {
        if (productErr.code === "23505") {
            throw new Error("Ya existe un producto con ese SKU o Código de Barras.");
        }
        throw productErr;
    }
    const { data: branchList, error: branchErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id, name");
    if (branchErr) throw branchErr;
    const normalize = (str)=>str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const updatePromises = (branchList || []).map((b)=>{
        const branchData = payload.branches.find((entry)=>normalize(entry.branchName) === normalize(b.name));
        const stockToSet = branchData ? Math.max(0, Number(branchData.stock) || 0) : 0;
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").upsert({
            branch_id: b.id,
            product_id: payload.id,
            stock: stockToSet
        }, {
            onConflict: "branch_id,product_id"
        });
    });
    const results = await Promise.all(updatePromises);
    const failedUpsert = results.find((r)=>r.error);
    if (failedUpsert?.error) throw failedUpsert.error;
    return true;
}
async function deleteProductFromDB(productId) {
    const { error: invErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").delete().eq("product_id", productId);
    if (invErr) {
        console.error("Error al eliminar inventario de sucursales:", invErr);
        throw new Error(`Error en branch_inventory: ${invErr.message}`);
    }
    const { error: movErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("stock_movements").delete().eq("product_id", productId);
    if (movErr) {
        console.error("Error al eliminar historial de movimientos:", movErr);
        throw new Error(`Error en stock_movements: ${movErr.message}`);
    }
    const { error: productErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("products").delete().eq("id", productId);
    if (productErr) {
        console.error("Error al eliminar producto maestro:", productErr);
        throw new Error(`Error en products: ${productErr.message}`);
    }
    return true;
}
async function transferProductStockInDB(payload) {
    const { productId, sourceBranchName, targetBranchName, quantity, userId } = payload;
    if (sourceBranchName === targetBranchName) {
        throw new Error("La sucursal de origen y destino no pueden ser iguales.");
    }
    if (quantity <= 0) {
        throw new Error("La cantidad debe ser mayor a 0.");
    }
    const { data: branches, error: branchErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id, name").in("name", [
        sourceBranchName,
        targetBranchName
    ]);
    if (branchErr || !branches || branches.length < 2) {
        throw new Error("No se pudieron verificar las sucursales de origen y destino.");
    }
    const sourceBranch = branches.find((b)=>b.name === sourceBranchName);
    const targetBranch = branches.find((b)=>b.name === targetBranchName);
    const { data: sourceInv, error: srcInvErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").select("id, stock").eq("product_id", productId).eq("branch_id", sourceBranch.id).single();
    if (srcInvErr || !sourceInv) {
        throw new Error(`El producto no tiene registro de stock en ${sourceBranchName}.`);
    }
    const currentSourceStock = sourceInv.stock ?? 0;
    if (currentSourceStock < quantity) {
        throw new Error(`Stock insuficiente en ${sourceBranchName}. Disponible: ${currentSourceStock}, solicitado: ${quantity}.`);
    }
    const { data: targetInv } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").select("id, stock").eq("product_id", productId).eq("branch_id", targetBranch.id).maybeSingle();
    const currentTargetStock = targetInv?.stock ?? 0;
    const newSourceStock = currentSourceStock - quantity;
    const newTargetStock = currentTargetStock + quantity;
    const { error: updateSrcErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").update({
        stock: newSourceStock
    }).eq("id", sourceInv.id);
    if (updateSrcErr) throw updateSrcErr;
    const { error: upsertTgtErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").upsert({
        branch_id: targetBranch.id,
        product_id: productId,
        stock: newTargetStock
    }, {
        onConflict: "branch_id,product_id"
    });
    if (upsertTgtErr) throw upsertTgtErr;
    const movements = [
        {
            product_id: productId,
            branch_id: sourceBranch.id,
            user_id: userId || null,
            movement_type: "TRASLADO",
            quantity: -quantity,
            stock_after: newSourceStock,
            reference: `Traslado enviado hacia ${targetBranchName}`
        },
        {
            product_id: productId,
            branch_id: targetBranch.id,
            user_id: userId || null,
            movement_type: "TRASLADO",
            quantity: quantity,
            stock_after: newTargetStock,
            reference: `Traslado recibido desde ${sourceBranchName}`
        }
    ];
    const { error: movErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("stock_movements").insert(movements);
    if (movErr) {
        console.error("Aviso Kardex:", movErr.message);
    }
    return {
        newSourceStock,
        newTargetStock
    };
}
async function fetchProductKardex(productId, branchName) {
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("stock_movements").select(`
      id,
      created_at,
      movement_type,
      quantity,
      stock_after,
      reference,
      branches (
        id,
        name
      ),
      profiles (
        id,
        full_name,
        username
      )
    `).eq("product_id", productId).order("created_at", {
        ascending: false
    });
    if (branchName && branchName !== "ALL" && branchName !== "Todas las sedes") {
        const { data: branchData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").ilike("name", branchName).maybeSingle();
        if (branchData) {
            query = query.eq("branch_id", branchData.id);
        }
    }
    const { data, error } = await query;
    if (error) {
        console.error("Error al consultar Kardex:", error);
        throw new Error(`Error en Kardex: ${error.message}`);
    }
    const movementRows = data ?? [];
    return movementRows.map((row)=>{
        const branchRecord = Array.isArray(row.branches) ? row.branches[0] : row.branches;
        const profileRecord = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
        const dateObj = new Date(row.created_at);
        const formattedDate = dateObj.toLocaleDateString("es-SV", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
        return {
            id: row.id,
            date: formattedDate,
            type: row.movement_type,
            branch: branchRecord?.name ?? "Sin sede",
            user: profileRecord?.full_name ?? profileRecord?.username ?? "Sistema",
            quantity: Number(row.quantity),
            stockAfter: Number(row.stock_after),
            reference: row.reference ?? "Sin detalle"
        };
    });
}
async function processSaleInDB(payload) {
    const { branchName, cashierId, paymentMethod, items, subtotal, tax, total, cashReceived, changeReturned } = payload;
    if (!items || items.length === 0) {
        throw new Error("El carrito no tiene productos.");
    }
    let effectiveCashierId = cashierId || null;
    if (!effectiveCashierId) {
        const { data: authData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        effectiveCashierId = authData.user?.id || null;
    }
    const cleanBranch = (branchName || "").trim();
    const { data: branch, error: branchErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id, name").ilike("name", cleanBranch).maybeSingle();
    if (branchErr || !branch) {
        throw new Error(`No se encontró la sucursal: "${cleanBranch}"`);
    }
    const { data: activeShift, error: shiftErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cash_shifts").select("id, cashier_id").eq("branch_id", branch.id).eq("status", "open").order("opened_at", {
        ascending: false
    }).limit(1).maybeSingle();
    if (shiftErr || !activeShift) {
        throw new Error("No hay un turno de caja abierto en esta sucursal para asociar la venta.");
    }
    const finalCashierId = effectiveCashierId || activeShift.cashier_id;
    const branchPrefix = branch.name.substring(0, 2).toUpperCase();
    const ticketNumber = `T-${branchPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data: saleData, error: saleErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sales").insert([
        {
            ticket_number: ticketNumber,
            branch_id: branch.id,
            shift_id: activeShift.id,
            cashier_id: finalCashierId,
            payment_method: paymentMethod,
            subtotal: Number(subtotal),
            tax: Number(tax),
            total: Number(total),
            cash_received: cashReceived ? Number(cashReceived) : null,
            change_given: changeReturned ? Number(changeReturned) : null,
            created_at: new Date().toISOString()
        }
    ]).select("id").single();
    if (saleErr || !saleData) {
        throw new Error(`Error al guardar en tabla 'sales': ${saleErr?.message}`);
    }
    const saleId = saleData.id;
    for (const item of items){
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sale_items").insert([
            {
                sale_id: saleId,
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price,
                subtotal: Number((item.price * item.quantity).toFixed(2))
            }
        ]);
        const { data: invRecord } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").select("id, stock").eq("product_id", item.id).eq("branch_id", branch.id).maybeSingle();
        const currentStock = invRecord?.stock ?? 0;
        const newStock = Math.max(0, currentStock - item.quantity);
        if (invRecord) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").update({
                stock: newStock
            }).eq("id", invRecord.id);
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("stock_movements").insert([
            {
                product_id: item.id,
                branch_id: branch.id,
                user_id: finalCashierId,
                movement_type: "VENTA_POS",
                quantity: -item.quantity,
                stock_after: newStock,
                reference: `Ticket #${ticketNumber}`
            }
        ]);
    }
    return {
        ticketNumber,
        saleId,
        total
    };
}
async function fetchTicketsByBranchAndDate(branchName, dateStr) {
    const startOfDay = `${dateStr}T00:00:00.000Z`;
    const endOfDay = `${dateStr}T23:59:59.999Z`;
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sales").select(`
      id,
      ticket_number,
      payment_method,
      subtotal,
      tax,
      total,
      cash_received,
      change_given,
      created_at,
      branches!inner(name),
      profiles(full_name),
      sale_items(
        id,
        quantity,
        unit_price,
        products(name)
      )
    `).ilike("branches.name", `%${branchName.trim()}%`).gte("created_at", startOfDay).lte("created_at", endOfDay).order("created_at", {
        ascending: false
    });
    if (error) {
        console.error("Error al consultar ventas para auditoría:", error);
        return [];
    }
    const queryRows = data ?? [];
    return queryRows.map((sale)=>{
        const d = new Date(sale.created_at);
        const branchRecord = Array.isArray(sale.branches) ? sale.branches[0] : sale.branches;
        const profileRecord = Array.isArray(sale.profiles) ? sale.profiles[0] : sale.profiles;
        return {
            id: sale.id,
            ticketNumber: sale.ticket_number || "S/F",
            time: d.toLocaleTimeString("es-SV", {
                hour: "2-digit",
                minute: "2-digit"
            }),
            date: dateStr,
            branch: branchRecord?.name || branchName,
            cashier: profileRecord?.full_name || "Cajero",
            paymentMethod: sale.payment_method || "cash",
            subtotal: Number(sale.subtotal) || 0,
            tax: Number(sale.tax) || 0,
            total: Number(sale.total) || 0,
            cashReceived: sale.cash_received ? Number(sale.cash_received) : undefined,
            changeReturned: sale.change_given ? Number(sale.change_given) : undefined,
            items: (sale.sale_items || []).map((it)=>{
                const prod = Array.isArray(it.products) ? it.products[0] : it.products;
                return {
                    name: prod?.name || "Insumo Dental",
                    qty: Number(it.quantity) || 1,
                    unitPrice: Number(it.unit_price) || 0
                };
            })
        };
    });
}
async function searchDashboardInventory(query, branchKey = "all") {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];
    let targetBranchId = null;
    if (branchKey !== "all") {
        let branchNamePattern = "";
        if (branchKey === "santa-ana") branchNamePattern = "Santa Ana";
        if (branchKey === "ahuachapan") branchNamePattern = "Ahuachapán";
        if (branchKey === "sonsonate") branchNamePattern = "Sonsonate";
        const { data: bData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").ilike("name", `%${branchNamePattern}%`).maybeSingle();
        targetBranchId = bData?.id ?? null;
    }
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("products").select(`
      id,
      sku,
      barcode,
      name,
      brand,
      category,
      price,
      branch_inventory (
        stock,
        branch_id,
        branches (
          id,
          name
        )
      )
    `).or(`name.ilike.%${cleanQuery}%,sku.ilike.%${cleanQuery}%,barcode.ilike.%${cleanQuery}%`).limit(10);
    if (error) {
        console.error("Error al buscar productos en Dashboard:", error.message);
        return [];
    }
    const queryRows = data ?? [];
    const results = [];
    queryRows.forEach((prod)=>{
        const invList = prod.branch_inventory ?? [];
        if (targetBranchId) {
            const branchInv = invList.find((bi)=>bi.branch_id === targetBranchId);
            results.push({
                id: prod.id,
                sku: prod.sku,
                barcode: prod.barcode,
                name: prod.name,
                brand: prod.brand,
                category: prod.category,
                price: Number(prod.price) || 0,
                stock: branchInv?.stock ?? 0,
                branchName: branchInv?.branches?.name ?? "Sede seleccionada"
            });
        } else {
            const totalStock = invList.reduce((acc, curr)=>acc + (Number(curr.stock) || 0), 0);
            results.push({
                id: prod.id,
                sku: prod.sku,
                barcode: prod.barcode,
                name: prod.name,
                brand: prod.brand,
                category: prod.category,
                price: Number(prod.price) || 0,
                stock: totalStock,
                branchName: "Todas las sedes (Red)"
            });
        }
    });
    return results;
}
async function fetchDashboardStockAlerts(branchKey = "all") {
    let targetBranchId = null;
    if (branchKey !== "all") {
        let branchPattern = "";
        if (branchKey === "santa-ana") branchPattern = "Santa Ana";
        if (branchKey === "ahuachapan") branchPattern = "Ahuachapán";
        if (branchKey === "sonsonate") branchPattern = "Sonsonate";
        const { data: bData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").ilike("name", `%${branchPattern}%`).maybeSingle();
        if (bData) targetBranchId = bData.id;
    }
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branch_inventory").select(`
      id,
      stock,
      branch_id,
      branches (
        id,
        name
      ),
      products (
        id,
        name,
        brand
      )
    `).lte("stock", 5).order("stock", {
        ascending: true
    });
    if (targetBranchId) {
        query = query.eq("branch_id", targetBranchId);
    }
    const { data, error } = await query;
    if (error || !data) {
        console.error("Error al consultar alertas de stock:", error?.message);
        return {
            lowStockItems: [],
            outOfStockItems: []
        };
    }
    const queryRows = data ?? [];
    const lowStockItems = [];
    const outOfStockItems = [];
    queryRows.forEach((row)=>{
        const prod = Array.isArray(row.products) ? row.products[0] : row.products;
        const branch = Array.isArray(row.branches) ? row.branches[0] : row.branches;
        const currentStock = Number(row.stock) || 0;
        if (!prod) return;
        const alertItem = {
            id: `${row.id}-${prod.id}`,
            name: prod.name || "Insumo Dental",
            brand: prod.brand || "Genérico",
            branch: branch?.name || "Sede",
            stock: currentStock
        };
        if (currentStock === 0) {
            outOfStockItems.push(alertItem);
        } else if (currentStock > 0 && currentStock <= 5) {
            lowStockItems.push(alertItem);
        }
    });
    return {
        lowStockItems,
        outOfStockItems
    };
}
async function fetchDashboardSalesMetrics(dateStr, branchKey = "all") {
    const defaultMetrics = {
        totalIncome: 0,
        totalTickets: 0,
        estimatedProfit: 0,
        trend: "+0.0%",
        paymentMethods: {
            card: 0,
            transfer: 0,
            cash: 0
        },
        breakdownAmounts: {
            card: 0,
            transfer: 0,
            cash: 0
        }
    };
    // 1. Rango del día completo en UTC
    const startOfDay = `${dateStr}T00:00:00.000Z`;
    const endOfDay = `${dateStr}T23:59:59.999Z`;
    // 2. Resolver el ID de la sucursal si no es consolidado
    let targetBranchId = null;
    if (branchKey !== "all") {
        let branchNamePattern = "";
        if (branchKey === "santa-ana") branchNamePattern = "Santa Ana";
        if (branchKey === "ahuachapan") branchNamePattern = "Ahuachapán";
        if (branchKey === "sonsonate") branchNamePattern = "Sonsonate";
        const { data: branchData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id").ilike("name", `%${branchNamePattern}%`).maybeSingle();
        if (!branchData) return defaultMetrics;
        targetBranchId = branchData.id;
    }
    // 3. Consultar las ventas de la fecha
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sales").select("id, total, subtotal, payment_method, branch_id").gte("created_at", startOfDay).lte("created_at", endOfDay);
    if (targetBranchId) {
        query = query.eq("branch_id", targetBranchId);
    }
    const { data: sales, error } = await query;
    if (error || !sales || sales.length === 0) {
        return defaultMetrics;
    }
    let totalIncome = 0;
    let cardAmount = 0;
    let transferAmount = 0;
    let cashAmount = 0;
    sales.forEach((sale)=>{
        const amt = Number(sale.total) || 0;
        totalIncome += amt;
        if (sale.payment_method === "card") cardAmount += amt;
        else if (sale.payment_method === "transfer") transferAmount += amt;
        else if (sale.payment_method === "cash") cashAmount += amt;
    });
    // Cálculo porcentual para el donut SVG
    const cardPercent = totalIncome > 0 ? Math.round(cardAmount / totalIncome * 100) : 0;
    const transferPercent = totalIncome > 0 ? Math.round(transferAmount / totalIncome * 100) : 0;
    const cashPercent = totalIncome > 0 ? Math.max(0, 100 - (cardPercent + transferPercent)) : 0;
    // Margen bruto estimado sobre costo medio comercial (aprox 35% del subtotal)
    const estimatedProfit = Number((totalIncome * 0.35).toFixed(2));
    return {
        totalIncome,
        totalTickets: sales.length,
        estimatedProfit,
        trend: totalIncome > 0 ? "+100%" : "+0.0%",
        paymentMethods: {
            card: cardPercent,
            transfer: transferPercent,
            cash: cashPercent
        },
        breakdownAmounts: {
            card: cardAmount,
            transfer: transferAmount,
            cash: cashAmount
        }
    };
}
async function fetchBranchesPerformance(dateStr) {
    const startOfDay = `${dateStr}T00:00:00.000Z`;
    const endOfDay = `${dateStr}T23:59:59.999Z`;
    // 1. Obtener el listado maestro de sucursales
    const { data: branches, error: branchErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("branches").select("id, name").order("name", {
        ascending: true
    });
    if (branchErr || !branches) {
        console.error("Error al obtener sucursales:", branchErr?.message);
        return [];
    }
    // 2. Consultar las ventas de la fecha
    const { data: sales, error: salesErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sales").select("branch_id, total").gte("created_at", startOfDay).lte("created_at", endOfDay);
    if (salesErr) {
        console.error("Error al obtener ventas por sede:", salesErr.message);
    }
    const salesList = sales || [];
    let grandTotal = 0;
    // 3. Acumular tickets e ingresos por branch_id
    const branchMap = new Map();
    branches.forEach((b)=>{
        branchMap.set(b.id, {
            tickets: 0,
            income: 0
        });
    });
    salesList.forEach((s)=>{
        const amt = Number(s.total) || 0;
        grandTotal += amt;
        const current = branchMap.get(s.branch_id);
        if (current) {
            current.tickets += 1;
            current.income += amt;
        }
    });
    // 4. Formatear y calcular el porcentaje relativo de la barra
    return branches.map((b)=>{
        const stats = branchMap.get(b.id) || {
            tickets: 0,
            income: 0
        };
        const pct = grandTotal > 0 ? Math.round(stats.income / grandTotal * 100) : 0;
        // Mapeo de key legible para selección en la interfaz
        let key = "santa-ana";
        const lower = b.name.toLowerCase();
        if (lower.includes("ahuachap")) key = "ahuachapan";
        if (lower.includes("sonso")) key = "sonsonate";
        return {
            id: key,
            name: b.name.includes("Santa Ana") ? "Santa Ana (Matriz)" : b.name,
            ticketsCount: stats.tickets,
            totalIncome: stats.income,
            percentage: pct
        };
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$ShiftContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/context/ShiftContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/store.mjs [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.mjs [app-client] (ecmascript) <export default as Users>");
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
function Navbar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { isShiftOpen } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$ShiftContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShift"])();
    const [showProfileMenu, setShowProfileMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const menuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Reloj oficial de El Salvador (UTC-6)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            const updateClock = {
                "Navbar.useEffect.updateClock": ()=>{
                    const now = new Date();
                    setCurrentTime(now.toLocaleTimeString("es-SV", {
                        timeZone: "America/El_Salvador",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false
                    }));
                }
            }["Navbar.useEffect.updateClock"];
            updateClock();
            const timer = setInterval(updateClock, 1000);
            return ({
                "Navbar.useEffect": ()=>clearInterval(timer)
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    // Cerrar menú de perfil al hacer clic fuera
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            const handleClickOutside = {
                "Navbar.useEffect.handleClickOutside": (e)=>{
                    if (menuRef.current && !menuRef.current.contains(e.target)) {
                        setShowProfileMenu(false);
                    }
                }
            }["Navbar.useEffect.handleClickOutside"];
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "Navbar.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    // Enlaces de módulos superiores en escritorio
    const links = user?.role === "admin" ? [
        {
            name: "Caja",
            href: "/caja"
        },
        {
            name: "Inventario",
            href: "/inventario"
        },
        {
            name: "Dashboard",
            href: "/dashboard"
        }
    ] : [
        {
            name: "Caja",
            href: "/caja"
        },
        {
            name: "Punto de venta",
            href: "/pos"
        },
        {
            name: "Inventario",
            href: "/inventario"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 font-sans select-none relative z-30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 sm:gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard",
                        className: "flex items-center gap-2 py-2 cursor-pointer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/mariosdent.jpg",
                            alt: "Mario's Dent",
                            width: 130,
                            height: 40,
                            priority: true,
                            className: "h-8 sm:h-9 w-auto object-contain"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "hidden md:flex items-center gap-6 text-sm font-medium",
                        children: links.map((link)=>{
                            const isActive = pathname.startsWith(link.href);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative py-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.href,
                                        className: `transition-colors ${isActive ? "text-sky-600 font-bold" : "text-slate-500 hover:text-slate-800"}`,
                                        children: link.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 96,
                                        columnNumber: 17
                                    }, this),
                                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 107,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, link.href, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 95,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden flex items-center gap-1.5 text-xs font-bold text-slate-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-slate-300",
                                children: "•"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 sm:gap-4 text-xs",
                children: [
                    user?.role !== "admin" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden sm:flex items-center gap-1.5 text-slate-600 font-medium",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `w-2 h-2 rounded-full inline-block ${isShiftOpen ? "bg-emerald-500" : "bg-amber-400"}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: isShiftOpen ? "Turno en curso" : "Sin turno"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hidden sm:inline text-slate-300",
                                children: "|"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 125,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 font-medium text-slate-700",
                        children: [
                            user?.role === "admin" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1 text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this),
                                    "Admin"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1 text-slate-700 font-bold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                                        className: "w-3.5 h-3.5 text-sky-600"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this),
                                    user?.branch || "Santa Ana"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hidden sm:inline text-slate-300",
                                children: "•"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hidden sm:inline",
                                children: user?.name || "Mario Ochoa"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden md:inline text-slate-300",
                        children: "|"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        suppressHydrationWarning: true,
                        className: "hidden md:inline text-slate-500 font-mono w-16 text-center tabular-nums font-medium",
                        children: currentTime || "--:--:--"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: logout,
                        className: "md:hidden flex items-center gap-1.5 py-1.5 px-2.5 bg-rose-50 text-rose-600 border border-rose-200/70 rounded-xl font-bold text-xs hover:bg-rose-100 transition-colors active:scale-95 cursor-pointer ml-1",
                        title: "Cerrar sesión",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                className: "w-3.5 h-3.5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Salir"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex items-center gap-1.5 ml-2 text-slate-600 relative",
                        ref: menuRef,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "p-2 hover:bg-slate-100 rounded-xl transition-colors relative",
                                title: "Notificaciones",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 185,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 186,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setShowProfileMenu((prev)=>!prev),
                                className: "p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer",
                                title: "Opciones de perfil",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navbar.tsx",
                                    lineNumber: 195,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            showProfileMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-0 top-12 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-3 py-2 border-b border-slate-100 mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-bold text-slate-800 text-xs truncate",
                                                children: user?.name || "Mario Ochoa"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 202,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-slate-400 truncate",
                                                children: user?.email || "admin@mariosdent.com"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 205,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 201,
                                        columnNumber: 15
                                    }, this),
                                    user?.role === "admin" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setShowProfileMenu(false);
                                                    // Si tienes un modal o ruta para sucursales, ejecútalo aquí
                                                    console.log("Abrir Gestión de Sucursales");
                                                },
                                                className: "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                                                        className: "w-4 h-4 text-sky-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navbar.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Gestión de Sucursales"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navbar.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 213,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setShowProfileMenu(false);
                                                    // Si tienes un modal o ruta para usuarios, ejecútalo aquí
                                                    console.log("Abrir Gestión de Usuarios");
                                                },
                                                className: "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                        className: "w-4 h-4 text-sky-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navbar.tsx",
                                                        lineNumber: 235,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Gestión de Usuarios"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Navbar.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 226,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "my-1 border-t border-slate-100"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 239,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 212,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            setShowProfileMenu(false);
                                            logout();
                                        },
                                        className: "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 252,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Cerrar Sesión"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 253,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 244,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 200,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Navbar.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_s(Navbar, "woRHidKyJ+oEa0yxMzfrES0gI+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$context$2f$ShiftContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShift"]
    ];
});
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_03o2nda._.js.map