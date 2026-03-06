package modules

import (
	"belajar-golang-uhuy/middlewares"
	"belajar-golang-uhuy/modules/analytic"
	"belajar-golang-uhuy/modules/auth"
	"belajar-golang-uhuy/modules/feature"
	"belajar-golang-uhuy/modules/testimony"
	"belajar-golang-uhuy/modules/user"

	"github.com/gofiber/fiber/v2"
)

func Routes(app fiber.Router) {

	api := app.Group("/api")

	// Public
	auth.PublicRoute(api.Group("/auth"))
	auth.ProtectedRoute(api.Group("/auth", middlewares.UseToken))

	// User
	user.ProtectedRoute(api.Group("/user", middlewares.UseToken))
	user.ManagementRoute(api.Group("/user", middlewares.UseToken, middlewares.UseRole(user.RoleAdmin)))

	// Testimony
	testimony.Route(api.Group("/testimony"))

	// Analytic
	analytic.Route(api.Group("/analytic"))

	// Feature
	feature.Route(api.Group("/feature"))

}
