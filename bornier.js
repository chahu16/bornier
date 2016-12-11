"use strict";

const cablesType = [
	"Rigide",
	"Souple",
	"Blinde"
];

const cables = [
	{ "label": "RO2V 3G1.5", "conducteurActif": 2, "terre": true, type: "Rigide" },
	{ "label": "RO2V 4G2.5", "conducteurActif": 3, "terre": true, type: "Rigide" },
	{ "label": "YSL-JZ 7G1", "conducteurActif": 6, "terre": true, type: "Souple" },
	{ "label": "YSL-JZ 27G0.75", "conducteurActif": 26, "terre": true, type: "Souple" },
	{ "label": "LY-CY 8X0.5", "conducteurActif": 8, "terre": false, type: "Blinde" },
	{ "label": "LY-CY 4X0.75", "conducteurActif": 4, "terre": false, type: "Blinde" },
];

var bornier = [];

const removeCable = (e) => {
	const line = e.parentNode.parentNode;
	delEl(line);
	line.parentNode.removeChild(line);
};

const addCable = (e) => {
	const div = e.parentNode;
	const body = e.nextSibling.childNodes[1];
	addContent(body,
		newEl("tr", {}, [
			newEl("td", {},
				newEl("select", {}, cables.map((e) => {
					return newEl("option", {}, e.label);
				}))
			),
			newEl("td", {},
				newEl("input", { "type": "number", "min": 1, "onchange": "changeCableQuantity(this)" })
			),
			newEl("td", {},
				newEl("button", { "onclick": "removeCable(this)" }, "Remove")
			)
		])
	);

	console.log(body);
	console.log(div);
	const parent = bornier.reduce((prev, cur) => {
		if (cur.name === div.id) {
			return cur;
		}
		return prev;
	}, null);
	if (parent) {
		parent.cables.push({
			"id": body.childNodes[0].childNodes.length,
			"name": `cable${body.childNodes[0].childNodes.length}`,
			"cable": cables[0],
			"quantite": 0
		});
	}
};

const generateBornier = (id) => {
	addContent("#borniers",
		newEl("div", { "id": `bornier${id}` }, [
			newEl("span", {}, `Bornier ${id}`),
			newEl("button", { "onclick": "addCable(this)" }, "Add Cable"),
			newEl("table", {}, [
				newEl("thead", {},
					newEl("tr", {}, [
						newEl("th", {}, "Cable"),
						newEl("th", {}, "Quantite"),
						newEl("th", {}, "Enlever")
					])
				),
				newEl("tbody", { "id": `bornier${id}Body`})
			])
		]
	));

	return {
		"id": id,
		"name": `bornier${id}`,
		"cables": [
		]
	};
};

const updateBornier = () => {
	const ctrl = document.querySelector("#nbBornier");
	const nbBornier = parseInt(ctrl.value);
	if (bornier.length < nbBornier) {
		while (bornier.length < nbBornier) {
			bornier.push(generateBornier(bornier.length));
		}
	}
};


// generic function
// add attributes to html tag
const addAttribute = (el, attr) => {
	if (typeof el === "string") {
		el = document.querySelector(el);
	}
	if (!(el instanceof Element)) { return; }
	Object.keys(attr).forEach((key) => {
		el.attributes[key] = attr[key];
	});
};

// add content to html tag
const addContent = (el, content) => {
	if (typeof el === "string") {
		el = document.querySelector(el);
	}
	if (!(el instanceof Element)) { return; }
	if (typeof content === "string") {
		el.appendChild(document.createTextNode(content));
	} else if (Array.isArray(content)) {
		content.forEach((subContent) => {
			addContent(el, subContent);
		});
	} else if (content instanceof Element) {
		el.appendChild(content);
	}
};

// create new tag
const newEl = (tag, attrs, content) => {
	var el = document.createElement(tag);
	Object.keys(attrs).forEach((key) => {
		el.setAttribute(key, attrs[key]);
	});
	addContent(el, content);
	return el;
};

// delete tag
const delEl = (el) => {
	if (typeof el === "string") {
		el = document.querySelector(el);
	}
	if (el instanceof Element) {
		while (el.firstChild) {
			if (el.firstChild instanceof Element) {
				delEl(el.firstChild);
			}
			el.removeChild(el.firstChild);
		}
	}
};
