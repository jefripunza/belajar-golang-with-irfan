package auth

import (
	"fmt"

	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/function"
	"belajar-golang-uhuy/modules/user"
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
)

type RegisterRequest struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func Register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	if req.Name == "" || req.Username == "" || req.Password == "" {
		return dto.BadRequest(c, "Name, username and password are required", nil)
	}

	// check username already exist
	var user_exist user.User
	if err := variable.Db.Where("username = ?", req.Username).First(&user_exist).Error; err == nil {
		return dto.BadRequest(c, "Username already exist", nil)
	}

	// create user
	user := user.User{
		Name:     req.Name,
		Username: req.Username,
		Password: function.EncryptPassword(req.Password),
		Role:     user.RoleUser,
	}
	if err := variable.Db.Create(&user).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create user", nil)
	}

	return dto.OK(c, "Register success", nil)
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
