package blog

import "github.com/gofiber/fiber/v2"

func Route(api fiber.Router) {
	// Public — single endpoint for BlogPage
	api.Get("", GetAll)

	// Posts
	api.Get("/posts", GetPosts)
	api.Post("/posts", CreatePost)
	api.Put("/posts/:id", UpdatePost)
	api.Patch("/posts/:id/publish", TogglePostPublish)
	api.Patch("/posts/:id/featured", SetFeaturedPost)
	api.Delete("/posts/:id", DeletePost)

	// Authors
	api.Get("/authors", GetAuthors)
	api.Post("/authors", CreateAuthor)
	api.Put("/authors/:id", UpdateAuthor)
	api.Delete("/authors/:id", DeleteAuthor)

	// Topics — reorder HARUS sebelum /:id
	api.Get("/topics", GetTopics)
	api.Post("/topics", CreateTopic)
	api.Put("/topics/reorder", ReorderTopics)
	api.Delete("/topics/:id", DeleteTopic)
}
