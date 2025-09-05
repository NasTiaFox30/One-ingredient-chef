import { useState, useEffect } from "react";
import { db, storage } from "../firebase.config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Save images
  const uploadImage = async (file) => {
    if (!file) return null;

    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

export default function AddNewRecipe() {
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
        if (!title || !imageFile) {
            alert("Please enter title and select an image");
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

    return (
        <div className="container mt-4">
            <h2>Add New Recipe</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Recipe title" className="form-control mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="Description" className="form-control mb-2" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="text" placeholder="Time in min." className="form-control mb-2" value={time} onChange={(e) => setTime(e.target.value)} />
                <input type="text" placeholder="Difficulty - Easy, Medium, Hard" className="form-control mb-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />                
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
    );
}
