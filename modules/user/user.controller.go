package user

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/function"
	"belajar-golang-uhuy/middlewares"
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func GetMe(c *fiber.Ctx) error {
	claims := c.Locals(string(middlewares.ClaimsContextKey)).(*function.JwtClaims)

	user := User{}
	if err := variable.Db.First(&user, "id = ?", claims.ID).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch user", nil)
	}

	return dto.OK(c, "Success get user", fiber.Map{
		"user": MapWithoutPassword(&user),
	})
}

// TODO: Management
func GetAllUsers(c *fiber.Ctx) error {
	var users []User
	if err := variable.Db.Order("created_at desc").Find(&users).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch users", nil)
	}

	result := make([]map[string]any, 0, len(users))
	for i := range users {
		result = append(result, MapWithoutPassword(&users[i]))
	}

	return dto.OK(c, "Success get users", fiber.Map{
		"users": result,
	})
}

func EditUser(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return dto.BadRequest(c, "Invalid user id", nil)
	}

	type EditUserRequest struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Role     string `json:"role"`
		Password string `json:"password"`
	}

	var req EditUserRequest
	if err := c.BodyParser(&req); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	var existing User
	if err := variable.Db.First(&existing, "id = ?", id.String()).Error; err != nil {
		return dto.NotFound(c, "User not found", nil)
	}

	updates := map[string]any{}
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Username != "" {
		updates["username"] = req.Username
	}
	if req.Role != "" {
		updates["role"] = req.Role
	}
	if req.Password != "" {
		updates["password"] = function.EncryptPassword(req.Password)
	}
	if len(updates) == 0 {
		return dto.BadRequest(c, "No fields to update", nil)
	}

	if err := variable.Db.Model(&existing).Updates(updates).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update user", nil)
	}
	if err := variable.Db.First(&existing, "id = ?", id.String()).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch updated user", nil)
	}

	return dto.OK(c, "Success update user", fiber.Map{
		"user": MapWithoutPassword(&existing),
	})
}

func RemoveUser(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return dto.BadRequest(c, "Invalid user id", nil)
	}

	res := variable.Db.Delete(&User{}, "id = ?", id.String())
	if res.Error != nil {
		return dto.InternalServerError(c, "Failed to delete user", nil)
	}
	if res.RowsAffected == 0 {
		return dto.NotFound(c, "User not found", nil)
	}

	return dto.OK(c, "Success delete user", nil)
}
