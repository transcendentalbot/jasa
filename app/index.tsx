import React, { useState } from "react";
import { ThemeProvider } from "./screens/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Define the Character type
type Character = {
  name: string;
  role: string;
};
import { ScrollView, View } from "react-native";

// Import the five steps as separate components
import StoryCreator from "./screens/story-creator";
import SceneCreator from "./screens/scene-creator";
import AudioCreator from "./screens/audio-creator";
import CaptionCreator from "./screens/caption-creator";
import MediaProcessor from "./screens/media-processor";

export default function Index() {
  // Shared state across steps
  const [story, setStory] = useState("");
  const [genre, setGenre] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState([]);
  const [audio, setAudio] = useState("");
  const [srt, setSrt] = useState("");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
     <ThemeProvider>
        <ScrollView className="bg-gray-950 p-4">
          <View className="space-y-6">
            <StoryCreator story={story} setStory={setStory} genre={genre} setGenre={setGenre} characters={characters} setCharacters={setCharacters} />
            <SceneCreator characters={characters} setCharacters={setCharacters} />
            <AudioCreator audio={audio} setAudio={setAudio} />
            <CaptionCreator srt={srt} setSrt={setSrt} />
            <MediaProcessor story={story} scenes={scenes} audio={audio} srt={srt} />
          </View>
        </ScrollView>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}