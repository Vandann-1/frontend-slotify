import { useState } from "react";
import { PROFESSIONAL_COMPONENT_MAP } from "../../layouts/professionalComponentMap";

export default function DashboardEngine({ navItems }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const ActiveComponent = PROFESSIONAL_COMPONENT_MAP[activeTab];

  return (                         
    <div style={{ display: "flex" }}>
      <aside>
        {navItems.map(item => (
          <button key={item.key} onClick={() => setActiveTab(item.key)}>
            {item.label}
          </button>
        ))}
      </aside>

      <main style={{ flex: 1 }}>
        {ActiveComponent ? <ActiveComponent /> : <div>Not Found</div>}
      </main>
    </div>
  );
}
// hello