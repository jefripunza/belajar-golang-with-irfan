package testimony

import (
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
)

func GetLatest(c *fiber.Ctx) error {
	var testimonies []Testimony

	if err := variable.Db.Order("created_at DESC").Limit(3).Find(&testimonies).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch testimonials",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    testimonies,
	})
}
