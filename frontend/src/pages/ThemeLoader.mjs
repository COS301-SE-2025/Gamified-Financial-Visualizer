const applyTheme = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
};

const BASE_URL = process.env.REACT_APP_API_URL || 'https://gamified-finance-backend-d2a3hnatafa7h8bw.southafricanorth-01.azurewebsites.net';
// const BASE_URL = "http://localhost:3000";
// const BASE_URL = "http://localhost:5000";

export const applyThemeFromPreferences = async (userId, token) => {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/${userId}/settings`, {
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