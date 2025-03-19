import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from 'axios';

const FarmerInfoPortal = () => {
  const [seedData, setSeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchSeedData = async () => {
      try {
        const response = await axios.get(`https://api.data.gov.in/resource/seed-cost?api-key=${process.env.NEXT_PUBLIC_API_KEY}`);
        setSeedData(response.data.records);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching seed data:", error);
        setLoading(false);
      }
    };

    fetchSeedData();
  }, []);

  const handlePrediction = async () => {
    try {
      const mlResponse = await axios.post('https://your-ml-model-endpoint.com/predict', {
        input: seedData.map(seed => ({
          crop_name: seed.crop_name,
          cost_per_kg: seed.cost_per_kg
        }))
      });
      setPrediction(mlResponse.data.bestCrop);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("ML Model Integration Failed!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Farmer Information Portal</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seedData.map((seed, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent>
                <h2 className="text-xl font-semibold">{seed.crop_name}</h2>
                <p><strong>Seed Type:</strong> {seed.seed_type}</p>
                <p><strong>Cost per Kg:</strong> ₹{seed.cost_per_kg}</p>
                <p><strong>State:</strong> {seed.state}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Button onClick={handlePrediction}>
          Predict Best Crop
        </Button>
        {prediction && (
          <p className="mt-4 text-lg font-medium">Recommended Crop: {prediction}</p>
        )}
      </div>
    </div>
  );
};

export default FarmerInfoPortal;

