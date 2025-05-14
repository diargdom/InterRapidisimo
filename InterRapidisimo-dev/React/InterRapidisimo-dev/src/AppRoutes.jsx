import React from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";
import { routes } from "./routes";

function AppRoutes() {
  const location = useLocation();
  const element = useRoutes(routes);

  return (
    <AnimatePresence mode="wait">
      {React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
}

export default AppRoutes;
