// QuestionCard.tsx
import { useState } from "react";

type Option = { id: string; label: string; };
type Props = {
    question: string;
    options: Option[];
    answerHtml?: string; // optional rich text for the explanation
};

export default function QuestionCard({ question, options, answerHtml }: Props) {
    const [selected, setSelected] = useState<string>("");

    return (
        <section className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white/70 shadow-sm backdrop-blur p-5 sm:p-6">
            {/* Question */}
            <header className="mb-4">
                <h2 className="text-base font-semibold text-neutral-900">
                    {question}
                </h2>
            </header>

            {/* Options */}
            <fieldset className="space-y-2" aria-label="Options">
                <legend className="sr-only">Choose one option</legend>
                {options.map((opt) => {
                    const active = selected === opt.id;
                    return (
                        <label
                            key={opt.id}
                            className={[
                                "flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition",
                                "border-neutral-200 bg-white hover:bg-neutral-50",
                                active ? "ring-2 ring-neutral-800" : "ring-0",
                            ].join(" ")}
                        >
                            <input
                                type="radio"
                                name="option"
                                value={opt.id}
                                checked={active}
                                onChange={() => setSelected(opt.id)}
                                className="mt-0.5 h-4 w-4 rounded-full border-neutral-400 text-neutral-900 focus:ring-neutral-800"
                                aria-describedby={`opt-${opt.id}`}
                            />
                            <span id={`opt-${opt.id}`} className="text-sm text-neutral-800">
                                {opt.label}
                            </span>
                        </label>
                    );
                })}
            </fieldset>

            {/* Answer / Explanation */}
            <div className="mt-5 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 p-4">
                <h3 className="text-sm font-medium text-neutral-800">Answer & Explanation</h3>
                {answerHtml ? (
                    <div
                        className="prose prose-neutral max-w-none text-sm leading-relaxed [&_p]:my-2"
                        dangerouslySetInnerHTML={{ __html: answerHtml }}
                    />
                ) : (
                    <p className="mt-1 text-sm text-neutral-600">
                        Select an option above to review the explanation.
                    </p>
                )}
            </div>
        </section>
    );
}
