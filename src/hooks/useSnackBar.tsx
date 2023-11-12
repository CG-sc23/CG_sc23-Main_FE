import { usePresence } from "framer-motion";
import { useCallback, useEffect } from "react";

import { useRecoilState } from "recoil";
import { snackBarAtom } from "@/store";

export default function useSnackBar() {
  const [snackBar, setSnackBar] = useRecoilState(snackBarAtom);
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (isPresent) return;
    const timer = setTimeout(safeToRemove, 1000);

    return () => clearTimeout(timer);
  }, [isPresent]);

  const openSnackBar = useCallback((message: string) => {
    if (snackBar.visible) return;

    let timer: NodeJS.Timeout | null = null;
    setSnackBar({ message, visible: true });
    timer = setTimeout(() => {
      setSnackBar((prev) => ({ ...prev, visible: false }));
      if (!timer) return;
      clearTimeout(timer);
    }, 2000);
  }, []);

  return {
    openSnackBar,
  };
}
