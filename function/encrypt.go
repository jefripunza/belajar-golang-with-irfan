package function

import "crypto/sha256"

func EncryptPassword(password string) string {
	hash := sha256.Sum256([]byte(password))
	return string(hash[:])
}
