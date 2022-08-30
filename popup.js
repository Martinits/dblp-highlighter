let arr = [
	"web前端精英特训班 980元",
	"HTML核心技术 199元",
	"CSS核心技术 299元",
	"Vue核心技术 599元",
	"CSS+HTML核心技术 299元",
	"web前端在线商城 99元",
	"JavaScript核心技术 399元",
	"JavaScript高级技术 899元",
];

var inp = document.getElementById("val");
var str = "";
var show = document.getElementById("show");
// 键盘起
inp.onkeyup = function () {
	// 匹配结果框展示
	show.style.display = "block";
	// 每次键盘输入，都会清空str
	let str = "";
	arr.forEach((item) => {
		// 将结果赋给res，res是arr中有查询关键字的元素，如果没有就返回-1
		let res = item.indexOf(inp.value);
		// 判断是否存在
		if (res != -1) {
			// 会有多个匹配结果，所以累加
			str += "<p>" + item + "</p>";
		}
	});
	// 判断是否输入查询关键字，和arr中是否存在相匹配的结果
	// ||：两者都为true才可以为true
	if (!inp.value || !str) {
		// 没有没有的与查询关键字有关的结果
		show.innerHTML = "<p>暂无结果</p>";
	} else {
		// innerHTML可以解析标签
		show.innerHTML = str;
	}
};
// 失去焦点事件
inp.onblur = function () {
	show.style.display = "none";
	inp.value = "";
};
