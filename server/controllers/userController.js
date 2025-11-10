
// GET /api/users

export const userData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recentSearchedCities;
    res.json({ success: true, role, recentSearchedCities });
  } catch (error){
    res.json({ success: false, message: "Error fetching user data: " + error.message });
  }
}

// Store recent searched cities
export const storeRecentSearchCities = async (req, res) => {
  try {
    const {recentSearchedCity} = req.body;
    const user = await req.user;

    if(user.recentSearchedCities.length < 3){ 
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }
    await user.save();
    res.json({ success: true, message: "City added to recent searches"});
    
  } catch (error) {
    res.json({ success: false, message: "Error storing recent searched city: " + error.message });
  }
}

