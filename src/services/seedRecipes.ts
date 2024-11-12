import { supabase } from './supabase';

const communityRecipes = [
  {
    title: "Thai Basil Chicken (Pad Kra Pao)",
    description: "A spicy, aromatic Thai street food classic that combines minced chicken with holy basil and chilis",
    ingredients: [
      "500g minced chicken",
      "5 cloves garlic",
      "3-10 Thai bird's eye chilies",
      "2 cups holy basil leaves",
      "2 tbsp oyster sauce",
      "1 tbsp fish sauce",
      "1 tbsp soy sauce",
      "1 tsp sugar",
      "2 tbsp vegetable oil",
      "2 fried eggs for serving"
    ],
    instructions: "1. Crush chilies and garlic in a mortar and pestle\n2. Heat oil in a wok over high heat\n3. Fry garlic and chilies until fragrant\n4. Add chicken, stir-fry until cooked\n5. Add sauces and sugar, mix well\n6. Toss in holy basil leaves\n7. Serve over jasmine rice with a fried egg",
    author: "Chef Sarah",
    cuisine_type: "Thai",
    prep_time: "15 minutes",
    cooking_time: "10 minutes",
    servings: "2",
    difficulty: "Medium",
    dietary_tags: [],
    image_url: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?auto=format&fit=crop&q=80&w=2532",
    trust_score: 50,
    votes: 0,
    comments: 0
  },
  {
    title: "Mediterranean Quinoa Bowl",
    description: "A vibrant, nutritious bowl packed with Mediterranean flavors and plant-based protein",
    ingredients: [
      "1 cup quinoa",
      "2 cups cherry tomatoes",
      "1 cucumber",
      "1 red onion",
      "200g chickpeas",
      "100g feta cheese",
      "Kalamata olives",
      "Extra virgin olive oil",
      "Fresh lemon juice",
      "Fresh parsley",
      "Fresh mint"
    ],
    instructions: "1. Cook quinoa according to package instructions\n2. Dice tomatoes, cucumber, and red onion\n3. Drain and rinse chickpeas\n4. Mix vegetables with cooked quinoa\n5. Add crumbled feta and olives\n6. Dress with olive oil and lemon juice\n7. Garnish with fresh herbs",
    author: "Chef Alex",
    cuisine_type: "Mediterranean",
    prep_time: "20 minutes",
    cooking_time: "15 minutes",
    servings: "4",
    difficulty: "Easy",
    dietary_tags: ["vegetarian", "gluten-free"],
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=2940",
    trust_score: 50,
    votes: 0,
    comments: 0
  },
  {
    title: "Japanese Miso Ramen",
    description: "A warming bowl of ramen with rich miso broth, tender chashu pork, and perfectly chewy noodles",
    ingredients: [
      "Fresh ramen noodles",
      "Chashu pork",
      "Miso paste",
      "Dashi stock",
      "Soy sauce",
      "Corn kernels",
      "Bamboo shoots",
      "Green onions",
      "Nori sheets",
      "Soft-boiled egg"
    ],
    instructions: "1. Prepare dashi stock\n2. Mix miso paste with hot dashi\n3. Cook ramen noodles until al dente\n4. Slice chashu pork\n5. Arrange noodles in bowl\n6. Pour hot miso broth\n7. Top with pork, corn, bamboo shoots\n8. Garnish with green onions, egg, and nori",
    author: "Chef Kenji",
    cuisine_type: "Japanese",
    prep_time: "30 minutes",
    cooking_time: "20 minutes",
    servings: "2",
    difficulty: "Medium",
    dietary_tags: [],
    image_url: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&q=80&w=2940",
    trust_score: 50,
    votes: 0,
    comments: 0
  },
  {
    title: "Moroccan Vegetable Tagine",
    description: "A fragrant, slow-cooked stew of vegetables and aromatic spices served with fluffy couscous",
    ingredients: [
      "Sweet potatoes",
      "Carrots",
      "Chickpeas",
      "Zucchini",
      "Red bell peppers",
      "Onions",
      "Garlic",
      "Moroccan spice blend",
      "Vegetable broth",
      "Dried apricots",
      "Fresh cilantro",
      "Couscous"
    ],
    instructions: "1. Sauté onions and garlic\n2. Add spices and toast\n3. Layer vegetables in tagine\n4. Add broth and apricots\n5. Simmer for 1 hour\n6. Prepare couscous\n7. Garnish with cilantro\n8. Serve hot with couscous",
    author: "Chef Amira",
    cuisine_type: "Moroccan",
    prep_time: "25 minutes",
    cooking_time: "1 hour",
    servings: "6",
    difficulty: "Medium",
    dietary_tags: ["vegan", "vegetarian"],
    image_url: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&q=80&w=2940",
    trust_score: 50,
    votes: 0,
    comments: 0
  },
  {
    title: "Korean Bibimbap",
    description: "A colorful rice bowl topped with seasoned vegetables, meat, and a spicy gochujang sauce",
    ingredients: [
      "Steamed rice",
      "Ground beef",
      "Spinach",
      "Bean sprouts",
      "Carrots",
      "Mushrooms",
      "Zucchini",
      "Gochujang sauce",
      "Sesame oil",
      "Soy sauce",
      "Fried egg"
    ],
    instructions: "1. Season and cook ground beef\n2. Blanch spinach and bean sprouts\n3. Sauté mushrooms and carrots\n4. Season each vegetable separately\n5. Arrange rice in bowl\n6. Place vegetables and meat in sections\n7. Top with fried egg\n8. Serve with gochujang sauce",
    author: "Chef Min",
    cuisine_type: "Korean",
    prep_time: "40 minutes",
    cooking_time: "20 minutes",
    servings: "2",
    difficulty: "Medium",
    dietary_tags: [],
    image_url: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&q=80&w=2940",
    trust_score: 50,
    votes: 0,
    comments: 0
  }
];

export const seedCommunityRecipes = async () => {
  try {
    const { data: existingRecipes, error: checkError } = await supabase
      .from('recipes')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing recipes:', checkError);
      return;
    }

    if (!existingRecipes?.length) {
      const { error: insertError } = await supabase
        .from('recipes')
        .insert(communityRecipes);

      if (insertError) {
        console.error('Error inserting recipes:', insertError);
        return;
      }

      console.log('Community recipes seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding community recipes:', error);
  }
};