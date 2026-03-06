package example

import (
	"belajar-golang-uhuy/dto"

	"github.com/gofiber/fiber/v2"
)

func HelloWorld(c *fiber.Ctx) error {
	return dto.OK(c, "Hello, World!", fiber.Map{
		"Title": "App Name",
	})
}
