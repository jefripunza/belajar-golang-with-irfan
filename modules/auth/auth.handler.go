package auth

import (
	"fmt"

	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/environment"
	"belajar-golang-uhuy/function"
	"belajar-golang-uhuy/modules/user"
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func ParseToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return environment.GetJWTSecret(), nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	return claims, nil
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	if req.Username == "" || req.Password == "" {
		return dto.BadRequest(c, "Username and password are required", nil)
	}

	var user user.User
	if err := variable.Db.Where("username = ?", req.Username).First(&user).Error; err != nil {
		return dto.Unauthorized(c, "Invalid password (1)", nil)
	}

	// compare hash
	if function.EncryptPassword(req.Password) != user.Password {
		return dto.Unauthorized(c, "Invalid password (2)", nil)
	}

	token, err := function.JwtGenerateToken(function.JwtClaims{
		ID:   user.ID.String(),
		Role: user.Role,
	})
	if err != nil {
		return dto.InternalServerError(c, "Failed to generate token", nil)
	}

	return dto.OK(c, "Login success", fiber.Map{
		"token": token,
	})
}

func Logout(c *fiber.Ctx) error {
	// logic revoke
	return dto.OK(c, "Logout success", nil)
}

func Validate(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*function.JwtClaims)
	fmt.Println(claims)
	return dto.OK(c, "Token valid", fiber.Map{
		"claims": claims,
	})
}
