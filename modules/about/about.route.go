package about

import (
	"github.com/gofiber/fiber/v2"
)

func Route(api fiber.Router) {
	// Public — single endpoint for AboutPage
	api.Get("", GetAll)

	// Team
	api.Get("/team", GetTeam)
	api.Post("/team", CreateTeamMember)
	api.Put("/team/reorder", ReorderTeam) // ← reorder HARUS sebelum /:id
	api.Put("/team/:id", UpdateTeamMember)
	api.Delete("/team/:id", DeleteTeamMember)

	// Values
	api.Get("/values", GetValues)
	api.Post("/values", CreateValue)
	api.Put("/values/reorder", ReorderValues) // ← reorder HARUS sebelum /:id
	api.Put("/values/:id", UpdateValue)
	api.Delete("/values/:id", DeleteValue)

	// Stats
	api.Get("/stats", GetStats)
	api.Post("/stats", CreateStat)
	api.Put("/stats/reorder", ReorderStats) // ← reorder HARUS sebelum /:id
	api.Put("/stats/:id", UpdateStat)
	api.Delete("/stats/:id", DeleteStat)

	// Page Content (Hero + Story)
	api.Get("/content", GetContent)
	api.Put("/content", UpdateContent)
}
