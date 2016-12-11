"use strict";

// DOM manipulation functions
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
// end DOM manipulation functions

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

// all the borniers
var borniers = [];

/**
 * function called when clicking on the remove button on the cable row
 *
 * @param DOMElement e      Cable remove button
 * @param Object bornier    bornier object from borniers array
 * @param Object cable      cable oject fromt the cable array of the bornier
 */
const removeCable = (e, bornier, cable) => {
	const line = e.parentNode.parentNode;
	delEl(line);
	line.parentNode.removeChild(line);
	// TODO remove cable from bornier
	// /!\ if you remove cable from array all indexes will be shifted, you should
	// set the cable in the array to null instead
};

/**
 * function called when changing cable quantity
 *
 * @param DOMElement e      Cable quanity input
 * @param Object cable      Cable who's quantity has changed
 */
const changeCableQuantity = (e, cable) => {
	// TODO update quantity of cable
};

/**
 * function called when clicking addCable
 *
 * @param DOMElement e      Add cable button
 * @param Object bornier    Bornier who got one more cable
 */
const addCable = (e, bornier) => {
	const id = bornier.cables.length;
	const body = e.nextSibling.childNodes[1];
	addContent(body,
		newEl("tr", {}, [
			newEl("td", {},
				newEl("select", {}, cables.map((e) => {
					return newEl("option", {}, e.label);
				}))
			),
			newEl("td", {},
				newEl("input", { "type": "number", "min": 1,
					"onchange": `changeCableQuantity(this, borniers[${bornier.id}].cable[${id}])` })
			),
			newEl("td", {},
				newEl("button", { "onclick": `removeCable(this, borniers[${bornier.id}], borniers[${bornier.id}].cables[${id}])` }, "Remove")
			)
		])
	);

	bornier.cables.push({
		"id": id,
		"name": `cable${id}`,
		"cable": cables[0],
		"quantite": 0
	});
};

/**
 * generate a new bornier
 */
const generateBornier = () => {
	const id = borniers.length;
	addContent("#borniers",
		newEl("div", { "id": `bornier${id}` }, [
			newEl("span", {}, `Bornier ${id}`),
			newEl("button", { "onclick": `addCable(this, borniers[${id}])` }, "Add Cable"),
			newEl("table", {}, [
				newEl("thead", {},
					newEl("tr", {}, [
						newEl("th", {}, "Cable"),
						newEl("th", {}, "Quantite"),
						newEl("th", {}, "Enlever")
					])
				),
				newEl("tbody", {})
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

/**
 * remove the last bornier
 */
const removeLastBornier = () => {
	// TODO remove last last bornier from the DOM and the borniers array
};

/**
 * function call when changing the number of bornier
 */
const updateBornier = () => {
	const ctrl = document.querySelector("#nbBornier");
	const nbBornier = parseInt(ctrl.value);
	if (borniers.length < nbBornier) {
		while (borniers.length < nbBornier) {
			borniers.push(generateBornier());
		}
	} else if (borniers.length > nbBornier) {
		while (borniers.length > nbBornier) {
			removeLastBornier();
		}
	}
};

/**
 * generate array of borne from the borniers array
 */
const generateBorneArrayFromBorniers = () => {
	// TODO you need to go through the bornier array to generate an array of the
	// needed borne
};
