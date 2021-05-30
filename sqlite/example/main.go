package main

import (
	"fmt"
	"log"
	"time"

	"github.com/kudarap/ratatxt/ratatxt"
	"github.com/kudarap/ratatxt/sqlite"
	"gorm.io/gorm"
)

type ID uint

type User struct {
	ID        ID `gorm:"primaryKey"`
	FirstName string
	LastName  string
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type UserFilter struct {
	ID        ID     `db:"id,omitempty"`
	FirstName string `db:"first_name,omitempty"`
	LastName  string `db:"last_name,omitempty"`
	Email     string `db:"email,omitempty"`
}

func main() {
	db, err := sqlite.New(sqlite.Config{Addr: "test.db"})
	if err != nil {
		return
	}

	db.AutoMigrate(&User{})

	if err = db.Create(&User{FirstName: "kudarap", LastName: "yo"}); err != nil {
		log.Println("could not create:", err)
	}

	var users []User
	if err = db.List(&users, nil); err != nil {
		log.Println("could not get list:", err)
	}
	for _, uu := range users {
		fmt.Println(uu)
	}

	var user User
	db.GetByID(&user, 1)
	fmt.Println(user)

	u := &User{ID: 5, LastName: "yayani"}
	if err = db.Update(u); err != nil {
		log.Println("could not update:", err)
	}
	fmt.Println(u)

	if err = db.Delete(&User{ID: 2}); err != nil {
		log.Println("could not delete:", err)
	}

	so := &ratatxt.SearchOpts{Limit: 5}
	so.KeywordFields = []string{"first_name", "last_name"}
	so.Keyword = "yayani"
	meta, err := db.Search(&users, so)
	if err != nil {
		log.Println("could not search:", err)
	}
	fmt.Println("meta", meta)
	for _, uu := range users {
		fmt.Println(uu)
	}

	count, err := db.Count(&User{}, nil)
	if err != nil {
		log.Println("could not count:", err)
	}
	fmt.Println("count", count)
	return
}
