const modelForecast = (data) => {
    const timeNow = new Date()
    const filteredData = (type) => {
        const temp = data.filter(t => {
            const dataTime = new Date(t.time)
            const msBetweenDates = Math.abs(timeNow.getTime() - dataTime.getTime());
            const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

            return t.type == type && hoursBetweenDates <= 24
        })
        if (type == "wind speed") {
            temp.forEach(x => {
                x.directions = x.directions.join(", ")
            })
        } else if (type == "precipitation") {
            temp.forEach(x => {
                x.precipitation_types = x.precipitation_types.join(", ")
            })
        }
        return temp;
    }

    return { filteredData }
}

export default modelForecast