"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  inputFormSchema,
  InputFormValues,
  FAVORITE_SUBJECTS,
  RECENT_EVENTS,
  CONCERN_THEMES,
  BIRTH_ORDERS,
} from "@/lib/input-schema";
import { encodeReadingInput, ReadingInput } from "@/lib/types";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 90 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function InputPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [postalLookup, setPostalLookup] = useState<{
    status: "idle" | "loading" | "error";
    message?: string;
  }>({ status: "idle" });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InputFormValues>({
    resolver: zodResolver(inputFormSchema),
    defaultValues: {
      privacyAgree: false as unknown as true,
      birthTimeUnknown: false,
      birthTime: "",
      olderSiblings: 0,
      youngerSiblings: 0,
      favoriteSubjects: [],
      recentEvents: [],
      concerns: [],
      newsletterOptIn: false,
    },
  });

  const birthTimeUnknown = watch("birthTimeUnknown");
  const concerns = watch("concerns") ?? [];

  const onSubmit = (values: InputFormValues) => {
    setSubmitError(null);
    const birthDate = `${values.birthYear}-${String(values.birthMonth).padStart(2, "0")}-${String(
      values.birthDay
    ).padStart(2, "0")}`;

    const input: ReadingInput = {
      name: values.name,
      gender: values.gender,
      birthDate,
      birthTimeUnknown: values.birthTimeUnknown,
      birthTime: values.birthTimeUnknown ? "12:00" : values.birthTime || "12:00",
      birthPlace: values.birthPlace,
      birthOrder: values.birthOrder,
      olderSiblings: values.olderSiblings,
      youngerSiblings: values.youngerSiblings,
      favoriteSubjects: values.favoriteSubjects,
      favoriteSubjectOther: values.favoriteSubjectOther,
      recentEvents: values.recentEvents,
      recentEventOther: values.recentEventOther,
      concerns: values.concerns,
      newsletterOptIn: values.newsletterOptIn,
      email: values.email,
    };

    const encoded = encodeReadingInput(input);
    router.push(`/reading/loading?d=${encoded}`);
  };

  return (
    <main className="px-6 py-12 max-w-xl mx-auto">
      <h1 className="font-serif text-2xl text-jade-dark mb-2">基本情報の入力</h1>
      <p className="text-sm text-gray-500 mb-8">
        入力は約90秒で完了します。必須項目はすべてご入力ください。
      </p>

      {/* 1. 注意事項ブロック */}
      <div className="mb-6 p-4 rounded-lg bg-jade/10 text-sm text-jade-dark">
        本サービスは占い鑑定であり、診断・医療・投資の助言ではありません。
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 2. プライバシーポリシー同意 */}
        <div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" {...register("privacyAgree")} />
            <span>
              <Link href="/legal/privacy" target="_blank" className="text-jade underline">
                プライバシーポリシー
              </Link>
              に同意します（生年月日等の情報は占い鑑定生成・メール送付の目的にのみ使用されます）
            </span>
          </label>
          {errors.privacyAgree && (
            <p className="text-red-500 text-xs mt-1">{errors.privacyAgree.message}</p>
          )}
        </div>

        {/* 3. 氏名 */}
        <Field label="氏名" error={errors.name?.message}>
          <input
            type="text"
            className="input"
            placeholder="山田 花子"
            {...register("name")}
          />
        </Field>

        {/* 4. 性別 */}
        <Field label="性別" error={errors.gender?.message}>
          <div className="flex gap-4">
            {(["女性", "男性", "回答しない"] as const).map((g) => (
              <label key={g} className="flex items-center gap-1 text-sm">
                <input type="radio" value={g} {...register("gender")} /> {g}
              </label>
            ))}
          </div>
        </Field>

        {/* 5. 生年月日 */}
        <Field
          label="生年月日"
          error={errors.birthYear?.message || errors.birthMonth?.message || errors.birthDay?.message}
        >
          <div className="flex gap-2">
            <select className="input" {...register("birthYear")} defaultValue="">
              <option value="" disabled>
                年
              </option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select className="input" {...register("birthMonth")} defaultValue="">
              <option value="" disabled>
                月
              </option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select className="input" {...register("birthDay")} defaultValue="">
              <option value="" disabled>
                日
              </option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </Field>

        {/* 6. 出生時間 */}
        <Field label="出生時間" error={errors.birthTime?.message}>
          <div className="flex items-center gap-3">
            <input
              type="time"
              className="input"
              disabled={birthTimeUnknown}
              {...register("birthTime")}
            />
            <label className="flex items-center gap-1 text-sm text-gray-500">
              <input
                type="checkbox"
                checked={birthTimeUnknown}
                onChange={(e) => {
                  setValue("birthTimeUnknown", e.target.checked);
                  if (e.target.checked) setValue("birthTime", "12:00");
                }}
              />
              不明（12:00として算出します）
            </label>
          </div>
        </Field>

        {/* 7. 出生地 */}
        <Field label="出生地" error={errors.birthPlace?.message}>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="input"
              placeholder="郵便番号（例: 100-0001）"
              {...register("postalCode")}
            />
            <button
              type="button"
              disabled={postalLookup.status === "loading"}
              className="px-3 py-2 text-sm rounded-md border border-jade text-jade whitespace-nowrap disabled:opacity-50"
              onClick={async () => {
                const raw = getValues("postalCode") ?? "";
                const digits = raw.replace(/[^0-9]/g, "");
                if (digits.length !== 7) {
                  setPostalLookup({ status: "error", message: "郵便番号は7桁で入力してください" });
                  return;
                }
                setPostalLookup({ status: "loading" });
                try {
                  const res = await fetch(
                    `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${digits}`
                  );
                  const data = await res.json();
                  if (data.status !== 200 || !data.results || data.results.length === 0) {
                    setPostalLookup({
                      status: "error",
                      message: data.message ?? "該当する住所が見つかりませんでした",
                    });
                    return;
                  }
                  const r = data.results[0];
                  setValue("birthPlace", `${r.address1}${r.address2}${r.address3}`);
                  setPostalLookup({ status: "idle" });
                } catch {
                  setPostalLookup({ status: "error", message: "住所検索に失敗しました。通信環境をご確認ください" });
                }
              }}
            >
              {postalLookup.status === "loading" ? "検索中…" : "住所を自動補完"}
            </button>
          </div>
          {postalLookup.status === "error" && (
            <p className="text-red-500 text-xs mb-2">{postalLookup.message}</p>
          )}
          <input
            type="text"
            className="input"
            placeholder="都道府県・市区町村"
            {...register("birthPlace")}
          />
        </Field>

        {/* 8. 出生順位 */}
        <Field label="出生順位" error={errors.birthOrder?.message}>
          <div className="grid grid-cols-2 gap-2">
            {BIRTH_ORDERS.map((o) => (
              <label key={o} className="flex items-center gap-1 text-sm">
                <input type="radio" value={o} {...register("birthOrder")} /> {o}
              </label>
            ))}
          </div>
        </Field>

        {/* 9-10. 兄姉・弟妹の人数 */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="兄姉の人数" error={errors.olderSiblings?.message}>
            <input type="number" min={0} max={5} className="input" {...register("olderSiblings")} />
          </Field>
          <Field label="弟妹の人数" error={errors.youngerSiblings?.message}>
            <input type="number" min={0} max={5} className="input" {...register("youngerSiblings")} />
          </Field>
        </div>

        {/* 11. 好きだった教科 */}
        <Field label="小学生時代の好きだった教科">
          <div className="flex flex-wrap gap-3 mb-2">
            {FAVORITE_SUBJECTS.map((subject) => (
              <label key={subject} className="flex items-center gap-1 text-sm">
                <input type="checkbox" value={subject} {...register("favoriteSubjects")} />
                {subject}
              </label>
            ))}
          </div>
          <input
            type="text"
            className="input"
            placeholder="その他（自由入力）"
            {...register("favoriteSubjectOther")}
          />
        </Field>

        {/* 12. 過去5年以内のライフイベント */}
        <Field label="過去5年以内のライフイベント">
          <div className="flex flex-wrap gap-3 mb-2">
            {RECENT_EVENTS.map((event) => (
              <label key={event} className="flex items-center gap-1 text-sm">
                <input type="checkbox" value={event} {...register("recentEvents")} />
                {event}
              </label>
            ))}
          </div>
          <input
            type="text"
            className="input"
            placeholder="その他（自由入力）"
            {...register("recentEventOther")}
          />
        </Field>

        {/* 13. 今心配しているテーマ */}
        <Field label="今心配しているテーマ（最大3つ）" error={errors.concerns?.message as string}>
          <div className="flex flex-wrap gap-3">
            {CONCERN_THEMES.map((theme) => {
              const checked = concerns.includes(theme);
              const disabled = !checked && concerns.length >= 3;
              return (
                <label
                  key={theme}
                  className={`flex items-center gap-1 text-sm ${disabled ? "opacity-40" : ""}`}
                >
                  <input
                    type="checkbox"
                    value={theme}
                    disabled={disabled}
                    checked={checked}
                    onChange={(e) => {
                      if (e.target.checked) setValue("concerns", [...concerns, theme]);
                      else
                        setValue(
                          "concerns",
                          concerns.filter((c) => c !== theme)
                        );
                    }}
                  />
                  {theme}
                </label>
              );
            })}
          </div>
        </Field>

        {/* 14. メールマガジン同意 */}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("newsletterOptIn")} />
          メールマガジン配信に同意する（任意・月1回程度）
        </label>

        {/* 15. メアド */}
        <Field label="メールアドレス" error={errors.email?.message}>
          <input type="email" className="input" placeholder="you@example.com" {...register("email")} />
        </Field>

        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-jade text-white text-lg font-medium hover:bg-jade-dark transition-colors disabled:opacity-50"
        >
          過去鑑定へ進む
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
