// app/tasks.tsx
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useAuth } from "./_layout";
import {
  useTasks,
  useAddTask,
  useDeleteTask,
  useToggleTask,
} from "../hooks/useTasks";

type Task = {
  id: string;
  title: string;
  completed?: boolean;
};

export default function TasksScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");

  const { data: tasks, isLoading } = useTasks(user?.uid);
  const addTask = useAddTask(user?.uid);
  const deleteTask = useDeleteTask(user?.uid);
  const toggleTask = useToggleTask(user?.uid);

  if (!loading && !user) {
    router.replace("/");
  }

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask.mutate(title.trim());
    setTitle("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
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

        <Text className="mb-3 text-lg font-semibold">Tasks</Text>

        {/* input + Add */}
        <View className="mb-4 flex-row items-center gap-2">
          <TextInput
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter task title..."
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity
            className="h-10 items-center justify-center rounded-md bg-[#1d7df2] px-4"
            onPress={handleAdd}
          >
            <Text className="text-sm font-semibold text-white">Add</Text>
          </TouchableOpacity>
        </View>

        {/* list */}
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={(tasks as Task[]) ?? []}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={({ item }) => (
              <TaskRow
                task={item}
                onToggle={() => toggleTask.mutate(item)}
                onDelete={() => deleteTask.mutate(item.id)}
              />
            )}
          />
        )}

        <TouchableOpacity
          className="mt-6 h-10 items-center justify-center rounded-md bg-[#1d7df2]"
          onPress={handleLogout}
        >
          <Text className="text-sm font-semibold text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type RowProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

function TaskRow({ task, onToggle, onDelete }: RowProps) {
  return (
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="mr-3 flex-row items-center"
        onPress={onToggle}
      >
        <View
          className={`mr-2 h-4 w-4 rounded-full border ${
            task.completed ? "bg-[#1d7df2] border-[#1d7df2]" : "border-gray-400"
          }`}
        />
        <Text
          className={
            task.completed ? "text-gray-400 line-through" : "text-black"
          }
        >
          {task.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete}>
        <Text className="text-xs font-semibold text-red-500">Delete</Text>
      </TouchableOpacity>
    </View>
  );
}