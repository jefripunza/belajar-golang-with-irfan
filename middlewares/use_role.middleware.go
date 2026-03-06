package middlewares

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/function"

	"github.com/gofiber/fiber/v2"
)

func UseRole(roles ...string) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		claims := c.Locals(string(ClaimsContextKey)).(*function.JwtClaims)
		for _, role := range roles {
			if claims.Role == role {
				return c.Next()
			}
		}
		return dto.Forbidden(c, "You don't have permission to access this resource", nil)
	}
}
