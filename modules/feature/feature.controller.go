package feature

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
)

func GetList(c *fiber.Ctx) error {
	features := make([]Feature, 0)
	if err := variable.Db.Find(&features).Error; err != nil {
		return dto.InternalServerError(c, "Failed to Fetch feature", nil)
	}
	return dto.OK(c, "Success Get Feature", fiber.Map{
		"features": features,
	})
}
