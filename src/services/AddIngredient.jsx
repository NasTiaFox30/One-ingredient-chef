import { db } from "../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "react-bootstrap";

export default function AddRecipe() {
  // Add New Ingredient:

  const addIngredient = async () => {
    try {
      await addDoc(collection(db, "ingredients"), {
        name: "Mushrooms",
        icon: "🍄"
      });
      fetchRecipes();
    } catch (error) {
      console.error("Error adding:", error);
    }
  };

    return (
        <div className="container text-center my-4">
            <Button variant="secondary" onClick={addIngredient}>
                ➕ Add Sample Ingredient
            </Button>
        </div>
    );
}

