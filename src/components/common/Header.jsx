import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAdmin } from "../../hooks/useAdmin";
import { useCart } from "../../hooks/useCart";
import { NAV_ITEMS } from "../../lib/content/navigation.js";
import { CONTACT_INFO } from "../../lib/content/business.js";
import Icon from "./Icon.jsx";
import Wordmark from "./Wordmark.jsx";

const LIGHT_COLORS = [
  { on: "#E11D2A", glow: "rgba(225,29,42,0.85)", dim: "#3a0d11" },
  { on: "#F2C100", glow: "rgba(242,193,0,0.85)", dim: "#3a2d05" },
  { on: "#16a34a", glow: "rgba(22,163,74,0.85)", dim: "#0a3d1a" },
];

// Decorative only — the lit index is driven by a timer, not by app state.
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
                opacity: 0.55,
              }}
            />
          )}
          <div
            className="relative rounded-full transition-colors duration-500 ease-snap"
            style={{
              width: size,
              height: size,
              backgroundColor: lit ? c.on : c.dim,
              boxShadow: lit
                ? `0 0 5px 1px ${c.glow}, inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.18)`
                : "inset 0 1px 3px rgba(0,0,0,0.55)",
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
      <div className="h-1 race-stripe" aria-hidden="true" />

      <div className="bg-asphalt-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Wordmark
              to="/"
              onClick={scrollToTop}
              size="md"
              tone="dark"
              showTagline
              className="hidden sm:flex"
            />
            <Wordmark
              to="/"
              onClick={scrollToTop}
              size="sm"
              tone="dark"
              showTagline={false}
              className="sm:hidden"
            />

            <div className="hidden xl:flex items-center gap-7 text-gray-300">
              <a
                href={CONTACT_INFO.phoneTel}
                className="flex items-center gap-2 hover:text-chalk transition-colors duration-base ease-snap"
              >
                <Icon name="phone" className="h-3.5 w-3.5 text-race-500" />
                <span className="text-xs font-semibold tracking-wide">
                  {CONTACT_INFO.phone}
                </span>
              </a>
              <div className="flex items-center gap-2">
                <Icon name="map-pin" className="h-3.5 w-3.5 text-race-500" />
                <span className="text-xs font-semibold tracking-wide">
                  {CONTACT_INFO.addressLine1}, Baytown
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="clock" className="h-3.5 w-3.5 text-race-500" />
                <span className="text-xs font-semibold tracking-wide">
                  Open Thu – Sun
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/cart"
                aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                className="relative p-2.5 rounded-md text-gray-300 hover:text-chalk hover:bg-asphalt-700/60 transition-colors duration-base"
              >
                <Icon name="shopping-cart" className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-race-600 text-chalk text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-black/30">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="w-px h-6 bg-asphalt-700" />
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="Account menu"
                    aria-expanded={isUserMenuOpen}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-300 hover:text-chalk hover:bg-asphalt-700/60 transition-colors duration-base"
                  >
                    <div className="w-8 h-8 rounded-full bg-asphalt-700 flex items-center justify-center">
                      <Icon name="user" className="h-4 w-4 text-gray-300" />
                    </div>
                    <span className="text-sm font-semibold max-w-[120px] truncate hidden xl:block">
                      {user.email?.split("@")[0]}
                    </span>
                    <Icon
                      name="chevron-down"
                      className={`h-3.5 w-3.5 transition-transform duration-base ease-snap ${isUserMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-lg overflow-hidden border border-asphalt-200 bg-chalk shadow-lift origin-top-right">
                      <div className="px-5 py-3.5 border-b border-asphalt-100 bg-asphalt-50">
                        <p className="text-[10px] uppercase tracking-widest text-asphalt-500 font-display">
                          Signed in as
                        </p>
                        <p className="text-sm text-asphalt-800 font-semibold truncate mt-1">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1.5">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-asphalt-700 hover:text-asphalt-900 hover:bg-asphalt-50 transition-colors duration-base"
                        >
                          <Icon name="shopping-bag" className="h-4 w-4 text-race-600" />
                          My Purchases
                        </Link>
                        {isStaff && (
                          <Link
                            to="/staff"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-asphalt-700 hover:text-asphalt-900 hover:bg-asphalt-50 transition-colors duration-base"
                          >
                            <Icon name="shield" className="h-4 w-4 text-race-600" />
                            Staff Panel
                          </Link>
                        )}
                        {isStaff && (
                          <Link
                            to="/traffic"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-asphalt-700 hover:text-asphalt-900 hover:bg-asphalt-50 transition-colors duration-base"
                          >
                            <Icon name="bar-chart" className="h-4 w-4 text-race-600" />
                            Site Traffic
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-asphalt-100 py-1.5">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-race-700 hover:bg-race-50 transition-colors duration-base"
                        >
                          <Icon name="log-out" className="h-4 w-4" />
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
                    className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-chalk transition-colors duration-base"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 rounded-md text-sm font-bold text-chalk bg-race-600 hover:bg-race-500 transition-colors duration-base shadow-race"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 lg:hidden">
              <Link
                to="/cart"
                aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                className="relative p-2.5 rounded-md text-gray-300 hover:text-chalk"
              >
                <Icon name="shopping-cart" className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-race-600 text-chalk text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-black/30">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                className="p-2.5 rounded-md text-gray-300 hover:text-chalk hover:bg-asphalt-700/60 transition-colors duration-base"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <Icon name={isMenuOpen ? "close" : "menu"} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-asphalt-950 border-b border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <TrafficLights activeLight={activeLight} size={10} gap={1.5} />
            <div className="w-px h-5 bg-chalk/15 mx-5" />
            <nav className="flex items-center">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={scrollToTop}
                    className="relative group"
                  >
                    <span
                      className={`block px-5 py-3 text-base font-display tracking-speedway uppercase transition-colors duration-base ease-snap ${
                        isActive
                          ? "text-chalk"
                          : "text-gray-400 group-hover:text-chalk"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-3/5 rounded-full bg-race-500 origin-center transition-transform duration-300 ease-snap ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-50"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
            <div className="w-px h-5 bg-chalk/15 mx-5" />
            <TrafficLights activeLight={activeLight} size={10} gap={1.5} />
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-asphalt-950/80 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 lg:hidden bg-asphalt-900 border-l border-white/10 shadow-[-12px_0_40px_rgba(0,0,0,0.4)] transform transition-transform duration-slow ease-drawer ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 bg-asphalt-950 border-b border-white/10">
            <Wordmark
              to="/"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
              size="sm"
              tone="dark"
              showTagline={false}
            />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-chalk hover:bg-asphalt-700/60 transition-colors duration-base"
              aria-label="Close menu"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
          <div className="h-1 race-stripe" aria-hidden="true" />
          <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-md text-base font-display tracking-speedway uppercase transition-colors duration-base ease-snap ${
                    isActive
                      ? "text-chalk bg-asphalt-800"
                      : "text-gray-400 hover:text-chalk hover:bg-asphalt-800/70"
                  }`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    scrollToTop();
                  }}
                >
                  <span
                    className={`block w-1 h-5 rounded-full ${
                      isActive ? "bg-race-500" : "bg-transparent"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-asphalt-700 space-y-2">
            {user ? (
              <>
                <div className="px-4 py-2.5 text-xs text-gray-400 font-medium truncate bg-asphalt-800 rounded-md">
                  {user.email}
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold text-gray-300 hover:text-chalk hover:bg-asphalt-800 transition-colors duration-base"
                >
                  <Icon name="shopping-bag" className="h-4 w-4 text-race-500" />
                  My Purchases
                </Link>
                {isStaff && (
                  <Link
                    to="/staff"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold text-gray-300 hover:text-chalk hover:bg-asphalt-800 transition-colors duration-base"
                  >
                    <Icon name="shield" className="h-4 w-4 text-race-500" />
                    Staff Panel
                  </Link>
                )}
                {isStaff && (
                  <Link
                    to="/traffic"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold text-gray-300 hover:text-chalk hover:bg-asphalt-800 transition-colors duration-base"
                  >
                    <Icon name="bar-chart" className="h-4 w-4 text-race-500" />
                    Site Traffic
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold text-race-400 hover:bg-race-950/40 transition-colors duration-base"
                >
                  <Icon name="log-out" className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center px-4 py-3 rounded-md text-sm font-bold text-chalk bg-asphalt-800 hover:bg-asphalt-700 transition-colors duration-base"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center px-4 py-3 rounded-md text-sm font-bold text-chalk bg-race-600 hover:bg-race-500 transition-colors duration-base"
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
