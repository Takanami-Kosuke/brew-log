export const ROAST_LEVELS = ["light", "medium", "dark"] as const;
export type RoastLevel = (typeof ROAST_LEVELS)[number];

export const BREW_METHODS = ["handDrip", "frenchPress", "aeroPress"] as const;
export type BrewMethod = (typeof BREW_METHODS)[number];

export const GRIND_SIZES = ["fine", "mediumFine", "medium", "coarse"] as const;
export type GrindSize = (typeof GRIND_SIZES)[number];

export const ROAST_LEVEL_LABELS: Record<RoastLevel, string> = {
	light: "浅煎り",
	medium: "中煎り",
	dark: "深煎り",
};

export const BREW_METHOD_LABELS: Record<BrewMethod, string> = {
	handDrip: "ハンドドリップ",
	frenchPress: "フレンチプレス",
	aeroPress: "エアロプレス",
};

export const GRIND_SIZE_LABELS: Record<GrindSize, string> = {
	fine: "細挽き",
	mediumFine: "中細挽き",
	medium: "中挽き",
	coarse: "粗挽き",
};

export type TasteScore = 1 | 2 | 3 | 4 | 5;

export type Taste = {
	acidity: TasteScore; // 酸味
	bitterness: TasteScore; // 苦味
	sweetness: TasteScore; // 甘味
	body: TasteScore; // コク
	aftertaste: TasteScore; // 後味
};

export type Brew = {
	id: string;
	createdAt: string; // ISO 8601 形式の日時
	beanName: string;
	shop?: string;
	roastLevel: RoastLevel;
	method: BrewMethod;
	grindSize: GrindSize;
	beanWeight: number; // g
	waterAmount: number; // ml
	waterTemp: number; // ℃
	brewTime: number; // 秒
	taste: Taste;
	memo: string;
};

// フォームから受け取る形。id と createdAt は保存するときに自動で付ける
export type BrewInput = Omit<Brew, "id" | "createdAt">;
