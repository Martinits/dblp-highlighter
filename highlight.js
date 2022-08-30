let databaseURL = "https://raw.githubusercontent.com/Martinits/dblp-highlighter/master/database.csv";

let catagoryMapping = ["", "计算机体系结构/并行与分布计算/存储系统", "计算机网络", "网络与信息安全", "软件工程/系统软件/程序设计语言", "数据库/数据挖掘/内容检索", "计算机科学理论", "计算机图形学与多媒体", "人工智能", "人机交互与普适计算", "交叉/综合/新兴"]

let database = {};

async function initialize() {
    let response = await fetch(databaseURL);
    if (!response.ok) {
        console.log("There's been trouble loading the database from github.")
        return false;
    }
    let csv = await response.text();
    database = $.csv.toObjects(csv);
    // {
    //     key: string,
    //     level: 'A'|'B'|'C',
    //     type: 'Journal'|'Meeting',
    //     category:'1'-'10'
    // }
    console.log(database);
    return true;
}

function searchInDatabase(site) {
    for (let item of database) {
        if (site.includes(item.key)) {
            return getDescriptorFromItem(item);
        }
    }
    // We do not know this site!
    console.log(`Unknown site: ${site}`);
    return {
        text: "Unknown",
        color: mapLevelToColor("Unknown")
    };
}

function getDescriptorFromItem(item) {
    return {
        text: `${item.level} - ${item.type} - ${catagoryMapping[parseInt(item.category)]}`,
        color: mapLevelToColor(item.level)
    }
}

function mapLevelToColor(level) {
    if (level === "A") return "#880506";
    if (level === "B") return "#DC582A";
    if (level === "C") return "#EEC252";

    return "#ffffff";
}

function appendDescriptor() {
    let targets = document.querySelectorAll("li > cite")
    console.log(`A total of ${targets.length} targets found`);
    for (let target of targets) {
        handleNode(target);
    }
}

function handleNode(target) {
    let hyperlinks = target.getElementsByTagName('a');
    let candidate = hyperlinks[hyperlinks.length - 1];
    // Whatever it is, we do not want it.
    if (candidate.firstChild.getAttribute('itemprop') !== "isPartOf") return;
    let site = candidate.getAttribute("href");
    let descriptor = searchInDatabase(site);
    if (descriptor.text !== 'Unknown'){
        let outer = document.createElement('div');
        let node = document.createElement('span');
        outer.appendChild(node);
        node.innerHTML = `&nbsp;CCF${descriptor.text}&nbsp;`;
        node.style = `background-color: ${descriptor.color};color: white;border-radius: 5px;`;
        target.appendChild(outer);
    }
}

var pageObserver = new window.MutationObserver(mutationHandler);
var obsConfig = {
    childList: true,
    subtree: true,
    attributes: true,
};

function mutationHandler(mutationRecords) {
    mutationRecords.forEach(function (mutation) {
        var node = mutation.target;
        if (node.tagName === "LI") {
            handleNode(node.getElementsByTagName('cite')[0]);
        }
    });
}

(async function main(){
    let ok = await initialize();
    if (!ok) return;

    while (document.readyState !== "complete") {
        await new Promise(r => setTimeout(r, 1));
    }

    appendDescriptor();
    pageObserver.observe(document, obsConfig);

    console.log("dblp-highlighter loaded!");
})();
