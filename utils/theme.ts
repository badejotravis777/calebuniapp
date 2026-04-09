export type Theme = {
    background: string;
    card: string;
    text: string;
    subtext: string;
    border: string;
    primary: string;
    input: string;
    chatOther: string;
  };
  
  export const getTheme = (isDark: boolean): Theme => ({
    background: isDark ? "#121212" : "#F8FAFC",
    card: isDark ? "#1E1E1E" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#111111",
    subtext: isDark ? "#A1A1AA" : "#71717A",
    border: isDark ? "#333333" : "#E5E7EB",
    primary: "#0B6E4F",
    input: isDark ? "#2A2A2A" : "#F4F4F5",
    chatOther: isDark ? "#2A2A2A" : "#FFFFFF",
  });