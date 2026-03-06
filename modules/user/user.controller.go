package user

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/function"
	"belajar-golang-uhuy/variable"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func GetMe(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*function.JwtClaims)
	fmt.Println(claims)

	user := User{}
	if err := variable.Db.First(&user, claims.ID).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch user", nil)
	}

	return dto.OK(c, "Success get user", fiber.Map{
		"user": user,
	})
}
