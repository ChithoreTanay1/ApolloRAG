import { IconType } from "react-icons";
import { MdDashboard, MdChat, MdOutlineTableChart } from "react-icons/md";

export interface AppRoute {
  name: string;
  path: string;
  icon: IconType;
}

const routes: AppRoute[] = [
  { name: "Dashboard", path: "/dashboard", icon: MdDashboard },
  { name: "Ask", path: "/chat", icon: MdChat },
  { name: "Documents", path: "/documents", icon: MdOutlineTableChart },
];

export default routes;
