// global helper function

function getJSON(url) {
  return new Promise((resolve, reject) => {
    var r = new XMLHttpRequest();
    r.open('GET', url);
    r.onreadystatechange = () => {
      if (r.readyState === XMLHttpRequest.DONE) {
        if (r.status === 200) {
          resolve(JSON.parse(r.responseText));
        } else {
          console.log(`error retrieving JSON from ${url}`);
          reject(r.statusText);
        }
      }
    };
    r.send();
  });

}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

function numberWithCommas(x) {
  x = x.toFixed(0);
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function parseInt2(input) {
  if (!input) return 0;
  return parseInt(input.toString().replace(/,/g, '')) || 0;
}

export { getJSON, capitalize, numberWithCommas, parseInt2 };
