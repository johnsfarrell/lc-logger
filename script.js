function parseLeetcodeLink() {
    const anchor = document.querySelector('a.no-underline[href^="/problems/"]');
    if (!anchor) return { title: null, number: null };

    const match = anchor.textContent.match(/^(\d+)\.\s+(.*)$/);
    if (!match) return { title: null, number: null };

    return { number: match[1], title: match[2] };
}

function openSheet() {
    chrome.tabs.create({ url: `https://docs.google.com/spreadsheets/d/${window.GOOGLE_SHEET_ID}` });
}

document.getElementById("log-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const notes = document.getElementById("notes").value;
    const difficulty = document.getElementById("difficulty").value;
    const daily = document.getElementById("daily").checked;
    const weekly = document.getElementById("weekly").checked;
    const tag = document.getElementById("tag").value;
    const status = document.getElementById("status");

    const submitButton = document.getElementById("submit");
    submitButton.disabled = true;
    submitButton.style.opacity = 0.5;
    submitButton.style.cursor = "default";

    status.textContent = "Logging...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;

        const tab = tabs[0];
        const url = tab.url;

        if (!url) {
            status.textContent = 'Unable to retrieve URL';
            return;
        }

        if (!url.includes('leetcode.com/problems')) {
            status.textContent = 'Not a LeetCode question URL';
            return;
        }

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: parseLeetcodeLink
        }, (results) => {
            const { title, number } = results[0].result;

            if (!title || !number) {
                status.textContent = 'Unable to retrieve title or number';
                return;
            }

            const data = {
                number,
                title,
                url,
                notes,
                difficulty,
                daily,
                weekly,
                tag,
                sheetId: window.GOOGLE_SHEET_ID
            };

            fetch(window.GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }).then(() => {
                status.textContent = "Logged successfully!";
            }).catch(() => {
                status.textContent = "Error logging data.";
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("open").addEventListener("click", () => {
        window.open(`https://docs.google.com/spreadsheets/d/${window.GOOGLE_SHEET_ID}`, '_blank');
    });
});
