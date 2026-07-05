"use server";

export async function loginWithClassCode(
  classCode: string,
  studentPin: string
) {
  if (!classCode || !studentPin) {
    return {
      success: false,
      error: "Class code and PIN are required.",
    };
  }

  return {
    success: false,
    error: "Class-code login is disabled in this district review build. Use the OneDrive flow or the local review bundle.",
  };
}