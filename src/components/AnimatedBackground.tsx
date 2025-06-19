import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import Image from "next/image";
import { useMemo } from "react";

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
  50% { opacity: 0.3; transform: translate(10px, -10px) scale(1); }
  100% { opacity: 0; transform: translate(0, 0) scale(0.8); }
`;

interface IconPosition {
  top: string;
  left: string;
  delay: string;
  duration: string;
}

export default function AnimatedBackground() {
  const iconPositions = useMemo<{ [key: string]: IconPosition[] }>(
    () => ({
      "/SVG-2.svg": [
        { top: "10%", left: "10%", delay: "0s", duration: "8s" },
        { top: "70%", left: "80%", delay: "4s", duration: "7s" },
      ],
      "/SVG-3.svg": [
        { top: "20%", left: "85%", delay: "2s", duration: "6s" },
        { top: "60%", left: "15%", delay: "5s", duration: "8s" },
      ],
      "/SVG-4.svg": [
        { top: "15%", left: "45%", delay: "1s", duration: "7s" },
        { top: "75%", left: "60%", delay: "3s", duration: "6s" },
      ],
      "/SVG-5.svg": [
        { top: "30%", left: "20%", delay: "2.5s", duration: "8s" },
        { top: "85%", left: "40%", delay: "5.5s", duration: "7s" },
      ],
      "/SVG.svg": [
        { top: "25%", left: "70%", delay: "1.5s", duration: "6s" },
        { top: "65%", left: "25%", delay: "4.5s", duration: "8s" },
      ],
    }),
    []
  );

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex="0"
      pointerEvents="none"
      overflow="hidden"
    >
      {Object.entries(iconPositions).map(([icon, positions]) =>
        positions.map((pos, index) => (
          <Box
            key={`${icon}-${index}`}
            position="absolute"
            top={pos.top}
            left={pos.left}
            animation={`${fadeInOut} ${pos.duration} ${pos.delay} infinite`}
            opacity="0"
          >
            <Image
              src={icon}
              alt="Background icon"
              width={32}
              height={32}
              style={{ opacity: 0.6 }}
            />
          </Box>
        ))
      )}
    </Box>
  );
}
