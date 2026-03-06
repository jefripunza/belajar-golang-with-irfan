package analytic

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
)

func GetStats(c *fiber.Ctx) error {
	stats := make([]AnalyticStats, 0)
	if err := variable.Db.Find(&stats).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch stats", nil)
	}

	return dto.OK(c, "Success get stats", fiber.Map{
		"stats": stats,
	})
}
