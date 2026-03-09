package contact

import (
	"github.com/gofiber/fiber/v2"
)

func Route(api fiber.Router) {
	// Public — single endpoint for ContactPage
	api.Get("", GetAll)

	// Contact Cards
	api.Get("/cards", GetContactCards)
	api.Post("/cards", CreateContactCard)
	api.Put("/cards/reorder", ReorderContactCards) // ← reorder HARUS sebelum /:id
	api.Put("/cards/:id", UpdateContactCard)
	api.Delete("/cards/:id", DeleteContactCard)

	// Office Hours
	api.Get("/hours", GetOfficeHours)
	api.Post("/hours", CreateOfficeHour)
	api.Put("/hours/reorder", ReorderOfficeHours) // ← reorder HARUS sebelum /:id
	api.Put("/hours/:id", UpdateOfficeHour)
	api.Delete("/hours/:id", DeleteOfficeHour)

	// Response Times
	api.Get("/response-times", GetResponseTimes)
	api.Post("/response-times", CreateResponseTime)
	api.Put("/response-times/reorder", ReorderResponseTimes) // ← reorder HARUS sebelum /:id
	api.Put("/response-times/:id", UpdateResponseTime)
	api.Delete("/response-times/:id", DeleteResponseTime)

	// Socials
	api.Get("/socials", GetSocials)
	api.Post("/socials", CreateSocial)
	api.Put("/socials/reorder", ReorderSocials) // ← reorder HARUS sebelum /:id
	api.Put("/socials/:id", UpdateSocial)
	api.Delete("/socials/:id", DeleteSocial)

	// FAQs
	api.Get("/faqs", GetFAQs)
	api.Post("/faqs", CreateFAQ)
	api.Put("/faqs/reorder", ReorderFAQs) // ← reorder HARUS sebelum /:id
	api.Put("/faqs/:id", UpdateFAQ)
	api.Delete("/faqs/:id", DeleteFAQ)
}
