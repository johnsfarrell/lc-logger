chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "getProblemData") {
        const h1 = document.querySelector("h1").innerText;
        const title = h1.split(". ")[1];
        const number = h1.split(". ")[0];
        const url = window.location.href;
        sendResponse({ title, number, url });
    }
});