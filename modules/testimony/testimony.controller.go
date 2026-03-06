package testimony

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
)

func GetLatest(c *fiber.Ctx) error {
	testimonies := make([]Testimony, 0)
	if err := variable.Db.Order("created_at DESC").Limit(3).Find(&testimonies).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch testimonials", nil)
	}

	return dto.OK(c, "Success get latest testimonials", fiber.Map{
		"testimonies": testimonies,
	})
}
