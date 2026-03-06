package modules

import (
	"belajar-golang-uhuy/modules/analytic"
	"belajar-golang-uhuy/modules/feature"
	"belajar-golang-uhuy/modules/testimony"
	"belajar-golang-uhuy/modules/user"

	"github.com/gofiber/fiber/v2"
)

func Routes(app fiber.Router) {

	api := app.Group("/api")
	user.Route(api.Group("/user"))
	testimony.Route(api.Group("/testimony"))
	analytic.Route(api.Group("/analytic"))
	feature.Route(api.Group("/feature"))

	admin := app.Group("/admin")
	testimony.Route(admin.Group("/testimony"))
	analytic.Route(admin.Group("/analytic"))
	feature.Route(admin.Group("/feature"))

}
