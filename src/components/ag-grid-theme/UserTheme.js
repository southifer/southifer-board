import { themeQuartz, iconSetQuartzLight } from '@ag-grid-community/theming';

// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz
	.withPart(iconSetQuartzLight)
	.withParams({
        backgroundColor: "#FFFFFF",
        browserColorScheme: "light",
        columnBorder: false,
        fontFamily: {
            googleFont: "Arial"
        },
        foregroundColor: "rgb(46, 55, 66)",
        headerBackgroundColor: "#F9FAFB",
        headerFontSize: 14,
        headerFontWeight: 600,
        headerTextColor: "#919191",
        oddRowBackgroundColor: "#F9FAFB",
        rowBorder: true,
        sidePanelBorder: false,
        spacing: 8,
        wrapperBorder: true,
        wrapperBorderRadius: 0
});
