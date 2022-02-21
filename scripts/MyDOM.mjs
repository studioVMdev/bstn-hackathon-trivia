// DOM manipulation helper functions
export default class MyDOM {
	//! 1. Create Element (element, classnames, parent, atrivbutes)
	static create = (element, classNames, parentEl, attributesObj) => {
		let htmlElement = document.createElement(element)

		typeof classNames == "string"
			? htmlElement.classList.add(classNames)
			: classNames.forEach((classs) => {
					htmlElement.classList.add(classs)
			  })

		parentEl && parentEl.appendChild(htmlElement)

		if (attributesObj) {
			for (const [attr, val] of Object.entries(attributesObj)) {
				const htmlAttribute = document.createAttribute(attr)
				htmlAttribute.value = val
				htmlElement.setAttributeNode(htmlAttribute)
			}
		}
		return htmlElement
	}

	//! 2. Select Elements
	static select(element, all = false) {
		if (all) {
			return [...document.querySelectorAll(element)]
		} else {
			return document.querySelector(element)
		}
	}
}
