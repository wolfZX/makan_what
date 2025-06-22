"use client";
import { Image } from "@chakra-ui/react";

interface LogoProps {
  size?: string | number;
}

export default function Logo({ size = 100 }: LogoProps) {
  return <Image src="/logo.png" alt="Makan Where Logo" boxSize={size} />;
}
