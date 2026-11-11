import { z } from "zod";
import { formatBrewTime } from "./format";
import { BREW_METHODS, GRIND_SIZES, ROAST_LEVELS, TASTE_SCORES } from "../types/brew";
import type { Brew, BrewInput } from "../types/brew";

// 全角の数字やコロン（「１５」「２：３０」）を半角にそろえる
function toHalfWidth(value: string) {
	return value.trim().normalize("NFKC");
}

// 数値の入力欄。入力中は文字列のまま扱い、チェックが通ったら数値に変換する
function numberField(label: string, min: number, max: number) {
	const rangeMessage = `${label}は${min}〜${max}の範囲で入力してください`;

	return z
		.string()
		.transform(toHalfWidth)
		.pipe(
			z
				.string()
				.min(1, `${label}を入力してください`)
				.regex(/^\d+(\.\d+)?$/, `${label}は数字で入力してください`),
		)
		.transform(Number)
		.pipe(z.number().min(min, rangeMessage).max(max, rangeMessage));
}

// 「2:30」→ 150（秒）
const brewTimeField = z
	.string()
	.transform(toHalfWidth)
	.pipe(
		z
			.string()
			.min(1, "抽出時間を入力してください")
			.regex(/^\d{1,2}:[0-5]\d$/, "抽出時間は「2:30」の形で入力してください"),
	)
	.transform((value) => {
		const [minutes, seconds] = value.split(":").map(Number);
		return minutes * 60 + seconds;
	})
	.pipe(z.number().min(1, "抽出時間は0:01以上で入力してください"));

const tasteScore = z.literal(TASTE_SCORES);

export const brewSchema = z.object({
	beanName: z.string().trim().min(1, "豆の名前を入力してください").max(50, "豆の名前は50文字以内で入力してください"),
	// 空欄なら undefined にして、「購入店なし」として保存する
	shop: z
		.string()
		.trim()
		.max(50, "購入店は50文字以内で入力してください")
		.transform((value) => (value === "" ? undefined : value)),
	roastLevel: z.enum(ROAST_LEVELS),
	method: z.enum(BREW_METHODS),
	grindSize: z.enum(GRIND_SIZES),
	beanWeight: numberField("豆の量", 1, 100),
	waterAmount: numberField("湯量", 10, 2000),
	waterTemp: numberField("湯温", 50, 100),
	brewTime: brewTimeField,
	taste: z.object({
		acidity: tasteScore,
		bitterness: tasteScore,
		sweetness: tasteScore,
		body: tasteScore,
		aftertaste: tasteScore,
	}),
	memo: z.string().trim().max(1000, "メモは1000文字以内で入力してください"),
});

// 入力欄に入っている値の形（数値の欄も文字列）
export type BrewFormValues = z.input<typeof brewSchema>;

// チェックと変換が済んだあとの値の形。保存する BrewInput と同じになることを型で確かめる
export type BrewFormOutput = z.output<typeof brewSchema>;
const _outputMatchesBrewInput = (value: BrewFormOutput): BrewInput => value;
void _outputMatchesBrewInput;

export const emptyBrewFormValues: BrewFormValues = {
	beanName: "",
	shop: "",
	roastLevel: "medium",
	method: "handDrip",
	grindSize: "medium",
	beanWeight: "",
	waterAmount: "",
	waterTemp: "",
	brewTime: "",
	taste: { acidity: 3, bitterness: 3, sweetness: 3, body: 3, aftertaste: 3 },
	memo: "",
};

// 保存済みの記録を、編集フォームの初期値に変換する
export function toBrewFormValues(brew: Brew): BrewFormValues {
	return {
		beanName: brew.beanName,
		shop: brew.shop ?? "",
		roastLevel: brew.roastLevel,
		method: brew.method,
		grindSize: brew.grindSize,
		beanWeight: String(brew.beanWeight),
		waterAmount: String(brew.waterAmount),
		waterTemp: String(brew.waterTemp),
		brewTime: formatBrewTime(brew.brewTime),
		taste: { ...brew.taste },
		memo: brew.memo,
	};
}

// タイマーから渡された URL（?method=handDrip&brewTime=150 など）を、新規フォームの初期値にする。
// 知らない値や数字でない値は無視して、空のフォームの値を使う
export function brewFormValuesFromSearchParams(params: URLSearchParams): BrewFormValues {
	const values: BrewFormValues = { ...emptyBrewFormValues, taste: { ...emptyBrewFormValues.taste } };

	const method = BREW_METHODS.find((value) => value === params.get("method"));
	if (method) values.method = method;

	const isNumber = (value: string | null): value is string => value !== null && /^\d+(\.\d+)?$/.test(value);
	const beanWeight = params.get("beanWeight");
	const waterAmount = params.get("waterAmount");
	const waterTemp = params.get("waterTemp");
	const brewTime = params.get("brewTime");
	if (isNumber(beanWeight)) values.beanWeight = beanWeight;
	if (isNumber(waterAmount)) values.waterAmount = waterAmount;
	if (isNumber(waterTemp)) values.waterTemp = waterTemp;
	if (isNumber(brewTime)) values.brewTime = formatBrewTime(Math.floor(Number(brewTime)));

	return values;
}
