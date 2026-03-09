package about

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// ═══════════════════════════════════════════════════════════════════════════════
// ALL — single endpoint for AboutPage public fetch
// ═══════════════════════════════════════════════════════════════════════════════

func GetAll(c *fiber.Ctx) error {
	team := make([]TeamMember, 0)
	values := make([]CompanyValue, 0)
	stats := make([]CompanyStat, 0)
	contents := make([]PageContent, 0)

	variable.Db.Order("\"order\" asc").Find(&team)
	variable.Db.Order("\"order\" asc").Find(&values)
	variable.Db.Order("\"order\" asc").Find(&stats)
	variable.Db.Find(&contents)

	// Ubah contents slice jadi map key → value untuk kemudahan di frontend
	contentMap := make(map[string]string)
	for _, c := range contents {
		contentMap[c.Key] = c.Value
	}

	return dto.OK(c, "Success get about page data", fiber.Map{
		"team":    team,
		"values":  values,
		"stats":   stats,
		"content": contentMap,
	})
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM MEMBER
// ═══════════════════════════════════════════════════════════════════════════════

func GetTeam(c *fiber.Ctx) error {
	team := make([]TeamMember, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&team).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch team", nil)
	}
	return dto.OK(c, "Success get team", fiber.Map{"team": team})
}

func CreateTeamMember(c *fiber.Ctx) error {
	body := new(TeamMember)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Name == "" || body.Role == "" {
		return dto.BadRequest(c, "Name and role are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&TeamMember{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create team member", nil)
	}
	return dto.Created(c, "Team member created", fiber.Map{"member": body})
}

func UpdateTeamMember(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	var member TeamMember
	if err := variable.Db.First(&member, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Team member not found", nil)
	}

	body := new(TeamMember)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	member.Name = body.Name
	member.Role = body.Role
	member.Emoji = body.Emoji

	if err := variable.Db.Save(&member).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update team member", nil)
	}
	return dto.OK(c, "Team member updated", fiber.Map{"member": member})
}

func DeleteTeamMember(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	if err := variable.Db.Delete(&TeamMember{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete team member", nil)
	}
	return dto.OK(c, "Team member deleted", nil)
}

func ReorderTeam(c *fiber.Ctx) error {
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
		variable.Db.Model(&TeamMember{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Team reordered", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPANY VALUE
// ═══════════════════════════════════════════════════════════════════════════════

func GetValues(c *fiber.Ctx) error {
	values := make([]CompanyValue, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&values).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch values", nil)
	}
	return dto.OK(c, "Success get values", fiber.Map{"values": values})
}

func CreateValue(c *fiber.Ctx) error {
	body := new(CompanyValue)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Title == "" || body.Desc == "" {
		return dto.BadRequest(c, "Title and desc are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&CompanyValue{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create value", nil)
	}
	return dto.Created(c, "Value created", fiber.Map{"value": body})
}

func UpdateValue(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	var val CompanyValue
	if err := variable.Db.First(&val, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Value not found", nil)
	}

	body := new(CompanyValue)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	val.Icon = body.Icon
	val.Title = body.Title
	val.Desc = body.Desc

	if err := variable.Db.Save(&val).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update value", nil)
	}
	return dto.OK(c, "Value updated", fiber.Map{"value": val})
}

func DeleteValue(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	if err := variable.Db.Delete(&CompanyValue{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete value", nil)
	}
	return dto.OK(c, "Value deleted", nil)
}

func ReorderValues(c *fiber.Ctx) error {
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
		variable.Db.Model(&CompanyValue{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Values reordered", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPANY STAT
// ═══════════════════════════════════════════════════════════════════════════════

func GetStats(c *fiber.Ctx) error {
	stats := make([]CompanyStat, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&stats).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch stats", nil)
	}
	return dto.OK(c, "Success get stats", fiber.Map{"stats": stats})
}

func CreateStat(c *fiber.Ctx) error {
	body := new(CompanyStat)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Value == "" || body.Label == "" {
		return dto.BadRequest(c, "Value and label are required", nil)
	}

	var maxOrder int
	variable.Db.Model(&CompanyStat{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create stat", nil)
	}
	return dto.Created(c, "Stat created", fiber.Map{"stat": body})
}

func UpdateStat(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}

	var stat CompanyStat
	if err := variable.Db.First(&stat, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Stat not found", nil)
	}

	body := new(CompanyStat)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	stat.Value = body.Value
	stat.Label = body.Label

	if err := variable.Db.Save(&stat).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update stat", nil)
	}
	return dto.OK(c, "Stat updated", fiber.Map{"stat": stat})
}

func DeleteStat(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	if err := variable.Db.Delete(&CompanyStat{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete stat", nil)
	}
	return dto.OK(c, "Stat deleted", nil)
}

func ReorderStats(c *fiber.Ctx) error {
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
		variable.Db.Model(&CompanyStat{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Stats reordered", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE CONTENT (Hero + Story)
// ═══════════════════════════════════════════════════════════════════════════════

func GetContent(c *fiber.Ctx) error {
	contents := make([]PageContent, 0)
	if err := variable.Db.Find(&contents).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch content", nil)
	}
	contentMap := make(map[string]string)
	for _, c := range contents {
		contentMap[c.Key] = c.Value
	}
	return dto.OK(c, "Success get content", fiber.Map{"content": contentMap})
}

func UpdateContent(c *fiber.Ctx) error {
	// Body: map of key → value
	body := make(map[string]string)
	if err := c.BodyParser(&body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}

	for key, val := range body {
		var content PageContent
		err := variable.Db.Where("key = ?", key).First(&content).Error
		if err != nil {
			// Buat baru jika belum ada
			content = PageContent{Key: key, Value: val}
			variable.Db.Create(&content)
		} else {
			content.Value = val
			variable.Db.Save(&content)
		}
	}

	return dto.OK(c, "Content updated", nil)
}
