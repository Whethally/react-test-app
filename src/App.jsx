import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import "./App.css"

function App() {
	// Данные сохраняются в состояние.
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const [searchParams, setSearchParams] = useSearchParams()
	const searchTerm = searchParams.get("search") || ""

	// 1. Делает запрос к публичному API (https://jsonplaceholder.typicode.com/posts).
	useEffect(() => {
		fetch("https://jsonplaceholder.typicode.com/posts")
			.then((response) => {
				if (!response.ok) throw new Error("Ошибка при загрузке")
				return response.json()
			})
			.then((data) => {
				setPosts(data)
				setLoading(false)
			})
			.catch((err) => {
				setError(err.message)
				setLoading(false)
			})
	}, [])

	// 3. Добавляет возможность поиска/фильтрации по данным.
	const filteredPosts = posts.filter((post) =>
		post.title.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const handleSearchChange = (search) => {
		const value = search.target.value
		if (value) {
			setSearchParams({ search: value })
		} else {
			setSearchParams({})
		}
	}

	return (
		// 2. Отображает полученные данные в виде списка или карточек.
		<>
			<h1>Посты</h1>
			{/* Добавить поле ввода (input), которое фильтрует данные по введённому тексту (например, по заголовку поста). */}
			<input
				type="text"
				placeholder="Поиск по заголовку"
				value={searchTerm}
				onChange={handleSearchChange}
			/>
			{/* 4.	Реализует индикатор загрузки и обработку ошибок. */}
			{/* Показывать лоадер во время загрузки. */}
			{loading && <div className="loader"></div>}
			{/* Обрабатывать ошибки (например, если API недоступно). */}
			{error && <p className="error">Ошибка: {error}</p>}

			{/* Показывать данные в виде карточек (id пользователя, заголовок, тело). */}
			{!loading &&
				!error &&
				filteredPosts.map((post) => (
					<div key={post.id} className="post">
						<small>ID пользователя: {post.userId}</small>
						<h3>{post.title}</h3>
						<p>{post.body}</p>
					</div>
				))}
		</>
	)
}

export default App
