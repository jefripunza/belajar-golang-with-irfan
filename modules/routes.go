package modules

import (
	"belajar-golang-uhuy/modules/example"
	"belajar-golang-uhuy/modules/testimony"

	"github.com/gofiber/fiber/v2"
)

func Routes(app *fiber.App) {
	example.Route(app)
	testimony.Route(app)
}
