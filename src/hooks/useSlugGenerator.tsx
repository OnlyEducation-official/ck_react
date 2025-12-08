import { useEffect } from "react";
import {
  FieldValues,
  Path,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

interface UseSlugGeneratorProps<T extends FieldValues> {
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  source: Path<T>;   // <-- FIXED
  target: Path<T>;   // <-- FIXED
}

export const useSlugGenerator = <T extends FieldValues>({
  watch,
  setValue,
  source,
  target,
}: UseSlugGeneratorProps<T>) => {
  const value = watch(source); // fully typed Path<T>

  useEffect(() => {
    if (!value) return;
    setValue(target, slugify(String(value)) as any, { shouldValidate: true });
  }, [value, setValue, target]);
};
