import { Box, useDisclosure } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/Navbar/navbar";
import routes from "../components/sidebar/routes";

export default function MainLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const current = routes.find((route) => route.path === location.pathname);

  return (
    <Box minH="100vh">
      <Sidebar isOpen={isOpen} onClose={onClose} />
      <Box ml={{ base: 0, lg: "290px" }}>
        <Navbar title={current?.name ?? "Apollo RAG"} onOpenSidebar={onOpen} />
        <Box p={{ base: "16px", md: "8" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
