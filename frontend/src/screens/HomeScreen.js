import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Col, Row } from "react-bootstrap"
import Product from "../components/Product"
import { listProducts } from "../actions/productActions"
import Loader from "../components/Loader"
import Paginate from "../components/Paginate"
import Message from "../components/Message"
import Meta from "../components/Meta"

const HomeScreen = ({ match }) => {
	const keyword = match.params.keyword

	const pageNumber = match.params.pageNumber || 1

	const dispatch = useDispatch()

	const productList = useSelector((state) => state.productList)
	const { loading, error, products, page, pages } = productList

	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber))
	}, [dispatch, keyword, pageNumber])

	return (
		<>
			<Meta title="Dead West | Home" />
			<h1>Products</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<Row>
						{products.map((product) => (
							<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
								<Product product={product} />
							</Col>
						))}
					</Row>
					<Paginate
						pages={pages}
						page={page}
						keyword={keyword ? keyword : ""}
					/>
				</>
			)}
		</>
	)
}

export default HomeScreen
