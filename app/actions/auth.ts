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

  const REVIEW_CLASS_CODE = "SDOC2026";
  const REVIEW_PIN = "1234";
  const REVIEW_STUDENT_ID = "SDOC-DEMO-01";

  if (
    classCode.trim().toUpperCase() === REVIEW_CLASS_CODE &&
    studentPin.trim() === REVIEW_PIN
  ) {
    return {
      success: true,
      studentId: REVIEW_STUDENT_ID,
    };
  }

  return {
    success: false,
    error: "Invalid class code or PIN. For district review access, use the provided test credentials.",
  };
}