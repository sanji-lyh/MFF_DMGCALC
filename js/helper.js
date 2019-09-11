// global helper function

function getJSON(url, callback) {
    var r = new XMLHttpRequest();
    r.open('GET', url);
    r.onreadystatechange = () => {
        if (r.readyState === XMLHttpRequest.DONE) {
            if (r.status === 200) {
                callback(JSON.parse(r.responseText));
            } else {
                console.log(`error retrieving JSON from ${url}`);
            }
        }
    };
    r.send();
}

export { getJSON }

