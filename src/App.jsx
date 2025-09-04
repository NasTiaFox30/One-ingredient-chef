import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import SearchBar from "./components/SearchBar";
import RecipeCard from "./components/RecipeCard";
import RecipeDetailScreen from "./components/RecipeDetailScreen";
import FavouritesScreen from "./components/FavouritesScreen";

import { db, auth, provider } from "./firebase.config";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const [showFavourites, setShowFavourites] = useState(false);
  const [favourites, setFavourites] = useState([]);

  const [user, setUser] = useState(null);

  //Login/Logout with Google
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Create user (first time login)
  const createNewUser = async (currentUser) => {
    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, { name: currentUser.displayName, createdAt: new Date().toISOString() });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchFavourites(currentUser.uid);
      } else {
        setFavourites([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Fetch all recipes from Firestore
  const fetchRecipes = async () => {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRecipes(data);
  };

  // Fetch favourites for user
  const fetchFavourites = async (uid) => {
    const favRef = collection(db, "users", uid, "favourites");
    const snapshot = await getDocs(favRef);
    const favs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFavourites(favs);
  };

  // Search by ingredients
  const handleSearch = (ingredients) => {
    const results = recipes.filter(r =>
      r.ingredients.some(i => ingredients.includes(i.name))
    );
    setFilteredRecipes(results);
  };

  // Save recipe to favourites
  const handleSaveRecipe = async (recipe) => {
    if (!user) {
      alert("Please login first to save recipes!");
      return;
    }
    const favRef = doc(db, "users", user.uid, "favourites", recipe.id);
    await setDoc(favRef, { ...recipe, savedAt: new Date().toISOString() });
    fetchFavourites(user.uid);
    alert("Recipe saved! ❤️");
  };

  return (
    <>
      <Header
        onShowFavourites={() => setShowFavourites(true)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        user={user}
      />

      <div className="container text-center mb-3">
        {user ? (
          <p>Welcome, {user.displayName}</p>
        ) : (
          <p>Can't find an interesting recipe? You are at the right place!</p>
        )}
      </div>

      <HeroSection />
      <SearchBar onSearch={handleSearch} />

      <div className="container d-flex flex-wrap gap-3 justify-content-center">
        {filteredRecipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onShow={(r) => { setSelectedRecipe(r); setShowDetail(true); }}
          />
        ))}
      </div>

      <AnimatePresence>
        {showDetail && (
          <RecipeDetailScreen
            recipe={selectedRecipe}
            onSaveRecipe={() => handleSaveRecipe(selectedRecipe)}
            onClose={() => setShowDetail(false)}
          />
        )}

        {showFavourites && (
          <FavouritesScreen
            favourites={favourites}
            onClose={() => setShowFavourites(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
