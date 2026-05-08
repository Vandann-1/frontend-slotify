import { useMemo } from "react";
import { NAV_CONFIG } from "./navConfig";

export function useDynamicNav(role, template) {
  return useMemo(() => {
    return Object.entries(NAV_CONFIG)
      .filter(([_, item]) => {
        const roleMatch = item.roles?.includes(role);
        const templateMatch = item.templates?.includes(template);
        return roleMatch || templateMatch;
      })
      .map(([key, item]) => ({
        key,
        label: item.label,
        icon: item.icon,
      }));
  }, [role, template]);
}