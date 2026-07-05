"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { calculateSubjectPoints, getPointsColor, getEncouragementMessage, calculatePointsFromPercentage } from "@/utils/pointsCalculator";
import { PublicClientApplication } from "@azure/msal-browser";
import { Client } from "@microsoft/microsoft-graph-client";

interface MathAssessment {
  id: string;
  assessment_type: string;
  test_name: string;
  score: number;
  max_score: number;
  date_given: string;
  is_scale_score?: boolean;
}

// Student data file structure (one file per student, all subjects)
interface StudentData {
  math: MathAssessment[];
  reading: MathAssessment[];
  science: MathAssessment[];
}

// ==============================================
// CONFIGURATION - Update these for your school
// ==============================================
const AZURE_CLIENT_ID = "YOUR_AZURE_APP_CLIENT_ID"; // Get from Azure AD App Registration
const DATA_FILE_NAME = "my-kidvision-data.json";    // File stored in student's own OneDrive
// ==============================================

export default function StudentMathPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [assessments, setAssessments] = useState<MathAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [allStudentData, setAllStudentData] = useState<StudentData>({ math: [], reading: [], science: [] });
  
  // Data Entry Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<MathAssessment | null>(null);
  const [formData, setFormData] = useState({
    assessment_type: "Quiz",
    test_name: "",
    score: "",
    max_score: "100",
    date_given: new Date().toISOString().split("T")[0],
  });

  // MSAL Configuration for School OneDrive
  const msalConfig = {
    auth: {
      clientId: AZURE_CLIENT_ID,
      authority: "https://login.microsoftonline.com/common", // Use "organizations" for school-only
      redirectUri: typeof window !== "undefined" ? window.location.origin : "",
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  };

  // Permissions needed: Read AND Write files (for shared files too)
  const graphScopes = ["Files.ReadWrite.All", "User.Read"];

  // Create MSAL instance (client-side only)
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  useEffect(() => {
    const initMsal = async () => {
      if (typeof window !== "undefined") {
        const instance = new PublicClientApplication(msalConfig);
        await instance.initialize();
        setMsalInstance(instance);
        
        // Check if already signed in
        const accounts = instance.getAllAccounts();
        if (accounts.length > 0) {
          setIsSignedIn(true);
          setUserName(accounts[0].name || accounts[0].username);
        }
      }
    };
    initMsal();
  }, []);

  // Sign in with Microsoft
  async function signIn() {
    if (!msalInstance) return;
    try {
      const result = await msalInstance.loginPopup({ scopes: graphScopes });
      setIsSignedIn(true);
      setUserName(result.account?.name || result.account?.username || null);
      return result.accessToken;
    } catch (err) {
      console.error("Login failed:", err);
      setError("Sign-in failed. Please try again.");
      return null;
    }
  }

  // Sign out
  async function signOut() {
    if (!msalInstance) return;
    await msalInstance.logoutPopup();
    setIsSignedIn(false);
    setUserName(null);
    setAssessments([]);
  }

  // Get access token (handles refresh)
  async function getAccessToken(): Promise<string | null> {
    if (!msalInstance) return null;
    
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      const token = await signIn();
      return token ?? null;
    }

    try {
      const result = await msalInstance.acquireTokenSilent({
        scopes: graphScopes,
        account: accounts[0],
      });
      return result.accessToken;
    } catch (err) {
      // Token expired, try interactive
      try {
        const result = await msalInstance.acquireTokenPopup({ scopes: graphScopes });
        return result.accessToken;
      } catch (err2) {
        setError("Session expired. Please sign in again.");
        return null;
      }
    }
  }

  // Create Graph client
  function getGraphClient(accessToken: string) {
    return Client.init({
      authProvider: (done: (error: Error | null, token: string | null) => void) => done(null, accessToken),
    });
  }

  // Find or create the student's data file in THEIR OWN OneDrive
  async function findOrCreateDataFile(): Promise<string | null> {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return null;

      const client = getGraphClient(accessToken);
      
      // Try to find existing file in student's OneDrive root
      try {
        const existingFile = await client.api(`/me/drive/root:/${DATA_FILE_NAME}`).get();
        if (existingFile?.id) {
          console.log("Found existing data file:", existingFile.id);
          return existingFile.id;
        }
      } catch (err: any) {
        // File doesn't exist, we'll create it
        if (err.statusCode !== 404) {
          console.error("Error checking for file:", err);
        }
      }

      // Create new file with empty structure
      const emptyData: StudentData = { math: [], reading: [], science: [] };
      const newFile = await client
        .api(`/me/drive/root:/${DATA_FILE_NAME}:/content`)
        .put(JSON.stringify(emptyData, null, 2));
      
      console.log("Created new data file:", newFile.id);
      return newFile.id;
    } catch (err) {
      console.error("Error finding/creating data file:", err);
      return null;
    }
  }

  // FETCH student data from their OneDrive file
  async function fetchAssessmentsFromOneDrive() {
    if (!studentId) return;
    setLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      // Find or create the data file
      const dataFileId = await findOrCreateDataFile();
      
      if (!dataFileId) {
        setError("Could not access your data file. Please try again.");
        setLoading(false);
        return;
      }

      setFileId(dataFileId);

      const client = getGraphClient(accessToken);
      
      // Read the file content
      const response = await client.api(`/me/drive/items/${dataFileId}/content`).get();
      
      // Parse the student data file (contains all subjects)
      if (response && typeof response === "object") {
        const studentData: StudentData = {
          math: Array.isArray(response.math) ? response.math : [],
          reading: Array.isArray(response.reading) ? response.reading : [],
          science: Array.isArray(response.science) ? response.science : [],
        };
        setAllStudentData(studentData);
        setAssessments(studentData.math);
      } else if (Array.isArray(response)) {
        // Legacy format: just an array (treat as math only)
        setAllStudentData({ math: response, reading: [], science: [] });
        setAssessments(response);
      } else {
        setAllStudentData({ math: [], reading: [], science: [] });
        setAssessments([]);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Could not load your data. Please try signing in again.");
    } finally {
      setLoading(false);
    }
  }

  // SAVE student data to their OneDrive file
  async function saveStudentDataToOneDrive(newData: StudentData) {
    if (!fileId) {
      setError("No file connected. Please refresh the page.");
      return false;
    }

    setSaving(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      const client = getGraphClient(accessToken);
      
      // Save to student's own file
      await client.api(`/me/drive/items/${fileId}/content`).put(JSON.stringify(newData, null, 2));

      setAllStudentData(newData);
      return true;
    } catch (err: any) {
      console.error("Save error:", err);
      setError("Could not save your data. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  // Save math assessments (updates the math section of student data)
  async function saveAssessmentsToOneDrive(newAssessments: MathAssessment[]) {
    const newData: StudentData = {
      ...allStudentData,
      math: newAssessments,
    };
    const success = await saveStudentDataToOneDrive(newData);
    if (success) {
      setAssessments(newAssessments);
    }
    return success;
  }

  // Reset form to default state
  function resetForm() {
    setFormData({
      assessment_type: "Quiz",
      test_name: "",
      score: "",
      max_score: "100",
      date_given: new Date().toISOString().split("T")[0],
    });
    setEditingAssessment(null);
    setShowAddForm(false);
  }

  // Handle form submission (add or edit)
  async function handleSubmitAssessment(e: React.FormEvent) {
    e.preventDefault();
    
    const isScaleScore = formData.assessment_type === "FAST Progress Monitoring" || formData.assessment_type === "STAR";
    
    const assessmentData = {
      assessment_type: formData.assessment_type,
      test_name: formData.test_name || `${formData.assessment_type} - ${formData.date_given}`,
      score: parseFloat(formData.score),
      max_score: isScaleScore ? 999 : parseFloat(formData.max_score),
      date_given: formData.date_given,
      is_scale_score: isScaleScore,
    };

    if (editingAssessment) {
      // Update existing assessment
      const updated = assessments.map(a => 
        a.id === editingAssessment.id 
          ? { ...assessmentData, id: editingAssessment.id }
          : a
      );
      await saveAssessmentsToOneDrive(updated);
    } else {
      // Add new assessment
      const newAssessment: MathAssessment = {
        ...assessmentData,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      const updated = [...assessments, newAssessment];
      await saveAssessmentsToOneDrive(updated);
    }
    
    resetForm();
  }

  // Start editing an assessment
  function startEditAssessment(assessment: MathAssessment) {
    setFormData({
      assessment_type: assessment.assessment_type,
      test_name: assessment.test_name,
      score: assessment.score.toString(),
      max_score: assessment.max_score.toString(),
      date_given: assessment.date_given,
    });
    setEditingAssessment(assessment);
    setShowAddForm(true);
  }

  // Delete an assessment
  async function deleteAssessment(id: string) {
    if (!confirm("Are you sure you want to delete this assessment?")) return;
    const updated = assessments.filter(a => a.id !== id);
    await saveAssessmentsToOneDrive(updated);
  }

  // Load data when signed in
  useEffect(() => {
    if (isSignedIn && studentId && msalInstance) {
      fetchAssessmentsFromOneDrive();
    }
  }, [isSignedIn, studentId, msalInstance]);

  // Calculate points using the new system
  const pointsResult = calculateSubjectPoints(assessments, "math");
  const progressPercentage = (pointsResult.totalPoints / pointsResult.maxPoints) * 100;
  const progressColor = getPointsColor(pointsResult.totalPoints);

  // Group assessments by type
  const quizzes = assessments.filter(a => a.assessment_type === "Quiz").sort((a, b) => new Date(a.date_given).getTime() - new Date(b.date_given).getTime());
  const unitTests = assessments.filter(a => a.assessment_type === "Unit Test").sort((a, b) => new Date(a.date_given).getTime() - new Date(b.date_given).getTime());
  const fastTests = assessments.filter(a => a.assessment_type === "FAST Progress Monitoring").sort((a, b) => new Date(a.date_given).getTime() - new Date(b.date_given).getTime());
  const starTests = assessments.filter(a => a.assessment_type === "STAR").sort((a, b) => new Date(a.date_given).getTime() - new Date(b.date_given).getTime());

  const getBarColor = (percentage: number) => {
    if (percentage === 100) return "#10b981";
    if (percentage >= 90) return "#22c55e";
    if (percentage >= 80) return "#3b82f6";
    if (percentage >= 70) return "#f59e0b";
    return "#ef4444";
  };

  // Bar chart component for assessments
  const AssessmentBarChart = ({ 
    data, 
    title, 
    icon, 
    color,
    isScaleScore = false,
    pointsEarned = 0,
  }: { 
    data: MathAssessment[]; 
    title: string; 
    icon: string; 
    color: string;
    isScaleScore?: boolean;
    pointsEarned?: number;
  }) => {
    if (data.length === 0) {
      return (
        <div style={{
          background: `${color}15`,
          backdropFilter: "blur(30px)",
          border: `2px solid ${color}40`,
          borderRadius: "24px",
          padding: "30px",
        }}>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color, marginBottom: "20px", textAlign: "center" }}>
            {icon} {title}
          </h3>
          <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(255, 255, 255, 0.5)" }}>
            No assessments yet
          </div>
        </div>
      );
    }

    const maxBarHeight = 120;
    const maxScore = isScaleScore ? 999 : 100;

    return (
      <div style={{
        background: `${color}15`,
        backdropFilter: "blur(30px)",
        border: `2px solid ${color}40`,
        borderRadius: "24px",
        padding: "30px",
      }}>
        <h3 style={{ fontSize: "20px", fontWeight: "700", color, marginBottom: "25px", textAlign: "center" }}>
          {icon} {title}
        </h3>
        
        {/* Bar Chart */}
        <div style={{ 
          display: "flex", 
          alignItems: "flex-end", 
          justifyContent: "center",
          gap: "12px", 
          height: maxBarHeight + 80,
          padding: "0 10px",
          overflowX: "auto",
        }}>
          {data.map((assessment, index) => {
            const percentage = isScaleScore 
              ? (assessment.score / maxScore) * 100 
              : (assessment.score / assessment.max_score) * 100;
            const barHeight = Math.max((percentage / 100) * maxBarHeight, 20);
            const barColor = isScaleScore ? color : getBarColor(percentage);
            const displayScore = isScaleScore ? assessment.score : Math.round(percentage);
            
            const shortName = assessment.test_name?.replace(/Quiz|Unit Test|FAST Progress Monitoring|STAR/gi, "").trim() 
              || `#${index + 1}`;
            
            return (
              <div 
                key={assessment.id} 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  minWidth: "50px",
                  maxWidth: "70px",
                }}
              >
                {/* Score on top */}
                <div style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: barColor,
                  marginBottom: "6px",
                  textShadow: `0 0 10px ${barColor}`,
                }}>
                  {displayScore}{isScaleScore ? "" : "%"}
                </div>
                
                {/* Bar */}
                <div style={{
                  width: "100%",
                  height: `${barHeight}px`,
                  background: `linear-gradient(to top, ${barColor}90, ${barColor})`,
                  borderRadius: "6px 6px 3px 3px",
                  boxShadow: `0 0 15px ${barColor}50`,
                  transition: "all 0.3s ease",
                  position: "relative",
                }}>
                  {!isScaleScore && calculatePointsFromPercentage(percentage) > 0 && (
                    <div style={{
                      position: "absolute",
                      top: "4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.7)",
                      color: "#c4b5fd",
                      padding: "1px 5px",
                      borderRadius: "6px",
                      fontSize: "9px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                    }}>
                      +{calculatePointsFromPercentage(percentage)}
                    </div>
                  )}
                </div>
                
                {/* Assessment name */}
                <div style={{
                  fontSize: "9px",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginTop: "6px",
                  textAlign: "center",
                  maxWidth: "60px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {shortName}
                </div>
                
                {/* Date */}
                <div style={{
                  fontSize: "8px",
                  color: "rgba(255, 255, 255, 0.5)",
                  marginTop: "2px",
                }}>
                  {new Date(assessment.date_given).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div style={{
          marginTop: "20px",
          padding: "12px",
          background: "rgba(0, 0, 0, 0.2)",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "space-around",
          textAlign: "center",
        }}>
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "3px" }}>Count</div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>{data.length}</div>
          </div>
          {!isScaleScore && (
            <div>
              <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "3px" }}>Avg</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color }}>
                {Math.round(data.reduce((sum, a) => sum + (a.score / a.max_score * 100), 0) / data.length)}%
              </div>
            </div>
          )}
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "3px" }}>Points</div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#c4b5fd" }}>{pointsEarned}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
          opacity: 0.25,
          filter: "hue-rotate(250deg) saturate(1.3)",
        }}
      >
        <source src="/math-bg.mp4" type="video/mp4" />
      </video>

      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(236, 72, 153, 0.2) 100%)",
        zIndex: -1,
      }} />

      <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            padding: "12px 24px",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "30px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
            e.currentTarget.style.transform = "translateX(-5px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "16px",
            textShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
          }}>
            🔢 Math Progress
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.7)" }}>
            Earn points with every assessment!
          </p>
        </div>

        {/* OneDrive Sign-In Status */}
        <div style={{
          maxWidth: "600px",
          margin: "0 auto 30px auto",
          background: isSignedIn ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.15)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${isSignedIn ? "rgba(16, 185, 129, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "15px",
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>{isSignedIn ? "☁️" : "🔐"}</span>
            <div>
              <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                {isSignedIn ? `Signed in as ${userName}` : "Sign in with School Account"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
                {isSignedIn 
                  ? "Your data is saved to your OneDrive" 
                  : "Sign in to track your math progress"}
              </div>
            </div>
          </div>
          {isSignedIn ? (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={fetchAssessmentsFromOneDrive}
                disabled={loading}
                style={{
                  background: "rgba(59, 130, 246, 0.3)",
                  border: "1px solid rgba(59, 130, 246, 0.5)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  color: "white",
                  fontSize: "13px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                🔄 Refresh
              </button>
              <button
                onClick={signOut}
                style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  color: "#fca5a5",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
              }}
            >
              🔑 Sign In with Microsoft
            </button>
          )}
        </div>

        {saving && (
          <div style={{ 
            textAlign: "center", 
            padding: "15px", 
            color: "#3b82f6", 
            fontWeight: 600,
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "12px",
            maxWidth: "400px",
            margin: "0 auto 20px auto",
          }}>
            💾 Saving to OneDrive...
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "60px", color: "white" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
            <div style={{ fontSize: "20px", fontWeight: "600" }}>Loading your assessments from OneDrive...</div>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "40px", color: "#ef4444", fontWeight: 700, fontSize: "18px" }}>
            {error}
          </div>
        )}

        {!isSignedIn && !loading && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "rgba(255,255,255,0.7)",
          }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎒</div>
            <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px", color: "white" }}>
              Sign In to Track Your Math Progress
            </div>
            <div style={{ fontSize: "14px", maxWidth: "400px", margin: "0 auto", lineHeight: "1.6" }}>
              Sign in with your school Microsoft account to enter your math scores and watch your points grow!
            </div>
          </div>
        )}

        {isSignedIn && !loading && !error && (
          <>
            {/* Add Assessment Button & Form */}
            <div style={{
              maxWidth: "800px",
              margin: "0 auto 30px auto",
            }}>
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    border: "none",
                    borderRadius: "16px",
                    padding: "20px",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 25px rgba(16, 185, 129, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.4)";
                  }}
                >
                  ➕ Add New Assessment
                </button>
              ) : (
                <div style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "20px",
                  padding: "30px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                    <h3 style={{ fontSize: "22px", fontWeight: "700", color: "white", margin: 0 }}>
                      {editingAssessment ? "✏️ Edit Assessment" : "➕ Add New Assessment"}
                    </h3>
                    <button
                      onClick={resetForm}
                      style={{
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        color: "#fca5a5",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      ✕ Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSubmitAssessment}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                      {/* Assessment Type */}
                      <div>
                        <label style={{ display: "block", fontSize: "14px", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>
                          Assessment Type *
                        </label>
                        <select
                          value={formData.assessment_type}
                          onChange={(e) => setFormData({ ...formData, assessment_type: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            background: "rgba(0, 0, 0, 0.3)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "10px",
                            color: "white",
                            fontSize: "16px",
                          }}
                          required
                        >
                          <option value="Quiz">📝 Quiz</option>
                          <option value="Unit Test">📋 Unit Test</option>
                          <option value="FAST Progress Monitoring">🎯 FAST Progress Monitoring</option>
                          <option value="STAR">⭐ STAR</option>
                        </select>
                      </div>

                      {/* Test Name */}
                      <div>
                        <label style={{ display: "block", fontSize: "14px", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>
                          Test Name (optional)
                        </label>
                        <input
                          type="text"
                          value={formData.test_name}
                          onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                          placeholder="e.g., Chapter 5 Quiz"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            background: "rgba(0, 0, 0, 0.3)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "10px",
                            color: "white",
                            fontSize: "16px",
                          }}
                        />
                      </div>

                      {/* Score */}
                      <div>
                        <label style={{ display: "block", fontSize: "14px", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>
                          {formData.assessment_type === "FAST Progress Monitoring" || formData.assessment_type === "STAR" 
                            ? "Scale Score *" 
                            : "Score *"}
                        </label>
                        <input
                          type="number"
                          value={formData.score}
                          onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                          placeholder={formData.assessment_type === "FAST Progress Monitoring" || formData.assessment_type === "STAR" ? "e.g., 325" : "e.g., 85"}
                          min="0"
                          max={formData.assessment_type === "FAST Progress Monitoring" || formData.assessment_type === "STAR" ? "999" : "100"}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            background: "rgba(0, 0, 0, 0.3)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "10px",
                            color: "white",
                            fontSize: "16px",
                          }}
                          required
                        />
                      </div>

                      {/* Max Score (only for Quiz/Unit Test) */}
                      {formData.assessment_type !== "FAST Progress Monitoring" && formData.assessment_type !== "STAR" && (
                        <div>
                          <label style={{ display: "block", fontSize: "14px", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>
                            Max Score *
                          </label>
                          <input
                            type="number"
                            value={formData.max_score}
                            onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
                            placeholder="100"
                            min="1"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              background: "rgba(0, 0, 0, 0.3)",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "10px",
                              color: "white",
                              fontSize: "16px",
                            }}
                            required
                          />
                        </div>
                      )}

                      {/* Date */}
                      <div>
                        <label style={{ display: "block", fontSize: "14px", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>
                          Date *
                        </label>
                        <input
                          type="date"
                          value={formData.date_given}
                          onChange={(e) => setFormData({ ...formData, date_given: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            background: "rgba(0, 0, 0, 0.3)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "10px",
                            color: "white",
                            fontSize: "16px",
                          }}
                          required
                        />
                      </div>
                    </div>

                    {/* Points Preview */}
                    {formData.score && (
                      <div style={{
                        marginTop: "20px",
                        padding: "15px",
                        background: "rgba(139, 92, 246, 0.2)",
                        borderRadius: "12px",
                        textAlign: "center",
                      }}>
                        {(() => {
                          const isScale = formData.assessment_type === "FAST Progress Monitoring" || formData.assessment_type === "STAR";
                          const score = parseFloat(formData.score);
                          const maxScore = parseFloat(formData.max_score) || 100;
                          const percentage = isScale ? null : (score / maxScore) * 100;
                          const points = isScale 
                            ? (score >= 300 ? 25 : 15) 
                            : calculatePointsFromPercentage(percentage || 0);
                          return (
                            <>
                              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>This will earn you: </span>
                              <span style={{ color: "#c4b5fd", fontSize: "24px", fontWeight: "700" }}>+{points} points</span>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={saving}
                      style={{
                        marginTop: "25px",
                        width: "100%",
                        background: saving ? "rgba(139, 92, 246, 0.3)" : "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                        border: "none",
                        borderRadius: "12px",
                        padding: "16px",
                        color: "white",
                        fontSize: "18px",
                        fontWeight: "600",
                        cursor: saving ? "not-allowed" : "pointer",
                        boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
                      }}
                    >
                      {saving ? "💾 Saving..." : (editingAssessment ? "✓ Update Assessment" : "✓ Add Assessment")}
                    </button>
                  </form>
                </div>
              )}
            </div>
            {/* Points Progress Meter */}
            <div style={{
              maxWidth: "1000px",
              margin: "0 auto 40px auto",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "28px",
              padding: "40px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "28px", fontWeight: "700", color: "white", marginBottom: "8px" }}>🏆 Points Progress</h2>
                  <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Earn points to reach 500!</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ 
                    fontSize: "52px", 
                    fontWeight: "900", 
                    color: progressColor, 
                    textShadow: `0 0 30px ${progressColor}`,
                    lineHeight: 1,
                  }}>
                    {pointsResult.totalPoints}
                  </div>
                  <div style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px" }}>
                    / 500 points
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ 
                position: "relative", 
                width: "100%", 
                height: "50px", 
                background: "rgba(0, 0, 0, 0.3)", 
                borderRadius: "25px", 
                overflow: "hidden", 
                border: "1px solid rgba(255, 255, 255, 0.1)" 
              }}>
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${Math.min(progressPercentage, 100)}%`,
                  background: `linear-gradient(90deg, ${progressColor} 0%, ${progressColor}cc 100%)`,
                  borderRadius: "25px",
                  transition: "width 1s ease-out",
                  boxShadow: `0 0 30px ${progressColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: "15px",
                }}>
                  {progressPercentage > 10 && (
                    <span style={{ 
                      fontSize: "16px", 
                      fontWeight: "700", 
                      color: "white",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}>
                      {Math.round(progressPercentage)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Points Breakdown */}
              <div style={{ 
                marginTop: "25px", 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", 
                gap: "15px" 
              }}>
                <div style={{ textAlign: "center", padding: "15px", background: "rgba(59, 130, 246, 0.2)", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>📝 Quizzes</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#3b82f6" }}>{pointsResult.quizPoints}</div>
                </div>
                <div style={{ textAlign: "center", padding: "15px", background: "rgba(236, 72, 153, 0.2)", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>📋 Unit Tests</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#ec4899" }}>{pointsResult.unitTestPoints}</div>
                </div>
                <div style={{ textAlign: "center", padding: "15px", background: "rgba(139, 92, 246, 0.2)", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>🎯 FAST PM</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#8b5cf6" }}>{pointsResult.fastPmPoints}</div>
                </div>
                <div style={{ textAlign: "center", padding: "15px", background: "rgba(16, 185, 129, 0.2)", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>⭐ STAR</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#10b981" }}>{pointsResult.starPoints}</div>
                </div>
              </div>

              <div style={{ 
                marginTop: "20px", 
                textAlign: "center", 
                fontSize: "18px", 
                fontWeight: "600", 
                color: progressColor 
              }}>
                {getEncouragementMessage(pointsResult.totalPoints)}
              </div>
            </div>

            {/* Bar Charts Grid */}
            <div style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "25px",
            }}>
              <AssessmentBarChart data={quizzes} title="Quizzes" icon="📝" color="#3b82f6" pointsEarned={pointsResult.quizPoints} />
              <AssessmentBarChart data={unitTests} title="Unit Tests" icon="📋" color="#ec4899" pointsEarned={pointsResult.unitTestPoints} />
              <AssessmentBarChart data={fastTests} title="FAST PM" icon="🎯" color="#8b5cf6" isScaleScore pointsEarned={pointsResult.fastPmPoints} />
              <AssessmentBarChart data={starTests} title="STAR" icon="⭐" color="#10b981" isScaleScore pointsEarned={pointsResult.starPoints} />
            </div>

            {/* Grades Summary Table */}
            {assessments.length > 0 && (
              <div style={{
                maxWidth: "1000px",
                margin: "40px auto 0 auto",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                borderRadius: "20px",
                padding: "25px",
                overflowX: "auto",
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "20px", textAlign: "center" }}>
                  📋 All Grades Summary
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(255, 255, 255, 0.2)" }}>
                      <th style={{ padding: "12px 8px", textAlign: "left", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Assessment</th>
                      <th style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Type</th>
                      <th style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Score</th>
                      <th style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Grade</th>
                      <th style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Date</th>
                      <th style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Points</th>
                      <th style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...assessments]
                      .sort((a, b) => new Date(b.date_given).getTime() - new Date(a.date_given).getTime())
                      .map((a, idx) => {
                        const isScale = a.is_scale_score || a.assessment_type === "FAST Progress Monitoring" || a.assessment_type === "STAR";
                        const percentage = isScale ? null : Math.round((a.score / a.max_score) * 100);
                        const points = isScale ? (a.score >= 300 ? 25 : 15) : calculatePointsFromPercentage(percentage || 0);
                        const gradeColor = isScale 
                          ? (a.score >= 300 ? "#10b981" : "#3b82f6")
                          : getBarColor(percentage || 0);
                        
                        return (
                          <tr key={a.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                            <td style={{ padding: "12px 8px", color: "white" }}>{a.test_name}</td>
                            <td style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>{a.assessment_type}</td>
                            <td style={{ padding: "12px 8px", textAlign: "center", color: "white", fontWeight: "600" }}>
                              {a.score}{!isScale && `/${a.max_score}`}
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "center" }}>
                              <span style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                background: `${gradeColor}30`,
                                color: gradeColor,
                                fontWeight: "700",
                                fontSize: "13px",
                              }}>
                                {isScale ? (a.score >= 300 ? "Proficient" : "On Track") : `${percentage}%`}
                              </span>
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>
                              {new Date(a.date_given).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "center", color: "#10b981", fontWeight: "700" }}>
                              +{points}
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                <button
                                  onClick={() => startEditAssessment(a)}
                                  style={{
                                    background: "rgba(59, 130, 246, 0.2)",
                                    border: "1px solid rgba(59, 130, 246, 0.4)",
                                    borderRadius: "6px",
                                    padding: "4px 10px",
                                    color: "#60a5fa",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                  }}
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => deleteAssessment(a.id)}
                                  style={{
                                    background: "rgba(239, 68, 68, 0.2)",
                                    border: "1px solid rgba(239, 68, 68, 0.4)",
                                    borderRadius: "6px",
                                    padding: "4px 10px",
                                    color: "#f87171",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                  }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Points Legend */}
            <div style={{
              maxWidth: "800px",
              margin: "40px auto 0 auto",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "20px",
              padding: "25px",
            }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "15px", textAlign: "center" }}>
                📊 How Points Are Earned
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", textAlign: "center" }}>
                <div style={{ padding: "10px", background: "rgba(245, 158, 11, 0.2)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#f59e0b" }}>70-79%</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>+5 points</div>
                </div>
                <div style={{ padding: "10px", background: "rgba(59, 130, 246, 0.2)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#3b82f6" }}>80-89%</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>+7 points</div>
                </div>
                <div style={{ padding: "10px", background: "rgba(34, 197, 94, 0.2)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#22c55e" }}>90-99%</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>+9 points</div>
                </div>
                <div style={{ padding: "10px", background: "rgba(16, 185, 129, 0.2)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#10b981" }}>100%</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>+15 points</div>
                </div>
              </div>
              <p style={{ 
                marginTop: "15px", 
                fontSize: "12px", 
                color: "rgba(255, 255, 255, 0.6)", 
                textAlign: "center" 
              }}>
                FAST PM & STAR tests earn bonus points for proficiency and growth!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
