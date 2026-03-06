package analytic

import (
	"github.com/gofiber/fiber/v2"
)

func Route(api fiber.Router) {
	api.Get("/stats", GetStats)
}
