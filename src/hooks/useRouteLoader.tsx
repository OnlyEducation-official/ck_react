import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useRouteLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); // artificial small delay to show loader

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading;
}
