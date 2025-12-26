My chrome extension for logging leetcode solutions. It simply provides a form for you to describe your solution, how hard it was, and a tag for the problem. This information as well as basic information about the problem is logged to a specified google sheet.

To use this yourself:

1. Clone this repository
2. Create a [Google Script](https://script.google.com/) and deploy it with the following contents:
    ```javascript
    function doGet(e) {

    }

    var success = ContentService.createTextOutput(JSON.stringify({ result: "success" }));
    success.setMimeType(ContentService.MimeType.JSON);

    var failure = ContentService.createTextOutput(JSON.stringify({ result: "failure" }));
    failure.setMimeType(ContentService.MimeType.JSON);

    function doPost(e) {
    if (!e.postData) return failure;

    var data = JSON.parse(e.postData.contents);

    var sheet = SpreadsheetApp.openById(data.sheetId).getActiveSheet();

    var formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MMMM dd, yyyy");
    var numberWithLink = `=HYPERLINK("${data.url}", "${data.number}")`;

    sheet.appendRow([
        data.title,
        numberWithLink,
        data.notes,
        data.tag,
        data.difficulty,
        formattedDate,
        data.daily ? true : false,
        data.weekly ? true : false,
    ]);

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 7, 1, 2).insertCheckboxes();

    var tagValidation = SpreadsheetApp.newDataValidation()
        .requireValueInList([
        "Arrays & Hashing", "Two Pointers", "Stack", "Binary Search", "Linked List",
        "Trees", "1-D DP", "2-D DP", "Graph", "Backtracking", "Trie", "Heap",
        "Intervals", "Strings", "Bit Manipulation", "Math & Geometry", "Greedy",
        "Advanced Graphs"
        ])
        .setAllowInvalid(false)
        .build();

    sheet.getRange(lastRow, 4).setDataValidation(tagValidation);
    sheet.getRange(lastRow, 2).setHorizontalAlignment("right");

    return success;
    }
    ```
3. Create `consts.js` based on `consts.js.example`
4. Add this extension [`chrome://extensions/`](chrome://extensions/) using developer mode and 'Load unpacked'

This extension is not published on the chrome web store, so you will have to use it in developer mode.
