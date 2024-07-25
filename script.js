const apikey = "dc2db78201bac7b7fd3c4c868ec30025";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const cityval = document.querySelector(".searchbar2 input");
const citybtn = document.querySelector(".searchbar2 button");
const voicebtn = document.getElementById('voice-btn');
const weathericon = document.querySelector(".weatherbtn");

async function checkweather(city) {
    const response = await fetch(apiURL + city + `&appid=${apikey}`);
    var data = await response.json();
    console.log(data);
    if (data.cod === 200) {
        document.querySelector(".cityname").innerHTML = data.name;
        document.querySelector(".temparature").innerHTML = data.main.temp + `°C`;
        document.querySelector(".wind2").innerHTML = data.wind.speed + ` km/h`;
        document.querySelector(".humidity2").innerHTML = data.main.humidity + `%`;
        if (data.weather[0].main === "Clouds") {
            weathericon.src = "images/clouds.png";
        } else if (data.weather[0].main === "Clear") {
            weathericon.src = "images/clear.png";
        } else if (data.weather[0].main === "Drizzle") {
            weathericon.src = "images/drizzle.png";
        } else if (data.weather[0].main === "Snow") {
            weathericon.src = "images/snow.png";
        } else if (data.weather[0].main === "Haze") {
            weathericon.src = "images/mist.png";
        } else if (data.weather[0].main === "Rain") {
            weathericon.src = "images/rain.png";
        }
    } else {
        document.querySelector(".cityname").innerHTML = "City not found";
        document.querySelector(".temparature").innerHTML = "-";
        document.querySelector(".wind2").innerHTML = "--";
        document.querySelector(".humidity2").innerHTML = "--";
        weathericon.src = "images/placeholder.png"; // Placeholder image when city is not found
    }
}

citybtn.addEventListener("click", () => {
    checkweather(cityval.value);
});

voicebtn.addEventListener('click', () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert('Your browser does not support the Speech Recognition API. Please use a supported browser like Google Chrome.');
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onstart = function () {
        console.log('Voice recognition started. Try speaking into the microphone.');
    };

    recognition.onresult = function (event) {
        let city = event.results[0][0].transcript;
        console.log('You said: ' + city);
        city = city.replace('.', ''); // Remove any full stops
        document.querySelector('.searchbar').value = city;
        checkweather(city);
    };

    recognition.onerror = function (event) {
        console.error('Speech recognition error:', event.error);
        let errorMessage;
        switch (event.error) {
            case 'no-speech':
                errorMessage = 'No speech was detected. Please try again.';
                break;
            case 'audio-capture':
                errorMessage = 'No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly.';
                break;
            case 'not-allowed':
                errorMessage = 'Permission to use microphone is blocked. To change, go to chrome://settings/content/microphone';
                break;
            default:
                errorMessage = 'An error occurred during speech recognition: ' + event.error;
        }
        alert(errorMessage);
    };

    recognition.start();
});
