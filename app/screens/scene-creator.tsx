import React, { useState } from "react";
import { 
  View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Alert, Animated, PanResponder 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "./theme";
import { Swipeable } from "react-native-gesture-handler";

type Scene = {
  id: string;
  text: string;
  location: string;
  image: string | null;
  style: "Cinematic" | "Animated";
};

import { v4 as uuidv4 } from 'uuid'; // Import UUID

export default function SceneCreator() {
  const { theme } = useTheme();
  const [scenes, setScenes] = useState<Scene[]>([
    { id: "1", text: "A hero stands in the sunset.", location: "Forest", image: null, style: "Cinematic" },
    { id: "2", text: "A battle takes place in a dark forest.", location: "Ancient Ruins", image: null, style: "Animated" },
  ]);

  // Animated Value for Swipe Up
  const swipeAnim = new Animated.Value(0);

  // PanResponder to Detect Swipe Up
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy < -50; // Detect upward movement
    },
    onPanResponderRelease: () => {
      Animated.timing(swipeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        swipeAnim.setValue(0);
        addScene(); // Add a new scene when swiped up
      });
    },
  });

  // Add a new scene
  const addScene = () => {
    const newScene = { id: Date.now().toString(), text: "", location: "", image: null, style: "Cinematic" };
    setScenes([...scenes, newScene]);
  };
  
  const deleteScene = (sceneId: string) => {
      setScenes((prevScenes) => prevScenes.filter((scene) => scene.id !== sceneId));
    };

  return (
    <View style={[styles.card, theme === "dark" ? styles.darkCard : styles.lightCard]}>
      <Text style={[styles.cardTitle, theme === "dark" ? styles.darkText : styles.lightText]}>
        Step 2: Scene Creator
      </Text>

    <FlatList
        data={scenes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <Swipeable
            renderRightActions={() => (
                <TouchableOpacity
                style={styles.deleteSwipe}
                onPress={() => deleteScene(item.id)}
                >
                <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
            )}
            >
            <View style={[styles.sceneBox, theme === "dark" ? styles.darkSceneBox : styles.lightSceneBox]}>
                
                {/* Two-Column Layout */}
                <View style={styles.container}>
                
                {/* Left Column: Scene Text + Location */}
                <View style={styles.leftColumn}>
                    <View style={styles.sceneTextContainer}>
                    <TextInput
                        style={[styles.sceneInput, theme === "dark" ? styles.darkInput : styles.lightInput]}
                        multiline
                        placeholder="Enter scene description..."
                        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
                        value={item.text}
                        onChangeText={(text) =>
                        setScenes((prev) => prev.map((scene) => (scene.id === item.id ? { ...scene, text } : scene)))
                        }
                    />
                    <TouchableOpacity style={styles.audioButton}>
                        <Ionicons name="play-circle-outline" size={24} color={theme === "dark" ? "#f57c00" : "#ff9800"} />
                    </TouchableOpacity>
                    </View>
                    <TextInput
                    style={[styles.locationInput, theme === "dark" ? styles.darkInput : styles.lightInput]}
                    placeholder="Enter location..."
                    placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
                    value={item.location}
                    onChangeText={(text) =>
                        setScenes((prev) => prev.map((scene) => (scene.id === item.id ? { ...scene, location: text } : scene)))
                    }
                    />
                </View>

                {/* Right Column: Scene Image + Style Selector */}
                <View style={styles.rightColumn}>
                    {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.sceneImage} />
                    ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={[styles.imagePlaceholderText, theme === "dark" ? styles.darkLabel : styles.lightLabel]}>
                        No Image
                        </Text>
                    </View>
                    )}
                    <Picker
                    selectedValue={item.style}
                    onValueChange={(value) =>
                        setScenes((prev) => prev.map((scene) => (scene.id === item.id ? { ...scene, style: value } : scene)))
                    }
                    style={[styles.picker, theme === "dark" ? styles.darkPicker : styles.lightPicker]}
                    >
                    <Picker.Item label="Cinematic" value="Cinematic" />
                    <Picker.Item label="Animated" value="Animated" />
                    </Picker>
                </View>
                </View>
            </View>
            </Swipeable>
        )}
    />


      {/* Add Scene Button (Just + Icon) */}
      <TouchableOpacity style={styles.addButton} onPress={addScene}>
        <Ionicons name="add-circle-outline" size={30} color="#f57c00" />
      </TouchableOpacity>
    </View>
  );
}

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
        justifyContent: "space-between", // Distributes left and right columns evenly
        alignItems: "flex-start", // Aligns items at the top
        width: "100%",
      },
      item: {
        width: "50%",
        paddingHorizontal: 8,
      },
      sceneBox: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 6,
      },
      darkSceneBox: {
        backgroundColor: "#2a2a2a",
        borderColor: "#444",
        borderWidth: 1,
      },
      lightSceneBox: {
        backgroundColor: "#f9f9f9",
        borderColor: "#ddd",
        borderWidth: 1,
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
      inlineRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
      },
      deleteButton: {
        position: "absolute",
        top: 8,
        right: 8,
      },
      sceneImage: {
        width: "100%", // Ensures image aligns with the text field
        height: 120, // Keeps image size consistent
        borderRadius: 8,
        marginBottom: 8,
      },
      imagePlaceholder: {
        width: "100%",
        height: 100,
        borderRadius: 8,
        backgroundColor: "#444",
        justifyContent: "center",
        alignItems: "center",
      },
      imagePlaceholderText: {
        fontStyle: "italic",
      },
      picker: {
        width: "100%", // Matches Scene Description & Location
        height: 40,
        borderRadius: 8, // Adds rounded corners
        overflow: "hidden", // Ensures border radius is applied
        backgroundColor: "#2a2a2a", // Matches dark theme
        color: "#fff", // Text color for dark mode
        marginTop: 10,
      },
      darkPicker: {
        color: "#fff",
        backgroundColor: "#2a2a2a",
      },
      lightPicker: {
        color: "#000",
        backgroundColor: "#fff",
      },
      label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
      },
      darkLabel: {
        color: "#fff",
      },
      lightLabel: {
        color: "#000",
      },
      addButton: {
        position: "absolute",
        bottom: -3, // Floating above bottom
        left: "50%",
        transform: [{ translateX: -20 }], // Adjusts position to align with center
        zIndex: 10, // Keep it above other elements
      },
      buttonText: {
        color: "#fff",
        marginLeft: 5,
        fontSize: 14,
      },
      sceneTextContainer: {
        position: "relative", // Allow absolute positioning for button
        flexDirection: "column",
        width: "100%",
        marginBottom: 2,
      },
      sceneInput: {
        width: "100%", // Ensures full width
        height: 100, // Adjust height as needed
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
      },
      audioButton: {
        position: "absolute",
        bottom: 6,
        right: 6,
        padding: 6,
        borderRadius: 50,
        zIndex: 10, // Keeps it above other elements
      },
      sceneLocationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "90%", // Adjust this value so it doesn't extend to the audio button
        marginBottom: 2,
      },
      locationInput: {
        width: "100%", // Now it will align perfectly with sceneInput
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
        marginTop: 8, // Keeps spacing consistent
      },
      deleteSwipe: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        height: "100%",
        borderRadius: 6,
        marginLeft: 8,
      },
      leftColumn: {
        flex: 1, // Takes up available space
        marginRight: 10, // Adds spacing between columns
      },
      rightColumn: {
        flex: 1, // Takes up equal space
        alignItems: "stretch", // Ensures elements fill the column width
      },
      
    });
