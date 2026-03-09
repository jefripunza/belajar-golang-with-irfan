package portfolio

import (
	"github.com/gofiber/fiber/v2"
)

func Route(api fiber.Router) {
	// Public — single endpoint for PortfolioPage
	api.Get("", GetAll)

	// Projects
	api.Get("/projects", GetProjects)
	api.Post("/projects", CreateProject)
	api.Put("/projects/reorder", ReorderProjects) // ← reorder HARUS sebelum /:id
	api.Put("/projects/:id", UpdateProject)
	api.Patch("/projects/:id/publish", TogglePublish)
	api.Delete("/projects/:id", DeleteProject)

	// Testimonials
	api.Get("/testimonials", GetTestimonials)
	api.Post("/testimonials", CreateTestimonial)
	api.Put("/testimonials/reorder", ReorderTestimonials) // ← reorder HARUS sebelum /:id
	api.Put("/testimonials/:id", UpdateTestimonial)
	api.Delete("/testimonials/:id", DeleteTestimonial)
}
