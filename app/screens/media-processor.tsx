import React from "react";
import { View, Text, Button } from "react-native";

// ✅ Define the expected props
interface MediaProps {
  story: string;
  scenes: { scene: string }[];
  audio: string;
  srt: string;
}

export default function MediaProcessor({ story, scenes, audio, srt }: MediaProps) {
  const exportStory = () => {
    alert("Story exported successfully!");
  };

  return (
    <View className="bg-gray-800 p-4 rounded-lg shadow-md">
      <Text className="text-lg font-bold text-white">Step 5: Review & Export</Text>
      <Text className="text-white">Story: {story}</Text>
      {scenes.map((scene, index) => (
        <Text key={index} className="text-white">{scene.scene}</Text>
      ))}
      <Text className="text-white">Audio: {audio}</Text>
      <Text className="text-white">Subtitles: {srt}</Text>
      <Button title="Export Story" onPress={exportStory} />
    </View>
  );
}
