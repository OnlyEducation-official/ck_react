// toastResponse.ts
import { toast } from "react-toastify";

export const toastResponse = async (
  res: Response,
  successMsg: string,
  errorMsg: string
) => {
  if (!res.ok) {
    toast.error(errorMsg, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return false; // ❌ failure
  }

  toast.success(successMsg, {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  return true; // ✅ success
};
