package portfolio

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// ═══════════════════════════════════════════════════════════════════════════════
// ALL — single endpoint for public PortfolioPage
// ═══════════════════════════════════════════════════════════════════════════════

func GetAll(c *fiber.Ctx) error {
	projects := make([]Project, 0)
	testimonials := make([]Testimonial, 0)

	variable.Db.Where("published = ?", true).Order("\"order\" asc").Find(&projects)
	variable.Db.Order("\"order\" asc").Find(&testimonials)

	return dto.OK(c, "Success get portfolio page data", fiber.Map{
		"projects":     projects,
		"testimonials": testimonials,
	})
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT
// ═══════════════════════════════════════════════════════════════════════════════

func GetProjects(c *fiber.Ctx) error {
	projects := make([]Project, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&projects).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch projects", nil)
	}
	return dto.OK(c, "Success get projects", fiber.Map{"projects": projects})
}

func CreateProject(c *fiber.Ctx) error {
	body := new(Project)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Title == "" || body.Desc == "" {
		return dto.BadRequest(c, "Title and desc are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&Project{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create project", nil)
	}
	return dto.Created(c, "Project created", fiber.Map{"project": body})
}

func UpdateProject(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	var project Project
	if err := variable.Db.First(&project, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Project not found", nil)
	}

	body := new(Project)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	project.Emoji = body.Emoji
	project.Title = body.Title
	project.Category = body.Category
	project.Desc = body.Desc
	project.Tags = body.Tags
	project.Result = body.Result
	project.Color = body.Color
	project.Border = body.Border
	project.Badge = body.Badge
	project.Published = body.Published

	if err := variable.Db.Save(&project).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update project", nil)
	}
	return dto.OK(c, "Project updated", fiber.Map{"project": project})
}

func TogglePublish(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	var project Project
	if err := variable.Db.First(&project, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Project not found", nil)
	}

	project.Published = !project.Published
	if err := variable.Db.Save(&project).Error; err != nil {
		return dto.InternalServerError(c, "Failed to toggle publish", nil)
	}
	return dto.OK(c, "Publish toggled", fiber.Map{"project": project})
}

func DeleteProject(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	if err := variable.Db.Delete(&Project{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete project", nil)
	}
	return dto.OK(c, "Project deleted", nil)
}

func ReorderProjects(c *fiber.Ctx) error {
	var body struct {
		IDs []string `json:"ids"`
	}
	if err := c.BodyParser(&body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	for i, rawID := range body.IDs {
		id, err := uuid.Parse(rawID)
		if err != nil {
			continue
		}
		variable.Db.Model(&Project{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Projects reordered", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// TESTIMONIAL
// ═══════════════════════════════════════════════════════════════════════════════

func GetTestimonials(c *fiber.Ctx) error {
	testimonials := make([]Testimonial, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&testimonials).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch testimonials", nil)
	}
	return dto.OK(c, "Success get testimonials", fiber.Map{"testimonials": testimonials})
}

func CreateTestimonial(c *fiber.Ctx) error {
	body := new(Testimonial)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Name == "" || body.Text == "" {
		return dto.BadRequest(c, "Name and text are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&Testimonial{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create testimonial", nil)
	}
	return dto.Created(c, "Testimonial created", fiber.Map{"testimonial": body})
}

func UpdateTestimonial(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	var testimonial Testimonial
	if err := variable.Db.First(&testimonial, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Testimonial not found", nil)
	}

	body := new(Testimonial)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	testimonial.Name = body.Name
	testimonial.Role = body.Role
	testimonial.Emoji = body.Emoji
	testimonial.Text = body.Text

	if err := variable.Db.Save(&testimonial).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update testimonial", nil)
	}
	return dto.OK(c, "Testimonial updated", fiber.Map{"testimonial": testimonial})
}

func DeleteTestimonial(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	if err := variable.Db.Delete(&Testimonial{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete testimonial", nil)
	}
	return dto.OK(c, "Testimonial deleted", nil)
}

func ReorderTestimonials(c *fiber.Ctx) error {
	var body struct {
		IDs []string `json:"ids"`
	}
	if err := c.BodyParser(&body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	for i, rawID := range body.IDs {
		id, err := uuid.Parse(rawID)
		if err != nil {
			continue
		}
		variable.Db.Model(&Testimonial{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Testimonials reordered", nil)
}
