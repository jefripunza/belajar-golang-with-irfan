package auth

import (
	"belajar-golang-uhuy/middlewares"

	"github.com/gofiber/fiber/v2"
)

func RegisterPublicRoutes(r fiber.Router) {
	r.Post("/login", Login)
	r.Delete("/logout", middlewares.UseToken, Logout)
}

func RegisterProtectedRoutes(r fiber.Router) {
	r.Get("/validate", middlewares.UseToken, Validate)
}
