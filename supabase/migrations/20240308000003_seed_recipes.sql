-- Insert initial community recipes
INSERT INTO public.recipes (
  title,
  description,
  ingredients,
  instructions,
  author,
  cuisine_type,
  prep_time,
  cooking_time,
  servings,
  difficulty,
  dietary_tags,
  image_url,
  trust_score,
  votes,
  comments
) VALUES
(
  'Mediterranean Quinoa Bowl',
  'A vibrant, nutritious bowl packed with Mediterranean flavors and plant-based protein',
  ARRAY['1 cup quinoa', '2 cups cherry tomatoes', '1 cucumber', '1 red onion', '200g chickpeas', '100g feta cheese', 'Kalamata olives', 'Extra virgin olive oil', 'Fresh lemon juice', 'Fresh parsley', 'Fresh mint'],
  '1. Cook quinoa according to package instructions
2. Dice tomatoes, cucumber, and red onion
3. Drain and rinse chickpeas
4. Mix vegetables with cooked quinoa
5. Add crumbled feta and olives
6. Dress with olive oil and lemon juice
7. Garnish with fresh herbs',
  'Chef Alex',
  'Mediterranean',
  '20 minutes',
  '15 minutes',
  '4',
  'Easy',
  ARRAY['vegetarian', 'gluten-free'],
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=2940',
  50,
  0,
  0
),
(
  'Thai Basil Chicken',
  'A spicy, aromatic Thai street food classic that combines minced chicken with holy basil and chilis',
  ARRAY['500g minced chicken', '5 cloves garlic', '3-10 Thai bird''s eye chilies', '2 cups holy basil leaves', '2 tbsp oyster sauce', '1 tbsp fish sauce', '1 tbsp soy sauce', '1 tsp sugar', '2 tbsp vegetable oil', '2 fried eggs'],
  '1. Crush chilies and garlic in a mortar and pestle
2. Heat oil in a wok over high heat
3. Fry garlic and chilies until fragrant
4. Add chicken, stir-fry until cooked
5. Add sauces and sugar, mix well
6. Toss in holy basil leaves
7. Serve over jasmine rice with a fried egg',
  'Chef Sarah',
  'Thai',
  '15 minutes',
  '10 minutes',
  '2',
  'Medium',
  ARRAY[]::text[],
  'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?auto=format&fit=crop&q=80&w=2532',
  50,
  0,
  0
),
(
  'Moroccan Vegetable Tagine',
  'A fragrant, slow-cooked stew of vegetables and aromatic spices served with fluffy couscous',
  ARRAY['2 sweet potatoes', '4 carrots', '1 can chickpeas', '2 zucchini', '2 red bell peppers', '2 onions', '4 cloves garlic', '2 tbsp Moroccan spice blend', '4 cups vegetable broth', '1 cup dried apricots', 'Fresh cilantro', '2 cups couscous'],
  '1. Sauté onions and garlic
2. Add spices and toast
3. Layer vegetables in tagine
4. Add broth and apricots
5. Simmer for 1 hour
6. Prepare couscous
7. Garnish with cilantro
8. Serve hot with couscous',
  'Chef Amira',
  'Moroccan',
  '25 minutes',
  '1 hour',
  '6',
  'Medium',
  ARRAY['vegan', 'vegetarian'],
  'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&q=80&w=2940',
  50,
  0,
  0
),
(
  'Japanese Miso Ramen',
  'A warming bowl of ramen with rich miso broth, tender chashu pork, and perfectly chewy noodles',
  ARRAY['Fresh ramen noodles', 'Chashu pork', 'Miso paste', 'Dashi stock', 'Soy sauce', 'Corn kernels', 'Bamboo shoots', 'Green onions', 'Nori sheets', 'Soft-boiled egg'],
  '1. Prepare dashi stock
2. Mix miso paste with hot dashi
3. Cook ramen noodles until al dente
4. Slice chashu pork
5. Arrange noodles in bowl
6. Pour hot miso broth
7. Top with pork, corn, bamboo shoots
8. Garnish with green onions, egg, and nori',
  'Chef Kenji',
  'Japanese',
  '30 minutes',
  '20 minutes',
  '2',
  'Medium',
  ARRAY[]::text[],
  'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&q=80&w=2940',
  50,
  0,
  0
),
(
  'Korean Bibimbap',
  'A colorful rice bowl topped with seasoned vegetables, meat, and a spicy gochujang sauce',
  ARRAY['Steamed rice', 'Ground beef', 'Spinach', 'Bean sprouts', 'Carrots', 'Mushrooms', 'Zucchini', 'Gochujang sauce', 'Sesame oil', 'Soy sauce', 'Fried egg'],
  '1. Season and cook ground beef
2. Blanch spinach and bean sprouts
3. Sauté mushrooms and carrots
4. Season each vegetable separately
5. Arrange rice in bowl
6. Place vegetables and meat in sections
7. Top with fried egg
8. Serve with gochujang sauce',
  'Chef Min',
  'Korean',
  '40 minutes',
  '20 minutes',
  '2',
  'Medium',
  ARRAY[]::text[],
  'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&q=80&w=2940',
  50,
  0,
  0
);