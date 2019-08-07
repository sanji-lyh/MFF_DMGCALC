import 'google-apps-script';

function doGet(request) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const ucSheet = spreadsheet.getSheets()[0];
    const esSheet = spreadsheet.getSheets()[1];

    const ucRange = ucSheet.getDataRange();
    let ucArray = cardRangeToJSONArray(ucRange);

    var result = {
        attack_uc: ucArray.filter((x: { [x: string]: string; }) => x['type'] !== 'support'),
        support_uc: ucArray.filter((x: { [x: string]: string; }) => x['type'] === 'support')
    };
    return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
}

function cardRangeToJSONArray(cardRange: GoogleAppsScript.Spreadsheet.Range) {
    let cardValues = cardRange.getValues();
    let header = cardValues.shift();
    
    const rowToObj = (row) => {
        let cardObj = {};
        let lastAutoAbilityName = '';
        for (let i = 0; i < header.length; i++) {
            if (header[i] === 'extra skill') {
                cardObj['extra skill'] = cardObj['extra skill'] || [];
                cardObj['extra skill'].push(row[i]);
            } else if (header[i] === 'auto ability') {
                lastAutoAbilityName = row[i];
            } else if (header[i] === 'value') {
                cardObj['auto ability'] = cardObj['auto ability'] || {};
                cardObj['auto ability'][[lastAutoAbilityName]] = row[i];
            } else {
                cardObj[header[i]] = row[i];
            }
        }
        return cardObj;
    }

    return cardValues.map(rowToObj);
}
