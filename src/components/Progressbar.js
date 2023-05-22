import { useState, useEffect } from "react";
import {
  CircularProgress,
  CircularProgressLabel,
  Box,
  Text,
  Center,
} from "@chakra-ui/react";

const CircularProgressBar = ({ percentage, duration, details }) => {
  const [progress, setProgress] = useState(0);
  const progressColor = "teal.500";
  const progressBarSize = "30rem";
  const fontWeightBold = "bold";
  const fontSize6xl = "6xl";
  const fontColorGray600 = "#666";
  const TrailColor = "#dddddd";

  useEffect(() => {
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);

      if (currentProgress >= percentage) {
        clearInterval(interval);
      }
    }, duration / percentage);

    return () => {
      clearInterval(interval);
    };
  }, [percentage, duration]);

  return (
    <Center>
      <CircularProgress
        value={progress}
        size={progressBarSize}
        thickness={4}
        color={progressColor}
        capIsRound
        trackColor={TrailColor}
      >
        <CircularProgressLabel
          fontSize={fontSize6xl}
          fontWeight={fontWeightBold}
        >
          {progress}%
          <Box textAlign="center">
            <Text
              fontSize="md"
              fontWeight={fontWeightBold}
              color={fontColorGray600}
            >
              {details}
            </Text>
          </Box>
        </CircularProgressLabel>
      </CircularProgress>
    </Center>
  );
};

export default CircularProgressBar;
