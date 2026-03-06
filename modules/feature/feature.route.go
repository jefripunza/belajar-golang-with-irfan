package feature

import (
	"github.com/gofiber/fiber/v2"
)

func Route(api fiber.Router) {
	api.Get("/list", GetList)
}
