import React, { useState } from "react"
import { Form, Button } from "react-bootstrap"

const SearchBar = ({ history }) => {
	const [keyword, setKeyword] = useState("")

	const submitHandler = (e) => {
		e.preventDefault()
		if (keyword.trim()) {
			history.push(`/search/${keyword}`)
		} else {
			history.push("/")
		}
	}

	return (
		<Form className="d-flex" onSubmit={submitHandler}>
			<Form.Control
				id="search-bar"
				type="text"
				name="q"
				onChange={(e) => setKeyword(e.target.value)}
				placeholder="Search"
				className="mr-sm-2 ml-sm-5"
			></Form.Control>

			<Button type="submit" variant="outline-secondary" className="p-2 mx-1">
				<i className="fas fa-search"></i>
			</Button>
		</Form>
	)
}

export default SearchBar
