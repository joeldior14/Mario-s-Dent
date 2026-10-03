(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/context/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const COOKIE_NAME = "marios_dent_session";
// Asienta la cookie de sesión para que el middleware de Next.js la lea
function setSessionCookie(sessionData) {
    if (typeof document === "undefined") return;
    const cookiePayload = JSON.stringify({
        id: sessionData.id,
        role: sessionData.role,
        branch: sessionData.branch
    });
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(cookiePayload)}; path=/; max-age=86400; SameSite=Lax`;
}
// Elimina la cookie de sesión
function removeSessionCookie() {
    if (typeof document === "undefined") return;
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Consulta el perfil del usuario en la tabla profiles
    const loadProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[loadProfile]": async (userId, emailStr)=>{
            try {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select(`
            id,
            username,
            full_name,
            role,
            branch_id,
            branches (
              id,
              name
            )
          `).eq("id", userId).single();
                if (error || !data) return null;
                const branchRecord = Array.isArray(data.branches) ? data.branches[0] : data.branches;
                return {
                    id: data.id,
                    name: data.full_name,
                    email: emailStr,
                    role: data.role,
                    branch: branchRecord?.name || "Santa Ana",
                    branchId: data.branch_id
                };
            } catch  {
                return null;
            }
        }
    }["AuthProvider.useCallback[loadProfile]"], []);
    // Sincroniza la sesión persistente de Supabase
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            let mounted = true;
            async function checkSession() {
                try {
                    const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                    if (session?.user && mounted) {
                        const profile = await loadProfile(session.user.id, session.user.email || "");
                        if (mounted && profile) {
                            setUser(profile);
                            setSessionCookie(profile);
                        }
                    }
                } catch  {
                    if (mounted) {
                        setUser(null);
                        removeSessionCookie();
                    }
                } finally{
                    if (mounted) setIsLoading(false);
                }
            }
            checkSession();
            const { data: authListener } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange({
                "AuthProvider.useEffect": async (_event, session)=>{
                    if (session?.user) {
                        const profile = await loadProfile(session.user.id, session.user.email || "");
                        if (profile) {
                            setUser(profile);
                            setSessionCookie(profile);
                        }
                    } else {
                        setUser(null);
                        removeSessionCookie();
                    }
                    setIsLoading(false);
                }
            }["AuthProvider.useEffect"]);
            return ({
                "AuthProvider.useEffect": ()=>{
                    mounted = false;
                    authListener.subscription.unsubscribe();
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        loadProfile
    ]);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async (identifier, pass, expectedRole)=>{
            let emailToAuth = identifier.trim().toLowerCase();
            // Si se ingresó un nombre de usuario (ej. 'admin' o 'maria.g'), se completa con el dominio
            if (!emailToAuth.includes("@")) {
                emailToAuth = `${emailToAuth}@mariosdent.com`;
            }
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
                email: emailToAuth,
                password: pass
            });
            if (error || !data.user) {
                return {
                    error: "Credenciales incorrectas o usuario no registrado."
                };
            }
            const profile = await loadProfile(data.user.id, data.user.email || emailToAuth);
            if (!profile) {
                return {
                    error: "El usuario existe pero no tiene un perfil asignado en la base de datos."
                };
            }
            if (expectedRole === "admin" && profile.role !== "admin") {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
                removeSessionCookie();
                return {
                    error: "Acceso denegado: Esta cuenta no posee permisos de Administrador."
                };
            }
            setUser(profile);
            setSessionCookie(profile);
            if (profile.role === "admin") {
                router.push("/dashboard");
            } else {
                router.push("/caja");
            }
            return {};
        }
    }["AuthProvider.useCallback[login]"], [
        loadProfile,
        router
    ]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async ()=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
            setUser(null);
            removeSessionCookie();
            router.push("/login");
        }
    }["AuthProvider.useCallback[logout]"], [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isLoading,
            login,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/context/AuthContext.tsx",
        lineNumber: 225,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "Ero/x8BUXuSfFa9F+PYScakgJ/4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/context/ShiftContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShiftProvider",
    ()=>ShiftProvider,
    "useShift",
    ()=>useShift
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const ShiftContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const SHIFT_STORAGE_KEY = "marios_dent_shift_data";
// Suscriptor reactivo a cambios de localStorage entre componentes y eventos locales
function subscribe(callback) {
    window.addEventListener("storage", callback);
    window.addEventListener("shift_state_change", callback);
    return ()=>{
        window.removeEventListener("storage", callback);
        window.removeEventListener("shift_state_change", callback);
    };
}
// Snapshot en el cliente
function getSnapshot() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem(SHIFT_STORAGE_KEY) ?? "";
}
// Snapshot seguro para SSR
function getServerSnapshot() {
    return "";
}
function ShiftProvider({ children }) {
    _s();
    const rawShiftData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getSnapshot, getServerSnapshot);
    const parsedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "ShiftProvider.useMemo[parsedData]": ()=>{
            if (!rawShiftData) {
                return {
                    shiftId: null,
                    isShiftOpen: false,
                    cashierName: "",
                    initialCash: 0,
                    auditStatus: "pending"
                };
            }
            try {
                return JSON.parse(rawShiftData);
            } catch  {
                return {
                    shiftId: null,
                    isShiftOpen: false,
                    cashierName: "",
                    initialCash: 0,
                    auditStatus: "pending"
                };
            }
        }
    }["ShiftProvider.useMemo[parsedData]"], [
        rawShiftData
    ]);
    // Actualizador de almacenamiento que notifica a toda la app
    const updateStorage = (payload)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (payload) {
            localStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(payload));
        } else {
            localStorage.removeItem(SHIFT_STORAGE_KEY);
        }
        window.dispatchEvent(new Event("shift_state_change"));
    };
    const openShift = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShiftProvider.useCallback[openShift]": (amount, cashier, newShiftId)=>{
            updateStorage({
                shiftId: newShiftId ?? null,
                isShiftOpen: true,
                cashierName: cashier,
                initialCash: amount,
                auditStatus: "pending"
            });
        }
    }["ShiftProvider.useCallback[openShift]"], []);
    const closeShift = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShiftProvider.useCallback[closeShift]": ()=>{
            updateStorage(null);
        }
    }["ShiftProvider.useCallback[closeShift]"], []);
    const resetShiftContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShiftProvider.useCallback[resetShiftContext]": ()=>{
            updateStorage(null);
        }
    }["ShiftProvider.useCallback[resetShiftContext]"], []);
    const resolveAudit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShiftProvider.useCallback[resolveAudit]": (_notes, _resolution)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const current = localStorage.getItem(SHIFT_STORAGE_KEY);
            if (current) {
                try {
                    const parsed = JSON.parse(current);
                    updateStorage({
                        ...parsed,
                        auditStatus: "reviewed"
                    });
                } catch (e) {
                    console.error("Error al actualizar auditoría:", e);
                }
            }
        }
    }["ShiftProvider.useCallback[resolveAudit]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShiftContext.Provider, {
        value: {
            shiftId: parsedData.shiftId,
            isShiftOpen: parsedData.isShiftOpen,
            cashierName: parsedData.cashierName,
            initialCash: parsedData.initialCash,
            openShift,
            closeShift,
            resetShiftContext,
            auditStatus: parsedData.auditStatus,
            resolveAudit
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/context/ShiftContext.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_s(ShiftProvider, "qYWFpDnpCK8mgJWvupsKZE2KATQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c = ShiftProvider;
function useShift() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ShiftContext);
    if (!context) {
        throw new Error("useShift debe usarse dentro de ShiftProvider");
    }
    return context;
}
_s1(useShift, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ShiftProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabaseClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
// Limpiamos espacios y eliminamos cualquier slash final accidental
const rawUrl = ("TURBOPACK compile-time value", "https://fbxvlkxfpvgjhjskbtpe.supabase.co") || "";
const supabaseUrl = rawUrl.trim().replace(/\/+$/, "");
const supabaseAnonKey = (("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZieHZsa3hmcHZnamhqc2tidHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTk2NzEsImV4cCI6MjEwNTIzNTY3MX0.FaDOw5b7It-v3cTi8cfRV7AXhhq7NullUBJe_8BBNDE") || "").trim();
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan las credenciales de Supabase en .env.local");
}
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0f6j3_t._.js.map