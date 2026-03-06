package user

import (
	"belajar-golang-uhuy/middlewares"

	"github.com/gofiber/fiber/v2"
)

func Route(api fiber.Router) {
	api.Get("/me", middlewares.UseToken, GetMe)
}
