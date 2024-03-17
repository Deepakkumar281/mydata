import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

import AppStyles from './styles';

export const PaperThemeDefault = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: AppStyles.color.COLOR_PRIMARY,
  },
};

export const PaperThemeDark = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: AppStyles.color.COLOR_PRIMARY,
  },
};

export const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
};

export const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: AppStyles.color.COLOR_BLACK,
    card: AppStyles.color.COLOR_BLACK,
    text: AppStyles.color.COLOR_WHITE,
    primary: 'white', 
  },
};
