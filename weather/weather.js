const https = require('https')

class DayPartCondition
{
    constructor(wind, temp, conditions, temp_feels_like) {
        this.temp = temp
        this.conditions = conditions
        this.temp_feels_like = temp_feels_like
        this.wind = wind
    }

    getAverage() {
        return new DayPartCondition(
            [this.wind.reduce((accumulator, currentValue) => {
                return accumulator + currentValue
            },0) / this.wind.length],
            [this.temp.reduce((accumulator, currentValue) => {
                return accumulator + currentValue
            },0) / this.temp.length],
            [...new Set(this.conditions)],
            [this.temp_feels_like.reduce((accumulator, currentValue) => {
                return accumulator + currentValue
            },0) / this.temp_feels_like.length],
        )
    }
}

class DayCondition 
{
    constructor(date, p0, p1, p2, p3) {
        this.date = date
        this.p0 = p0
        this.p1 = p1
        this.p2 = p2
        this.p3 = p3
    }
}

const httpGet = url => {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        res.setEncoding('utf8');
        let body = ''; 
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(body));
      }).on('error', reject);
    });
  };

async function getWeather(days) {
    apiKey = process.env.WEATHER_API_KEY
    cityName = 'Yoshkar-Ola'
    apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=${days}&aqi=no&alerts=yes&lang=ru`

    return JSON.parse(await httpGet(apiUrl))
}

function porcessHours(hours, idxStart, idxEnd) {
    let feelslike_temp = []
    let wind = []
    let temp = []
    let conditions = []

    for (let hIdx = idxStart; hIdx < idxEnd; hIdx++) {
        let hour = hours[hIdx]
        feelslike_temp.push(parseFloat(hour.feelslike_c))
        wind.push(parseFloat(hour.wind_kph))
        temp.push(parseFloat(hour.temp_c))
        conditions.push(hour.condition.text)
    }

    return new DayPartCondition(wind, temp, conditions, feelslike_temp)
}

function processWeatherData(weatherData) {
    days = []
    forecast = weatherData.forecast.forecastday

    forecast.forEach((day) => {
        let date = day.date
        let dayHours = day.hour

        let p0 = porcessHours(dayHours, 0, 6)
        let p1 = porcessHours(dayHours, 6, 12)
        let p2 = porcessHours(dayHours, 12, 18)
        let p3 = porcessHours(dayHours, 18, 24)

        days.push(new DayCondition(date, p0, p1, p2, p3))
    }, days);

    return days
}

module.exports = {processWeatherData, getWeather, DayCondition, DayPartCondition}