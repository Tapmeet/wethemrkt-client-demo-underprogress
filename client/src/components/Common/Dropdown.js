import React from "react"
import "./Dropdown.css"

var __rest =
	(this && this.__rest) ||
	function (s, e) {
		var t = {}
		for (var p in s)
			if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
				t[p] = s[p]
		if (s != null && typeof Object.getOwnPropertySymbols === "function")
			for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
				if (
					e.indexOf(p[i]) < 0 &&
					Object.prototype.propertyIsEnumerable.call(s, p[i])
				)
					t[p[i]] = s[p[i]]
			}
		return t
	}

const Entry = props => {
	const { mention, theme, searchValue, isFocused, selectMention } = props
	let parentProps = __rest(props, [
		"mention",
		"theme",
		"searchValue",
		"isFocused",
		"selectMention",
	])
	return React.createElement(
		"div",
		Object.assign({}, parentProps),
		React.createElement(
			"div",
			{
				className:
					theme === null || theme === void 0
						? void 0
						: theme.mentionSuggestionsEntryContainer,
			},
			React.createElement(
				"div",
				{
					className:
						theme === null || theme === void 0
							? void 0
							: theme.mentionSuggestionsEntryText,
				},
				mention.name
			),
			React.createElement(
				"div",
				{
					className:
						theme === null || theme === void 0
							? void 0
							: theme.mentionSuggestionsEntryTitle,
				},
				mention.symboleName
			)
		)
	)
}

export default Entry
