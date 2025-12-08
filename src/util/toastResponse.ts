// toastResponse.ts
import { toast } from "react-toastify";

export const toastResponse = async (
  res: Response,
  successMsg: string,
  fallbackErrorMsg: string
) => {
  let errorText = fallbackErrorMsg;

  try {
    // Try to parse JSON error
    const body = await res.clone().json();

    if (body?.error) {
      const err = body.error;

      // 1️⃣ Direct Strapi error message
      if (err.message) {
        errorText = err.message;
      }

      // 2️⃣ Deep details → validation errors, unique errors, relation errors
      if (err.details?.errors?.length) {
        const firstErr = err.details.errors[0];

        if (firstErr.message) {
          errorText = firstErr.message;
        }
      }

      // 3️⃣ Path-specific errors (like slug unique)
      if (err.details?.errors?.[0]?.path?.length) {
        const path = err.details.errors[0].path.join(".");
        const msg = err.details.errors[0].message;
        errorText = `${path}: ${msg}`;
      }
    }
  } catch (e) {
    // If JSON parse fails, fallback to text or default
    try {
      const txt = await res.clone().text();
      if (txt) errorText = txt;
    } catch {
      /* ignore */
    }
  }

  // ❌ Error case
  if (!res.ok) {
    toast.error(errorText || fallbackErrorMsg, {
      position: "top-center",
      draggable: true,
      autoClose: 1800,
    });
    return false;
  }

  // ✅ Success case
  toast.success(successMsg, {
    position: "top-center",
    draggable: true,
    autoClose: 1800,
  });

  return true;
};
