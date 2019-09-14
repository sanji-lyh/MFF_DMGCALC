//var exports = exports || {};
//var module = module || { exports: exports };

import 'google-apps-script';

function doGet(request) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var ucSheet = spreadsheet.getSheets()[0];
    var esSheet = spreadsheet.getSheets()[1];
    var ucRange = ucSheet.getDataRange();
    var ucArray = cardRangeToJSONArray(ucRange);
    var result = {
        attack_uc: ucArray.filter(function (x) { return x['type'] !== 'support'; }),
        support_uc: ucArray.filter(function (x) { return x['type'] === 'support'; })
    };
    return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
}
function cardRangeToJSONArray(cardRange) {
    var cardValues = cardRange.getValues();
    var header = cardValues.shift();
    var rowToObj = function (row) {
        var cardObj = {};
        var lastAutoAbilityName = '';
        var lastMechanicsName = '';
        for (var i = 0; i < header.length; i++) {
            if (header[i] === 'extra skill') {
                cardObj['extra skill'] = cardObj['extra skill'] || [];
                cardObj['extra skill'].push(row[i]);
            }
            else if (header[i] === 'auto ability') {
                lastAutoAbilityName = row[i];
            }
            else if (header[i] === 'value') {
                cardObj['auto ability'] = cardObj['auto ability'] || {};
                cardObj['auto ability'][[lastAutoAbilityName]] = row[i];
            }
             else if (header[i] === 'mechanics') {
                lastMechanicsName = row[i];
            }
            else if (header[i] === 'mvalue') {
                cardObj['mechanics'] = cardObj['mechanics'] || {};
                cardObj['mechanics'][[lastMechanicsName]] = row[i];
            }
            else {
                cardObj[header[i]] = row[i];
            }
        }
        return cardObj;
    };
    return cardValues.map(rowToObj);
}
