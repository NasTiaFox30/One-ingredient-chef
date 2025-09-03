import { db } from "../firebase.config";
import {
  collection, addDoc, getDocs, query, where, deleteDoc, doc
} from "firebase/firestore";

// add recipe
export const addRecipe = async (recipe) => {
  const docRef = await addDoc(collection(db, "recipes"), recipe);
  return { id: docRef.id, ...recipe };
};

// all recipes
export const getRecipes = async () => {
  const snapshot = await getDocs(collection(db, "recipes"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// Save favourites
export const addFavourite = async (recipe, userId) => {
  const docRef = await addDoc(collection(db, "favourites"), {
    ...recipe,
    userId,
    savedAt: new Date().toISOString()
  });
  return { id: docRef.id, ...recipe };
};

// delete favourite
export const deleteFavourite = async (id) => {
  await deleteDoc(doc(db, "favourites", id));
};


// get favourites (for user)
export const getFavourites = async (userId) => {
  const q = query(collection(db, "favourites"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


