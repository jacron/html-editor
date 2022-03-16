const plaintext = "text/plain";
const htmltext = "text/html";

function getTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    if (seconds < 10) {
        seconds = ' ' + seconds;
    }
    return `${minutes}:${seconds}`;
}

function showText(text) {
    const pos = text.indexOf('?t=');
    if (pos !== -1) {
        document.getElementById('clipboard-text').value = text.substr(0, pos);
        document.getElementById('clipboard-time').value = getTime(text.substr(pos+3));
    } else {
        document.getElementById('clipboard-text').value = text;
    }
}

function showHtml(text) {
    document.getElementById('clipboard-html').value = text;
}

function getSeconden(time) {
    const parts = time.split(':');
    let seconden;
    if (parts.length > 2) {
        seconden = parts[0] * 60 * 60;
        seconden += parseInt(parts[1] * 60);
        seconden += parseInt(parts[2]);
    } else if (parts.length > 1) {
        seconden = parseInt(parts[0] * 60);
        seconden += parseInt(parts[1]);
    } else {
        seconden = parts[0];
    }
    return seconden;
}

function writeHtml() {
    const text = document.getElementById('clipboard-text').value;
    const time = document.getElementById('clipboard-time').value;
    const seconden = getSeconden(time);
    const qs = seconden ? `&t=${seconden}` : '';
    document.getElementById('clipboard-html').value  = `
<p style="margin:0in;font-family:Calibri;font-size:12.0pt" lang="nl">
<!--StartFragment--><a href="${text}${qs}">${time}</a><!--EndFragment--></p>`;
    document.getElementById('clipboard-url').setAttribute('href', text + qs);
}

function adjustTimeTable() {
    document.getElementById('clipboard-html').value =
        document.getElementById('clipboard-html').value
            .replace(/<a /g, '<br><a ');
}

function copyHtml() {
    const htmlElement = document.getElementById('clipboard-html');
    const blob = new Blob([htmlElement.value], {type: htmltext});
    const item = new ClipboardItem({
        [htmltext]: blob,
    });
    navigator.clipboard.write([item]).then();
}

function showPlainText(item) {
    item.getType(plaintext).then((blob) => {  // (blob: Blob)
        new Response(blob).text().then(text => {
            showText(text);
        })
    })
}

function showHtmlText(item) {
    item.getType(htmltext).then(blob => {
        new Response(blob).text().then(text => {
            showHtml(text);
        })
    })
}

function showItem(item) {
    for (let j = 0; j < item.types.length; j++) {
        switch(item.types[j]) {
            case plaintext:
                showPlainText(item);
                break;
            case htmltext:
                showHtmlText(item);
        }
    }
}

function readClipboard() {
    navigator.clipboard.read().then(data => {
        for (let i = 0; i < data.length; i++) {
            showItem(data[i]);  // item: ClipboardItem
        }
    })
}
