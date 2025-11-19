// app/signup.tsx
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useAuth } from "./_layout";

export default function Signup() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && user) {
    router.replace("/tasks");
  }

  const handleSignup = async () => {
    try {
      setSubmitting(true);
      setError("");
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/tasks");
    } catch (e) {
      setError("Signup failed. Try another email/password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-[#f5f5f5]">
      <View className="w-80 rounded-3xl bg-white p-6 shadow">
        <Text className="mb-6 text-center text-3xl font-bold">FireTasks</Text>

        <Text className="mb-2 text-lg font-semibold">Signup</Text>

        <Text className="mb-1 text-xs text-gray-600">Email</Text>
        <TextInput
          className="mb-3 rounded-md border border-gray-300 px-3 py-2"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
        />

        <Text className="mb-1 text-xs text-gray-600">Password</Text>
        <TextInput
          className="mb-4 rounded-md border border-gray-300 px-3 py-2"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />

        {error ? (
          <Text className="mb-2 text-xs text-red-500">{error}</Text>
        ) : null}

        <TouchableOpacity
          className="mb-4 h-10 items-center justify-center rounded-md bg-[#1d7df2]"
          onPress={handleSignup}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-sm font-semibold text-white">Sign Up</Text>
          )}
        </TouchableOpacity>

        <View className="items-center">
          <Text className="mb-1 text-xs text-gray-500">
            Already have an account?
          </Text>
          <Link href="/" asChild>
            <TouchableOpacity>
              <Text className="text-xs font-semibold text-[#1d7df2]">
                Go to Login
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}