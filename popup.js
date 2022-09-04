let databaseURL = "https://raw.githubusercontent.com/Martinits/dblp-highlighter/master/moreinfo.csv";
// let databaseURL = chrome.runtime.getURL("moreinfo.csv");
// console.log(databaseURL);

let catagory_strings = [
    "",
    "计算机体系结构/并行与分布计算/存储系统",
    "计算机网络",
    "网络与信息安全",
    "软件工程/系统软件/程序设计语言",
    "数据库/数据挖掘/内容检索",
    "计算机科学理论",
    "计算机图形学与多媒体",
    "人工智能",
    "人机交互与普适计算",
    "交叉/综合/新兴",
]

let database = {};

(async function () {
    $("#submitbtn").click(search);
    $("#listpaperbtn").click(listpaper);
    let response = await fetch(databaseURL);
    if (!response.ok) {
        console.log("There's been trouble loading the moreinfo.csv.")
        return false;
    }
    let csv = await response.text();
    database = $.csv.toObjects(csv);
    // {
    //     key: string,
    //     level: 'A'|'B'|'C',
    //     type: 'Journal'|'Meeting',
    //     category:'1'-'10'
    //     fullname: string,
    //     publisher: string,
    //     url: string
    // }
    // console.log(database);
    return true;
})();

function search() {
    let searchkey = $("#searchinput").val();
    if (searchkey.length == 0) return;

    // case insensitive
    searchkey = searchkey.toLowerCase();

    results = [];

    for (let item of database) {
        if (searchkey == item.key) {
            results.push(item);
        }
    }

    show_table(results, 'Search');
}

function listpaper() {
    let list_cate = $('#cate').val();

    let list_type = $('#type').val();
    let list_type_str = 'Journal';
    let list_type_both = 0;
    if (list_type == 0) {
        list_type_both = 1;
    }else if (list_type == 2) {
        list_type_str = 'Conference';
    }

    let list_class_tmp = $('#class').val();
    let list_class = 'A';
    if (list_class_tmp == 1)
        list_class = 'B';
    else if (list_class_tmp == 2)
        list_class = 'C';

    // console.log(list_class);
    // console.log(list_cate);
    // console.log(list_type);

    results = [];

    for (let item of database) {
        if (list_cate == item.category
            && list_class == item.level
            && (list_type_both || list_type_str == item.type)) {
            results.push(item);
        }
    }

    show_table(results, 'List');
}

let table_titles = [
    "简称",
    "评级",
    "类别",
    "领域",
    "全称",
    "出版社",
    "网址"
];

function show_table(results, type) {
    if (results.length == 0) {
        $("#oneres").html(`${type}: No result.`);
        return;
    }

    $("#oneres").html(`${type}: ${results.length} result(s):`);
    let content = [];
    for (let result of results) {
        let row = [];
        row.push(result.key.toUpperCase());
        row.push(result.level);
        row.push(result.type);
        row.push(catagory_strings[result.category]);
        row.push(result.fullname);
        row.push(result.publisher);
        row.push(result.url);
        content.push(row);
    }

    let rows = content.length + 1;
    let cols = content[0].length;

    if (cols != table_titles.length) {
        console.error('tables cols is wrong.');
        return;
    }

    let table = $('<table border="1">');
    table.appendTo($('#oneres'));

    let tr = $("<tr></tr>");
    tr.appendTo(table);
    for (let j = 0 ; j < cols; j++) {
        let td = $("<td>" + table_titles[j] + "</td>");
        if(j == 1 || j == 5) {
            td.attr('class', 'thincol');
        } else if (j == 3) {
            td.attr('class', 'thincol');
        }
        td.appendTo(tr);
    }

    for (let i = 0; i < rows-1; i++) {
        let tr = $("<tr></tr>");
        tr.appendTo(table);
        for (let j = 0 ; j < cols; j++) {
            let td = $("<td>" + content[i][j] + "</td>");
            if(j == 1 || j == 5) {
                td.attr('class', 'thincol');
            } else if (j == 3) {
                td.attr('class', 'thincol');
            }
            td.appendTo(tr);
        }
    }

    $('#oneres').append("</table>");
}
