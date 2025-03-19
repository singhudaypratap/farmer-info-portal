import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from 'axios';

const FarmerInfoPortal = () => {
  const [cropData, setCropData] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const kharifResponse = await axios.get('https://api.data.gov.in/resource/kharif-msp-cost?api-key=' + process.env.NEXT_PUBLIC_API_KEY);
        const commercialResponse = await axios.get('https://api.data.gov.in/resource/commercial-msp-cost?api-key=' + process.env.NEXT_PUBLIC_API_KEY);

        const combinedData = [...kharifResponse.data.records, ...commercialResponse.data.records];
        setCropData(combinedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching crop data:", error);
        setLoading(false);
      }
    };

    const fetchMarketPrices = async () => {
      try {
        const response = await axios.get('https://your-custom-proxy-or-service/ncdex');
        setMarketPrices(response.data);
      } catch (error) {
        console.error("Error fetching market prices:", error);
      }
    };

    fetchCropData();
    fetchMarketPrices();
  }, []);

  const handlePrediction = async () => {
    try {
      const mlResponse = await axios.post('https://your-ml-model-endpoint.com/predict', {
        input: cropData.map(crop => ({
          crop_name: crop.crop_name,
          msp: crop.msp,
          cost_of_production: crop.cost_of_production
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
          {cropData.map((crop, index) => {
            const marketPrice = marketPrices.find(mp => mp.crop_name === crop.crop_name);

            return (
              <Card key={index} className="shadow-lg">
                <CardContent>
                  <h2 className="text-xl font-semibold">{crop.crop_name}</h2>
                  <p><strong>MSP (₹):</strong> {crop.msp}</p>
                  <p><strong>Cost of Production (₹):</strong> {crop.cost_of_production}</p>
                  <p><strong>Crop Type:</strong> {crop.crop_type}</p>
                  {marketPrice && (
                    <p><strong>Market Price (₹):</strong> {marketPrice.price}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
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
