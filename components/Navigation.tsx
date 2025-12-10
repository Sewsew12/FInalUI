"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Home,
  Target,
  Users,
  Trophy,
  MessageSquare,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/gamification", label: "Challenges", icon: Target },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/coach", label: "AI Coach", icon: MessageSquare },
];

export function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Only show navigation when authenticated
  if (!isAuthenticated || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 gradient-purple-blue rounded-full flex items-center justify-center mr-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              FitLife
            </Link>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex md:space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/gamification" && pathname?.startsWith("/gamification"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "gradient-purple-blue text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>

          {/* User Profile */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{user?.name || "User"}</div>
                <div className="text-xs text-purple-600">
                  {user ? `${Math.floor((user as any).points || 0)} pts` : "0 pts"}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === "/gamification" && pathname?.startsWith("/gamification"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "gradient-purple-blue text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

