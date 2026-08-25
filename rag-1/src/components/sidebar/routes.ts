import { IconType } from "react-icons";
import { MdChat, MdOutlineTableChart } from "react-icons/md";

export interface AppRoute {
  name: string;
  path: string;
  icon: IconType;
}

const routes: AppRoute[] = [
  { name: "Ask", path: "/chat", icon: MdChat },
  { name: "Documents", path: "/documents", icon: MdOutlineTableChart },
];

export default routes;
