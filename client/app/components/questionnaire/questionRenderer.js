export default function QuestionRenderer({
  currentQuestion,
  answers,
  subAnswers,
  extraInputs,
  onSingleSelect,
  onMultiSelect,
  onSubAnswer,
  onInputChange,
  onExtraInput,
  onFileUpload,
}) {
  if (!currentQuestion) return null;

  const selectedSingleOption =
    currentQuestion?.type === "single-select"
      ? currentQuestion.options?.find(
          (opt) => opt.value === answers[currentQuestion.key]
        )
      : null;

  const renderSubQuestion = (subQuestion) => {
    if (!subQuestion) return null;

    return (
      <div className="relative mt-4 rounded-2xl border border-[#AFAFAF]/15 bg-[#FAFAFB] p-4">
        <h4 className="text-[15px] md:text-base text-[#3E1747] font-medium mb-3">
          {subQuestion.question}
        </h4>

        {subQuestion.type === "single-select" && (
          <div className="space-y-2.5">
            {subQuestion.options.map((option) => {
              const active = subAnswers[subQuestion.key] === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSubAnswer(subQuestion.key, option.value)}
                  className={`question-option w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-300 ${
                    active
                      ? "border-[#4EDDE2] bg-[#4EDDE2]/8"
                      : "border-[#AFAFAF]/15 bg-white hover:border-[#4EDDE2]/35"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        {subQuestion.type === "multi-select" && (
          <div className="space-y-2.5">
            {subQuestion.options.map((option) => {
              const active = (subAnswers[subQuestion.key] || []).includes(
                option.value
              );

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onSubAnswer(subQuestion.key, option.value, "multi-select")
                  }
                  className={`question-option w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-300 ${
                    active
                      ? "border-[#4EDDE2] bg-[#4EDDE2]/8"
                      : "border-[#AFAFAF]/15 bg-white hover:border-[#4EDDE2]/35"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  switch (currentQuestion.type) {
    case "group":
      return (
        <div className="question-shell">
          <h3 className="text-[24px] md:text-[28px] leading-tight text-[#111111] text-center font-semibold mb-2">
            {currentQuestion.question}
          </h3>

          <p className="text-center text-[#3E1747]/55 text-sm mb-7">
            A few details to personalize your score
          </p>

          <div
            className={`grid gap-3 ${
              currentQuestion.fields.length === 3
                ? "md:grid-cols-3"
                : "md:grid-cols-2"
            }`}
          >
            {currentQuestion.fields.map((field) => (
              <div
                key={field.key}
                className="rounded-2xl border border-[#AFAFAF]/15 bg-[#FAFAFB] p-4"
              >
                <label className="block text-xs uppercase tracking-[0.12em] text-[#3E1747]/50 mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={answers[field.key] || ""}
                  onChange={(e) => onInputChange(field.key, e.target.value)}
                  className="w-full bg-transparent text-[#111111] text-lg outline-none placeholder:text-[#3E1747]/25"
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "single-select":
      return (
        <div className="question-shell">
          <h3 className="text-[24px] md:text-[28px] leading-tight text-[#111111] text-center font-semibold mb-7">
            {currentQuestion.question}
          </h3>

          <div className="space-y-2.5">
            {currentQuestion.options.map((option) => {
              const active = answers[currentQuestion.key] === option.value;

              return (
                <div key={option.value}>
                  <button
                    type="button"
                    onClick={() =>
                      onSingleSelect(currentQuestion.key, option.value)
                    }
                    className={`question-option group w-full text-left rounded-2xl border px-4 md:px-5 py-4 transition-all duration-300 ${
                      active
                        ? "border-[#4EDDE2] bg-[#4EDDE2]/8 shadow-[0_10px_30px_rgba(78,221,226,0.08)]"
                        : "border-[#AFAFAF]/15 bg-white hover:border-[#4EDDE2]/35 hover:bg-[#FAFAFB]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[15px] md:text-base text-[#111111]">
                        {option.label}
                      </span>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                          active
                            ? "border-[#4EDDE2]"
                            : "border-[#AFAFAF]/30 group-hover:border-[#4EDDE2]/40"
                        }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full transition ${
                            active ? "bg-[#4EDDE2]" : "bg-transparent"
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {active && option.hasInput && (
                    <div className="mt-3 rounded-2xl border border-[#AFAFAF]/15 bg-[#FAFAFB] px-4 py-4">
                      <label className="block text-xs uppercase tracking-[0.12em] text-[#3E1747]/50 mb-2">
                        Enter target in KG
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        value={extraInputs[`${currentQuestion.key}_kg`] || ""}
                        onChange={(e) =>
                          onExtraInput(
                            `${currentQuestion.key}_kg`,
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent text-[#111111] text-lg outline-none placeholder:text-[#3E1747]/25"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedSingleOption?.subQuestion &&
            renderSubQuestion(selectedSingleOption.subQuestion)}
        </div>
      );

    case "multi-select":
      return (
        <div className="question-shell">
          <h3 className="text-[24px] md:text-[28px] leading-tight text-[#111111] text-center font-semibold mb-2">
            {currentQuestion.question}
          </h3>

          <p className="text-center text-[#3E1747]/55 text-sm mb-7">
            Select all that apply
          </p>

          <div className="space-y-2.5">
            {currentQuestion.options.map((option) => {
              const active = (answers[currentQuestion.key] || []).includes(
                option.value
              );

              return (
                <div key={option.value}>
                  <button
                    type="button"
                    onClick={() =>
                      onMultiSelect(currentQuestion.key, option.value)
                    }
                    className={`question-option group w-full text-left rounded-2xl border px-4 md:px-5 py-4 transition-all duration-300 ${
                      active
                        ? "border-[#4EDDE2] bg-[#4EDDE2]/8 shadow-[0_10px_30px_rgba(78,221,226,0.08)]"
                        : "border-[#AFAFAF]/15 bg-white hover:border-[#4EDDE2]/35 hover:bg-[#FAFAFB]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[15px] md:text-base text-[#111111]">
                        {option.label}
                      </span>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          active
                            ? "border-[#4EDDE2]"
                            : "border-[#AFAFAF]/30 group-hover:border-[#4EDDE2]/40"
                        }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-sm transition ${
                            active ? "bg-[#4EDDE2]" : "bg-transparent"
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {active &&
                    option.subQuestion &&
                    renderSubQuestion(option.subQuestion)}
                </div>
              );
            })}
          </div>
        </div>
      );

    case "textarea":
      return (
        <div className="question-shell">
          <h3 className="text-[24px] md:text-[28px] leading-tight text-[#111111] text-center font-semibold mb-7">
            {currentQuestion.question}
          </h3>

          <div className="rounded-3xl border border-[#AFAFAF]/15 bg-[#FAFAFB] p-4">
            <textarea
              rows={7}
              placeholder={currentQuestion.placeholder}
              value={answers[currentQuestion.key] || ""}
              onChange={(e) =>
                onInputChange(currentQuestion.key, e.target.value)
              }
              className="w-full bg-transparent resize-none outline-none text-[#111111] leading-8 placeholder:text-[#3E1747]/25"
            />
          </div>
        </div>
      );

    case "file-upload":
      return (
        <div className="question-shell">
          <h3 className="text-[24px] md:text-[28px] leading-tight text-[#111111] text-center font-semibold mb-7">
            {currentQuestion.question}
          </h3>

          <label className="question-option flex flex-col items-center justify-center text-center border border-dashed border-[#AFAFAF]/25 rounded-3xl p-10 bg-[#FAFAFB] cursor-pointer hover:border-[#4EDDE2]/35 transition">
            <span className="text-[#111111] text-lg mb-2">
              Drag & drop or click to upload
            </span>
            <span className="text-sm text-[#3E1747]/55">
              PDF, JPG, PNG supported
            </span>

            <input
              type="file"
              accept={currentQuestion.accept}
              className="hidden"
              onChange={(e) =>
                onFileUpload(currentQuestion.key, e.target.files?.[0])
              }
            />
          </label>

          {answers[currentQuestion.key] && (
            <p className="mt-4 text-center text-sm text-[#3E1747]/65">
              Selected: {answers[currentQuestion.key].name}
            </p>
          )}
        </div>
      );

    default:
      return null;
  }
}