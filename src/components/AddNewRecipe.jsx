import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, storage } from "../firebase.config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button, Alert } from "react-bootstrap";

// Save images
  const uploadImage = async (file) => {
    if (!file) return null;

    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

export default function AddNewRecipe({ onClose }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [steps, setSteps] = useState([""]);
    const [imageFile, setImageFile] = useState(null);

    const [recipeIngredients, setRecipeIngredients] = useState([{ name: "", qty: "" }]);
    const [ingredients, setingredients] = useState([]);

    // Fetch ingredients from Firestore 
    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        const querySnapshot = await getDocs(collection(db, "ingredients"));
        const data = querySnapshot.docs.map(doc => doc.data());
        setingredients(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description || !time || !difficulty || !imageFile) {
            setShowAlert("warning");
            return;
        }
        const hasValidIngredient = recipeIngredients.some(ing => ing.name.trim() !== "" && ing.qty.trim() !== "");
        if (!hasValidIngredient) {
            setShowAlert("warning");
            return;
        }
        const hasValidStep = steps.some(step => step.trim() !== "");
        if (!hasValidStep) {
            setShowAlert("warning");
            return;
        }

        const imageUrl = await uploadImage(imageFile);

        const finalIngredients = recipeIngredients
            .filter(ing => ing.name && ing.qty)
            .map(ing => {
                const foundIngredient = ingredients.find(item => item.name === ing.name);
                return {
                    name: ing.name,
                    qty: ing.qty,
                    icon: foundIngredient ? foundIngredient.icon : "NaN"
                };
            });

        await addDoc(collection(db, "recipes"), {
            title,
            description,
            image: imageUrl,
            time,
            difficulty,
            ingredients: finalIngredients,
            steps: steps,
            createdAt: new Date().toISOString()
        });

        alert("Recipe added successfully!");
        setTitle("");
        setDescription("");
        setTime("");
        setDifficulty("");
        setRecipeIngredients([{ name: "", qty: "" }]);
        setSteps([""]);
        setImageFile(null);
    };

    // Steps
    const addStep = () => {
        setSteps([...steps, ""]);
    };
    const removeLastStep = () => {
        if (steps.length > 1) {
            setSteps(steps.slice(0, -1));
        }
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    // Ingredients
    const addIngredient = () => {
        setRecipeIngredients([...recipeIngredients, { name: "", qty: "" }]);
    }
    const removeLastIngredient = () => {
        if (recipeIngredients.length > 1) {
            setRecipeIngredients(recipeIngredients.slice(0, -1));
        }
    };
    
    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...recipeIngredients];
        newIngredients[index][field] = value;
        setRecipeIngredients(newIngredients);
    };

    return (
        <motion.div
            className="recipe-detail-overlay"
            initial={{ opacity: 0, y: 90 }}     
            animate={{ opacity: 1, y: 0 }}      
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }} 
        >
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Add New Recipe🗒️</h2>
                    <Button variant="outline-secondary" onClick={onClose}>✖</Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Recipe title" className="form-control mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input type="text" placeholder="Description" className="form-control mb-2" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type="text" placeholder="Time in min." className="form-control mb-2" value={time} onChange={(e) => setTime(e.target.value)} />
                    <input type="text" placeholder="Difficulty - Easy, Medium, Hard" className="form-control mb-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />                
                    
                    <div className="mb-2">
                        <p><strong>Ingredients:</strong></p>
                        {recipeIngredients.map((ing, index) => (
                            <div key={index} className="d-flex gap-2 mb-2">
                                <select
                                    className="form-select"
                                    value={ing.name}
                                    onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                >
                                    <option value="">Select ingredient...</option>
                                    {ingredients.map((item, i) => (
                                        <option key={i} value={item.name}>{item.name} {item.icon}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Quantity (e.g., 200 g)"
                                    className="form-control"
                                    value={ing.qty}
                                    onChange={(e) => handleIngredientChange(index, "qty", e.target.value)}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addIngredient} className="btn btn-secondary me-2">Add Ingredient +</button>
                        <button type="button" onClick={removeLastIngredient} className="btn btn-danger">Remove last x</button>
                    </div>

                    <div className="mb-2">
                        <p><strong>Steps of cooking:</strong></p>
                        {steps.map((step, index) => (
                            <input
                                key={index}
                                type="text"
                                placeholder={`Step - ${index + 1}`}
                                className="form-control mb-2"
                                value={step}
                                onChange={(e) => handleStepChange(index, e.target.value)}
                            />
                        ))}
                        <button type="button" onClick={addStep} className="btn btn-secondary me-2">Add Step +</button>
                        <button type="button" onClick={removeLastStep} className="btn btn-danger">Remove last x</button>
                    </div>
                    
                    <input type="file" className="form-control mb-2" onChange={(e) => setImageFile(e.target.files[0])} />

                    <button type="submit" className="btn btn-primary">Add Recipe</button>
                </form>
            </div>
        </motion.div>
    );
}
