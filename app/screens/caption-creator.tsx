import React from "react";
import { View, Text, Button } from "react-native";

// ✅ Define the expected props
interface CaptionProps {
  srt: string;
  setSrt: (srt: string) => void;
}

export default function CaptionCreator({ srt, setSrt }: CaptionProps) {
  const generateSRT = () => {
    setSrt("Generated Subtitles: \n00:00:00,000 --> 00:00:05,000\nThis is a subtitle.");
  };

  return (
    <View className="bg-gray-800 p-4 rounded-lg shadow-md">
      <Text className="text-lg font-bold text-white">Step 4: Generate Subtitles</Text>
      <Text className="text-white">{srt || "No subtitles yet."}</Text>
      <Button title="Generate Subtitles" onPress={generateSRT} />
    </View>
  );
}
