package user

import (
	"github.com/gofiber/fiber/v2"
)

func ProtectedRoute(api fiber.Router) {
	api.Get("/me", GetMe)
}

// TODO: Management
func ManagementRoute(api fiber.Router) {
	api.Get("/manage/all", GetAllUsers)
	api.Put("/manage/:id", EditUser)
	api.Delete("/manage/:id", RemoveUser)
}
