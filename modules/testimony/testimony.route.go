package testimony

import (
	"github.com/gofiber/fiber/v2"
)

func Route(app *fiber.App) {
	app.Get("/api/testimonials/latest", GetLatest)
}
