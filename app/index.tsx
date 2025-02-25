import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Switch, Button, Alert } from "react-native";

export default function Index() {
  const [story, setStory] = useState("");
  const [character, setCharacter] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [genre, setGenre] = useState("");
  const [hasAnimals, setHasAnimals] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const invokeEndpoint = async () => {
    try {
      const res = await fetch(
        "https://dl8sa7hwka.execute-api.us-east-1.amazonaws.com/dev/script",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            story,
          }),
        }
      );

      const data = await res.json();
      console.log("API Response:", data);

      // Extract details from API response
      if (data.main_character) {
        setCharacter(data.main_character.name || "Unknown");
      }
      if (data.main_character && data.main_character.description) {
        setGender(data.main_character.description.includes("warrior") ? "Male" : "Unknown"); // Example logic
      }
      if (data.setting) {
        setAge("Unknown"); // Placeholder since age isn't in API response
      }
      if (data.story_type) {
        setGenre(data.story_type);
      }
      if (data.event) {
        setHasAnimals(data.event.toLowerCase().includes("animal"));
      }

      setResponseData(data); // Store full response for debugging/display
      Alert.alert("Response", JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error invoking endpoint:", error);
      Alert.alert("Error", "Failed to invoke endpoint");
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        
        {/* LEFT PANEL: STORY INPUT */}
        <View style={{ flex: 2, paddingRight: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Enter Your Story:
          </Text>
          <TextInput
            style={{
              height: 250,
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 10,
              borderRadius: 8,
              textAlignVertical: "top",
              fontSize: 16,
              backgroundColor: "#f9f9f9",
            }}
            multiline
            placeholder="Once upon a time..."
            value={story}
            onChangeText={setStory}
          />
        </View>

        {/* RIGHT PANEL: DISPLAY STORY ELEMENTS */}
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Extracted Story Elements:
          </Text>

          {[
            { label: "Character:", value: character },
            { label: "Gender:", value: gender },
            { label: "Age:", value: age },
            { label: "Genre:", value: genre },
          ].map((item, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 14 }}>{item.label}</Text>
              <TextInput
                style={{
                  height: 40,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 4,
                  paddingLeft: 8,
                  backgroundColor: "white",
                }}
                placeholder="Extracted value"
                value={item.value}
                editable={false} // Prevent user input since it's API-generated
              />
            </View>
          ))}

          {/* Switch for Animals */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <Text style={{ fontSize: 14, marginRight: 10 }}>Includes Animals?</Text>
            <Switch value={hasAnimals} disabled={true} />
          </View>
        </View>
      </View>

      {/* Button to Invoke Endpoint */}
      <View style={{ marginTop: 20 }}>
        <Button title="Submit Story" onPress={invokeEndpoint} />
      </View>

      {/* Display Full Response for Debugging */}
      {responseData && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Full API Response:</Text>
          <Text>{JSON.stringify(responseData, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
}
