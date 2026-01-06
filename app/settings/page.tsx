"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input, ConfirmModal, ArrowLeftIcon } from "../components";
import { AvatarUploader } from "../components/profile";
import { getUserAvatar } from "../lib/avatar";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setName(data.name);
      setEmail(data.email);
      setAvatarBase64(data.avatarBase64);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfileError("Failed to load profile");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileMessage("");

    if (!name.trim()) {
      setProfileError("Name cannot be empty");
      return;
    }

    setIsLoadingProfile(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setProfileError(data.error || "Failed to update profile");
        setIsLoadingProfile(false);
        return;
      }

      setProfileMessage("Name updated! Redirecting...");
      await update({ name: name.trim() });

      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileError("An error occurred. Please try again.");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setIsLoadingPassword(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || "Failed to update password");
        return;
      }

      setPasswordMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async (password: string) => {
    setIsDeleting(true);

    try {
      const response = await fetch("/api/profile/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || "Failed to delete account");
        setShowDeleteModal(false);
        setIsDeleting(false);
        return;
      }

      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      setPasswordError("An error occurred. Please try again.");
      setShowDeleteModal(false);
      setIsDeleting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="neo-border neo-shadow bg-white p-8">
          <div className="flex items-center gap-3">
            <div className="neo-border bg-[var(--lime)] p-3 animate-pulse">
              <span className="text-2xl">🧑‍💻</span>
            </div>
            <span className="font-display text-xl">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] bg-grid relative">
      <div className="noise-overlay" />

      <nav className="sticky top-0 z-40 bg-[var(--cream)] neo-border-thick border-t-0 border-l-0 border-r-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover-lift"
          >
            <div className="neo-border bg-[var(--lime)] p-2">
              <span className="text-xl">💡</span>
            </div>
            <span className="font-display text-2xl">IDEAMARKET</span>
          </Link>
          <Link
            href="/dashboard"
            className="font-body text-sm hover:text-[var(--hot-pink)] transition-colors flex items-center gap-1"
          >
            <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="neo-border bg-[var(--hot-pink)] p-3">
              <span className="text-3xl">🧑‍💻</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl">Your Profile</h1>
          </div>
          <p className="font-body text-lg text-[var(--deep-black)]/70">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          <div className="neo-border-thick neo-shadow-lg bg-white p-6 animate-fade-in-up stagger-1">
            <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
              <span className="text-2xl">👤</span>
              Profile Picture
            </h2>

            <AvatarUploader
              currentAvatar={getUserAvatar(email, avatarBase64)}
              onAvatarUpdate={(newAvatar) => {
                setAvatarBase64(newAvatar);
                setProfileMessage("Avatar updated successfully!");
                setTimeout(() => setProfileMessage(""), 3000);
              }}
              onAvatarRemove={() => {
                setAvatarBase64(null);
                setProfileMessage("Avatar removed successfully!");
                setTimeout(() => setProfileMessage(""), 3000);
              }}
            />
          </div>

          <div className="neo-border-thick neo-shadow-lg bg-white p-6 animate-fade-in-up stagger-2">
            <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Personal Information
            </h2>

            {profileMessage && (
              <div className="neo-border bg-[var(--lime)] p-4 mb-4 font-body text-sm">
                {profileMessage}
              </div>
            )}

            {profileError && (
              <div className="neo-border bg-[var(--hot-pink)] text-white p-4 mb-4 font-body text-sm">
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-body font-medium text-[var(--deep-black)] mb-2"
                >
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="primary"
                  size="lg"
                  disabled={isLoadingProfile}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-body font-medium text-[var(--deep-black)] mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  variant="neutral"
                  size="lg"
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="font-body text-xs text-[var(--deep-black)]/60 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoadingProfile}
              >
                {isLoadingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>

          <div className="neo-border-thick neo-shadow-lg bg-white p-6 animate-fade-in-up stagger-2">
            <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              Security
            </h2>

            {passwordMessage && (
              <div className="neo-border bg-[var(--lime)] p-4 mb-4 font-body text-sm">
                {passwordMessage}
              </div>
            )}

            {passwordError && (
              <div className="neo-border bg-[var(--hot-pink)] text-white p-4 mb-4 font-body text-sm">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-body font-medium text-[var(--deep-black)] mb-2"
                >
                  Current Password
                </label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  variant="primary"
                  size="lg"
                  placeholder="••••••••"
                  disabled={isLoadingPassword}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-body font-medium text-[var(--deep-black)] mb-2"
                >
                  New Password
                </label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="primary"
                  size="lg"
                  placeholder="••••••••"
                  disabled={isLoadingPassword}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block text-sm font-body font-medium text-[var(--deep-black)] mb-2"
                >
                  Confirm New Password
                </label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  variant="primary"
                  size="lg"
                  placeholder="••••••••"
                  disabled={isLoadingPassword}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={isLoadingPassword}
              >
                {isLoadingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>

          <div className="neo-border-thick neo-shadow-lg bg-[var(--hot-pink)]/10 p-6 animate-fade-in-up stagger-3 bg-white">
            <h2 className="font-display text-2xl mb-4 flex items-center gap-2 text-[var(--hot-pink)]">
              <span className="text-2xl">⚠️</span>
              Danger Zone
            </h2>

            <p className="font-body text-[var(--deep-black)]/80 mb-4">
              Once you delete your account, there is no going back. Your ideas
              will remain but will be marked as posted by &quot;[Deleted
              User]&quot;.
            </p>

            <Button
              variant="error"
              size="lg"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="This action cannot be undone. All your data will be permanently deleted."
        confirmButtonText="Delete My Account"
        isLoading={isDeleting}
      />
    </div>
  );
}
