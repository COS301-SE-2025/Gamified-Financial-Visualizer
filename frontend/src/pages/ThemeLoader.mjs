const applyTheme = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
};

export const applyThemeFromPreferences = async (userId, token) => {
  try {
    const res = await fetch(`http://localhost:5000/api/auth/${userId}/settings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.preferences.theme === 'dark') {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
    localStorage.setItem('theme', data.preferences.theme);
  } catch (err) {
    console.error('Failed to apply theme:', err);
  }
};