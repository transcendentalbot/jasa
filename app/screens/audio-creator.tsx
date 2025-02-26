import React from "react";
import { View, Text, Button } from "react-native";

// ✅ Define the expected props
interface AudioProps {
  audio: string;
  setAudio: (audio: string) => void;
}

export default function AudioCreator({ audio, setAudio }: AudioProps) {
  const generateAudio = () => {
    setAudio(`Audio file ${Math.random().toString(36).substr(2, 5)}.mp3`);
  };

  return (
    <View className="bg-gray-800 p-4 rounded-lg shadow-md">
      <Text className="text-lg font-bold text-white">Step 3: Generate Audio</Text>
      <Text className="text-white">{audio || "No audio generated yet."}</Text>
      <Button title="Generate Audio" onPress={generateAudio} />
    </View>
  );
}
