"use client";

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
export const EMPTY_STUDENT_DATA: StudentData = {
  math: [],
  reading: [],
  science: [],
};

// MSAL Configuration for School OneDrive
export const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common", // Use "organizations" for school-only
    redirectUri: typeof window !== "undefined" ? window.location.origin : "",
  },
  cache: {
    cacheLocation: "sessionStorage" as const,
    storeAuthStateInCookie: false,
  },
};

// Permissions needed: Read AND Write files (for shared files too)
export const graphScopes = ["Files.ReadWrite.All", "User.Read"];

// Create Graph client
export function getGraphClient(accessToken: string) {
  return Client.init({
    authProvider: (done: (error: Error | null, token: string | null) => void) => done(null, accessToken),
  });
}

// Find the student's shared file from "Shared with me"
export async function findSharedFile(
  accessToken: string
): Promise<{ fileId: string; driveId: string; fileName: string } | null> {
  try {
    const client = getGraphClient(accessToken);
    
    // Get all files shared with this student
    const sharedItems = await client.api("/me/drive/sharedWithMe").get();
    
    if (!sharedItems.value || sharedItems.value.length === 0) {
      console.log("No shared files found");
      return null;
    }

    // Look for a Kidvision file shared with this student
    // Teacher should name files like: "kidvision-StudentName.json" or "kidvision-Emma.json"
    const kidvisionFile = sharedItems.value.find((item: any) => {
      const name = item.name?.toLowerCase() || "";
      return name.includes(FILE_NAME_PATTERN.toLowerCase()) && name.endsWith(".json");
    });

    if (kidvisionFile) {
      // Get the drive ID from the remote item reference
      const remoteDriveId = kidvisionFile.remoteItem?.parentReference?.driveId;
      const remoteItemId = kidvisionFile.remoteItem?.id || kidvisionFile.id;
      
      console.log("Found shared file:", kidvisionFile.name);
      return {
        fileId: remoteItemId,
        driveId: remoteDriveId,
        fileName: kidvisionFile.name,
      };
    }

    console.log("No matching Kidvision file found in shared items");
    return null;
  } catch (err) {
    console.error("Error finding shared file:", err);
    return null;
  }
}

// Fetch student data from shared OneDrive file
export async function fetchStudentData(
  accessToken: string,
  driveId: string,
  fileId: string
): Promise<StudentData> {
  try {
    const client = getGraphClient(accessToken);
    
    // Read the shared file content using drive ID and item ID
    const filePath = `/drives/${driveId}/items/${fileId}/content`;
    const response = await client.api(filePath).get();
    
    // Parse the student data file (contains all subjects)
    if (response && typeof response === "object" && !Array.isArray(response)) {
      return {
        math: Array.isArray(response.math) ? response.math : [],
        reading: Array.isArray(response.reading) ? response.reading : [],
        science: Array.isArray(response.science) ? response.science : [],
      };
    } else if (Array.isArray(response)) {
      // Legacy format: just an array (treat as math only for backward compatibility)
      return { math: response, reading: [], science: [] };
    }
    
    return { ...EMPTY_STUDENT_DATA };
  } catch (err: any) {
    if (err.statusCode === 404) {
      console.log("File is empty or not found.");
      return { ...EMPTY_STUDENT_DATA };
    }
    throw err;
  }
}

// Save student data to shared OneDrive file
export async function saveStudentData(
  accessToken: string,
  driveId: string,
  fileId: string,
  data: StudentData
): Promise<boolean> {
  try {
    const client = getGraphClient(accessToken);
    
    // Save to the shared file using drive ID and item ID
    const filePath = `/drives/${driveId}/items/${fileId}/content`;
    await client.api(filePath).put(JSON.stringify(data, null, 2));
    
    return true;
  } catch (err: any) {
    console.error("Save error:", err);
    return false;
  }
}

// Generate unique ID for new assessments
export function generateAssessmentId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
