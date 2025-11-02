import { Outlet } from "react-router-dom";
import TopNavbar from "../components/ui/webNavBar/TopNavbar";

export default function DefaultLayout() {
  return (
    <div className="flex flex-col h-screen w-full  overflow-y-auto">
      <TopNavbar />
      <Outlet />
    </div>
  );
}
