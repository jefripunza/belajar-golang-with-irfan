package blog

import (
	"belajar-golang-uhuy/dto"
	"belajar-golang-uhuy/variable"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// ═══════════════════════════════════════════════════════════════════════════════
// ALL — public BlogPage endpoint
// ═══════════════════════════════════════════════════════════════════════════════

func GetAll(c *fiber.Ctx) error {
	posts := make([]Post, 0)
	authors := make([]Author, 0)
	topics := make([]Topic, 0)

	variable.Db.Where("published = ?", true).Find(&posts)
	variable.Db.Find(&authors)
	variable.Db.Order("\"order\" asc").Find(&topics)

	return dto.OK(c, "Success get blog page data", fiber.Map{
		"posts":   posts,
		"authors": authors,
		"topics":  topics,
	})
}

// ═══════════════════════════════════════════════════════════════════════════════
// POSTS
// ═══════════════════════════════════════════════════════════════════════════════

func GetPosts(c *fiber.Ctx) error {
	posts := make([]Post, 0)
	if err := variable.Db.Find(&posts).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch posts", nil)
	}
	return dto.OK(c, "Success get posts", fiber.Map{"posts": posts})
}

func CreatePost(c *fiber.Ctx) error {
	body := new(Post)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Title == "" || body.Desc == "" {
		return dto.BadRequest(c, "Title and desc are required", nil)
	}
	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create post", nil)
	}
	return dto.Created(c, "Post created", fiber.Map{"post": body})
}

func UpdatePost(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	var post Post
	if err := variable.Db.First(&post, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Post not found", nil)
	}
	body := new(Post)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	post.Emoji = body.Emoji
	post.Category = body.Category
	post.Badge = body.Badge
	post.Title = body.Title
	post.Desc = body.Desc
	post.Author = body.Author
	post.AuthorEmoji = body.AuthorEmoji
	post.Role = body.Role
	post.Date = body.Date
	post.ReadTime = body.ReadTime
	post.Color = body.Color
	post.Published = body.Published

	if err := variable.Db.Save(&post).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update post", nil)
	}
	return dto.OK(c, "Post updated", fiber.Map{"post": post})
}

func TogglePostPublish(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	var post Post
	if err := variable.Db.First(&post, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Post not found", nil)
	}
	post.Published = !post.Published
	if err := variable.Db.Save(&post).Error; err != nil {
		return dto.InternalServerError(c, "Failed to toggle publish", nil)
	}
	return dto.OK(c, "Publish toggled", fiber.Map{"post": post})
}

func SetFeaturedPost(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	// Unset all featured first
	if err := variable.Db.Model(&Post{}).Where("featured = ?", true).Update("featured", false).Error; err != nil {
		return dto.InternalServerError(c, "Failed to unset featured", nil)
	}
	// Set new featured
	if err := variable.Db.Model(&Post{}).Where("id = ?", id).Update("featured", true).Error; err != nil {
		return dto.InternalServerError(c, "Failed to set featured", nil)
	}
	var post Post
	variable.Db.First(&post, "id = ?", id)
	return dto.OK(c, "Featured post set", fiber.Map{"post": post})
}

func DeletePost(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	if err := variable.Db.Delete(&Post{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete post", nil)
	}
	return dto.OK(c, "Post deleted", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHORS
// ═══════════════════════════════════════════════════════════════════════════════

func GetAuthors(c *fiber.Ctx) error {
	authors := make([]Author, 0)
	if err := variable.Db.Find(&authors).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch authors", nil)
	}
	return dto.OK(c, "Success get authors", fiber.Map{"authors": authors})
}

func CreateAuthor(c *fiber.Ctx) error {
	body := new(Author)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Name == "" {
		return dto.BadRequest(c, "Name is required", nil)
	}
	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create author", nil)
	}
	return dto.Created(c, "Author created", fiber.Map{"author": body})
}

func UpdateAuthor(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	var author Author
	if err := variable.Db.First(&author, "id = ?", id).Error; err != nil {
		return dto.NotFound(c, "Author not found", nil)
	}
	body := new(Author)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	author.Name = body.Name
	author.Role = body.Role
	author.Emoji = body.Emoji

	if err := variable.Db.Save(&author).Error; err != nil {
		return dto.InternalServerError(c, "Failed to update author", nil)
	}
	return dto.OK(c, "Author updated", fiber.Map{"author": author})
}

func DeleteAuthor(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	if err := variable.Db.Delete(&Author{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete author", nil)
	}
	return dto.OK(c, "Author deleted", nil)
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOPICS
// ═══════════════════════════════════════════════════════════════════════════════

func GetTopics(c *fiber.Ctx) error {
	topics := make([]Topic, 0)
	if err := variable.Db.Order("\"order\" asc").Find(&topics).Error; err != nil {
		return dto.InternalServerError(c, "Failed to fetch topics", nil)
	}
	return dto.OK(c, "Success get topics", fiber.Map{"topics": topics})
}

func CreateTopic(c *fiber.Ctx) error {
	body := new(Topic)
	if err := c.BodyParser(body); err != nil {
		return dto.BadRequest(c, "Invalid request body", nil)
	}
	if body.Label == "" {
		return dto.BadRequest(c, "Label is required", nil)
	}
	var maxOrder int
	variable.Db.Model(&Topic{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&maxOrder)
	body.Order = maxOrder + 1

	if err := variable.Db.Create(body).Error; err != nil {
		return dto.InternalServerError(c, "Failed to create topic", nil)
	}
	return dto.Created(c, "Topic created", fiber.Map{"topic": body})
}

func DeleteTopic(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return dto.BadRequest(c, "Invalid ID", nil)
	}
	if err := variable.Db.Delete(&Topic{}, "id = ?", id).Error; err != nil {
		return dto.InternalServerError(c, "Failed to delete topic", nil)
	}
	return dto.OK(c, "Topic deleted", nil)
}

func ReorderTopics(c *fiber.Ctx) error {
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
		variable.Db.Model(&Topic{}).Where("id = ?", id).Update("order", i+1)
	}
	return dto.OK(c, "Topics reordered", nil)
}
