import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Switch } from "react-native";

export default function Index() {
  const [story, setStory] = useState("");
  const [character, setCharacter] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [genre, setGenre] = useState("");
  const [hasAnimals, setHasAnimals] = useState(false);

  return (
    <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        
        {/* LEFT PANEL: STORY INPUT (EXPANDED) */}
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

        {/* RIGHT PANEL: TEXT INPUTS INSTEAD OF PICKER */}
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Story Elements:
          </Text>

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
    </ScrollView>
  );
}
