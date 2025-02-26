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
  ActivityIndicator,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";

// Collapsible CharacterCard component
const CharacterCard = ({ character, index, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  // Update a field and notify parent
  const updateField = (field, value) => {
    onUpdate(index, { ...character, [field]: value });
  };

  return (
    <View style={styles.charCard}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.charHeader}
      >
        {/* Editable header: Name and Story Context */}
        <TextInput
          style={styles.headerInput}
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={character.name}
          onChangeText={(text) => updateField("name", text)}
        />
        <TextInput
          style={styles.contextInput}
          placeholder="Story Context"
          placeholderTextColor="#aaa"
          value={character.context}
          onChangeText={(text) => updateField("context", text)}
        />
        <Ionicons
          name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={18}
          color="#fff"
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.charContent}>
          <View style={styles.row}>
            {/* Gender Dropdown */}
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Gender:</Text>
              <Picker
                selectedValue={character.gender}
                onValueChange={(value) => updateField("gender", value)}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            {/* Age Input */}
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Age:</Text>
              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={character.age}
                onChangeText={(text) => updateField("age", text)}
              />
            </View>
          </View>
          {/* Description */}
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Description"
            placeholderTextColor="#aaa"
            multiline
            value={character.description}
            onChangeText={(text) => updateField("description", text)}
          />
        </View>
      )}
    </View>
  );
};

export default function Index() {
  // Story states
  const [story, setStory] = useState("");
  const [storySubmitted, setStorySubmitted] = useState(false);
  const [genre, setGenre] = useState("");

  // Dynamic character list with two static examples
  const [characters, setCharacters] = useState([
    { name: "Alice", context: "Knight", gender: "Female", age: "25", description: "A brave warrior of light." },
    { name: "Bob", context: "Rogue", gender: "Male", age: "30", description: "A cunning trickster." },
  ]);

  // Other states for subsequent steps
  const [scenes, setScenes] = useState([]);
  const [images, setImages] = useState({}); // scene index => image URL
  const [audio, setAudio] = useState("");
  const [audioPreset, setAudioPreset] = useState("Default");
  const [srt, setSrt] = useState("");
  const [subtitlePreset, setSubtitlePreset] = useState("Standard");

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Utility: Show status message temporarily
  const showStatus = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Step 1: Submit Story (including genre and characters)
  const submitStory = async () => {
    setLoading(true);
    try {
      const payload = {
        story,
        genre,
        characters,
      };
      const res = await fetch("https://dl8sa7hwka.execute-api.us-east-1.amazonaws.com/dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      showStatus(data.message || "Story submitted!");
      setStorySubmitted(true);
    } catch (error) {
      console.error("Error submitting story:", error);
      Alert.alert("Error", "Failed to submit story");
    }
    setLoading(false);
  };

  // Add a new character
  const addCharacter = () => {
    setCharacters([...characters, { name: "", context: "", gender: "Male", age: "", description: "" }]);
  };

  const updateCharacterAtIndex = (index, updatedCharacter) => {
    const updated = characters.map((char, idx) => (idx === index ? updatedCharacter : char));
    setCharacters(updated);
  };

  // Scenes
  const createScenes = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://abi6wff436.execute-api.us-east-1.amazonaws.com/dev/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setScenes(data);
        showStatus("Scenes generated successfully.");
      } else {
        Alert.alert("Error", "Unexpected scenes response format");
      }
    } catch (error) {
      console.error("Error creating scenes:", error);
      Alert.alert("Error", "Failed to create scenes");
    }
    setLoading(false);
  };

  const updateScene = (index, newText) => {
    const updatedScenes = scenes.map((sceneObj, idx) =>
      idx === index ? { ...sceneObj, scene: newText } : sceneObj
    );
    setScenes(updatedScenes);
  };

  const generateImageForScene = async (index) => {
    setLoading(true);
    const imageUrl = `https://example.com/generated-image-${index}.jpg`;
    setImages({ ...images, [index]: imageUrl });
    showStatus(`Image for scene ${index + 1} generated.`);
    setLoading(false);
  };

  // Audio
  const generateAudio = async () => {
    setLoading(true);
    const generatedAudioUrl = `https://example.com/generated-audio-${audioPreset}.mp3`;
    setAudio(generatedAudioUrl);
    showStatus("Audio generated successfully.");
    setLoading(false);
  };

  // Subtitles
  const generateSRT = async () => {
    setLoading(true);
    const generatedSRT = `1
00:00:00,000 --> 00:00:05,000
Subtitle using preset ${subtitlePreset}\n\n2
00:00:05,000 --> 00:00:10,000
Another subtitle line using preset ${subtitlePreset}`;
    setSrt(generatedSRT);
    showStatus("Subtitles generated successfully.");
    setLoading(false);
  };

  const finalizeExport = () => {
    Alert.alert("Export", "Storyboard exported successfully!");
  };

  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      {statusMessage !== "" && (
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      )}

      {/* Card: Step 1 - Story & Story Elements */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Step 1: Enter Your Story</Text>
        </View>
        <View style={styles.row}>
          {/* Left: Story Input */}
          <View style={styles.halfColumn}>
            <TextInput
              style={styles.storyInput}
              multiline
              placeholder="Once upon a time..."
              placeholderTextColor="#aaa"
              value={story}
              onChangeText={setStory}
            />
          </View>
          {/* Right: Story Elements */}
          <View style={styles.halfColumn}>
            <View style={styles.outputBox}>
              <Text style={styles.label}>Genre:</Text>
              <TextInput
                style={styles.outputInput}
                placeholder="e.g., Fantasy"
                placeholderTextColor="#aaa"
                value={genre}
                onChangeText={setGenre}
              />
            </View>
            <Text style={[styles.label, { marginVertical: 5, color: "#fff" }]}>Characters:</Text>
            {characters.map((char, index) => (
              <CharacterCard
                key={index}
                character={char}
                index={index}
                onUpdate={updateCharacterAtIndex}
              />
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addCharacter}>
              <Ionicons name="add-circle-outline" size={16} color="#fff" />
              <Text style={styles.addButtonText}>Add Character</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomRightButtonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={submitStory}>
            <Ionicons name="send-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.secondaryButton]} onPress={createScenes}>
            <Ionicons name="albums-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Create Scenes</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card: Step 2 - Edit Scenes */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Step 2: Edit Scenes</Text>
        {scenes.length > 0 ? (
          scenes.map((sceneObj, index) => (
            <View key={index} style={styles.sceneCard}>
              <View style={styles.inlineHeader}>
                <Text style={styles.sceneLabel}>Scene {index + 1}</Text>
                <TouchableOpacity style={styles.tinyButton} onPress={() => generateImageForScene(index)}>
                  <Ionicons name="image-outline" size={12} color="#fff" />
                  <Text style={styles.tinyButtonText}>Image</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <View style={styles.halfColumn}>
                  <TextInput
                    style={styles.sceneInput}
                    placeholder="Edit scene text..."
                    placeholderTextColor="#aaa"
                    value={sceneObj.scene}
                    onChangeText={(text) => updateScene(index, text)}
                  />
                </View>
                <View style={styles.halfColumn}>
                  {images[index] ? (
                    <Text style={styles.linkText}>Image: {images[index]}</Text>
                  ) : (
                    <Text style={styles.placeholderText}>No image</Text>
                  )}
                </View>
              </View>
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
        </View>
        <View style={styles.row}>
          <View style={styles.halfColumn}>
            <Text style={styles.label}>Audio Preset:</Text>
            <Picker
              selectedValue={audioPreset}
              onValueChange={(itemValue) => setAudioPreset(itemValue)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Default" value="Default" />
              <Picker.Item label="Narrator 1" value="Narrator1" />
              <Picker.Item label="Narrator 2" value="Narrator2" />
            </Picker>
          </View>
          <View style={styles.halfColumn}>
            {audio ? (
              <Text style={styles.linkText}>Audio: {audio}</Text>
            ) : (
              <Text style={styles.placeholderText}>No audio generated</Text>
            )}
          </View>
        </View>
        <View style={styles.bottomRightButtonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={generateAudio}>
            <Ionicons name="musical-notes-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Gen Audio</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card: Step 4 - Generate Subtitles */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Step 4: Generate Subtitles</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.halfColumn}>
            <Text style={styles.label}>Subtitle Preset:</Text>
            <Picker
              selectedValue={subtitlePreset}
              onValueChange={(itemValue) => setSubtitlePreset(itemValue)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Standard" value="Standard" />
              <Picker.Item label="Minimal" value="Minimal" />
              <Picker.Item label="Detailed" value="Detailed" />
            </Picker>
          </View>
          <View style={styles.halfColumn}>
            {srt ? (
              <Text style={styles.linkText}>{srt}</Text>
            ) : (
              <Text style={styles.placeholderText}>No subtitles generated</Text>
            )}
          </View>
        </View>
        <View style={styles.bottomRightButtonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={generateSRT}>
            <Ionicons name="document-text-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Gen SRT</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card: Step 5 - Review & Export */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Step 5: Review & Export</Text>
        </View>
        <View style={styles.outputBox}>
          <Text style={styles.label}>Final Storyboard:</Text>
          <Text style={styles.bodyText}>{story}</Text>
          {scenes.map((sceneObj, index) => (
            <View key={index} style={{ marginVertical: 5 }}>
              <Text style={styles.bodyText}>
                Scene {index + 1}: {sceneObj.scene}
              </Text>
              {images[index] && (
                <Text style={styles.linkText}>Image: {images[index]}</Text>
              )}
            </View>
          ))}
          {audio && (
            <>
              <Text style={[styles.label, { marginTop: 10 }]}>Audio:</Text>
              <Text style={styles.linkText}>{audio}</Text>
            </>
          )}
          {srt && (
            <>
              <Text style={[styles.label, { marginTop: 10 }]}>Subtitles (SRT):</Text>
              <Text style={styles.bodyText}>{srt}</Text>
            </>
          )}
        </View>
        <View style={styles.bottomRightButtonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={finalizeExport}>
            <Ionicons name="checkmark-done-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 10 },
  row: { flexDirection: "row" },
  halfColumn: { flex: 1, padding: 5 },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    position: "relative",
  },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  secondaryButton: { backgroundColor: "#34C759" },
  buttonText: { color: "#fff", fontSize: 14, marginLeft: 4 },
  storyInput: { height: 150, borderWidth: 1, borderColor: "#444", padding: 10, borderRadius: 8, backgroundColor: "#2a2a2a", color: "#fff", textAlignVertical: "top", marginBottom: 10 },
  outputBox: { borderWidth: 1, borderColor: "#444", padding: 8, borderRadius: 8, backgroundColor: "#2a2a2a", marginVertical: 5 },
  label: { fontSize: 14, marginBottom: 4, color: "#ccc" },
  outputInput: { height: 40, borderWidth: 1, borderColor: "#555", borderRadius: 4, paddingHorizontal: 8, backgroundColor: "#2a2a2a", color: "#fff" },
  picker: { height: 50, width: "100%", marginBottom: 10, color: "#fff", backgroundColor: "#2a2a2a" },
  statusBar: { backgroundColor: "#007AFF", padding: 5, borderRadius: 5, marginVertical: 5 },
  statusText: { color: "#fff", textAlign: "center" },
  loadingOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", zIndex: 10 },
  bottomRightButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
  },
  bodyText: { color: "#fff" },
  // Character card styles
  charCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 6,
    padding: 4,
    marginVertical: 4,
  },
  charHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#1e1e1e",
    borderRadius: 6,
  },
  headerInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  contextInput: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    marginRight: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  charContent: { padding: 8 },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "#1e1e1e",
    color: "#fff",
    fontSize: 14,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: "#007AFF",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, marginLeft: 4 },
  inlineHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  sceneLabel: { fontWeight: "bold", color: "#fff" },
  sceneInput: { height: 60, borderWidth: 1, borderColor: "#444", padding: 5, borderRadius: 4, backgroundColor: "#2a2a2a", color: "#fff", marginBottom: 4 },
  tinyButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF9500", paddingVertical: 2, paddingHorizontal: 4, borderRadius: 3 },
  tinyButtonText: { fontSize: 12, color: "#fff", marginLeft: 2 },
  placeholderText: { fontStyle: "italic", color: "#888", marginVertical: 8 },
  linkText: { color: "#1E90FF", marginTop: 5 },
});

