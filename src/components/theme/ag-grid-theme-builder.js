import { themeQuartz } from '@ag-grid-community/theming';

// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz
	.withParams({
        backgroundColor: "#1f2836",
        browserColorScheme: "dark",
        chromeBackgroundColor: {
            ref: "foregroundColor",
            mix: 0.07,
            onto: "backgroundColor"
        },
        foregroundColor: "#FFF",
        headerFontSize: 14
    });
