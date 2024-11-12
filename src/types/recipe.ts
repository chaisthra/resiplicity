export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  author?: string;
  image_url?: string;
  cuisine_type?: string;
  prep_time?: string;
  cooking_time?: string;
  servings?: string;
  difficulty?: string;
  dietary_tags?: string[];
  trust_score?: number;
  votes?: number;
  comments?: number;
  created_at?: string;
  plating_image?: string;
  nutrition?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  plating?: string;
  history?: string;
}