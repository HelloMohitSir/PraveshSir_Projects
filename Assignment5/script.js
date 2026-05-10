        function normalizeTemperature(temp) {
            return (temp - 273.15).toFixed(1);
        }

        async function getWeather(city) {
            const apiKey = "0cf0084d6266ecf663820a2a721979c4";
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            let temp = data.main.temp;
            temp = normalizeTemperature(temp);
            
            let tempMax = data.main.temp_max;
            tempMax = normalizeTemperature(tempMax);
            
            let tempMin = data.main.temp_min;
            tempMin = normalizeTemperature(tempMin);
            
            return {
                temp,
                tempMax,
                tempMin
            };
        }

        const getWeatherButton = document.getElementById("getWeather");
        getWeatherButton.addEventListener("click", async () => {
            const city = document.getElementById("city").value;
            
            if (!city) {
                document.getElementById("result").textContent = "⚠️ Please enter a city name!";
                return;
            }
            
            try {
                const weather = await getWeather(city);
                document.getElementById("result").textContent = `The temperature in ${city} is ${weather.temp}°C, the maximum temperature is ${weather.tempMax}°C`;
            } catch(error) {
                document.getElementById("result").textContent = "⚠️ City not found!";
            }
        });
    