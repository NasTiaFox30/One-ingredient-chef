import { useState } from "react";
import { db, storage } from "../firebase.config";
import { collection, addDoc } from "firebase/firestore";
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
    const [time, ] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [steps, ] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !imageFile) {
            alert("Please enter title and select an image");
            return;
        }

        const imageUrl = await uploadImage(imageFile);

        await addDoc(collection(db, "recipes"), {
            title,
            description,
            image: imageUrl,
            time,
            difficulty,
            ingredients: [
            { icon: "🥚", name: "Eggs", qty: "2 pcs" },
            { icon: "🧀", name: "Cheese", qty: "50 g" },
            { icon: "🥛", name: "Milk", qty: "50 ml" }
            ],
            steps: [],
            createdAt: new Date().toISOString()
        });

        alert("Recipe added successfully!");
        setTitle("");
        setDescription("");
        setTime("");
        setDifficulty("");
        setSteps("");
        setImageFile(null);
    };

    return (
        <div className="container mt-4">
            <h2>Add New Recipe</h2>
            <form onSubmit={handleSubmit}>
                
                <input
                type="text"
                placeholder="Recipe title"
                className="form-control mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                    />
                
                <input
                type="text"
                placeholder="Description"
                className="form-control mb-2"
                value={description}
                onChange={(e) => setTitle(e.target.value)}
                    />
                
                <input
                type="text"
                placeholder="Time in min."
                className="form-control mb-2"
                value={time}
                onChange={(e) => setTitle(e.target.value)}
                    />

                <input
                type="text"
                placeholder="Difficulty - Easy, Medium, Hard"
                className="form-control mb-2"
                value={difficulty}
                onChange={(e) => setTitle(e.target.value)}
                    />
                
                <input
                type="text"
                placeholder="Step - 1"
                className="form-control mb-2"
                value={steps[0]}
                onChange={(e) => setTitle(e.target.value)}
                    />
                <input
                type="text"
                placeholder="Step - 2"
                className="form-control mb-2"
                value={steps[1]}
                onChange={(e) => setTitle(e.target.value)}
                    />
                <input
                type="text"
                placeholder="Step - 3"
                className="form-control mb-2"
                value={steps[2]}
                onChange={(e) => setTitle(e.target.value)}
                    />
                    
                <input
                type="file"
                className="form-control mb-2"
                onChange={(e) => setImageFile(e.target.files[0])}
                    />

                <button className="btn btn-primary">Add Recipe</button>
            </form>
        </div>
    );
}
