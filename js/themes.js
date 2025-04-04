const themes = ["dark-theme", "light-theme", "amber-theme", "americanfootball-theme"];
let currentThemeIndex = 0;

function changeTheme(themeName) {
  let themeChanged = false;
  
  if (themeName) {
    const themeIndex = themes.findIndex(t => t.startsWith(themeName.toLowerCase()));
    if (themeIndex !== -1) {
      document.body.classList.remove(themes[currentThemeIndex]);
      currentThemeIndex = themeIndex;
      document.body.classList.add(themes[currentThemeIndex]);
      themeChanged = true;
    }
  }
  
  if (!themeChanged) {
    document.body.classList.remove(themes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.classList.add(themes[currentThemeIndex]);
  }
  
  return `Theme changed to: ${themes[currentThemeIndex].replace('-theme', '')}`;
}
