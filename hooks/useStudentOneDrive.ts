"use client";

import { useState, useEffect, useCallback } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { Client } from "@microsoft/microsoft-graph-client";

// ==============================================
// CONFIGURATION - Update these for your school
// ==============================================
export const AZURE_CLIENT_ID = "YOUR_AZURE_APP_CLIENT_ID"; // Get from Azure AD App Registration
export const FILE_NAME_PATTERN = "kidvision";              // Teacher names files: "kidvision-StudentName.json"
// ==============================================

// Assessment structure (works for all subjects)
export interface Assessment {
  id: string;
  assessment_type: string;
  test_name: string;
  score: number;
  max_score: number;
  date_given: string;
  is_scale_score?: boolean;
}

// Student data file structure (one file per student, all subjects)
export interface StudentData {
  math: Assessment[];
  reading: Assessment[];
  science: Assessment[];
}

export type SubjectKey = keyof StudentData;

// Empty student data template
const EMPTY_STUDENT_DATA: StudentData = {
  math: [],
  reading: [],
  science: [],
};

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: typeof window !== "undefined" ? window.location.origin : "",
  },
  cache: {
    cacheLocation: "sessionStorage" as const,
    storeAuthStateInCookie: false,
  },
};

const graphScopes = ["Files.ReadWrite.All", "User.Read"];

// Create Graph client
function getGraphClient(accessToken: string) {
  return Client.init({
    authProvider: (done: (error: Error | null, token: string | null) => void) => done(null, accessToken),
  });
}

/**
 * Custom hook for OneDrive student data storage
 * Use this in any subject page (math, reading, science)
 */
export function useStudentOneDrive(subject: SubjectKey) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [allStudentData, setAllStudentData] = useState<StudentData>(EMPTY_STUDENT_DATA);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [sharedFileName, setSharedFileName] = useState<string | null>(null);
  
  // File connection info
  const [sharedFileId, setSharedFileId] = useState<string | null>(null);
  const [driveId, setDriveId] = useState<string | null>(null);
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  // Initialize MSAL
  useEffect(() => {
    const initMsal = async () => {
      if (typeof window !== "undefined") {
        const instance = new PublicClientApplication(msalConfig);
        await instance.initialize();
        setMsalInstance(instance);
        
        const accounts = instance.getAllAccounts();
        if (accounts.length > 0) {
          setIsSignedIn(true);
          setUserName(accounts[0].name || accounts[0].username);
        }
      }
    };
    initMsal();
  }, []);

  // Get access token
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!msalInstance) return null;
    
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
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

    try {
      const result = await msalInstance.acquireTokenSilent({
        scopes: graphScopes,
        account: accounts[0],
      });
      return result.accessToken;
    } catch (err) {
      try {
        const result = await msalInstance.acquireTokenPopup({ scopes: graphScopes });
        return result.accessToken;
      } catch (err2) {
        setError("Session expired. Please sign in again.");
        return null;
      }
    }
  }, [msalInstance]);

  // Sign in
  const signIn = useCallback(async () => {
    if (!msalInstance) return;
    try {
      const result = await msalInstance.loginPopup({ scopes: graphScopes });
      setIsSignedIn(true);
      setUserName(result.account?.name || result.account?.username || null);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Sign-in failed. Please try again.");
    }
  }, [msalInstance]);

  // Sign out
  const signOut = useCallback(async () => {
    if (!msalInstance) return;
    await msalInstance.logoutPopup();
    setIsSignedIn(false);
    setUserName(null);
    setAssessments([]);
    setAllStudentData(EMPTY_STUDENT_DATA);
    setSharedFileId(null);
    setDriveId(null);
    setSharedFileName(null);
  }, [msalInstance]);

  // Find shared file
  const findSharedFile = useCallback(async (accessToken: string) => {
    const client = getGraphClient(accessToken);
    const sharedItems = await client.api("/me/drive/sharedWithMe").get();
    
    if (!sharedItems.value || sharedItems.value.length === 0) {
      return null;
    }

    const kidvisionFile = sharedItems.value.find((item: any) => {
      const name = item.name?.toLowerCase() || "";
      return name.includes(FILE_NAME_PATTERN.toLowerCase()) && name.endsWith(".json");
    });

    if (kidvisionFile) {
      return {
        fileId: kidvisionFile.remoteItem?.id || kidvisionFile.id,
        driveId: kidvisionFile.remoteItem?.parentReference?.driveId,
        fileName: kidvisionFile.name,
      };
    }
    return null;
  }, []);

  // Fetch data from OneDrive
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      const fileInfo = await findSharedFile(accessToken);
      
      if (!fileInfo) {
        setError("No Kidvision file found. Ask your teacher to share your file with you.");
        setLoading(false);
        return;
      }

      setSharedFileId(fileInfo.fileId);
      setDriveId(fileInfo.driveId);
      setSharedFileName(fileInfo.fileName);

      const client = getGraphClient(accessToken);
      const filePath = `/drives/${fileInfo.driveId}/items/${fileInfo.fileId}/content`;
      const response = await client.api(filePath).get();
      
      let studentData: StudentData;
      if (response && typeof response === "object" && !Array.isArray(response)) {
        studentData = {
          math: Array.isArray(response.math) ? response.math : [],
          reading: Array.isArray(response.reading) ? response.reading : [],
          science: Array.isArray(response.science) ? response.science : [],
        };
      } else if (Array.isArray(response)) {
        // Legacy format
        studentData = { math: response, reading: [], science: [] };
      } else {
        studentData = { ...EMPTY_STUDENT_DATA };
      }
      
      setAllStudentData(studentData);
      setAssessments(studentData[subject]);
    } catch (err: any) {
      if (err.statusCode === 404) {
        setAllStudentData(EMPTY_STUDENT_DATA);
        setAssessments([]);
      } else {
        console.error("Fetch error:", err);
        setError("Could not load data. Make sure your teacher has shared your file with you.");
      }
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, findSharedFile, subject]);

  // Save data to OneDrive
  const saveData = useCallback(async (newAssessments: Assessment[]) => {
    if (!sharedFileId || !driveId) {
      setError("No file connected. Please refresh to find your shared file.");
      return false;
    }

    setSaving(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      const newData: StudentData = {
        ...allStudentData,
        [subject]: newAssessments,
      };

      const client = getGraphClient(accessToken);
      const filePath = `/drives/${driveId}/items/${sharedFileId}/content`;
      await client.api(filePath).put(JSON.stringify(newData, null, 2));

      setAllStudentData(newData);
      setAssessments(newAssessments);
      return true;
    } catch (err: any) {
      console.error("Save error:", err);
      setError("Could not save. Make sure you have edit permission for this file.");
      return false;
    } finally {
      setSaving(false);
    }
  }, [sharedFileId, driveId, allStudentData, subject, getAccessToken]);

  // Add assessment
  const addAssessment = useCallback(async (assessment: Omit<Assessment, "id">) => {
    const newAssessment: Assessment = {
      ...assessment,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    return saveData([...assessments, newAssessment]);
  }, [assessments, saveData]);

  // Delete assessment
  const deleteAssessment = useCallback(async (id: string) => {
    return saveData(assessments.filter(a => a.id !== id));
  }, [assessments, saveData]);

  // Auto-fetch when signed in
  useEffect(() => {
    if (isSignedIn && msalInstance) {
      fetchData();
    }
  }, [isSignedIn, msalInstance, fetchData]);

  return {
    // Data
    assessments,
    allStudentData,
    
    // Status
    loading,
    saving,
    error,
    isSignedIn,
    userName,
    sharedFileName,
    isConnected: !!sharedFileId,
    
    // Actions
    signIn,
    signOut,
    fetchData,
    saveData,
    addAssessment,
    deleteAssessment,
  };
}
