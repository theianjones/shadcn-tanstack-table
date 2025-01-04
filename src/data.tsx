export const generateData = () => {
  const names = ["John", "Jane", "Doe", "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace"];
  const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white"];
  const websites = ["google.com", "facebook.com", "twitter.com", "github.com", "linkedin.com"];
  
  const data = [];
  
  for (let i = 0; i < 10000; i++) {
    const randomDate = new Date(1970 + Math.floor(Math.random() * 50), 
                              Math.floor(Math.random() * 12),
                              Math.floor(Math.random() * 28) + 1);
    
    data.push({
      name: names[Math.floor(Math.random() * names.length)],
      age: Math.floor(Math.random() * 50) + 18, // Ages 18-67
      dateOfBirth: randomDate.toISOString().split('T')[0],
      website: `https://www.${websites[Math.floor(Math.random() * websites.length)]}`,
      favoriteColor: colors[Math.floor(Math.random() * colors.length)],
      isActive: Math.random() > 0.5
    });
  }
  
  return data;
};