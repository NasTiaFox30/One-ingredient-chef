import { db } from "../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "react-bootstrap";

export default function AddRecipe() {
    // Add New Recipe:
  const addRecipe = async () => {
    try {
      await addDoc(collection(db, "recipes"), {
        title: "Omelette with cheese",
        description: "A delicious and easy-to-make omelette with cheese.",
        image: "https://www.allrecipes.com/thmb/x3RzCwaJ-omelette.jpg",
        time: "10 min", 
        difficulty: "Easy",
        ingredients: [
          { icon: "🥚", name: "Eggs", qty: "2 pcs" },
          { icon: "🧀", name: "Cheese", qty: "50 g" },
          { icon: "🥛", name: "Milk", qty: "50 ml" }
        ],
        steps: [
          "Whisk eggs in a bowl; add milk and season with salt and white pepper. Whisk until egg mixture is foamy, 2 to 3 minutes.",
          "Melt butter in a small, nonstick skillet over medium-low heat. Pour in egg mixture and swirl the skillet, so the bottom is evenly covered with egg. Cook until egg starts to set, about 1 minute. Lift edges with a spatula and tilt the skillet so uncooked egg can flow towards the bottom of the skillet to set. Repeat until no visible liquid egg remains.",
          "Carefully flip omelette; cook until warmed through, 30 seconds to 1 minute. Sprinkle Emmentaler cheese down the middle of omelette; fold in half. Cook until cheese is melted, about 20 seconds. Slide omelette onto a plate."
        ],
        createdAt: new Date().toISOString()
      });
      fetchRecipes();
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

    return (
        <div className="container text-center my-4">
            <Button variant="secondary" onClick={addRecipe}>
                ➕ Add Sample Recipe
            </Button>
        </div>
    );
}

