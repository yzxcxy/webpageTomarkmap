// 假设我们需要读取当前网页的内容并发送给服务器总结   
function general(event) {
    // 获取触发事件的按钮
    const triggeredButton = event.target.id;
    // console.log('Triggered Button:', triggeredButton);
    const btnMap = {
        "summarizeBtn": { "category": "summary", "query": "summary this content in chinese" },
        "mindmapBtn": { "category": "mindmap", "query": "generate a mindmap for this content" }
    }

    // 假设我们需要读取当前网页的内容并发送给服务器总结
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tab = tabs[0];
        contentFunc = function getContentFunc() {
            // console.log('Getting content...');
            // console.log(triggeredButton);
            if (triggeredButton === "summarizeBtn") {
                return () => {
                    let selection = window.getSelection().toString();
                    return selection || document.body.innerText;
                }
            } else if (triggeredButton === "mindmapBtn") {
                return () => {
                    let selection = window.getSelection().toString();
                    return selection || document.body.innerText;
                }
            }
        }();
        console.log(contentFunc);

        // 向 content script 发送消息以获取网页内容
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: contentFunc
        }, (results) => {
            let pageContent = results[0].result;
            // console.log(pageContent);
            category = btnMap[triggeredButton]["category"];
            query = btnMap[triggeredButton]["query"];
            // console.log(category, query);
            const url = '';
            const apiKey = '';
            const headers = {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            };

            const data = {
                "inputs": { "category": category, "content": pageContent },
                "query": query,
                "response_mode": "blocking",
                "conversation_id": "",
                "user": "chorme_ext"
            };

            // console.log('Sending data:', data);
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    if (category === "summary") {
                        // 将总结结果显示在页面上
                        document.getElementById('result').innerText = data["answer"];
                        document.getElementById('result').style.display = "block";
                    } else if (category === "mindmap") {
                        let mindmapUrl = data["answer"];
                        // mindmapUrl = JSON.parse(mindmapUrl)["body"];
                        document.getElementById('mindmap').src = mindmapUrl;
                        document.getElementById('mindmap').style.display = "block";
                    }
                })
                .catch((error) => console.error('Error:', error));
        });
    });
}

// console.log('sidebar.js loaded');

document.getElementById('summarizeBtn').addEventListener('click', general

);

console.log('summarizeBtn added');

document.getElementById('mindmapBtn').addEventListener('click', general
);

console.log('mindmapBtn added');