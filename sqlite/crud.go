package sqlite

import (
	"fmt"
	"reflect"

	"github.com/kudarap/ratatxt/ratatxt"
)

const metaFieldID = "ID"

func (c *Client) List(rows, filter interface{}) error {
	so := searchOpts(ratatxt.SearchOpts{Filter: filter})
	return c.db.Scopes(so.parseFilter).Find(rows).Error
}

func (c *Client) Get(row interface{}, id ratatxt.ID) error {
	return c.db.Model(row).First(row, "id = ?", id.String()).Error
}

func (c *Client) GetByID(row interface{}, id interface{}) error {
	return c.db.Model(row).First(row, "id = ?", id).Error
}

func (c *Client) Create(input interface{}) error {
	if err := setCreateMetaValues(input); err != nil {
		return err
	}

	return c.db.Create(input).Error
}

func (c *Client) Update(input interface{}) error {
	id, err := getStructID(input)
	if err != nil {
		return err
	}

	if err = c.db.Model(input).Updates(input).Error; err != nil {
		return err
	}

	return c.GetByID(input, id)
}

func (c *Client) Delete(input interface{}) error {
	if err := c.db.Where(input).First(input).Error; err != nil {
		return err
	}

	return c.db.Delete(input).Error
}

// setCreateMetaValues sets generated metadata values for new data.
func setCreateMetaValues(obj interface{}) error {
	return setStructFieldValue(obj, metaFieldID, ratatxt.NewID())
}

// setStructFieldValue sets value by field name on struct
// and skips setting new value when not nil.
func setStructFieldValue(obj interface{}, field string, value interface{}) error {
	rField := reflect.ValueOf(obj).Elem().FieldByName(field)
	if !rField.IsZero() {
		return nil
	}

	rVal := reflect.ValueOf(value)
	if rField.Type() != rVal.Type() {
		return fmt.Errorf("struct %s field type not matched with value %s", field, value)
	}

	rField.Set(rVal)
	return nil
}

func getStructID(obj interface{}) (id ratatxt.ID, err error) {
	rField := reflect.ValueOf(obj).Elem().FieldByName(metaFieldID)
	if !rField.IsValid() {
		err = fmt.Errorf("ID field is invalid")
	}

	id = ratatxt.ID(rField.String())
	if rField.IsZero() {
		err = fmt.Errorf("ID field is empty")
	}

	return
}
