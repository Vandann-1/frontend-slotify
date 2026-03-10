import { Outlet } from "react-router-dom";

const MainLayout = () => {

  return (

    <div className="min-h-screen">

      <main className="min-h-screen">
        <Outlet />
      </main>

    </div>

  );

};

export default MainLayout;