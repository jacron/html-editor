const plaintext = "text/plain";
const htmltext = "text/html";

const buttonReadClipboard = document.getElementById('buttonReadClipboard');
const buttonCopyHtml = document.getElementById('buttonCopyHtml');
const buttonReplace = document.getElementById('buttonReplace');
const buttonCopyAll = document.getElementById('buttonCopyAll');
const buttonCopyText = document.getElementById('buttonCopyText');
const aTimetable = document.getElementById('aTimetable');

const inputHtml = document.getElementById('inputHtml');
const inputText = document.getElementById('inputText');
const inputMatch = document.getElementById('inputMatch');
const inputTarget = document.getElementById('inputTarget');

const msgHtmlCopied = document.getElementById('msgHtmlCopied');
const msgAllCopied = document.getElementById('msgAllCopied');
const msgReplaced = document.getElementById('msgReplaced');
const msgTextCopied = document.getElementById('msgTextCopied');

function bind() {
    [
        [buttonReadClipboard, readClipboard],
        [buttonCopyHtml, copyHtml],
        [buttonCopyAll, copyAll],
        [buttonReplace, replace],
        [buttonCopyText, copyText],
        [aTimetable, youtubeTimetable]
    ].forEach(binding => {
        const [element, listener] = binding;
        element.addEventListener('click', listener);
    })
}

function hideMsgs() {
    [msgReplaced, msgHtmlCopied, msgTextCopied, msgAllCopied]
        .forEach(msg => msg.style.visibility = 'hidden')
}

function youtubeTimetable() {
    inputMatch.value = '<a ';
    inputTarget.value = '<br><a ';
}

function replace() {
    if (inputHtml.value.length < 1) {
        return;
    }
    inputHtml.value = inputHtml.value
        .split(inputMatch.value)
        .join(inputTarget.value);
    hideMsgs();
    msgReplaced.style.visibility = 'visible';
}

function copyAll() {
    if (inputHtml.value.length < 1 && inputText.value.length < 1) {
        return;
    }
    const htmlBlob = new Blob([inputHtml.value], {type: htmltext});
    const textBlob = new Blob([inputText.value], {type: plaintext});
    const item = new ClipboardItem({
        [htmltext]: htmlBlob,
        [plaintext]: textBlob
    });
    navigator.clipboard.write([item]).then(
        () => {
            hideMsgs();
            msgAllCopied.style.visibility = 'visible';
        }
    );
}

function copyHtml() {
    if (inputHtml.value.length < 1) {
        return;
    }
    const blob = new Blob([inputHtml.value], {type: htmltext});
    const item = new ClipboardItem({[htmltext]: blob,});
    navigator.clipboard.write([item]).then(
        () => {
            hideMsgs();
            msgHtmlCopied.style.visibility = 'visible';
        }
    );
}

function copyText() {
    if (inputText.value.length < 1) {
        return;
    }
    const blob = new Blob([inputText.value], {type: plaintext});
    const item = new ClipboardItem({[plaintext]: blob,});
    navigator.clipboard.write([item]).then(
        () => {
            hideMsgs();
            msgTextCopied.style.visibility = 'visible';
        }
    );
}

function showPlainText(item) {
    item.getType(plaintext).then((blob) => {  // (blob: Blob)
        new Response(blob).text().then(text => {
            inputText.value = text;
        })
    })
}


function showHtmlText(item) {
    item.getType(htmltext).then(blob => {
        new Response(blob).text().then(text => {
            inputHtml.value = text;
        })
    })
}

function showItem(item) {
    // todo: should only process first (or, only) item
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

bind();
hideMsgs();
