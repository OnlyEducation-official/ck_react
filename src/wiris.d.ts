declare module "*.js";
declare module "@wiris/mathtype-ckeditor5/dist/mathtype.js" {
  const MathType: any;
  export default MathType;
}

declare module "@wiris/mathtype-ckeditor5/dist/chemdraw.js" {
  const ChemType: any;
  export default ChemType;
}

declare module "@wiris/mathtype-ckeditor5/dist/index.js" {
  const WirisPlugins: any;
  export default WirisPlugins;
}

declare module "*.jsx" {
  import { FC } from "react";
  import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
  import type { FieldValues } from "react-hook-form";
  export interface MainEditorProps {
    name: string;
    setValue: UseFormSetValue<any>;
    watch?: UseFormWatch<any>;
    value?: string;
    debounceMs?: number;
  }

  const MainEditor: FC<MainEditorProps>;
  export default MainEditor;
}
// export declare function fetchQuestions(
//   routeName: string,
//   page: number
// ): Promise<any>;
