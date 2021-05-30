package sqlite

import (
	"github.com/kudarap/ratatxt/ratatxt"
	"gorm.io/gorm"
)

func (c *Client) MessageStats(dst interface{}, scope ratatxt.StatsScope, filter *ratatxt.MessageFilter) error {
	return c.db.Model(&ratatxt.Message{}).
		Select(`
		   COUNT() as total,
		   COUNT(nullif(kind = ?, 0)) as inbox,
		   COUNT(nullif(kind = ?, 0)) as outbox,
		   COUNT(nullif(status = ?, 0)) as outbox_queued,
		   COUNT(nullif(status = ?, 0)) as outbox_sending,
		   COUNT(nullif(status = ?, 0)) as outbox_sent,
		   COUNT(nullif(status = ?, 0)) as outbox_failed,
		   COUNT(nullif(status = ?, 0)) as outbox_error`,
			ratatxt.MessageKindInbox,
			ratatxt.MessageKindOutbox,
			ratatxt.MessageStatusOutboxQueued,
			ratatxt.MessageStatusOutboxSending,
			ratatxt.MessageStatusOutboxSent,
			ratatxt.MessageStatusOutboxFailed,
			ratatxt.MessageStatusOutboxError,
		).
		Scopes(statsScoreScope(scope, filter)).Scan(dst).Error
}

func (c *Client) MessageGraph(dst interface{}, scope ratatxt.StatsScope, filter *ratatxt.MessageFilter) error {
	return c.db.Model(&ratatxt.Message{}).
		Select(`
		   STRFTIME(?, updated_at) as scope,
		   COUNT() as total,
		   COUNT(nullif(kind = ?, 0)) as inbox,
		   COUNT(nullif(kind = ?, 0)) as outbox`,
			scope.Unit.SQLDateFormat(),
			ratatxt.MessageKindInbox,
			ratatxt.MessageKindOutbox,
		).
		Scopes(statsScope(scope, filter)).Scan(dst).Error
}

func (c *Client) OutboxGraph(dst interface{}, scope ratatxt.StatsScope, filter *ratatxt.MessageFilter) error {
	if filter == nil {
		filter = &ratatxt.MessageFilter{}
	}

	filter.Kind = ratatxt.MessageKindOutbox
	return c.db.Model(&ratatxt.Message{}).
		Select(`
		   STRFTIME(?, updated_at) as scope,
		   COUNT() as total,
		   COUNT(nullif(status = ?, 0)) as outbox_queued,
		   COUNT(nullif(status = ?, 0)) as outbox_sending,
		   COUNT(nullif(status = ?, 0)) as outbox_sent,
		   COUNT(nullif(status = ?, 0)) as outbox_failed,
		   COUNT(nullif(status = ?, 0)) as outbox_error`,
			scope.Unit.SQLDateFormat(),
			ratatxt.MessageStatusOutboxQueued,
			ratatxt.MessageStatusOutboxSending,
			ratatxt.MessageStatusOutboxSent,
			ratatxt.MessageStatusOutboxFailed,
			ratatxt.MessageStatusOutboxError,
		).
		Scopes(statsScope(scope, filter)).Scan(dst).Error
}

func statsScoreScope(scope ratatxt.StatsScope, filter *ratatxt.MessageFilter) func(db *gorm.DB) *gorm.DB {
	return func(t *gorm.DB) *gorm.DB {
		q := t.Where(filter)
		if scope.All {
			return q
		}

		return q.Where("updated_at BETWEEN ? AND ?", scope.From, scope.To)
	}
}

func statsScope(scope ratatxt.StatsScope, filter *ratatxt.MessageFilter) func(db *gorm.DB) *gorm.DB {
	return func(t *gorm.DB) *gorm.DB {
		q := t.Where(filter).Order("updated_at DESC").Group("scope")
		if scope.All {
			return q
		}

		return q.Where("updated_at BETWEEN ? AND ?", scope.From, scope.To)
	}
}
