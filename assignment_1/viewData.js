export default window => {
    const document = window.document
    const table_body_temp = document.getElementById('temperature_data')
    const table_body_prec = document.getElementById('precipitation_data')
    const table_body_wind = document.getElementById('wind_data')
    const table_body_cloud = document.getElementById('cloud_data')

    const addData = (p, table_body) => {
        const tr = table_body.appendChild(document.createElement('tr'))
        tr.insertCell().appendChild(document.createTextNode(p.time))
        tr.insertCell().appendChild(document.createTextNode(p.type))
        tr.insertCell().appendChild(document.createTextNode(p.value))
        tr.insertCell().appendChild(document.createTextNode(p.unit))

        if (p.direction != undefined)
            tr.insertCell().appendChild(document.createTextNode(p.direction))
        if (p.precipitation_type != undefined)
            tr.insertCell().appendChild(document.createTextNode(p.precipitation_type))
    }
    const addStatistics = (stats, type) => {
        switch (type) {
            case "min": {
                const minTemp = document.getElementById('minTemp')
                minTemp.innerText = "Minimal temperature: " + stats + "C"
            } break
            case "max": {
                const maxTemp = document.getElementById('maxTemp')
                maxTemp.innerText = "Maximal temperature: " + stats + "C"
            }
            case "total": {
                const totalPrec = document.getElementById('totalPrec')
                totalPrec.innerText = "Total precipitation: " + stats + "mm"
            }
            case "wind": {
                const avgWind = document.getElementById('averageWind')
                avgWind.innerText = "Average wind speed: " + stats + "m/s"
            }
        }

    }

    const displayError = e => {
        const msg_board = document.getElementById('error messages')
        msg_board.innerText = e
    }

    const update = model => {
        while (table_body_temp.firstChild) table_body_temp.removeChild(table_body_temp.firstChild)
        while (table_body_prec.firstChild) table_body_prec.removeChild(table_body_prec.firstChild)
        while (table_body_wind.firstChild) table_body_wind.removeChild(table_body_wind.firstChild)
        while (table_body_cloud.firstChild) table_body_cloud.removeChild(table_body_cloud.firstChild)

        model.filteredData("temperature").forEach(p => addData(p, table_body_temp))
        model.filteredData("precipitation").forEach(p => addData(p, table_body_prec))
        model.filteredData("wind speed").forEach(p => addData(p, table_body_wind))
        model.filteredData("cloud coverage").forEach(p => addData(p, table_body_cloud))
        addStatistics(model.minimalTemp(), "min")
        addStatistics(model.maximalTemp(), "max")
        addStatistics(model.totalPrec(), "total")
        addStatistics(model.averageWindSpeed(), "wind")
    }

    return { addData, update, displayError }
}