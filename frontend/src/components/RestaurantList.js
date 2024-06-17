import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RestaurantList = () => {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://localhost:5000/api/restaurant/profile"
        );
        setRestaurants(response);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading && <div>Loading</div>}
      {!loading && (
        <div>
          <h2>Restaurants</h2>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant._id}>{restaurant.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
