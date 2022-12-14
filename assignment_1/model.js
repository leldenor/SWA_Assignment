const model = (data) => {
    const timeNow = new Date()
    const filteredData = (type) => {
        const temp = data.filter(t => {
            return t.type == type
        })
        return temp;
    }
    const minimalTemp = () => {
        const data = filteredData("temperature")
        const temp = data.filter(m => {
            const then = new Date(m.time)
            const msBetweenDates = Math.abs(then.getTime() - timeNow.getTime());
            const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

            return hoursBetweenDates <= 24
        })
        const t = temp.map(m => m.value)
        return Math.min(...t)
    }
    const maximalTemp = () => {
        const data = filteredData("temperature")
        const temp = data.filter(m => {
            const then = new Date(m.time)
            const msBetweenDates = Math.abs(then.getTime() - timeNow.getTime());
            const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

            return hoursBetweenDates <= 24
        })
        const t = temp.map(m => m.value)
        return Math.max(...t)
    }
    const totalPrec = () => {
        const data = filteredData("precipitation")
        let total = 0
        data.forEach(p => {
            const then = new Date(p.time)
            const msBetweenDates = Math.abs(then.getTime() - timeNow.getTime());
            const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);
            if (hoursBetweenDates <= 24)
                total = total + p.value
        });
        return total
    }
    const averageWindSpeed = () => {
        const data = filteredData("wind speed")
        let total = 0
        data.forEach(m => {
            const then = new Date(m.time)
            const msBetweenDates = Math.abs(then.getTime() - timeNow.getTime());
            const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);
            if (hoursBetweenDates <= 24)
                total = total + m.value
        })
        return total / data.length
    }

    const filteredForecast = (type) => {
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

    return { filteredData, minimalTemp, maximalTemp, totalPrec, averageWindSpeed, filteredForecast }
}

export default model