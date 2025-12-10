"use client";


import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useActivityStore } from "@/store/useActivityStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import {
  Camera,
  Video,
  Watch,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

const captureMethods = [
  { id: "photo", label: "Live Photo", icon: Camera },
  { id: "video", label: "Live Video", icon: Video },
  { id: "wearable", label: "Wearable Device", icon: Watch },
];

const activityTypes = [
  { id: "running", label: "Running", inputs: ["distance", "duration"] },
  { id: "cycling", label: "Cycling", inputs: ["distance", "duration"] },
  { id: "swimming", label: "Swimming", inputs: ["distance", "duration", "laps"] },
  { id: "weight_lifting", label: "Weight Lifting", inputs: ["sets", "reps", "weight"] },
  { id: "yoga", label: "Yoga", inputs: ["duration"] },
  { id: "hiit", label: "HIIT", inputs: ["duration", "rounds"] },
  { id: "walking", label: "Walking", inputs: ["distance", "duration", "steps"] },
  { id: "dancing", label: "Dancing", inputs: ["duration"] },
];

export function ActivityLogForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addActivity } = useActivityStore();
  const { updateXP } = useGamificationStore();
  const [step, setStep] = useState(1);
  const [captureMethod, setCaptureMethod] = useState<string>("");
  const [activityType, setActivityType] = useState<string>("");
  const [activityInputs, setActivityInputs] = useState<Record<string, string>>({});
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"photo" | "video" | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentActivity = activityTypes.find((a) => a.id === activityType);

  // Calculate calories and points
  const calculateMetrics = () => {
    if (!activityType || !user) return { calories: 0, points: 0 };

    const weight = user.weight || 70;
    const duration = parseFloat(activityInputs.duration || "0");
    const distance = parseFloat(activityInputs.distance || "0");
    const weightLifted = parseFloat(activityInputs.weight || "0");
    const sets = parseFloat(activityInputs.sets || "0");
    const reps = parseFloat(activityInputs.reps || "0");

    let calories = 0;
    let points = 0;

    switch (activityType) {
      case "running":
        calories = Math.round((distance * 60 * weight) / 1000);
        points = Math.round(distance * 10);
        break;
      case "cycling":
        calories = Math.round((distance * 30 * weight) / 1000);
        points = Math.round(distance * 8);
        break;
      case "swimming":
        calories = Math.round((duration * 10 * weight) / 100);
        points = Math.round(duration * 5);
        break;
      case "weight_lifting":
        calories = Math.round((sets * reps * weightLifted) / 10);
        points = Math.round(sets * reps * 2);
        break;
      case "yoga":
      case "dancing":
        calories = Math.round((duration * 3 * weight) / 100);
        points = Math.round(duration * 3);
        break;
      case "hiit":
        calories = Math.round((duration * 12 * weight) / 100);
        points = Math.round(duration * 8);
        break;
      case "walking":
        calories = Math.round((distance * 30 * weight) / 1000);
        points = Math.round(distance * 5);
        break;
    }

    return { calories, points };
  };

  const { calories, points } = calculateMetrics();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedMedia(dataUrl);
        setMediaType("photo");
        stopCamera();
      }
    }
  };

  const captureVideo = () => {
    // Mock video capture - in real app, use MediaRecorder API
    setCapturedMedia("video_captured");
    setMediaType("video");
    stopCamera();
  };

  const syncWearable = async () => {
    setLoading(true);
    // Mock wearable sync
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCapturedMedia("wearable_synced");
    setMediaType(null);
    setLoading(false);
  };

  const handleCapture = async () => {
    if (captureMethod === "photo") {
      await startCamera();
    } else if (captureMethod === "video") {
      await startCamera();
    } else if (captureMethod === "wearable") {
      await syncWearable();
    }
  };

  const handleSubmit = async () => {
    if (!user || !activityType) return;

    setLoading(true);
    try {
      const activityData: any = {
        userId: user.id,
        type: activityTypes.find((a) => a.id === activityType)?.label || activityType,
        duration: parseFloat(activityInputs.duration || "0"),
        calories,
        date: new Date().toISOString(),
      };

      if (activityInputs.distance) {
        activityData.distance = parseFloat(activityInputs.distance);
      }
      if (activityInputs.steps) {
        activityData.steps = parseInt(activityInputs.steps);
      }
      if (activityInputs.weight) {
        activityData.weight = parseFloat(activityInputs.weight);
      }

      await addActivity(activityData);
      await updateXP(user.id, points);

      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting activity:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!captureMethod;
      case 2:
        return !!activityType;
      case 3:
        return currentActivity?.inputs.every((input) => activityInputs[input]);
      case 4:
        return !!capturedMedia;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="gradient-purple-blue h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Select Capture Method */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How do you want to capture?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {captureMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setCaptureMethod(method.id)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      captureMethod === method.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                    <div className="font-semibold text-gray-900">{method.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Select Activity Type */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What activity did you do?</h2>
            <div className="grid grid-cols-2 gap-3">
              {activityTypes.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => setActivityType(activity.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activityType === activity.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {activity.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Activity Inputs */}
        {step === 3 && currentActivity && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Details</h2>
            <div className="space-y-4">
              {currentActivity.inputs.map((input) => (
                <div key={input}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {input.replace("_", " ")}
                  </label>
                  <input
                    type={input === "duration" ? "number" : "number"}
                    step={input === "weight" ? "0.1" : "1"}
                    value={activityInputs[input] || ""}
                    onChange={(e) =>
                      setActivityInputs({ ...activityInputs, [input]: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
                    placeholder={`Enter ${input.replace("_", " ")}`}
                  />
                </div>
              ))}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600">Estimated</div>
                <div className="text-2xl font-bold text-purple-600">{calories} calories</div>
                <div className="text-sm text-gray-600 mt-1">{points} points earned</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Capture/Verify */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {captureMethod === "wearable" ? "Sync Device" : "Capture Activity"}
            </h2>

            {!capturedMedia && (
              <div className="space-y-4">
                {captureMethod === "photo" && (
                  <div>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg mb-4"
                      style={{ display: streamRef.current ? "block" : "none" }}
                    />
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    <button
                      onClick={capturePhoto}
                      className="w-full gradient-purple-blue text-white py-3 rounded-lg font-semibold"
                    >
                      Capture Photo
                    </button>
                  </div>
                )}

                {captureMethod === "video" && (
                  <div>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg mb-4"
                      style={{ display: streamRef.current ? "block" : "none" }}
                    />
                    <button
                      onClick={captureVideo}
                      className="w-full gradient-purple-blue text-white py-3 rounded-lg font-semibold"
                    >
                      Record Video
                    </button>
                  </div>
                )}

                {captureMethod === "wearable" && (
                  <div className="text-center py-8">
                    <Watch className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                    <p className="text-gray-600 mb-4">Syncing with your wearable device...</p>
                    {loading && <div className="text-purple-600">Syncing...</div>}
                  </div>
                )}

                {!streamRef.current && captureMethod !== "wearable" && (
                  <button
                    onClick={handleCapture}
                    className="w-full gradient-purple-blue text-white py-3 rounded-lg font-semibold"
                  >
                    {captureMethod === "photo" ? "Open Camera" : "Start Recording"}
                  </button>
                )}
              </div>
            )}

            {capturedMedia && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Captured!</p>
                <p className="text-gray-600 mb-6">Review your activity details below</p>
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Activity:</span>
                    <span className="font-semibold">
                      {activityTypes.find((a) => a.id === activityType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Calories:</span>
                    <span className="font-semibold">{calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Points:</span>
                    <span className="font-semibold">{points}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => {
              if (step === 4 && capturedMedia) {
                setCapturedMedia(null);
                setMediaType(null);
                stopCamera();
              } else {
                setStep(Math.max(1, step - 1));
              }
            }}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            onClick={() => {
              if (step === 4) {
                handleSubmit();
              } else {
                setStep(step + 1);
              }
            }}
            disabled={!canProceed() || loading}
            className="flex items-center px-6 py-3 gradient-purple-blue text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 4 ? (loading ? "Submitting..." : "Submit") : "Next"}
            {step < 4 && <ChevronRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
}

