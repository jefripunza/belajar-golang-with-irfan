package modules

import (
	"belajar-golang-uhuy/modules/example"
	"belajar-golang-uhuy/modules/testimony"

	"github.com/gofiber/fiber/v2"
)

func Routes(app fiber.Router) {
	api := app.Group("/api")

	example.Route(app)
	testimony.Route(api.Group("/testimony"))
}
