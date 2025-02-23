import React from "react";
import { SafeAreaView } from "react-native";
import { Amplify } from "aws-amplify";
import amplifyconfig from "./src/amplifyconfiguration.json";
import Index from "./app/index"; // ✅ Main screen

Amplify.configure(amplifyconfig);

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Index />
    </SafeAreaView>
  );
}
