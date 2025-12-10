"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Mail, Lock, User, Calendar, Weight, Ruler, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface FormData {
  email: string;
  password: string;
  name: string;
  age: string;
  weight: string;
  height: string;
  goals: string[];
  activityTypes: string[];
  notifications: boolean;
}

const fitnessGoals = [
  "Weight Loss",
  "Muscle Gain",
  "Endurance",
  "Flexibility",
  "General Fitness",
];

const activityTypes = [
  "Running",
  "Cycling",
  "Swimming",
  "Weight Lifting",
  "Yoga",
  "HIIT",
  "Walking",
  "Dancing",
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    age: "",
    weight: "",
    height: "",
    goals: [],
    activityTypes: [],
    notifications: true,
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const toggleActivity = (activity: string) => {
    setFormData((prev) => ({
      ...prev,
      activityTypes: prev.activityTypes.includes(activity)
        ? prev.activityTypes.filter((a) => a !== activity)
        : [...prev.activityTypes, activity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          goals: formData.goals,
          preferences: {
            activityTypes: formData.activityTypes,
            notifications: formData.notifications,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push("/login");
      } else {
        setError(data.error || "Failed to create account");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.email && formData.password && formData.password.length >= 6;
      case 2:
        return formData.name;
      case 3:
        return formData.age && formData.weight && formData.height;
      case 4:
        return formData.goals.length > 0;
      case 5:
        return formData.activityTypes.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 5</span>
            <span className="text-sm font-medium text-gray-600">{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="gradient-purple-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-purple-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {step === 1 && "Create Your Account"}
            {step === 2 && "Tell Us About Yourself"}
            {step === 3 && "Your Body Metrics"}
            {step === 4 && "Your Fitness Goals"}
            {step === 5 && "Activity Preferences"}
          </h2>
          <p className="mt-2 text-gray-600">
            {step === 1 && "Start your fitness journey today"}
            {step === 2 && "Help us personalize your experience"}
            {step === 3 && "We&apos;ll use this to track your progress"}
            {step === 4 && "What do you want to achieve?"}
            {step === 5 && "What activities do you enjoy?"}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Account Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline w-4 h-4 mr-1" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                placeholder="John Doe"
              />
            </div>
          )}

          {/* Step 3: Metrics */}
          {step === 3 && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Age
                </label>
                <input
                  type="number"
                  required
                  min="13"
                  max="120"
                  value={formData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Weight className="inline w-4 h-4 mr-1" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  required
                  min="30"
                  max="300"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="inline w-4 h-4 mr-1" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  max="250"
                  value={formData.height}
                  onChange={(e) => updateField("height", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="175"
                />
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div className="grid grid-cols-2 gap-3">
              {fitnessGoals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.goals.includes(goal)
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          )}

          {/* Step 5: Activities */}
          {step === 5 && (
            <div className="grid grid-cols-2 gap-3">
              {activityTypes.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => toggleActivity(activity)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.activityTypes.includes(activity)
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <button
              type="submit"
              disabled={!canProceed() || loading}
              className="flex items-center px-6 py-3 gradient-purple-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 5 ? (loading ? "Creating..." : "Create Account") : "Next"}
              {step < 5 && <ChevronRight className="w-4 h-4 ml-2" />}
            </button>
          </div>

          {step === 1 && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

