import { z } from "zod";

export const FastMathRowSchema = z.object({
  student_id: z.string().optional(),
  kidvision_id: z.string().optional(),
  scale_score: z.optional(
    z.preprocess(
      (v) => (v === "" ? undefined : Number(v)),
      z.number().nullable(),
    ),
  ),
  level: z.string().optional().nullable(),
  date_given: z.string().optional().nullable(),
}).refine(
  (obj) => obj.student_id || obj.kidvision_id,
  "Either student_id or kidvision_id is required"
);

export const StarMathRowSchema = z.object({
  student_id: z.string().optional(),
  kidvision_id: z.string().optional(),
  scale_score: z.optional(
    z.preprocess(
      (v) => (v === "" ? undefined : Number(v)),
      z.number().nullable(),
    ),
  ),
  percentile_rank: z.optional(
    z.preprocess(
      (v) => (v === "" ? undefined : Number(v)),
      z.number().nullable(),
    ),
  ),
  level: z.string().optional().nullable(),
  test_name: z.string().optional().nullable(),
  date_given: z.string().optional().nullable(),
}).refine(
  (obj) => obj.student_id || obj.kidvision_id,
  "Either student_id or kidvision_id is required"
);

export const UnitMathRowSchema = z.object({
  student_id: z.string().optional(),
  kidvision_id: z.string().optional(),
  score: z.optional(
    z.preprocess(
      (v) => (v === "" ? undefined : Number(v)),
      z.number().nullable(),
    ),
  ),
  test_name: z.string().optional().nullable(),
  date_given: z.string().optional().nullable(),
}).refine(
  (obj) => obj.student_id || obj.kidvision_id,
  "Either student_id or kidvision_id is required"
);

export const QuizMathRowSchema = UnitMathRowSchema;

export const RosterRowSchema = z.object({
  kidvision_id: z.string().min(1, "kidvision_id is required"),
  class_code: z.string().min(1, "class_code is required"),
  student_pin: z.preprocess(
    (v) => (v === undefined || v === "" ? undefined : String(v)),
    z.string().min(1, "student_pin is required"),
  ),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
});

export function validateRows<T extends z.ZodTypeAny>(
  schema: T,
  rows: unknown[],
) {
  const validRows: Array<z.infer<T>> = [];
  const errors: Array<{ index: number; errors: string[] }> = [];

  rows.forEach((r, i) => {
    const parsed = schema.safeParse(r);
    if (parsed.success) {
      validRows.push(parsed.data);
    } else {
      const errs = parsed.error.errors.map(
        (e) => `${e.path.join(".")}: ${e.message}`,
      );
      errors.push({ index: i, errors: errs });
    }
  });

  return { validRows, errors };
}

/**
 * Convert assessment rows with student_id to kidvision_id by looking up in students table.
 * If row already has kidvision_id, use that. Otherwise, fetch from DB.
 */
export async function resolveKidvisionIds(
  rows: Array<any>,
  storageClient: any,
) {
  const resolved: Array<any> = [];
  const errors: Array<{ index: number; error: string }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // If already has kidvision_id, use it
    if (row.kidvision_id) {
      resolved.push({ ...row, kidvision_id: row.kidvision_id });
      continue;
    }

    // Otherwise, look up by student_id
    if (!row.student_id) {
      errors.push({ index: i, error: "No student_id or kidvision_id provided" });
      continue;
    }

    try {
      const { data: students, error: dbError } = await storageClient
        .from("students")
        .select("kidvision_id")
        .eq("student_id", row.student_id)
        .limit(1);

      if (dbError || !students || students.length === 0) {
        errors.push({
          index: i,
          error: `Student ID ${row.student_id} not found in roster`,
        });
        continue;
      }

      resolved.push({
        ...row,
        kidvision_id: students[0].kidvision_id,
      });
    } catch (err: any) {
      errors.push({ index: i, error: err.message });
    }
  }

  return { resolved, errors };
}

