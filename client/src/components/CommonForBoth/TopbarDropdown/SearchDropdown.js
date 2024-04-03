import React, { useEffect, useState } from "react"
import axiosHttpMiddelware from "common/axiosHttpMiddelware"

import { useHistory } from "react-router-dom"

import {
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap"
import { get, map } from "lodash"
import toaster from "../../../components/Common/Toaster"

import "../../../assets/scss/custom/wethemkrt/searchdropdown.scss"

const SearchDropdown = props => {
	// Declare a new state variable, which we'll call "menu"
	const history = useHistory()
	const [searchText, setSearchText] = useState("")

	const [symbolData, setsymbolData] = useState("")
	const [userData, setuserData] = useState("")
	const [menu, setMenu] = useState(false)

	const usSectors = [
		{ label: "Energy", value: "XLE" },
		{ label: "Financials", value: "XLF" },
		{ label: "Health Care", value: "XLV" },
		{ label: "Industrials", value: "XLI" },
		{ label: "Materials", value: "XLB" },
		{ label: "Real Estate", value: "XLRE" },
		{ label: "Technology", value: "XLK" },
		{ label: "Utilities", value: "XLU" },
	]

	const usIndustries = [
		{ label: "Agriculture", value: "MOO" },
		{ label: "Airlines", value: "JETS" },
		{ label: "Biotech", value: "IBB" },
		{ label: "Clean Energy", value: "PBW" },
		{ label: "Gold Miners", value: "GDX" },
		{ label: "Homebuilders", value: "ITB" },
		{ label: "Insurance", value: "KIE" },
		{ label: "Internet", value: "FDN" },
		{ label: "MLPs", value: "AMLP" },
		{ label: "Metals & Mining", value: "XME" },
		{ label: "Oil & Gas E&P", value: "XOP" },
		{ label: "Oil Services", value: "OIH" },
		{ label: "REITs", value: "VNQ" },
		{ label: "Regional Banks", value: "KRE" },
		{ label: "Retail", value: "XRT" },
		{ label: "Semiconductors", value: "SMH" },
		{ label: "Software", value: "IGV" },
		{ label: "Solar", value: "TAN" },
		{ label: "Water Resources", value: "PHO" },
	]

	async function getTrendingData(e) {
		setSearchText(e.target.value)
		setsymbolData("")
		setuserData("")
		if (e.target.value.startsWith("@")) {
			var newValue = e.target.value.replace("@", "")
			if (newValue) {
				axiosHttpMiddelware
					.post("usergetbyname", newValue)
					.then(userresponse => {
						if (
							userresponse != undefined &&
							userresponse.status == 200 &&
							userresponse.data.userResponse !== undefined
						) {
							setuserData(
								userresponse.data.userResponse.map(
									({ username, id, imageuri }) => ({
										label: username,
										value: id,
										image: imageuri,
									})
								)
							)
						}
					})
					.catch(err => {
						toaster.errorToaster(err.response, "Error while fetching user.")
					})
			} else {
				axiosHttpMiddelware
					.get("userget")
					.then(userresponse => {
						if (
							userresponse != undefined &&
							userresponse.status == 200 &&
							userresponse.data.userResponse !== undefined
						) {
							setuserData(
								userresponse.data.userResponse.map(({ name, id }) => ({
									label: name,
									value: id,
								}))
							)
						}
					})
					.catch(err => {
						toaster.errorToaster(err.response, "Error fectching user.")
					})
			}
		} else if (e.target.value) {
			await axiosHttpMiddelware
				.post("search/symbol", { symbolname: e.target.value })
				.then(response => {
					if (
						response.status == 200 &&
						response.data.symbolResponse !== undefined
					) {
						setsymbolData(
							response.data.symbolResponse.map(({ symbol, name, exchDisp }) => {
								if (exchDisp != "Australian") {
									return {
										label: symbol,
										name: name,
										value: symbol,
									}
								}
							})
						)
					}
				})
				.catch(err => {
					console.log(err)
					toaster.errorToaster(err.response, "Error fectching Symbole.")
				})
		} else {
			await axiosHttpMiddelware
				.post("search/symbol", { symbolname: null })
				.then(response => {
					if (
						response.status == 200 &&
						response.data.symbolResponse !== undefined
					) {
						setsymbolData(
							response.data.symbolResponse.map(({ symbol, name, exchDisp }) => {
								if (exchDisp != "Australian") {
									return {
										label: symbol,
										name: name,
										value: symbol,
									}
								}
							})
						)
					}
				})
				.catch(err => {
					console.log(err)
					toaster.errorToaster(err.response, "Error fectching Symbole.")
				})
		}
		toggle()
	}

	async function getSymbolData(e) {
		setSearchText(e.target.value)
		setsymbolData("")
		setuserData("")

		// debugger
		if (e.target.value.startsWith("@")) {
			var newValue = e.target.value.replace("@", "")
			if (newValue) {
				axiosHttpMiddelware
					.post("usergetbyname", { newValue })
					.then(userresponse => {
						if (
							userresponse != undefined &&
							userresponse.status == 200 &&
							userresponse.data.userResponse !== undefined
						) {
							setuserData(
								userresponse.data.userResponse.map(
									({ username, id, imageuri }) => ({
										label: username,
										value: id,
										image: imageuri,
									})
								)
							)
						}
					})
					.catch(err => {
						toaster.errorToaster(err.response, "Error fectching Users.")
					})
			} else {
				axiosHttpMiddelware
					.get("userget")
					.then(userresponse => {
						if (
							userresponse != undefined &&
							userresponse.status == 200 &&
							userresponse.data.userResponse !== undefined
						) {
							setuserData(
								userresponse.data.userResponse.map(({ name, id }) => ({
									label: name,
									value: id,
								}))
							)
						}
					})
					.catch(err => {
						toaster.errorToaster(err.response, "Error fectching Users.")
					})
			}
		} else if (e.target.value) {
			var newValue = ""
			if (e.target.value.startsWith("$")) {
				newValue = e.target.value.replace("$", "")
			} else {
				newValue = e.target.value
			}
			if (newValue != "") {
				await axiosHttpMiddelware
					.post("search/symbol", { symbolname: newValue })
					.then(response => {
						if (
							response.status == 200 &&
							response.data.symbolResponse !== undefined
						) {
							setsymbolData(
								response.data.symbolResponse.map(
									({ symbol, name, exchDisp }) => {
										if (exchDisp != "Australian") {
											return {
												label: symbol,
												name: name,
												value: symbol,
											}
										}
									}
								)
							)
						}
					})
					.catch(err => {
						console.log(err)
						toaster.errorToaster(err.response, "Error fectching Symbole.")
					})
			}
		} else {
			await axiosHttpMiddelware
				.post("search/symbol", { symbolname: null })
				.then(response => {
					if (
						response.status == 200 &&
						response.data.symbolResponse !== undefined
					) {
						setsymbolData(
							response.data.symbolResponse.map(({ symbol, name, exchDisp }) => {
								if (exchDisp != "Australian") {
									return {
										label: symbol,
										name: name,
										value: symbol,
									}
								}
							})
						)
					}
				})
				.catch(err => {
					console.log(err)
					toaster.errorToaster(err.response, "Error fectching Symbole.")
				})
		}
	}

	const toggle = () => {
		setMenu(!menu)
	}

	const symboal = params => {
		history.push(`/feed/${params}`)
	}

	const userprofile = (username, userid) => {
		history.push({ pathname: `/viewprofile/${username}`, state: userid })
	}

	return (
		<>
			<form className="app-search search-btn">
				<div className="position-relative search-input">
					<input
						type="text"
						className="form-control"
						placeholder={"Search companies"}
						onClick={e => getTrendingData(e)}
						onChange={e => getSymbolData(e)}
					/>
					<span class="search-icon">
						<box-icon name="search"></box-icon>
					</span>
				</div>
			</form>
			<UncontrolledDropdown isOpen={menu} toggle={toggle} className="dropdown">
				<DropdownToggle
					className="btn btn-search-deopdown"
					tag="button"
					id="page-header-notifications-dropdown"></DropdownToggle>
				<DropdownMenu className="dropdown-menu-end drop-menu">
					{symbolData.length == 0 && userData.length == 0 ? (
						<div className="w-100 text-center">
							<div className="loader1">
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
					) : null}
					{symbolData.length > 0 ? (
						<div>
							<p className="text-start ms-4 mb-1 heading-search">
								Trending Stocks
							</p>
							{searchText === "^" ? (
								<div>
									{symbolData.slice(5).map((symbol, key) => (
										<DropdownItem
											key={key}
											onClick={() => symboal(symbol.value)}>
											<span className="align-middle">
												<span className="stocks-name"> {symbol.label} </span>{" "}
												<br />{" "}
												<span className="stocks-description">
													{" "}
													{symbol.name}
												</span>
											</span>
										</DropdownItem>
									))}
									<p className="text-start ms-4 mb-1 heading-search">
										Us Sectors
									</p>
									{map(usSectors, (sector, key) => (
										<DropdownItem
											key={key}
											onClick={() => symboal(sector.value)}>
											<span className="align-middle">
												<span className="stocks-name"> {sector.value} </span>
											</span>
											<br />
											<span className="stocks-description">{sector.label}</span>
										</DropdownItem>
									))}
									<p className="text-start ms-4 mb-1 heading-search">
										Us Industries
									</p>
									{map(usIndustries, (industry, key) => (
										<DropdownItem
											key={key}
											onClick={() => symboal(industry.value)}>
											<span className="align-middle">
												<span className="stocks-name"> {industry.value} </span>
											</span>
											<br />
											<span className="stocks-description">
												{industry.label}
											</span>
										</DropdownItem>
									))}
								</div>
							) : (
								map(Object.keys(symbolData), key => (
									<DropdownItem
										key={key}
										onClick={() => symboal(get(symbolData, `${key}.value`))}>
										<span className="align-middle">
											<span className="stocks-name">
												{" "}
												{get(symbolData, `${key}.label`)}{" "}
											</span>{" "}
											<br />{" "}
											<span className="stocks-description">
												{" "}
												{get(symbolData, `${key}.name`)}
											</span>
										</span>
									</DropdownItem>
								))
							)}
						</div>
					) : null}

					{userData.length > 0 ? (
						<div>
							<p className="text-start ms-4 mb-1 people-title">People</p>
							{map(Object.keys(userData), key => (
								<DropdownItem
									key={key}
									onClick={() =>
										userprofile(
											get(userData, `${key}.label`),
											get(userData, `${key}.value`)
										)
									}>
									<span className="user-pro-name">
										<span className=""> {get(userData, `${key}.label`)} </span>
										<span className="float-end">
											<img
												className="rounded-circle header-profile-user"
												src={userData.profilePhoto}
												alt="Header Avatar"
											/>
										</span>
									</span>
								</DropdownItem>
							))}
						</div>
					) : null}
				</DropdownMenu>
			</UncontrolledDropdown>
		</>
	)
}

export default SearchDropdown
