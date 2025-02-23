import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Switch, Pressable, SafeAreaView } from "react-native";
import { generateClient } from "aws-amplify/api";
import { createStory } from "../src/graphql/mutations";
import { listStories } from "../src/graphql/queries";

const client = generateClient();

export default function Index() {
  const [story, setStory] = useState("");
  const [character, setCharacter] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [genre, setGenre] = useState("");
  const [hasAnimals, setHasAnimals] = useState(false);
  const [stories, setStories] = useState([]);

  // Fetch stories from GraphQL
  useEffect(() => {
    fetchStories();
  }, []);

  async function fetchStories() {
    try {
      const storyData = await client.graphql({
        query: listStories,
      });
      const fetchedStories = storyData.data.listStories.items;
      setStories(fetchedStories);
    } catch (err) {
      console.log("Error fetching stories:", err);
    }
  }

  async function addStory() {
    if (!story) return;
    const newStory = { name: story, description: story, character, gender, age, genre, hasAnimals };
    
    try {
      setStories([...stories, newStory]); // Update UI
      setStory(""); // Clear input fields
      setCharacter("");
      setGender("");
      setAge("");
      setGenre("");
      setHasAnimals(false);

      await client.graphql({
        query: createStory,
        variables: {
          input: newStory,
        },
      });

      fetchStories(); // Refresh stories
    } catch (err) {
      console.log("Error creating story:", err);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flexDirection: "row" }}>
          {/* LEFT PANEL: STORY INPUT */}
          <View style={{ flex: 2, paddingRight: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              Enter Your Story:
            </Text>
            <TextInput
              style={{
                height: 150,
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

          {/* RIGHT PANEL: STORY DETAILS */}
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Story Elements:</Text>

            {[
              { label: "Character:", value: character, setValue: setCharacter, placeholder: "e.g., Hero" },
              { label: "Gender:", value: gender, setValue: setGender, placeholder: "e.g., Male/Female" },
              { label: "Age:", value: age, setValue: setAge, placeholder: "e.g., Adult" },
              { label: "Genre:", value: genre, setValue: setGenre, placeholder: "e.g., Fantasy" },
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
                  placeholder={item.placeholder}
                  value={item.value}
                  onChangeText={item.setValue}
                />
              </View>
            ))}

            {/* Switch for Animals */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <Text style={{ fontSize: 14, marginRight: 10 }}>Include Animals?</Text>
              <Switch value={hasAnimals} onValueChange={setHasAnimals} />
            </View>
          </View>
        </View>

        {/* BUTTON: SAVE STORY */}
        <Pressable onPress={addStory} style={{ alignSelf: "center", backgroundColor: "black", padding: 10, marginTop: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Save Story</Text>
        </Pressable>

        {/* DISPLAY STORIES */}
        <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}>Saved Stories:</Text>
        {stories.map((s, index) => (
          <View key={s.id || index} style={{ marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: "#ccc" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{s.name}</Text>
            <Text>{s.description}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}