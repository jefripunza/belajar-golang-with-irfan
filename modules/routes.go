package modules

import (
	"belajar-golang-uhuy/modules/example"

	"github.com/gofiber/fiber/v2"
)

func Routes(app *fiber.App) {
	example.Route(app) // aku ngubah aku seng edit
}
