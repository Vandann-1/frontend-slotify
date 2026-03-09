import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {

  const location = useLocation();

  // hide header + footer on admin professional page
  const hideLayout =
    location.pathname.startsWith("/admin/professionals/");

  return (

    <div className="flex flex-col min-h-screen">

      {!hideLayout && <Header />}

      <main className="flex-grow">
        <Outlet />
      </main>

      {!hideLayout && <Footer />}

    </div>

  );

};

export default MainLayout;