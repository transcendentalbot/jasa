import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function Index() {
  // Data states
  const [story, setStory] = useState("");
  const [storySubmitted, setStorySubmitted] = useState(false);
  // Story Elements are auto-generated (simulate extraction from the story)
  const [character, setCharacter] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [genre, setGenre] = useState("");
  const [hasAnimals, setHasAnimals] = useState(false);

  const [scenes, setScenes] = useState([]);
  const [images, setImages] = useState({}); // Mapping: scene index -> image URL
  const [audio, setAudio] = useState("");
  const [audioPreset, setAudioPreset] = useState("Default");
  const [srt, setSrt] = useState("");
  const [subtitlePreset, setSubtitlePreset] = useState("Standard");

  // Simulate auto-generating story elements from the story input
  useEffect(() => {
    // For demo purposes, we simply extract the first few words as elements
    if (story) {
      const words = story.split(" ");
      setCharacter(words.slice(0, 1).join(" ") || "N/A");
      setGender(words.slice(1, 2).join(" ") || "N/A");
      setAge(words.slice(2, 3).join(" ") || "N/A");
      setGenre(words.slice(3, 4).join(" ") || "N/A");
      // For hasAnimals, we simply check if the word "animal" appears
      setHasAnimals(story.toLowerCase().includes("animal"));
    }
  }, [story]);

  // Step 1: Submit full story (simulate existing endpoint)
  const submitStory = async () => {
    try {
      const res = await fetch("https://dl8sa7hwka.execute-api.us-east-1.amazonaws.com/dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story,
          character,
          gender,
          age,
          genre,
          hasAnimals,
        }),
      });
      const data = await res.json();
      Alert.alert("Story Submitted", data.message);
      setStorySubmitted(true);
    } catch (error) {
      console.error("Error submitting story:", error);
      Alert.alert("Error", "Failed to submit story");
    }
  };

  // Step 2: Create & Edit Scenes (simulate calling endpoint)
  const createScenes = async () => {
    try {
      const res = await fetch("https://abi6wff436.execute-api.us-east-1.amazonaws.com/dev/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setScenes(data);
        Alert.alert("Scenes Created", "Scenes generated successfully.");
      } else {
        Alert.alert("Error", "Unexpected scenes response format");
      }
    } catch (error) {
      console.error("Error creating scenes:", error);
      Alert.alert("Error", "Failed to create scenes");
    }
  };

  const updateScene = (index, newText) => {
    const updatedScenes = scenes.map((sceneObj, idx) =>
      idx === index ? { ...sceneObj, scene: newText } : sceneObj
    );
    setScenes(updatedScenes);
  };

  // Step 3: Generate Images (simulate API)
  const generateImageForScene = async (index) => {
    const imageUrl = `https://example.com/generated-image-${index}.jpg`;
    setImages({ ...images, [index]: imageUrl });
    Alert.alert("Image Generated", `Image for scene ${index + 1} generated.`);
  };

  // Step 4: Generate Audio
  const generateAudio = async () => {
    const generatedAudioUrl = `https://example.com/generated-audio-${audioPreset}.mp3`;
    setAudio(generatedAudioUrl);
    Alert.alert("Audio Generated", "Audio generated successfully.");
  };

  // Step 5: Generate Subtitles (SRT)
  const generateSRT = async () => {
    const generatedSRT = `1
00:00:00,000 --> 00:00:05,000
Subtitle using preset ${subtitlePreset}\n\n2
00:00:05,000 --> 00:00:10,000
Another subtitle line using preset ${subtitlePreset}`;
    setSrt(generatedSRT);
    Alert.alert("Subtitles Generated", "SRT generated successfully.");
  };

  // Step 6: Final Review & Export
  const finalizeExport = () => {
    Alert.alert("Export", "Storyboard exported successfully!");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        {/* LEFT COLUMN: User Inputs & Actions */}
        <View style={styles.column}>
          {/* Card: Step 1 - Story Input */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Step 1: Enter Your Story</Text>
              <TouchableOpacity style={styles.smallButton} onPress={submitStory}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallButton, styles.secondaryButton]} onPress={createScenes}>
                <Text style={styles.buttonText}>Create Scenes</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.storyInput}
              multiline
              placeholder="Once upon a time..."
              value={story}
              onChangeText={setStory}
            />
          </View>

          {/* Card: Step 2 - Edit Scenes */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Step 2: Edit Scenes</Text>
            </View>
            {scenes.length > 0 ? (
              scenes.map((sceneObj, index) => (
                <View key={index} style={styles.sceneCard}>
                  <View style={styles.inlineHeader}>
                    <Text style={styles.sceneLabel}>Scene {index + 1}</Text>
                    <TouchableOpacity style={styles.tinyButton} onPress={() => generateImageForScene(index)}>
                      <Text style={styles.tinyButtonText}>Gen Img</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.sceneInput}
                    value={sceneObj.scene}
                    onChangeText={(text) => updateScene(index, text)}
                  />
                  {images[index] && (
                    <Text style={styles.linkText}>Image: {images[index]}</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.placeholderText}>No scenes generated yet.</Text>
            )}
          </View>

          {/* Card: Step 3 - Generate Audio */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Step 3: Generate Audio</Text>
              <TouchableOpacity style={styles.smallButton} onPress={generateAudio}>
                <Text style={styles.buttonText}>Gen Audio</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Select Audio Preset:</Text>
            <Picker
              selectedValue={audioPreset}
              onValueChange={(itemValue) => setAudioPreset(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Default" value="Default" />
              <Picker.Item label="Narrator 1" value="Narrator1" />
              <Picker.Item label="Narrator 2" value="Narrator2" />
            </Picker>
          </View>

          {/* Card: Step 4 - Generate Subtitles */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Step 4: Generate Subtitles</Text>
              <TouchableOpacity style={styles.smallButton} onPress={generateSRT}>
                <Text style={styles.buttonText}>Gen SRT</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Select Subtitle Preset:</Text>
            <Picker
              selectedValue={subtitlePreset}
              onValueChange={(itemValue) => setSubtitlePreset(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Standard" value="Standard" />
              <Picker.Item label="Minimal" value="Minimal" />
              <Picker.Item label="Detailed" value="Detailed" />
            </Picker>
          </View>

          {/* Card: Step 5 - Final Review & Export */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Step 5: Review & Export</Text>
              <TouchableOpacity style={styles.smallButton} onPress={finalizeExport}>
                <Text style={styles.buttonText}>Export</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* RIGHT COLUMN: Story Elements (Auto-generated) */}
        <View style={styles.column}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Story Elements</Text>
            <View style={styles.outputBox}>
              <Text style={styles.label}>Character:</Text>
              <TextInput style={styles.outputInput} value={character} onChangeText={setCharacter} />
            </View>
            <View style={styles.outputBox}>
              <Text style={styles.label}>Gender:</Text>
              <TextInput style={styles.outputInput} value={gender} onChangeText={setGender} />
            </View>
            <View style={styles.outputBox}>
              <Text style={styles.label}>Age:</Text>
              <TextInput style={styles.outputInput} value={age} onChangeText={setAge} />
            </View>
            <View style={styles.outputBox}>
              <Text style={styles.label}>Genre:</Text>
              <TextInput style={styles.outputInput} value={genre} onChangeText={setGenre} />
            </View>
            <View style={styles.outputBox}>
              <Text style={styles.label}>Include Animals:</Text>
              <Switch value={hasAnimals} onValueChange={setHasAnimals} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
    padding: 5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  smallButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  secondaryButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
  storyInput: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingLeft: 8,
    backgroundColor: "white",
  },
  outputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginVertical: 5,
  },
  outputInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
  },
  sceneCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inlineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sceneLabel: {
    fontWeight: "bold",
  },
  sceneInput: {
    height: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
    borderRadius: 4,
    backgroundColor: "#f9f9f9",
    marginBottom: 4,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  tinyButton: {
    backgroundColor: "#FF9500",
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  tinyButtonText: {
    fontSize: 12,
    color: "white",
  },
  placeholderText: {
    fontStyle: "italic",
    color: "#888",
    marginVertical: 8,
  },
  linkText: {
    color: "blue",
    marginTop: 5,
  },
});
