"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSocialStore } from "@/store/useSocialStore";
import { UserPlus, Search, X, User, Trophy, Flame } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getUserById } from "@/lib/mock-data";

export default function FriendsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { friends, fetchSocialData, addFriend } = useSocialStore();
  const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [friendEmail, setFriendEmail] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchSocialData(user.id);
    }
  }, [isAuthenticated, user, router, fetchSocialData]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleAddFriend = async () => {
    if (!friendEmail || !user) return;
    // Mock: In real app, search by email and add
    await addFriend(user.id, friendEmail);
    setShowAddFriendModal(false);
    setFriendEmail("");
  };

  const handleViewProfile = (friendId: string) => {
    const friend = getUserById(friendId);
    if (friend) {
      setSelectedUser(friend);
      setShowProfileModal(true);
    }
  };

  const friendUsers = friends.map((id) => getUserById(id)).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Friends & Groups</h1>
        <button
          onClick={() => setShowAddFriendModal(true)}
          className="flex items-center px-4 py-2 gradient-purple-blue text-white rounded-lg font-semibold hover:opacity-90"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Friend
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <button
              onClick={() => setActiveTab("friends")}
              className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${
                activeTab === "friends"
                  ? "gradient-purple-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Friends ({friendUsers.length})
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "groups"
                  ? "gradient-purple-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Groups
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "friends" && (
            <div>
              {/* Search */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>
              </div>

              {/* Friends List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friendUsers
                  .filter((f) =>
                    f?.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((friend) => (
                    <div
                      key={friend?.id}
                      className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-semibold text-lg">
                            {friend?.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{friend?.name}</div>
                          <div className="text-sm text-gray-500">Online</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                          <span>1,234 pts</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Flame className="w-4 h-4 mr-1 text-orange-500" />
                          <span>7 day streak</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewProfile(friend?.id || "")}
                        className="w-full px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
              </div>

              {friendUsers.length === 0 && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No friends yet. Add some friends to get started!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "groups" && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
              <p className="text-gray-500">Groups feature coming soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Friend</h2>
              <button
                onClick={() => setShowAddFriendModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Friend&apos;s Email
              </label>
              <input
                type="email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                placeholder="friend@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddFriendModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFriend}
                className="flex-1 px-4 py-2 gradient-purple-blue text-white rounded-lg font-semibold hover:opacity-90"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-semibold text-2xl">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
              <p className="text-gray-600">{selectedUser.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">1,234</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">7</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Fitness Goals</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUser.goals?.map((goal: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full px-4 py-2 gradient-purple-blue text-white rounded-lg font-semibold hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

