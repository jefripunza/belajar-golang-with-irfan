package modules

import (
	"belajar-golang-uhuy/modules/analytic"
	"belajar-golang-uhuy/modules/example"
	"belajar-golang-uhuy/modules/testimony"
	"belajar-golang-uhuy/modules/user"

	"github.com/gofiber/fiber/v2"
)

func Routes(app fiber.Router) {
	example.Route(app)

	api := app.Group("/api")
	user.Route(api.Group("/user"))
	testimony.Route(api.Group("/testimony"))
	analytic.Route(api.Group("/analytic"))

}
