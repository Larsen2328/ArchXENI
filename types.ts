export interface RoomConfig {
  bedrooms: number;
  bathrooms: number;
  office: boolean;
  laundry: boolean;
  separateWc: boolean;
  openKitchen: boolean;
  garage: boolean;
  style: 'modern' | 'traditional' | 'minimalist' | 'farmhouse';
  totalArea?: number; // Optional target area in m2
}

export interface PlanAnalysis {
  description: string;
  surfaceSuggestions: Array<{
    room: string;
    area: string;
    tips: string;
  }>;
  estimatedTotalArea: string;
  constructionTips: string[];
}

export interface GeneratedPlan {
  imageUrl: string;
  analysis: PlanAnalysis;
}
