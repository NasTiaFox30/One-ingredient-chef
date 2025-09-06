import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import SearchBar from "./components/SearchBar";
import RecipeCard from "./components/RecipeCard";
import RecipeDetailScreen from "./components/RecipeDetailScreen";
import FavouritesScreen from "./components/FavouritesScreen";
import AddNewRecipe from "./components/AddNewRecipe";
import catgif from "./assets/cat-chef.gif"

import { db, auth, provider } from "./firebase.config";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const [showFavourites, setShowFavourites] = useState(false);

  const [showNewRecipe, setShowNewRecipe] = useState(false);

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await createNewUser(currentUser);
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

  // Search by ingredients
  const handleSearch = (ingredients) => {
    const results = recipes.filter(r =>
      r.ingredients.some(i => ingredients.includes(i.name))
    );
    setFilteredRecipes(results);
  };
  
  const showCatGif = filteredRecipes.length === 0;

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

      <div className="container text-center mb-3">
        <button type="button" className="btn btn-outline-success" onClick={() => setShowNewRecipe(true)}>Add your own recipe🗒️+</button>
      </div>

      
      <div className="container d-flex flex-wrap gap-3 justify-content-center">
        <AnimatePresence>
          {showCatGif && (
            <motion.div
              key="cat-chef"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, ease: "easeIn" }}
            >
              <img src={catgif} style={{ width: "200px", height: "200px" }} alt="Chef cat" />
            </motion.div>
          )}

          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onShow={(r) => {
                setSelectedRecipe(r);
                setShowDetail(true);
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showDetail && (
          <RecipeDetailScreen
            recipe={selectedRecipe}
            onClose={() => setShowDetail(false)}
            user={user}
          />
        )}

        {showFavourites && (
          <FavouritesScreen
            onClose={() => setShowFavourites(false)}
            user={user}
          />
        )}

        {showNewRecipe && (
          <AddNewRecipe
            onClose={() => setShowNewRecipe(false)}
            user={user}
          />
        )}
        
      </AnimatePresence>
    </>
  );
}
