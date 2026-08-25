import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#E9E3FF",
      100: "#C0B8FE",
      200: "#A195FD",
      300: "#8171FC",
      400: "#7551FF",
      500: "#4318FF",
      600: "#3311DB",
      700: "#2111A5",
      800: "#190793",
      900: "#11047A",
    },
    navy: {
      50: "#d0dcfb",
      100: "#aac0fe",
      200: "#a3b9f8",
      300: "#728fea",
      400: "#3652ba",
      500: "#1b3bbb",
      600: "#24388a",
      700: "#1B254B",
      800: "#111c44",
      900: "#0b1437",
    },
    secondaryGray: {
      100: "#F4F7FE",
      200: "#EFF4FB",
      300: "#E0E5F2",
      400: "#E9EDF7",
      500: "#8F9BBA",
      600: "#A3AED0",
      700: "#707EAE",
      800: "#707EAE",
      900: "#1B2559",
    },
  },
  styles: {
    global: {
      body: {
        bg: "secondaryGray.100",
        color: "navy.700",
      },
    },
  },
});

export default theme;
