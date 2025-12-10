"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeft, User, Bell, Shield, LogOut } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={user.name}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-gray-700">Push notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-gray-700">Email notifications</span>
            </label>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Privacy</h2>
          </div>
          <p className="text-gray-600">Your data is secure and private.</p>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

