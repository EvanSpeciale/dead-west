import React from "react"
import { Helmet } from "react-helmet"

const Meta = ({ title, description, keywords }) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
		</Helmet>
	)
}

Meta.defaultProps = {
	title: "Dead West",
	description: "Artisan Painted Denim",
	keywords: "painted denim, hand-painted denim, artisan denim",
}

export default Meta
