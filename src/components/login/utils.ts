import { ColorSchemeStringType, ColorSchemeType } from '../../api/login';

export const getFinalColorScheme = (
  firstPriorityColorScheme: ColorSchemeType,
  secondPriorityColorScheme: ColorSchemeStringType,
): ColorSchemeStringType | null => {
  const isEmpty =
    !firstPriorityColorScheme.primaryColor &&
    !firstPriorityColorScheme.secondaryColor &&
    !secondPriorityColorScheme;

  if (isEmpty) return null;

  const spc = secondPriorityColorScheme.split(',').map((color) => color.trim());
  return `${firstPriorityColorScheme['primaryColor'] || spc[0]},${
    firstPriorityColorScheme['secondaryColor'] || spc[1]
  }`;
};
