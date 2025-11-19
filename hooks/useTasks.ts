// hooks/useTasks.ts
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../services/firebaseConfig";

export const useTasks = (userId?: string | null) => {
  return useQuery({
    queryKey: ["tasks", userId],
    enabled: !!userId,
    queryFn: async () => {
      const ref = collection(db, "users", userId!, "tasks");
      const q = query(ref, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
    },
  });
};

export const useAddTask = (userId?: string | null) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      const ref = collection(db, "users", userId!, "tasks");
      await addDoc(ref, {
        title,
        completed: false,
        createdAt: serverTimestamp(),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", userId] }),
  });
};

export const useDeleteTask = (userId?: string | null) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "users", userId!, "tasks", id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", userId] }),
  });
};

export const useToggleTask = (userId?: string | null) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (task: any) => {
      await updateDoc(doc(db, "users", userId!, "tasks", task.id), {
        completed: !task.completed,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", userId] }),
  });
};