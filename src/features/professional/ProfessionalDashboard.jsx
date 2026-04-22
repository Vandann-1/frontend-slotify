import { useEffect, useState } from "react";
import professionalApi from "../../api/professionalApi";
import { useDynamicNav } from "./useDynamicNav";
import DashboardEngine from "../../features/professional/DashboardEngine";

export default function ProfessionalDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await professionalApi.getMyProfile();
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // 🔥 ALWAYS CALL HOOK (NO CONDITIONS)
  const specialization = profile?.specialization || "";
  const { fixed, dynamic } = useDynamicNav(specialization);

  // 🔹 Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // 🔹 Safety check (optional but good)
  if (!profile) {
    return <div>Error loading profile</div>;
  }

  // 🔹 Final render
  return (
    <DashboardEngine
      navItems={[...fixed, ...dynamic]}
      profile={profile}
    />
  );
}