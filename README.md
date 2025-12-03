# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
ck_react
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ addQeustion
│  │  ├─ components
│  │  │  ├─ EqEditorModal.jsx
│  │  │  ├─ EquationPlugin.js
│  │  │  ├─ KaTeXRenderPlugin.js
│  │  │  ├─ MainEditor.d.ts
│  │  │  ├─ MainEditor.jsx
│  │  │  ├─ OptionsFieldArray.tsx
│  │  │  ├─ renderLatexWithKatex.js
│  │  │  └─ TimeStampClass.jsx
│  │  ├─ Index.tsx
│  │  ├─ katexComponentss
│  │  │  └─ MainKatex.jsx
│  │  ├─ QuestionSchema.ts
│  │  └─ _components
│  │     ├─ data.ts
│  │     ├─ FormStructure.tsx
│  │     ├─ InitalContext.tsx
│  │     └─ OptimizedTopicSearch.tsx
│  ├─ App.css
│  ├─ App.jsx
│  ├─ components
│  │  ├─ EqEditorModal.jsx
│  │  ├─ EquationPlugin.js
│  │  ├─ KaTeXRenderPlugin.js
│  │  ├─ MainEditor.jsx
│  │  ├─ renderLatexWithKatex.js
│  │  ├─ TimeStampClass.jsx
│  │  └─ TopicSearchBar.tsx
│  ├─ context
│  │  └─ MeiliContext.tsx
│  ├─ getAll
│  │  ├─ fetchQuestions.js
│  │  └─ GetAllPage.tsx
│  ├─ GlobalComponent
│  │  ├─ FileUpload.tsx
│  │  ├─ Sidebar.tsx
│  │  ├─ SimpleAutocomplete.tsx
│  │  ├─ SimpleMultiAutoComplete.tsx
│  │  ├─ SimpleSelectField.tsx
│  │  ├─ SimpleTextField.tsx
│  │  ├─ SingleSelectAuto.tsx
│  │  └─ TopicsPage.tsx
│  ├─ hooks
│  │  └─ useSlugGenerator.tsx
│  ├─ index.css
│  ├─ katexComponentss
│  │  └─ MainKatex.jsx
│  ├─ main-editor.d.ts
│  ├─ main.jsx
│  ├─ test-exams
│  │  ├─ TestExamsForm.tsx
│  │  ├─ TestExamsFormEdit.tsx
│  │  └─ _components
│  │     └─ TestExamFormStructure.tsx
│  ├─ TestExamCategories
│  │  └─ components
│  │     └─ TestExamCategoriesForm.tsx
│  ├─ testSubject
│  │  ├─ components
│  │  │  └─ TestSubjectForm.tsx
│  │  └─ Index.tsx
│  ├─ testTopic
│  │  ├─ components
│  │  │  └─ TestSeriesForm.tsx
│  │  └─ Index.tsx
│  ├─ types
│  │  └─ StrapiResponse.ts
│  ├─ ui
│  │  ├─ CheckBox.jsx
│  │  ├─ Form.jsx
│  │  ├─ Form2.jsx
│  │  ├─ Header.jsx
│  │  ├─ Header1.jsx
│  │  ├─ QuestionCard.tsx
│  │  ├─ QuestionSchema.ts
│  │  └─ SelectComponent.jsx
│  ├─ util
│  │  ├─ meiliClient.ts
│  │  ├─ resource.ts
│  │  ├─ toastResponse.ts
│  │  └─ topicSearch.ts
│  ├─ validation
│  │  ├─ testSeriesExamCategorySchema.ts
│  │  ├─ testSeriesExamSchema.ts
│  │  ├─ testSeriesSchema.ts
│  │  └─ testSeriesSubjectSchema.ts
│  ├─ vite-env.d.ts
│  └─ wiris.d.ts
├─ tsconfig.json
└─ vite.config.js

```