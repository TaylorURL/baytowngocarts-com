import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAdmin } from "../../hooks/useAdmin";
import { useCart } from "../../hooks/useCart";
import { NAV_ITEMS } from "../../lib/content/navigation.js";
import Icon from "./Icon.jsx";
import NavDisclosure from "./NavDisclosure.jsx";
import StartingLights from "./StartingLights.jsx";
import UtilityStrip from "./UtilityStrip.jsx";
import Wordmark from "./Wordmark.jsx";

/*
 * Two tiers on one slab, over a utility rail. The rail carries the venue's
 * phone, address and open days; the bar carries the wordmark, the cart and
 * the account; the tier under it carries the tracked uppercase link row
 * between two starting gantries, on the darker ground. Below lg the rail and
 * the link row both go, and the bar stands alone over the drawer.
 */

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isStaff } = useAdmin();
  const { getTotalItems } = useCart();

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
    <header className="fixed top-0 left-0 right-0 z-header">
      <div
        className="h-[var(--header-stripe)] race-stripe"
        aria-hidden="true"
      />

      <UtilityStrip />

      <div className="bg-asphalt-900 border-b border-white/10 shadow-track lg:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[var(--header-bar)]">
            <Wordmark
              to="/"
              onNavigate={scrollToTop}
              size="md"
              tone="dark"
              showTagline
              className="hidden sm:flex"
            />
            <Wordmark
              to="/"
              onNavigate={scrollToTop}
              size="sm"
              tone="dark"
              showTagline={false}
              className="sm:hidden"
            />

            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/cart"
                aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                className="relative flex h-11 w-11 items-center justify-center rounded-md text-gray-300 hover:text-chalk hover:bg-asphalt-700/60 transition-colors duration-base"
              >
                <Icon name="shopping-cart" className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-race-600 text-chalk text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-asphalt-950/40">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="w-px h-6 bg-asphalt-700" aria-hidden="true" />
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="Your Account"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-controls="account-panel"
                    className="flex h-11 items-center gap-2.5 px-3 rounded-md text-gray-300 hover:text-chalk hover:bg-asphalt-700/60 transition-colors duration-base"
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
                    <div
                      id="account-panel"
                      data-nav-dropdown
                      className="absolute right-0 z-drawer mt-2 w-64 rounded-lg overflow-hidden border border-asphalt-200 bg-chalk shadow-lift origin-top-right"
                    >
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
                          <Icon
                            name="shopping-bag"
                            className="h-4 w-4 text-race-600"
                          />
                          My Purchases
                        </Link>
                        {isStaff && (
                          <Link
                            to="/staff"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-asphalt-700 hover:text-asphalt-900 hover:bg-asphalt-50 transition-colors duration-base"
                          >
                            <Icon
                              name="shield"
                              className="h-4 w-4 text-race-600"
                            />
                            Staff Panel
                          </Link>
                        )}
                        {isStaff && (
                          <Link
                            to="/traffic"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-asphalt-700 hover:text-asphalt-900 hover:bg-asphalt-50 transition-colors duration-base"
                          >
                            <Icon
                              name="bar-chart"
                              className="h-4 w-4 text-race-600"
                            />
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
                    className="flex h-11 items-center px-4 text-sm font-bold text-gray-300 hover:text-chalk transition-colors duration-base"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="flex h-11 items-center px-5 rounded-md text-sm font-bold text-chalk bg-race-600 hover:bg-race-500 transition-colors duration-base shadow-race"
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
                  <span className="absolute -top-0.5 -right-0.5 bg-race-600 text-chalk text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-asphalt-950/40">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                className="p-2.5 rounded-md text-gray-300 hover:text-chalk hover:bg-asphalt-700/60 transition-colors duration-base"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                aria-controls="mobile-menu"
              >
                <Icon
                  name={isMenuOpen ? "close" : "menu"}
                  className="h-6 w-6"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-asphalt-950 border-b border-white/10 shadow-track">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-[var(--header-nav)]">
            <StartingLights />
            <div className="w-px h-5 bg-chalk/15 mx-5" aria-hidden="true" />
            <nav aria-label="Primary" className="flex items-center">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.href;
                if (item.panel) {
                  return (
                    <NavDisclosure
                      key={item.label}
                      item={item}
                      isActive={isActive}
                      onNavigate={scrollToTop}
                    />
                  );
                }
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={scrollToTop}
                    aria-current={isActive ? "page" : undefined}
                    className="relative group flex h-11 items-center px-5"
                  >
                    <span
                      className={`block text-base font-display tracking-speedway uppercase leading-none transition-colors duration-base ease-snap ${
                        isActive
                          ? "text-chalk"
                          : "text-gray-400 group-hover:text-chalk"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-3/5 rounded-pill bg-race-500 origin-center transition-transform duration-slow ease-snap ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-50"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
            <div className="w-px h-5 bg-chalk/15 mx-5" aria-hidden="true" />
            <StartingLights />
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <button
          type="button"
          aria-label="Close Menu"
          className="fixed inset-0 bg-asphalt-950/80 z-sticky lg:hidden cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-drawer lg:hidden bg-asphalt-900 border-l border-white/10 shadow-lift transform transition-transform duration-slow ease-drawer ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* The drawer runs to both viewport edges, so its own content stands
            off whatever the device reserves at the top and the bottom while
            its ground still reaches the glass. */}
        <div className="flex flex-col h-full pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
          <div className="flex items-center justify-between px-5 py-4 bg-asphalt-950 border-b border-white/10">
            <Wordmark
              to="/"
              onNavigate={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
              size="sm"
              tone="dark"
              showTagline={false}
            />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-md text-gray-400 hover:text-chalk hover:bg-asphalt-700/60 transition-colors duration-base"
              aria-label="Close Menu"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
          <div
            className="h-[var(--header-stripe)] race-stripe"
            aria-hidden="true"
          />
          {/* Contained, so reaching the end of the list stops there rather
              than dragging the page along behind the open drawer. */}
          <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-1">
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
