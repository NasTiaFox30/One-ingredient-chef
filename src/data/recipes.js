import food_img from "../assets/food/omlete_cheese.webp";

export const recipes = [
  {
    id: 1,
    title: "Omelette with cheese",
    description: "A delicious and easy-to-make omelette with cheese.",
    image: food_img,
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
    ]
  },
  {
    id: 2,
    title: "Cucumber and tomato salad",
    image: food_img,
    time: "5 min",
    difficulty: "Easy",
    ingredients: [
      { icon: "🥒", name: "Cucumbers", qty: "2 pcs" },
      { icon: "🍅", name: "Tomatoes", qty: "2 pcs" },
      { icon: "🧂", name: "Salt", qty: "a pinch" }
    ],
    steps: [
      "Chop the vegetables ",
      "Add salt and mix ",
      "Serve "
    ]
  }
];