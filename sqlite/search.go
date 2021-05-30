package sqlite

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/fatih/structs"
	"github.com/kudarap/ratatxt/ratatxt"
	"gorm.io/gorm"
)

func (c *Client) Search(data interface{}, opts *ratatxt.SearchOpts) (*ratatxt.SearchMetadata, error) {
	so := ratatxt.SearchOpts{}
	if opts != nil {
		so = *opts
	}

	q := searchOpts(so).newSearchQuery(c.db)
	if err := q.Find(data).Error; err != nil {
		return nil, err
	}

	total, err := c.Count(data, opts)
	if err != nil {
		return nil, err
	}
	sm := &ratatxt.SearchMetadata{
		TotalCount:  total,
		ResultCount: reflect.ValueOf(data).Elem().Len(),
	}

	return sm, nil
}

func (c *Client) Count(model interface{}, opts *ratatxt.SearchOpts) (int, error) {
	so := ratatxt.SearchOpts{}
	if opts != nil {
		so = *opts
	}

	var i int64
	q := searchOpts(so).newCountQuery(c.db)
	if err := q.Model(model).Count(&i).Error; err != nil {
		return 0, err
	}

	return int(i), nil
}

type searchOpts ratatxt.SearchOpts

// newSearchQuery builds query for search.
func (o searchOpts) newSearchQuery(q *gorm.DB) *gorm.DB {
	return q.Scopes(
		o.parseFilter,
		o.parseSorter,
		o.parseOffset,
		o.parseKeyword)
}

// newCountQuery builds query for search count.
func (o searchOpts) newCountQuery(q *gorm.DB) *gorm.DB {
	return q.Scopes(
		o.parseFilter,
		o.parseKeyword,
	)
}

func (o searchOpts) parseFilter(q *gorm.DB) *gorm.DB {
	filter := map[string]interface{}{}

	// Set object filter.
	if structs.IsStruct(o.Filter) {
		s := structs.New(o.Filter)
		s.TagName = "db"
		filter = s.Map()
	}

	// Assign user id when available.
	if !o.UserID.IsEmpty() {
		filter["user_id"] = o.UserID
	}

	return q.Where(filter)
}

func (o searchOpts) parseSorter(q *gorm.DB) *gorm.DB {
	if o.Sort == "" {
		return q
	}

	s := strings.TrimSpace(o.Sort)
	if o.Desc {
		s += " desc"
	}

	return q.Order(strings.ToLower(s))
}

func (o searchOpts) parseOffset(q *gorm.DB) *gorm.DB {
	if o.Page < 1 {
		o.Page = 1
	}
	o.Page--

	offset := o.Page * o.Limit
	limit := o.Limit
	return q.Offset(offset).Limit(limit)
}

func (o searchOpts) parseKeyword(q *gorm.DB) *gorm.DB {
	// Requires keyword and keyword fields.
	if strings.TrimSpace(o.Keyword) == "" || len(o.KeywordFields) == 0 {
		return q
	}

	k := fmt.Sprintf("%%%s%%", o.Keyword)
	var s string
	var v []interface{}
	for i, kf := range o.KeywordFields {
		// Populate query values.
		v = append(v, k)
		// Build string query like "first_name LIKE ? OR last_name LIKE ? OR email LIKE ?"
		s += fmt.Sprintf("%s LIKE ?", kf)
		if i < len(o.KeywordFields)-1 {
			s += " OR "
		}
	}

	q = q.Where(s, v...)
	return q
}
