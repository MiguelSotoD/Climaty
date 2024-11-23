const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const watherInforSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');

const forecastItemsContainer = document.querySelector('.forecast-items-container');

const apiKey = 'bb53b802663dae641e3de77c9150985a'

searchBtn.addEventListener('click', () => {
   if(cityInput.value.trim()!= ''){
    updateWeatherInfo(cityInput.value)
    cityInput.value = '';
    cityInput.blur();
   }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' &&
        cityInput.value.trim() !== ''
    ){
        updateWeatherInfo(cityInput.value)
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint ,city){
    const apiUrl =`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response =await fetch(apiUrl)

    return response.json()
}
function getWeatherIcon(id){
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id == 800) return 'clear.svg';
    else return 'clouds.svg';
}

function getcurrentDate(){
    const currentData = new Date();
        const options ={
            weekday: 'short',
            day: '2-digit',
            month: 'short',
        }
        return currentData.toLocaleDateString('es-GB', options)
}


async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city);
    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection);
        return
    }

    const{
        name: country,
        main:{temp, humidity},
        weather:[{id,main}],
        wind: {speed},
    } =weatherData

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + '°C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + 'km/h';

    currentDateTxt.textContent = getcurrentDate();
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    await updateForecastsInfo(city)

    showDisplaySection(watherInforSection);
} 

async function updateForecastsInfo(city){
    const forecastData = await getFetchData('forecast', city);

    const timeTaken ='12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML='';
    forecastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) &&           !forecastWeather.dt_txt.includes(todayDate))
        updateForecastItems(forecastWeather)
    })
}

function updateForecastItems(weatherData){
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{id }],
        main: {temp},
    }=weatherData 

    const dataTaken = new Date(date)
    const dataOptions ={
        day: '2-digit',
        month: 'short',
    }
    const dataResult = dataTaken.toLocaleDateString('es-GB', dataOptions)

    const forecastItem =`
        <div class="forecast-item">
        <p class="forecast-date">${dataResult}</p>
        <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-icon">
        <p class="forecast-temp">${Math.round(temp)}°C</p>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section){
    [watherInforSection,searchCitySection, notFoundSection].forEach((section => section.style.display = 'none'));
    section.style.display = 'flex';
}