import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { brewSchema } from "../../lib/brewSchema";
import type { BrewFormOutput, BrewFormValues } from "../../lib/brewSchema";
import {
	BREW_METHOD_LABELS,
	BREW_METHODS,
	GRIND_SIZE_LABELS,
	GRIND_SIZES,
	ROAST_LEVEL_LABELS,
	ROAST_LEVELS,
	TASTE_ITEMS,
} from "../../types/brew";
import { Button } from "../Button/Button";
import { ChipRadioGroup } from "../ChipRadioGroup/ChipRadioGroup";
import { Section } from "../Section/Section";
import { TasteRating } from "../TasteRating/TasteRating";
import { TextArea } from "../TextArea/TextArea";
import { TextField } from "../TextField/TextField";
import styles from "./BrewForm.module.css";

// ["light", ...] と { light: "浅煎り", ... } から、選択肢の配列を作る
function toOptions<T extends string>(values: readonly T[], labels: Record<T, string>) {
	return values.map((value) => ({ value, label: labels[value] }));
}

const roastOptions = toOptions(ROAST_LEVELS, ROAST_LEVEL_LABELS);
const methodOptions = toOptions(BREW_METHODS, BREW_METHOD_LABELS);
const grindOptions = toOptions(GRIND_SIZES, GRIND_SIZE_LABELS);

type BrewFormProps = {
	defaultValues: BrewFormValues;
	submitLabel: string;
	onSubmit: (input: BrewFormOutput) => void;
};

// 新規作成と編集で共通のフォーム。保存後の動きはページ側が onSubmit で決める
export function BrewForm({ defaultValues, submitLabel, onSubmit }: BrewFormProps) {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(brewSchema),
		defaultValues,
	});

	return (
		<form className={styles.root} onSubmit={handleSubmit(onSubmit)} noValidate>
			<Section title="豆の情報">
				<TextField label="豆の名前" autoComplete="off" error={errors.beanName?.message} {...register("beanName")} />
				<TextField label="購入店（任意）" autoComplete="off" error={errors.shop?.message} {...register("shop")} />
				<Controller
					control={control}
					name="roastLevel"
					render={({ field }) => (
						<ChipRadioGroup legend="焙煎度" options={roastOptions} value={field.value} onChange={field.onChange} />
					)}
				/>
			</Section>

			<Section title="抽出条件">
				<Controller
					control={control}
					name="method"
					render={({ field }) => (
						<ChipRadioGroup legend="抽出方法" options={methodOptions} value={field.value} onChange={field.onChange} />
					)}
				/>
				<Controller
					control={control}
					name="grindSize"
					render={({ field }) => (
						<ChipRadioGroup legend="挽き目" options={grindOptions} value={field.value} onChange={field.onChange} />
					)}
				/>
				<div className={styles.row}>
					<TextField label="豆の量" unit="g" inputMode="decimal" error={errors.beanWeight?.message} {...register("beanWeight")} />
					<TextField label="湯量" unit="ml" inputMode="decimal" error={errors.waterAmount?.message} {...register("waterAmount")} />
				</div>
				<div className={styles.row}>
					<TextField label="湯温" unit="℃" inputMode="decimal" error={errors.waterTemp?.message} {...register("waterTemp")} />
					<TextField label="抽出時間" unit="分:秒" placeholder="2:30" error={errors.brewTime?.message} {...register("brewTime")} />
				</div>
			</Section>

			<Section title="味の評価">
				{TASTE_ITEMS.map((item) => (
					<Controller
						key={item.key}
						control={control}
						name={`taste.${item.key}`}
						render={({ field }) => <TasteRating label={item.label} value={field.value} onChange={field.onChange} />}
					/>
				))}
			</Section>

			<Section title="メモ">
				<TextArea label="感想・次回への改善" error={errors.memo?.message} {...register("memo")} />
			</Section>

			<div className={styles.footer}>
				<Button type="submit" className={styles.submit}>
					{submitLabel}
				</Button>
			</div>
		</form>
	);
}
