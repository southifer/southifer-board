import { themeQuartz, iconSetQuartzLight } from '@ag-grid-community/theming';

const customTheme = themeQuartz
  .withPart(iconSetQuartzLight)
  .withParams({
      backgroundColor: "#222437",
      borderColor: "#1C1E2F",
      browserColorScheme: "dark",
      columnBorder: false,
      fontFamily: {
          googleFont: "Inter",
      },
      fontSize: "16px",
      foregroundColor: "#FFFFFF",
      headerBackgroundColor: "#222437",
      headerFontFamily: {
          googleFont: "Inter",
      },
      headerFontSize: 14,
      headerFontWeight: 600,
      headerTextColor: "#FFFFFF",
      oddRowBackgroundColor: "#1C1E2F",
      rowBorder: true,
      sidePanelBorder: false,
      spacing: 8,
      wrapperBorder: false,
      wrapperBorderRadius: 0,
  });

export default customTheme;