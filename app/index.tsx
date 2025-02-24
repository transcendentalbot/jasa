import { Amplify } from "aws-amplify";
import { post } from "@aws-amplify/api";
import amplifyconfig from "../src/amplifyconfiguration.json";
Amplify.configure(amplifyconfig);

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Switch, Pressable, SafeAreaView } from "react-native";
import { generateClient } from "aws-amplify/api";
import { createStory } from "../src/graphql/mutations";
import { listStories } from "../src/graphql/queries";

const client = generateClient();
const API_NAME = "ScriptGeneratorAPI";
const API_GATEWAY_URL = "https://isxtrrscue.execute-api.us-east-1.amazonaws.com/dev";

// Define the Story interface for TypeScript
interface Story {
  __typename: string;
  id: string;
  name: string;
  description?: string | null;
  character?: string | null;
  gender?: string | null;
  age?: string | null;
  genre?: string | null;
  hasAnimals?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export default function Index() {
  // Use a single state object for form data
  const [formData, setFormData] = useState({
    story: "",
    character: "",
    name: "",
    description: "",
    gender: "",
    age: "",
    genre: "",
    hasAnimals: false,
  });

  const [stories, setStories] = useState<Story[]>([]);

  // Fetch stories from GraphQL
  useEffect(() => {
    fetchStories();
  }, []);

  async function fetchStories() {
    try {
      console.log("📌 Fetching stories from GraphQL...");
      const storyData = await client.graphql({ query: listStories });

      if (storyData.data?.listStories?.items) {
        setStories(storyData.data.listStories.items);
      } else {
        console.warn("⚠️ No stories found.");
        setStories([]);
      }
    } catch (err) {
      console.error("❌ Error fetching stories:", err);
    }
  }

  // Handle input changes dynamically
  const handleChange = (name: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function generateScript() {
    if (!formData.story) {
        alert("⚠️ Please enter a story before generating a script.");
        return;
    }

    try {
        console.log("📌 Sending story to Lambda...");

        const response = await fetch("https://isxtrrscue.execute-api.us-east-1.amazonaws.com/dev/script", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // ✅ Explicitly setting Content-Type
            },
            body: JSON.stringify(formData) // ✅ Convert to JSON string
        });

        const data = await response.json();
        console.log("✅ Generated Script:", data);
        alert(`Generated Script: ${JSON.stringify(data, null, 2)}`);
    } catch (err) {
        console.error("❌ Error generating script:", err);
    }
}

  async function addStory() {
    if (!formData.story || !formData.name) {
      alert("⚠️ Story and Name are required!");
      return;
    }

    const newStory = {
      __typename: "Story",
      id: "",
      ...formData, // Spread formData instead of manually assigning
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      setStories([...stories, newStory]);

      await client.graphql({
        query: createStory,
        variables: { input: newStory },
      });

      const lambdaResponse = await fetch(`${API_GATEWAY_URL}/scriptgenerator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStory),
      });

      const data = await lambdaResponse.json();
      console.log("✅ Generated Script:", data.script);

      fetchStories();
    } catch (err) {
      console.log("❌ Error:", err);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flexDirection: "row" }}>
          {/* LEFT PANEL: STORY INPUT */}
          <View style={{ flex: 2, paddingRight: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Enter Your Story:</Text>
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
              value={formData.story}
              onChangeText={(text) => handleChange("story", text)}
            />
          </View>

          {/* RIGHT PANEL: STORY DETAILS */}
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Story Elements:</Text>

            {[
              { label: "Character:", name: "character", placeholder: "e.g., Hero" },
              { label: "Story Name:", name: "name", placeholder: "e.g., The Brave Knight" },
              { label: "Description:", name: "description", placeholder: "Short summary" },
              { label: "Gender:", name: "gender", placeholder: "e.g., Male/Female" },
              { label: "Age:", name: "age", placeholder: "e.g., Adult" },
              { label: "Genre:", name: "genre", placeholder: "e.g., Fantasy" },
            ].map((item, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.label}</Text>
                  {item.name === "hasAnimals" ? (
                    <Switch 
                      value={formData.hasAnimals} 
                      onValueChange={(value) => handleChange("hasAnimals", value)}
                    />
                  ) : (
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
                      value={formData[item.name as keyof typeof formData] as string} // Ensure it is a string
                      onChangeText={(text) => handleChange(item.name as keyof typeof formData, text)}
                    />
                  )}
              </View>
            ))}

            {/* Switch for Animals */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <Text style={{ fontSize: 14, marginRight: 10 }}>Include Animals?</Text>
              <Switch
                value={formData.hasAnimals}
                onValueChange={(value) => handleChange("hasAnimals", value)}
              />
            </View>
          </View>
        </View>

        {/* BUTTONS */}
        <Pressable onPress={addStory} style={{ alignSelf: "center", backgroundColor: "black", padding: 10, marginTop: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Save Story</Text>
        </Pressable>

        <Pressable onPress={generateScript} style={{ alignSelf: "center", backgroundColor: "blue", padding: 10, marginTop: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Generate Script ➤</Text>
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
