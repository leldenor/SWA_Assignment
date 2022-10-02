const viewForecast = (window) => {
    const document = window.document
    const table_body_temp = document.getElementById('temperature_data')
    const table_body_prec = document.getElementById('precipitation_data')
    const table_body_wind = document.getElementById('wind_data')
    const table_body_cloud = document.getElementById('cloud_data')

    const addData = (p, table_body) => {
        const tr = table_body.appendChild(document.createElement('tr'))
        tr.insertCell().appendChild(document.createTextNode(p.time))
        tr.insertCell().appendChild(document.createTextNode(p.type))
        tr.insertCell().appendChild(document.createTextNode(p.from))
        tr.insertCell().appendChild(document.createTextNode(p.to))
        tr.insertCell().appendChild(document.createTextNode(p.unit))

        if (p.directions != undefined)
            tr.insertCell().appendChild(document.createTextNode(p.directions))
        else if (p.precipitation_types != undefined)
            tr.insertCell().appendChild(document.createTextNode(p.precipitation_types))
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

        model.filteredForecast("temperature").forEach(p => addData(p, table_body_temp))
        model.filteredForecast("precipitation").forEach(p => addData(p, table_body_prec))
        model.filteredForecast("wind speed").forEach(p => addData(p, table_body_wind))
        model.filteredForecast("cloud coverage").forEach(p => addData(p, table_body_cloud))
    }

    return { addData, update, displayError }

}

export default viewForecast