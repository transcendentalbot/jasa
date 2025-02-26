import React, { useState } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "./theme"; // Import Theme Context

// Define Character Type
type Character = {
  name: string;
  gender: string;
  personality: string;
};

export default function StoryCreator() {
  const { theme } = useTheme(); // Get current theme
  const [story, setStory] = useState("");
  const [genre, setGenre] = useState("");
  const [timePeriod, setTimePeriod] = useState("Medieval");
  const [hasAnimalFriends, setHasAnimalFriends] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);

  // Add a new character
  const addCharacter = () => {
    setCharacters([...characters, { name: "", gender: "Male", personality: "" }]);
  };

  // Update character details
  const updateCharacter = (index: number, field: keyof Character, value: string) => {
    const updatedCharacters = [...characters];
    updatedCharacters[index][field] = value;
    setCharacters(updatedCharacters);
  };

  return (
    <View style={[styles.card, theme === "dark" ? styles.darkCard : styles.lightCard]}>
      {/* Header */}
      <Text style={[styles.cardTitle, theme === "dark" ? styles.darkText : styles.lightText]}>
        Step 1: Enter Your Story
      </Text>

      {/* Two-column layout */}
      <View style={styles.container}>
        {/* Left Column: Story Input */}
        <View style={styles.item}>
          <Text style={[styles.label, theme === "dark" ? styles.darkText : styles.lightText]}>Story Input:</Text>
          <TextInput
            style={[styles.input, styles.storyInput, theme === "dark" ? styles.darkInput : styles.lightInput]}
            multiline
            placeholder="Start writing your story..."
            placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
            value={story}
            onChangeText={setStory}
          />
        </View>

        {/* Right Column: Metadata */}
        <View style={styles.item}>
          {/* Genre Input */}
          <Text style={[styles.label, theme === "dark" ? styles.darkText : styles.lightText]}>Genre:</Text>
          <TextInput
            style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
            placeholder="e.g., Fantasy, Sci-Fi, Drama"
            placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
            value={genre}
            onChangeText={setGenre}
          />

          {/* Time Period Picker */}
          <Text style={[styles.label, theme === "dark" ? styles.darkText : styles.lightText]}>Time Period:</Text>
          <Picker
            selectedValue={timePeriod}
            onValueChange={setTimePeriod}
            style={[styles.picker, theme === "dark" ? styles.darkPicker : styles.lightPicker]}
          >
            <Picker.Item label="Medieval" value="Medieval" />
            <Picker.Item label="Modern" value="Modern" />
            <Picker.Item label="Futuristic" value="Futuristic" />
          </Picker>

          {/* Animal Friends Switch */}
          <View style={styles.row}>
            <Text style={[styles.label, theme === "dark" ? styles.darkText : styles.lightText]}>Animal Friends?</Text>
            <Switch value={hasAnimalFriends} onValueChange={setHasAnimalFriends} />
          </View>

          {/* Characters List */}
          <Text style={[styles.label, theme === "dark" ? styles.darkText : styles.lightText]}>Characters:</Text>
          <FlatList
            data={characters}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.characterRow}>
                <TextInput
                  style={[styles.input, styles.characterInput, theme === "dark" ? styles.darkInput : styles.lightInput]}
                  placeholder="Character Name"
                  placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
                  value={item.name}
                  onChangeText={(text) => updateCharacter(index, "name", text)}
                />
                <Picker
                  selectedValue={item.gender}
                  onValueChange={(value) => updateCharacter(index, "gender", value)}
                  style={[styles.picker, styles.characterPicker]}
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
                <TextInput
                  style={[styles.input, styles.characterInput, theme === "dark" ? styles.darkInput : styles.lightInput]}
                  placeholder="Personality"
                  placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
                  value={item.personality}
                  onChangeText={(text) => updateCharacter(index, "personality", text)}
                />
              </View>
            )}
          />

          {/* Add Character Button */}
          <TouchableOpacity style={styles.addButton} onPress={addCharacter}>
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.buttonText}>Add Character</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  darkCard: {
    backgroundColor: "#1e1e1e",
  },
  lightCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  item: {
    width: "50%",
    paddingHorizontal: 8,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  darkInput: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    borderColor: "#444",
  },
  lightInput: {
    backgroundColor: "#f9f9f9",
    color: "#000",
    borderColor: "#ddd",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  picker: {
    height: 40,
    marginBottom: 10,
  },
  darkPicker: {
    color: "#fff",
    backgroundColor: "#2a2a2a",
  },
  lightPicker: {
    color: "#000",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  preview: {
    fontStyle: "italic",
    marginBottom: 10,
  },
  darkPreview: {
    color: "#aaa",
  },
  lightPreview: {
    color: "#666",
  },
  characterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  characterInput: {
    flex: 1,
    marginRight: 8,
  },
  characterPicker: {
    width: 100,
  },
  addButton: {
    backgroundColor: "#ff7f0e",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
  },
  storyInput: {  // ✅ Add this
    height: 150,
    textAlignVertical: "top",
  },
});

