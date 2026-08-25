import { Flex, Icon, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { IconType } from "react-icons";
import Card from "./Card";

interface MiniStatisticsProps {
  name: string;
  value: string;
  icon: IconType;
}

export default function MiniStatistics({ name, value, icon }: MiniStatisticsProps) {
  return (
    <Card>
      <Flex align="center" justify="space-between">
        <Stat>
          <StatLabel color="secondaryGray.700" fontSize="sm" fontWeight="600">
            {name}
          </StatLabel>
          <StatNumber color="navy.700" fontSize="2xl" fontWeight="700">
            {value}
          </StatNumber>
        </Stat>
        <Flex
          boxSize="48px"
          align="center"
          justify="center"
          borderRadius="14px"
          bg="brand.50"
        >
          <Icon as={icon} boxSize="22px" color="brand.500" />
        </Flex>
      </Flex>
    </Card>
  );
}
