import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  Clock,
  LogOut,
  MapPin,
  Menu,
  Phone,
  Shield,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useAdmin } from "../../hooks/useAdmin";
import { useCart } from "../../hooks/useCart";
const LIGHT_COLORS = [
  { on: "#ef4444", glow: "rgba(239,68,68,0.8)", dim: "#3d1111" },
  { on: "#facc15", glow: "rgba(250,204,21,0.8)", dim: "#3d2e05" },
  { on: "#16a34a", glow: "rgba(22,163,74,0.8)", dim: "#0a3d1a" },
];
const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Pricing", path: "/pricing" },
  { name: "Events", path: "/events" },
  { name: "Contact", path: "/contact" },
  { name: "FAQ", path: "/faq" },
];
const TrafficLights = ({ activeLight, size = 10, gap = 1.5 }) => (
  <div className="flex items-center" style={{ gap: `${gap * 4}px` }}>
    {LIGHT_COLORS.map((c, i) => {
      const lit = activeLight === i;
      return (
        <div
          key={i}
          className="relative flex items-center justify-center"
          style={{ width: size + 6, height: size + 6 }}
        >
          {lit && (
            <div
              className="absolute rounded-full"
              style={{
                width: size + 10,
                height: size + 10,
                backgroundColor: c.glow,
                filter: "blur(5px)",
                opacity: 0.5,
              }}
            />
          )}
          <div
            className="relative rounded-full transition duration-500"
            style={{
              width: size,
              height: size,
              backgroundColor: lit ? c.on : c.dim,
              boxShadow: lit
                ? `0 0 4px 1px ${c.glow}, inset 0 -1px 2px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.2)`
                : "inset 0 1px 3px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      );
    })}
  </div>
);
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeLight, setActiveLight] = useState(0);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isStaff } = useAdmin();
  const { getTotalItems } = useCart();
  useEffect(() => {
    const id = setInterval(() => setActiveLight((p) => (p + 1) % 3), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setIsUserMenuOpen(false);
    };
    if (isUserMenuOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };
  const cartCount = getTotalItems();
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ─── Top Bar: Silver — Logo, info, cart, auth ─── */}
      <div className="bg-gradient-to-b from-[#edf0f4] to-[#d8dce4] border-b border-[#b4bcc8]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Left: Logo + Name */}
            <Link
              to="/"
              className="flex items-center gap-4 group"
              onClick={scrollToTop}
            >
              <img
                src="/images/logo.png"
                alt="Speedway 146 Logo"
                className="h-14 w-14 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <span className="block text-xl font-bold text-gray-800 leading-tight tracking-wide">
                  SPEEDWAY 146
                </span>
                <span className="block text-[11px] font-medium text-gray-400 tracking-widest uppercase">
                  Go-Kart Racing & Family Fun
                </span>
              </div>
            </Link>
            {/* Center: Contact Info (desktop only) */}
            <div className="hidden xl:flex items-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold tracking-wide">
                  (346) 932-1266
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold tracking-wide">
                  6750 N TX-146, Baytown, TX
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold tracking-wide">
                  Open Daily
                </span>
              </div>
            </div>
            {/* Right: Cart + Auth */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/cart"
                aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                className="relative p-2.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-white/50 transition-colors duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white/80">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="w-px h-6 bg-gray-400/25" />
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="Account menu"
                    aria-expanded={isUserMenuOpen}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-white/50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-300/50 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="text-sm font-semibold max-w-[120px] truncate hidden xl:block">
                      {user.email?.split("@")[0]}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-xl overflow-hidden border border-gray-200/80 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] origin-top-right">
                      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-xs text-gray-400 font-medium">
                          Signed in as
                        </p>
                        <p className="text-sm text-gray-700 font-semibold truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1.5">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          My Purchases
                        </Link>
                        {isStaff && (
                          <Link
                            to="/staff"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          >
                            <Shield className="h-4 w-4" />
                            Staff Panel
                          </Link>
                        )}
                        {isStaff && (
                          <Link
                            to="/traffic"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          >
                            <BarChart3 className="h-4 w-4" />
                            Site Traffic
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-100 py-1.5">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition duration-200 hover:shadow-lg hover:shadow-red-600/25"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            {/* Mobile: Cart + Hamburger */}
            <div className="flex items-center gap-1 lg:hidden">
              <Link
                to="/cart"
                aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                className="relative p-2.5 rounded-lg text-gray-600"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white/80">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                className="p-2.5 rounded-lg text-gray-600 hover:bg-white/50 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ─── Bottom Bar: Navy — Nav links with traffic lights ─── */}
      <div className="hidden lg:block bg-gradient-to-b from-gray-800 to-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            {/* Traffic lights — left */}
            <TrafficLights activeLight={activeLight} size={10} gap={1.5} />
            <div className="w-px h-5 bg-white/10 mx-5" />
            {/* Nav links */}
            <nav className="flex items-center">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={scrollToTop}
                    className="relative group"
                  >
                    <span
                      className={`block px-5 py-3 text-sm font-bold tracking-widest uppercase transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-200"
                      }`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-3/5 rounded-full bg-red-500 origin-center transition-transform duration-300 ease-out ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-50"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
            <div className="w-px h-5 bg-white/10 mx-5" />
            {/* Traffic lights — right */}
            <TrafficLights activeLight={activeLight} size={10} gap={1.5} />
          </div>
        </div>
      </div>
      {/* Mobile overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 lg:hidden bg-gradient-to-b from-[#f0f2f5] to-[#e2e6eb] shadow-[-8px_0_30px_rgba(0,0,0,0.1)] transform transition-transform duration-300 ease-drawer ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-b from-gray-800 to-gray-900">
            <Link
              to="/"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
              className="flex items-center gap-3"
            >
              <img
                src="/images/logo.png"
                alt="Speedway 146"
                loading="eager"
                className="h-10 w-10 object-contain"
              />
              <div>
                <span className="block text-sm font-bold text-white tracking-wide">
                  SPEEDWAY 146
                </span>
                <div className="mt-1">
                  <TrafficLights activeLight={activeLight} size={6} gap={1} />
                </div>
              </div>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase transition duration-200 ${
                    isActive
                      ? "text-white bg-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-800 hover:bg-white/40"
                  }`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    scrollToTop();
                  }}
                >
                  <span className="flex items-center gap-3">
                    {isActive && (
                      <span className="w-1 h-4 rounded-full bg-red-500" />
                    )}
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
          {/* Drawer footer */}
          <div className="p-4 border-t border-gray-300/50 space-y-2">
            {user ? (
              <>
                <div className="px-4 py-2.5 text-xs text-gray-400 font-medium truncate bg-white/40 rounded-lg">
                  {user.email}
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white/50 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  My Purchases
                </Link>
                {isStaff && (
                  <Link
                    to="/staff"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white/50 transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    Staff Panel
                  </Link>
                )}
                {isStaff && (
                  <Link
                    to="/traffic"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white/50 transition-colors"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Site Traffic
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center px-4 py-3 rounded-xl text-sm font-bold text-gray-600 bg-white/60 hover:bg-white/80 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center px-4 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
