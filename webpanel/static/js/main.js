class InternalSocket {
    ws = null;

    constructor() { console.log('socket init') }

    send(json) {
        this.ws.send(JSON.stringify(json))
    }

    connect(url) {
        console.log('opening connection to ' + url)
        this.ws = new WebSocket(url);

        this.ws.onopen = () => this.onopen();
        this.ws.onclose = (code, reason) => this.onclose(code, reason);
        this.ws.onerror = (error) => this.onerror(error);
        this.ws.onmessage = (data, isBinary) => this.onmessage(data, isBinary);
    }

    onopen() {
        console.log('open')
        this.ws.send(JSON.stringify({
            key: 'hi'
        }))
    }

    onclose(code, reason) {
        console.log('close', code, reason)
        delete this.ws
    }

    onerror(error) {
        console.log('error')
        console.error(error)
    }

    onmessage(data, isBinary) {
        console.log('message', data, isBinary)
    }
}

var client = {
    apiUrl: 'http://localhost:3000/api',
    wsUrl: 'http://localhost:3030/panel',
    socket: new InternalSocket()
}

client.socket.connect(client.wsUrl)

const xhr = (type, url, callback, headers = []) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;
        callback(this)
    };
    xhr.open(type, url, true);
    headers.forEach(header => {
        xhr.setRequestHeader(header.key, header.value)
    })
    xhr.send();
}
/*
xhr('POST', client.apiUrl, (xhr) => {
    console.log(xhr.status, xhr.responseText)
}, [ { key: 'api', value: 225 } ])

xhr('PUT', client.apiUrl, (xhr) => {
    console.log(xhr.status, xhr.responseText)
}, [ { key: 'api', value: 225 } ])

xhr('DELETE', client.apiUrl, (xhr) => {
    console.log(xhr.status, xhr.responseText)
}, [ { key: 'api', value: 225 } ])*/

xhr('GET', client.apiUrl, (xhr) => {
    console.log(xhr.status, xhr.responseText)
    const json = JSON.parse(xhr.responseText)

    json.sliders.forEach(slider => {
        let div = document.createElement('div')

        let label = document.createElement('label')
        label.textContent = slider.textContent

        let rawValue = document.createElement('input')
        rawValue.type = 'number'
        rawValue.min = slider.min;
        rawValue.max = slider.max;
        rawValue.step = slider.step;
        rawValue.value = slider.value;
        rawValue.onchange = (ev) => {
            console.log(ev.target.value)
        }

        let domSlider = document.createElement('input')
        domSlider.type = 'range'
        domSlider.path = slider.path;
        domSlider.min = slider.min
        domSlider.max = slider.max;
        domSlider.step = slider.step;
        domSlider.value = slider.value;
        domSlider.onchange = (ev) => {
            console.log(ev.target.value, ev.target.path)
            console.log(client)
            client.socket.send({
                key: 'input',
                input: {
                    path: ev.target.path,
                    value: ev.target.value
                }
            })
        }

        div.appendChild(domSlider)
        div.appendChild(label)
        div.appendChild(rawValue)
        document.body.appendChild(div)
    })
}, [ { key: 'api', value: 'user/panel' } ])